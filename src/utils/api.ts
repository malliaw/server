// API service for real school directory

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = new Map<string, { data: DirectoryData; timestamp: number; etag?: string }>();

// Type definitions
interface DirectoryItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  size: number;
  lastModified: string;
  extension?: string;
  url?: string;
  verified?: boolean;
}

interface DirectoryData {
  items: DirectoryItem[];
  totalFiles: number;
  totalFolders: number;
  currentPath: string;
}

interface FileItem extends DirectoryItem {
  type: 'file';
  extension: string;
  url: string;
}



// Helper function to get file extension
const getFileExtension = (name: string): string => {
  const lastDot = name.lastIndexOf('.');
  return lastDot > 0 ? name.substring(lastDot + 1).toLowerCase() : '';
};

// Check if cache is valid
const isCacheValid = (cacheEntry: { timestamp: number }) => {
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
};

// Get cache key for a path
const getCacheKey = (path: string) => `directory:${path}`;

// Scan real school directory
const scanDirectory = async (path: string = ''): Promise<DirectoryItem[]> => {
  try {
    // Make actual API call to our backend server (use relative URL for production)
    const response = await fetch(`/api/directory?path=${encodeURIComponent(path)}`);
    
    if (!response.ok) {
      console.error(`API Error ${response.status}:`, await response.text());
      // Return empty array instead of throwing error to prevent crashes
      return [];
    }
    
    const data = await response.json();
    
    // Handle redirect to non-empty directory
    if (data.redirect && data.path) {
      console.log(`Auto-redirecting from "${path}" to "${data.path}"`);
      // Throw redirect signal so fetchDirectoryData can handle navigation
      throw { redirect: true, path: data.path, message: data.message };
    }
    
    console.log(`Scanned directory "${path}":`, data.items?.length || 0, 'items');
    return data.items || [];
    
  } catch (error) {
    // Re-throw redirect errors
    if (error && typeof error === 'object' && 'redirect' in error) {
      throw error;
    }
    
    console.error('Error scanning directory:', error);
    
    // Fallback to basic structure if backend is not available
    const schoolPath = path || '';
    const pathParts = schoolPath.split('/').filter(Boolean);
    
    if (pathParts.length === 0) {
      return [
        {
          name: '12',
          type: 'directory' as const,
          path: '12',
          size: 0,
          lastModified: new Date().toISOString()
        }
      ];
    }
    
    // Return empty if we can't reach the backend
    return [];
  }
};

export const fetchDirectoryData = async (path: string = ''): Promise<DirectoryData> => {
  const cacheKey = getCacheKey(path);
  const cachedEntry = cache.get(cacheKey);
  
  // Return cached data if valid
  if (cachedEntry && isCacheValid(cachedEntry)) {
    console.log(`Using cached data for "${path}"`);
    return cachedEntry.data;
  }
  
  try {
    // Fetch fresh data
    console.log(`Fetching fresh data for "${path}"`);
    const items = await scanDirectory(path);
    
    const folders = items.filter(item => item.type === 'directory');
    const files = items.filter(item => item.type === 'file');
    
    const directoryData: DirectoryData = {
      items,
      totalFiles: files.length,
      totalFolders: folders.length,
      currentPath: path
    };
    
    // Cache the result
    cache.set(cacheKey, {
      data: directoryData,
      timestamp: Date.now()
    });
    
    return directoryData;
    
  } catch (error) {
    // Handle redirect errors
    if (error && typeof error === 'object' && 'redirect' in error && (error as any).redirect) {
      console.log(`Handling redirect to: ${(error as any).path}`);
      // Recursively fetch the redirected path
      return fetchDirectoryData((error as any).path);
    }
    
    console.error('Error fetching directory data:', error);
    
    // If we have stale cache data, return it as fallback
    if (cachedEntry) {
      console.log(`Using stale cached data for "${path}" due to error`);
      return cachedEntry.data;
    }
    
    throw new Error('Failed to fetch directory data');
  }
};

export const fetchFileData = async (path: string): Promise<DirectoryItem> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    // For now, return basic file info
    // In a real app, this would fetch actual file metadata
    const fileName = path.split('/').pop() || '';
    const extension = getFileExtension(fileName);
    
    return {
      name: fileName,
      path,
      type: 'file' as const,
      extension,
      size: 0,
      lastModified: new Date().toISOString(),
      url: `/school/${path}` // Assuming files are served from /school/
    };
  } catch (error) {
    console.error('Error fetching file data:', error);
    throw new Error('Failed to fetch file data');
  }
};

// Preloading cache for instant navigation
const preloadingPaths = new Set<string>();

// Preload directory data in background
export const preloadDirectory = async (path: string) => {
  const cacheKey = getCacheKey(path);
  const cachedEntry = cache.get(cacheKey);
  
  // Skip if already cached and valid, or currently preloading
  if ((cachedEntry && isCacheValid(cachedEntry)) || preloadingPaths.has(path)) {
    return;
  }
  
  preloadingPaths.add(path);
  
  try {
    console.log(`Preloading directory "${path}"`);
    await fetchDirectoryData(path);
  } catch (error) {
    console.warn(`Failed to preload directory "${path}":`, error);
  } finally {
    preloadingPaths.delete(path);
  }
};

// Preload image for instant viewing
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${url}`));
    img.src = url;
  });
};

// Cache management utilities
export const clearCache = () => {
  cache.clear();
  preloadingPaths.clear();
  console.log('Directory cache cleared');
};

export const invalidateCache = (path: string) => {
  const cacheKey = getCacheKey(path);
  cache.delete(cacheKey);
  console.log(`Cache invalidated for "${path}"`);
};

export const getCacheInfo = () => {
  const entries = Array.from(cache.entries()).map(([key, value]) => ({
    path: key.replace('directory:', ''),
    timestamp: value.timestamp,
    age: Date.now() - value.timestamp,
    valid: isCacheValid(value)
  }));
  return entries;
};

// Explicit exports
export type { DirectoryItem, DirectoryData, FileItem };

// Recursively fetch all files from a directory and its subdirectories
export const fetchAllFilesRecursive = async (path: string = ''): Promise<DirectoryItem[]> => {
  const cacheKey = `allFiles:${path}`;
  const cachedEntry = cache.get(cacheKey);
  
  // Return cached data if valid
  if (cachedEntry && isCacheValid(cachedEntry)) {
    console.log(`Using cached recursive data for "${path}"`);
    return cachedEntry.data.items.filter(item => item.type === 'file');
  }
  
  try {
    console.log(`Fetching all files recursively for "${path}"`);
    const allFiles: DirectoryItem[] = [];
    
    const collectFiles = async (currentPath: string) => {
      const items = await scanDirectory(currentPath);
      
      for (const item of items) {
        if (item.type === 'file') {
          allFiles.push(item);
        } else if (item.type === 'directory') {
          // Recursively collect files from subdirectories
          await collectFiles(item.path);
        }
      }
    };
    
    await collectFiles(path);
    
    // Cache the result
    const directoryData: DirectoryData = {
      items: allFiles,
      totalFiles: allFiles.length,
      totalFolders: 0,
      currentPath: path
    };
    
    cache.set(cacheKey, {
      data: directoryData,
      timestamp: Date.now()
    });
    
    return allFiles;
  } catch (error) {
    console.error('Error fetching recursive files:', error);
    return [];
  }
};