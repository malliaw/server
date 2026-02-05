import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use('/school', express.static(path.join(__dirname, 'public', 'school')));

// Serve unverified files (pending admin approval)
app.use('/unverified', express.static(path.join(__dirname, 'unverified')));

// Serve built frontend files
app.use(express.static(path.join(__dirname, 'dist')));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Import and use verification routes (we'll need to convert to ES modules)
// For now, we'll inline the verification endpoints

// Admin password from environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vault_admin_2026';
let pendingSubmissions = [];

// Cache for UptimeRobot API responses
let uptimeRobotCache = null;
let uptimeRobotCacheTimestamp = 0;
const UPTIME_ROBOT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to unverified directory: unverified/grade/class/unit/type/medium
    const targetDir = req.body.targetDirectory;
    if (!targetDir) {
      return cb(new Error('Target directory not specified'));
    }
    
    // Strip 'school/' prefix from targetDirectory for unverified
    const unverifiedDir = targetDir.replace(/^school\//, '');
    const unverifiedPath = path.join(__dirname, 'unverified', unverifiedDir);
    
    // Create directory recursively if it doesn't exist
    fs.mkdir(unverifiedPath, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, unverifiedPath);
    });
  },
  filename: (req, file, cb) => {
    // Use original filename
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    files: 10 // Max 10 files per upload
  },
  fileFilter: (req, file, cb) => {
    // File type validation is done on frontend, but add server-side check
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp', 
                               '.py', '.java', '.cpp', '.c', '.js', '.ts', 
                               '.html', '.css', '.txt', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${ext}`));
    }
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Get pending submissions
app.get('/api/admin/submissions', (req, res) => {
  res.json(pendingSubmissions.filter(sub => sub.status === 'pending'));
});

// Approve submission and move files from unverified to public
app.post('/api/admin/approve/:id', (req, res) => {
  const submissionId = req.params.id;
  const submission = pendingSubmissions.find(s => s.id === submissionId);
  
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  
  if (submission.status !== 'pending') {
    return res.status(400).json({ error: 'Submission already processed' });
  }
  
  try {
    // Create target directory in public/school
    const targetPath = path.join(__dirname, 'public', submission.targetDirectory);
    fs.mkdirSync(targetPath, { recursive: true });
    
    // Move files from unverified to public
    for (const file of submission.files) {
      const sourcePath = path.join(__dirname, file.unverifiedPath);
      const destPath = path.join(targetPath, file.originalName);
      
      if (fs.existsSync(sourcePath)) {
        fs.renameSync(sourcePath, destPath);
      }
    }
    
    // Clean up empty directories in unverified
    const unverifiedDir = path.join(__dirname, submission.unverifiedPath);
    if (fs.existsSync(unverifiedDir)) {
      fs.rmSync(unverifiedDir, { recursive: true, force: true });
    }
    
    // Update submission status
    submission.status = 'approved';
    submission.approvedAt = new Date().toISOString();
    
    res.json({ success: true, message: 'Submission approved and files published' });
    
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ error: 'Failed to approve submission', details: error.message });
  }
});

// Reject submission and delete unverified files
app.post('/api/admin/reject/:id', (req, res) => {
  const submissionId = req.params.id;
  const submission = pendingSubmissions.find(s => s.id === submissionId);
  
  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }
  
  if (submission.status !== 'pending') {
    return res.status(400).json({ error: 'Submission already processed' });
  }
  
  try {
    // Delete unverified files
    const unverifiedDir = path.join(__dirname, submission.unverifiedPath);
    if (fs.existsSync(unverifiedDir)) {
      fs.rmSync(unverifiedDir, { recursive: true, force: true });
    }
    
    // Update submission status
    submission.status = 'rejected';
    submission.rejectedAt = new Date().toISOString();
    
    res.json({ success: true, message: 'Submission rejected and files deleted' });
    
  } catch (error) {
    console.error('Rejection error:', error);
    res.status(500).json({ error: 'Failed to reject submission', details: error.message });
  }
});

// File upload endpoint with multer
app.post('/api/upload-for-verification', upload.array('files', 10), (req, res) => {
  try {
    const submissionId = Date.now().toString();
    const { targetDirectory, courseCode, unit, fileType, verificationDate, customTitle } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    if (!targetDirectory || !courseCode || !unit || !fileType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create submission record for admin approval
    const submission = {
      id: submissionId,
      courseCode,
      unit,
      fileType,
      verificationDate: verificationDate || 'idk',
      customTitle: customTitle || '',
      targetDirectory, // school/12/ICS4U1/...
      unverifiedPath: path.join('unverified', targetDirectory.replace(/^school\//, '')), // unverified/12/ICS4U1/...
      files: req.files.map(f => ({
        originalName: f.originalname,
        unverifiedPath: path.relative(__dirname, f.path),
        size: f.size
      })),
      status: 'pending',
      uploadedAt: new Date().toISOString()
    };
    
    pendingSubmissions.push(submission);
    
    res.json({ 
      success: true, 
      message: 'Files uploaded successfully and pending admin verification',
      uploadedFiles: req.files.length,
      submissionId: submission.id
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process upload', details: error.message });
  }
});

// Scan directory endpoint
app.get('/api/directory', (req, res) => {
  try {
    const requestedPath = decodeURIComponent(req.query.path || '');
    const schoolDir = path.join(__dirname, 'public', 'school');
    const fullPath = path.join(schoolDir, requestedPath);
    // Don't show unverified content in regular browsing - only show verified files
    // Admins can access unverified files through the admin panel
    
    console.log(`API Request - Path: "${requestedPath}", Verified: "${fullPath}"`);
    
    // Security check - make sure we're not accessing files outside school directory
    if (!fullPath.startsWith(schoolDir)) {
      console.log('Access denied - path outside school directory');
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Check if at least one directory exists
    const verifiedExists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
    
    if (!verifiedExists) {
      console.log(`Directory not found: ${fullPath}`);
      return res.status(404).json({ error: 'Directory not found', path: fullPath });
    }
    
    // Helper function to check if directory has any files (recursively) - only checks verified
    const hasFiles = (verifiedDirPath) => {
      try {
        // Check verified directory
        if (fs.existsSync(verifiedDirPath)) {
          const verifiedContents = fs.readdirSync(verifiedDirPath, { withFileTypes: true });
          if (verifiedContents.some(entry => entry.isFile())) {
            return true;
          }
          // Check subdirectories
          for (const entry of verifiedContents) {
            if (entry.isDirectory()) {
              const subdirPath = path.join(verifiedDirPath, entry.name);
              if (hasFiles(subdirPath)) {
                return true;
              }
            }
          }
        }
        
        return false;
      } catch (error) {
        console.log(`Error checking directory:`, error.message);
        return false;
      }
    };

    // Helper function to find first non-empty subdirectory
    const findFirstNonEmptyDir = (dirPath) => {
      try {
        const contents = fs.readdirSync(dirPath, { withFileTypes: true });
        
        // Check if current directory has files
        if (contents.some(entry => entry.isFile())) {
          return dirPath;
        }
        
        // Get all subdirectories
        const subdirs = contents.filter(entry => entry.isDirectory());
        
        // Check each subdirectory
        for (const subdir of subdirs) {
          const subdirPath = path.join(dirPath, subdir.name);
          const result = findFirstNonEmptyDir(subdirPath);
          if (result) {
            return result;
          }
        }
        
        return null;
      } catch (error) {
        console.log(`Error finding non-empty directory in ${dirPath}:`, error.message);
        return null;
      }
    };

    // Check if current directory is empty and try to skip to first non-empty one
    if (!hasFiles(fullPath)) {
      console.log(`Directory "${requestedPath}" is empty, searching for non-empty subdirectory...`);
      const nonEmptyPath = findFirstNonEmptyDir(fullPath);
      
      if (nonEmptyPath && nonEmptyPath !== fullPath) {
        // Found a non-empty subdirectory, redirect to it
        const redirectPath = path.relative(schoolDir, nonEmptyPath).replace(/\\/g, '/');
        console.log(`Redirecting to first non-empty directory: "${redirectPath}"`);
        return res.json({ 
          redirect: true, 
          path: redirectPath,
          message: 'Skipped to first directory with files'
        });
      } else {
        // No files found anywhere in this path
        console.log(`No files found in "${requestedPath}" or its subdirectories`);
        return res.json({ 
          items: [],
          empty: true,
          message: 'This directory and all subdirectories are empty'
        });
      }
    }
    
    // Read directory contents - only show verified files
    const items = [];
    
    // Read verified directory only
    const verifiedContents = fs.readdirSync(fullPath, { withFileTypes: true });
    for (const item of verifiedContents) {
      const itemPath = path.join(fullPath, item.name);
      const itemStat = fs.statSync(itemPath);
      const relativePath = path.join(requestedPath.toString(), item.name).replace(/\\/g, '/');
      
      if (item.isDirectory()) {
        const containsFiles = hasFiles(itemPath);
        if (containsFiles) {
          items.push({
            name: item.name,
            type: 'directory',
            path: relativePath,
            size: 0,
            lastModified: itemStat.mtime.toISOString(),
            verified: true
          });
        }
      } else if (item.isFile()) {
        const extension = path.extname(item.name).toLowerCase().slice(1);
        items.push({
          name: item.name,
          type: 'file',
          path: relativePath,
          size: itemStat.size,
          lastModified: itemStat.mtime.toISOString(),
          extension: extension,
          url: `/school/${relativePath}`,
          verified: true
        });
      }
    }
    
    // Add parent directory entry if not at root
    if (requestedPath && requestedPath !== '') {
      const parentPath = path.dirname(requestedPath);
      items.push({
        name: '../',
        type: 'directory',
        path: parentPath === '.' ? '' : parentPath,
        size: 0,
        lastModified: new Date().toISOString(),
        isParent: true,
        verified: true // Parent directory is always considered verified
      });
    }
    
    // Sort items - parent directory first, then directories, then files, all alphabetically within type
    items.sort((a, b) => {
      if (a.isParent) return -1;
      if (b.isParent) return 1;
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    
    res.json({ items });
    
  } catch (error) {
    console.error('Error scanning directory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UptimeRobot status endpoint
app.get('/api/status', async (req, res) => {
  try {
    const UPTIME_ROBOT_API_KEY = process.env.UPTIME_ROBOT_API_KEY;
    
    if (!UPTIME_ROBOT_API_KEY) {
      return res.status(500).json({ 
        error: 'UptimeRobot API key not configured',
        details: 'Please set UPTIME_ROBOT_API_KEY in environment variables'
      });
    }
    
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (uptimeRobotCache && (now - uptimeRobotCacheTimestamp) < UPTIME_ROBOT_CACHE_DURATION) {
      console.log('Serving UptimeRobot data from cache');
      return res.json(uptimeRobotCache);
    }
    
    console.log('Fetching fresh UptimeRobot data');
    const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: UPTIME_ROBOT_API_KEY,
        format: 'json',
        custom_uptime_ratios: '30',
        response_times: 1,
        response_times_average: 30
      })
    });
    
    if (!response.ok) {
      throw new Error(`UptimeRobot API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update cache
    uptimeRobotCache = data;
    uptimeRobotCacheTimestamp = now;
    
    res.json(data);
    
  } catch (error) {
    console.error('UptimeRobot API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch status from UptimeRobot',
      details: error.message 
    });
  }
});

// API health check endpoint
app.get('/api/health', async (req, res) => {
  const startTime = Date.now();
  
  const apiRoutes = [
    { name: 'Directory API', endpoint: '/api/directory?path=', method: 'GET' },
    { name: 'Admin API', endpoint: '/api/admin/submissions', method: 'GET' },
    // Removed Status API check to avoid excessive UptimeRobot API calls
  ];
  
  const checks = await Promise.all(
    apiRoutes.map(async (route) => {
      const checkStart = Date.now();
      try {
        const url = `http://localhost:${port}${route.endpoint}`;
        const response = await fetch(url, { 
          method: route.method,
          headers: { 'Content-Type': 'application/json' }
        });
        
        const responseTime = Date.now() - checkStart;
        
        return {
          name: route.name,
          endpoint: route.endpoint,
          status: response.ok ? 'operational' : 'degraded',
          responseTime,
          statusCode: response.status
        };
      } catch (error) {
        return {
          name: route.name,
          endpoint: route.endpoint,
          status: 'down',
          responseTime: Date.now() - checkStart,
          statusCode: 0,
          error: error.message
        };
      }
    })
  );
  
  const allOperational = checks.every(check => check.status === 'operational');
  const totalTime = Date.now() - startTime;
  
  res.json({
    status: allOperational ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    totalResponseTime: totalTime,
    checks
  });
});


// Serve React app for all non-API routes (must be last)
app.use((req, res) => {
  // Serve the React app for all routes not already handled
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`School file server running on port ${port}`);
});