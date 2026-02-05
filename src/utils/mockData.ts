export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  modified?: string;
}

export interface DirectoryData {
  path: string;
  items: FileItem[];
  totalFiles: number;
  totalFolders: number;
}

export interface NavigationData {
  prev: string | null;
  next: string | null;
  current: number;
  total: number;
}

export interface FileViewerData {
  file_path: string;
  file_name: string;
  file_type: string;
  nav_data: NavigationData;
}

// Mock school directory structure
export const mockDirectoryStructure: Record<string, DirectoryData> = {
  '': {
    path: '',
    items: [
      { name: '12', path: '12', type: 'folder' }
    ],
    totalFiles: 0,
    totalFolders: 1
  },
  '12': {
    path: '12',
    items: [
      { name: 'advanced functions', path: '12/advanced functions', type: 'folder' }
    ],
    totalFiles: 0,
    totalFolders: 1
  },
  '12/advanced functions': {
    path: '12/advanced functions',
    items: [
      { name: 'U1', path: '12/advanced functions/U1', type: 'folder' },
      { name: 'U2', path: '12/advanced functions/U2', type: 'folder' },
      { name: 'U3', path: '12/advanced functions/U3', type: 'folder' },
      { name: 'U4', path: '12/advanced functions/U4', type: 'folder' },
      { name: 'U5', path: '12/advanced functions/U5', type: 'folder' },
      { name: 'U6', path: '12/advanced functions/U6', type: 'folder' }
    ],
    totalFiles: 0,
    totalFolders: 6
  },
  '12/advanced functions/U1': {
    path: '12/advanced functions/U1',
    items: [
      { name: 'answers', path: '12/advanced functions/U1/answers', type: 'folder' },
      { name: 'test', path: '12/advanced functions/U1/test', type: 'folder' }
    ],
    totalFiles: 0,
    totalFolders: 2
  },
  '12/advanced functions/U1/test': {
    path: '12/advanced functions/U1/test',
    items: [
      { name: 'IMG_7691.jpg', path: '12/advanced functions/U1/test/IMG_7691.jpg', type: 'file', size: 2048576, modified: '2024-01-15' },
      { name: 'IMG_7692.jpg', path: '12/advanced functions/U1/test/IMG_7692.jpg', type: 'file', size: 1875234, modified: '2024-01-15' },
      { name: 'IMG_7693.jpg', path: '12/advanced functions/U1/test/IMG_7693.jpg', type: 'file', size: 2156789, modified: '2024-01-15' },
      { name: 'test_notes.pdf', path: '12/advanced functions/U1/test/test_notes.pdf', type: 'file', size: 345678, modified: '2024-01-14' }
    ],
    totalFiles: 4,
    totalFolders: 0
  },
  '12/advanced functions/U1/answers': {
    path: '12/advanced functions/U1/answers',
    items: [
      { name: 'answer_key.pdf', path: '12/advanced functions/U1/answers/answer_key.pdf', type: 'file', size: 456789, modified: '2024-01-16' }
    ],
    totalFiles: 1,
    totalFolders: 0
  },
  '12/advanced functions/U2': {
    path: '12/advanced functions/U2',
    items: [
      { name: 'answers', path: '12/advanced functions/U2/answers', type: 'folder' }
    ],
    totalFiles: 0,
    totalFolders: 1
  },
  '12/advanced functions/U2/answers': {
    path: '12/advanced functions/U2/answers',
    items: [
      { name: 'unit2_solutions.pdf', path: '12/advanced functions/U2/answers/unit2_solutions.pdf', type: 'file', size: 678901, modified: '2024-01-20' }
    ],
    totalFiles: 1,
    totalFolders: 0
  },
  '12/advanced functions/U3': {
    path: '12/advanced functions/U3',
    items: [
      { name: 'test', path: '12/advanced functions/U3/test', type: 'folder' }
    ],
    totalFiles: 0,
    totalFolders: 1
  },
  '12/advanced functions/U3/test': {
    path: '12/advanced functions/U3/test',
    items: [
      { name: 'practice_test.pdf', path: '12/advanced functions/U3/test/practice_test.pdf', type: 'file', size: 789012, modified: '2024-01-25' }
    ],
    totalFiles: 1,
    totalFolders: 0
  },
  '12/advanced functions/U4': {
    path: '12/advanced functions/U4',
    items: [
      { name: 'test', path: '12/advanced functions/U4/test', type: 'folder' }
    ],
    totalFiles: 0,
    totalFolders: 1
  },
  '12/advanced functions/U4/test': {
    path: '12/advanced functions/U4/test',
    items: [
      { name: 'answers', path: '12/advanced functions/U4/test/answers', type: 'folder' }
    ],
    totalFiles: 0,
    totalFolders: 1
  },
  '12/advanced functions/U4/test/answers': {
    path: '12/advanced functions/U4/test/answers',
    items: [
      { name: 'detailed_solutions.pdf', path: '12/advanced functions/U4/test/answers/detailed_solutions.pdf', type: 'file', size: 890123, modified: '2024-02-01' }
    ],
    totalFiles: 1,
    totalFolders: 0
  },
  '12/advanced functions/U5': {
    path: '12/advanced functions/U5',
    items: [
      { name: 'answers', path: '12/advanced functions/U5/answers', type: 'folder' }
    ],
    totalFiles: 0,
    totalFolders: 1
  },
  '12/advanced functions/U5/answers': {
    path: '12/advanced functions/U5/answers',
    items: [
      { name: 'final_answers.pdf', path: '12/advanced functions/U5/answers/final_answers.pdf', type: 'file', size: 567890, modified: '2024-02-05' }
    ],
    totalFiles: 1,
    totalFolders: 0
  },
  '12/advanced functions/U6': {
    path: '12/advanced functions/U6',
    items: [
      { name: 'answers', path: '12/advanced functions/U6/answers', type: 'folder' },
      { name: 'test', path: '12/advanced functions/U6/test', type: 'folder' }
    ],
    totalFiles: 0,
    totalFolders: 2
  },
  '12/advanced functions/U6/answers': {
    path: '12/advanced functions/U6/answers',
    items: [
      { name: 'comprehensive_review.pdf', path: '12/advanced functions/U6/answers/comprehensive_review.pdf', type: 'file', size: 1234567, modified: '2024-02-10' }
    ],
    totalFiles: 1,
    totalFolders: 0
  },
  '12/advanced functions/U6/test': {
    path: '12/advanced functions/U6/test',
    items: [
      { name: 'final_exam.pdf', path: '12/advanced functions/U6/test/final_exam.pdf', type: 'file', size: 987654, modified: '2024-02-12' }
    ],
    totalFiles: 1,
    totalFolders: 0
  }
};

export const getDirectoryData = (path: string): DirectoryData | null => {
  return mockDirectoryStructure[path] || null;
};

export const getFileData = (filePath: string): FileViewerData | null => {
  // Find the file in the directory structure
  const pathParts = filePath.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const dirPath = pathParts.slice(0, -1).join('/');
  
  const directory = getDirectoryData(dirPath);
  if (!directory) return null;
  
  const file = directory.items.find(item => item.name === fileName && item.type === 'file');
  if (!file) return null;
  
  // Determine file type
  let fileType = 'unknown';
  if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    fileType = 'image';
  } else if (fileName.match(/\.pdf$/i)) {
    fileType = 'pdf';
  }
  
  // Get navigation data for images
  let navData: NavigationData = {
    prev: null,
    next: null,
    current: 1,
    total: 1
  };
  
  if (fileType === 'image') {
    const imageFiles = directory.items.filter(item => 
      item.type === 'file' && 
      item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );
    
    const currentIndex = imageFiles.findIndex(item => item.name === fileName);
    if (currentIndex !== -1) {
      navData = {
        current: currentIndex + 1,
        total: imageFiles.length,
        prev: currentIndex > 0 ? imageFiles[currentIndex - 1].path : null,
        next: currentIndex < imageFiles.length - 1 ? imageFiles[currentIndex + 1].path : null
      };
    }
  }
  
  return {
    file_path: filePath,
    file_name: fileName,
    file_type: fileType,
    nav_data: navData
  };
};