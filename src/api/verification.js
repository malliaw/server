const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

const router = express.Router();

// Admin password (in production, use environment variables)
const ADMIN_PASSWORD = -process.env.ADMIN_PASSWORD || 'admin123';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max per file
    files: 20 // Max 20 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// In-memory storage for pending submissions (in production, use a database)
let pendingSubmissions = [];

// Admin login
router.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Get pending submissions
router.get('/admin/submissions', (req, res) => {
  res.json(pendingSubmissions.filter(sub => sub.status === 'pending'));
});

// Upload files for verification
router.post('/upload-for-verification', upload.array('files'), async (req, res) => {
  try {
    const {
      targetDirectory,
      baseFilename,
      courseCode,
      unit,
      fileType,
      verificationDate,
      customTitle
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Validate total size
    const totalSize = req.files.reduce((acc, file) => acc + file.size, 0);
    const maxSize = req.files.length === 1 ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    
    if (totalSize > maxSize) {
      return res.status(400).json({ 
        error: `Total file size exceeds ${req.files.length === 1 ? '10MB' : '50MB'} limit` 
      });
    }

    // Create pending directory if it doesn't exist
    const pendingDir = path.join(__dirname, '../pending-uploads');
    await fs.mkdir(pendingDir, { recursive: true });

    const submissionId = crypto.randomUUID();
    const submissionDir = path.join(pendingDir, submissionId);
    await fs.mkdir(submissionDir, { recursive: true });

    // Save files temporarily
    const files = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const fileId = crypto.randomUUID();
      const filename = `${fileId}_${file.originalname}`;
      const filepath = path.join(submissionDir, filename);
      
      await fs.writeFile(filepath, file.buffer);
      
      files.push({
        id: fileId,
        originalName: file.originalname,
        editedName: file.originalname,
        size: file.size,
        type: file.mimetype,
        url: `/api/pending-file/${submissionId}/${filename}`
      });
    }

    // Create submission record
    const submission = {
      id: submissionId,
      targetDirectory,
      baseFilename,
      courseCode,
      unit,
      fileType,
      verificationDate,
      customTitle,
      files,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    pendingSubmissions.push(submission);

    res.json({ 
      success: true, 
      submissionId,
      message: 'Files uploaded for verification' 
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Serve pending files
router.get('/pending-file/:submissionId/:filename', async (req, res) => {
  try {
    const { submissionId, filename } = req.params;
    const filepath = path.join(__dirname, '../pending-uploads', submissionId, filename);
    
    // Check if file exists
    await fs.access(filepath);
    res.sendFile(path.resolve(filepath));
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
});

// Approve submission
router.post('/admin/submissions/:id/approve', async (req, res) => {
  try {
    const submissionId = req.params.id;
    const { files } = req.body;
    
    const submission = pendingSubmissions.find(s => s.id === submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Create target directory structure
    const schoolDir = path.join(__dirname, '../public/school');
    const targetPath = path.join(schoolDir, submission.targetDirectory.replace('school/', ''));
    await fs.mkdir(targetPath, { recursive: true });

    // Move and rename files
    const pendingDir = path.join(__dirname, '../pending-uploads', submissionId);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const oldPath = path.join(pendingDir, `${file.id}_${file.originalName}`);
      
      // Generate new filename
      let newFilename = file.editedName;
      if (!newFilename.includes('.')) {
        // Add appropriate extension if missing
        const ext = path.extname(file.originalName);
        newFilename += ext;
      }
      
      // If multiple files, add index
      if (files.length > 1) {
        const ext = path.extname(newFilename);
        const name = path.basename(newFilename, ext);
        newFilename = `${name}_${(i + 1).toString().padStart(2, '0')}${ext}`;
      }
      
      const newPath = path.join(targetPath, newFilename);
      
      // Move file
      await fs.rename(oldPath, newPath);
    }

    // Clean up pending directory
    await fs.rmdir(pendingDir, { recursive: true });
    
    // Update submission status
    submission.status = 'approved';
    
    res.json({ success: true, message: 'Files approved and moved to vault' });

  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ error: 'Approval failed' });
  }
});

// Reject submission
router.post('/admin/submissions/:id/reject', async (req, res) => {
  try {
    const submissionId = req.params.id;
    
    const submission = pendingSubmissions.find(s => s.id === submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Clean up pending files
    const pendingDir = path.join(__dirname, '../pending-uploads', submissionId);
    try {
      await fs.rmdir(pendingDir, { recursive: true });
    } catch (err) {
      console.error('Error cleaning up files:', err);
    }
    
    // Update submission status
    submission.status = 'rejected';
    
    res.json({ success: true, message: 'Submission rejected' });

  } catch (error) {
    console.error('Rejection error:', error);
    res.status(500).json({ error: 'Rejection failed' });
  }
});

module.exports = router;