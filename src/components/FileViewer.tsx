import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { fetchFileData, fetchDirectoryData } from '../utils/api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageHeader = styled.div`
  h1 {
    position: relative;
    color: ${props => props.theme.colors.accent.primary};
    font-family: ${props => props.theme.fonts.mono};
    font-weight: 700;
    font-size: 2rem;
  }
`;

const ViewerBox = styled.div`
  background: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  min-height: 70vh;
  position: relative;
`;

const ViewerHeader = styled.div`
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.tertiary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .icon {
    font-size: 2rem;
  }
  
  .details {
    h2 {
      color: ${props => props.theme.colors.accent.primary};
      font-family: ${props => props.theme.fonts.mono};
      font-size: 1.2rem;
      margin-bottom: 0.25rem;
    }
    
    .meta {
      color: ${props => props.theme.colors.text.muted};
      font-family: ${props => props.theme.fonts.mono};
      font-size: 0.9rem;
    }
  }
`;

const ViewerActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ActionBtn = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.9rem;
  transition: all ${props => props.theme.animations.normal};
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.accent.primary};
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.accent.primary};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ImageNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid ${props => props.theme.colors.border};
`;

const NavBtn = styled.button`
  padding: 0.5rem;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text.primary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  font-size: 1rem;
  transition: all ${props => props.theme.animations.normal};
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.accent.primary};
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.accent.primary};
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ViewerContent = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  position: relative;
`;

const ImageNavigationArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all ${props => props.theme.animations.normal};
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(0, 255, 136, 0.2);
    border-color: ${props => props.theme.colors.accent.primary};
    transform: translateY(-50%) scale(1.1);
    color: ${props => props.theme.colors.accent.primary};
  }
  
  &.prev {
    left: 2rem;
  }
  
  &.next {
    right: 2rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    
    &.prev {
      left: 1rem;
    }
    
    &.next {
      right: 1rem;
    }
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: ${props => props.theme.colors.text.secondary};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 0.9rem;
  z-index: 10;
  backdrop-filter: blur(10px);
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    bottom: 1rem;
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

const ImageViewer = styled.img`
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: transform ${props => props.theme.animations.normal};
  cursor: zoom-in;
  
  &:hover {
    transform: scale(1.02);
  }
  
  &.zoomed {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    z-index: 1000;
    max-width: 95vw;
    max-height: 95vh;
    cursor: zoom-out;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  }
`;

const ZoomOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 999;
  opacity: 0;
  transition: opacity ${props => props.theme.animations.normal};
  pointer-events: none;
  
  &.active {
    opacity: 1;
    pointer-events: all;
  }
`;

const PDFViewer = styled.iframe`
  width: 100%;
  min-height: 70vh;
  border: none;
  border-radius: 4px;
  background: #fff;
`;

const CodeViewerContainer = styled.div`
  width: 100%;
  height: 70vh;
  overflow: auto;
  background: #1e1e1e;
  border-radius: 8px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1e1e1e;
    border-radius: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 6px;
    border: 2px solid #1e1e1e;
    
    &:hover {
      background: #666;
    }
  }
  
  pre {
    margin: 0 !important;
    padding: 1.5rem !important;
    background: #1e1e1e !important;
    font-size: 0.9rem !important;
    line-height: 1.6 !important;
    min-height: 100%;
  }
`;

const UnknownFile = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .message {
    color: ${props => props.theme.colors.text.muted};
    font-family: ${props => props.theme.fonts.mono};
    margin-bottom: 2rem;
    
    p {
      margin-bottom: 0.5rem;
    }
  }
`;

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.colors.text.muted};
  font-family: ${props => props.theme.fonts.mono};
  padding: 4rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid ${props => props.theme.colors.border};
    border-top: 3px solid ${props => props.theme.colors.accent.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
`;

interface NavData {
  prev: string | null;
  next: string | null;
  current: number;
  total: number;
}

interface FileData {
  file_path: string;
  file_name: string;
  file_type: string;
  nav_data: NavData;
}

const FileViewer = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [codeContent, setCodeContent] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname.replace('/view/', '');

  useEffect(() => {
    fetchData();
  }, [currentPath]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
          document.body.style.overflow = 'auto';
        } else {
          goBack();
        }
      }
      
      if (fileData && !isZoomed) {
        if (e.key === 'ArrowLeft' && fileData.nav_data.prev) {
          handlePrevImage();
        }
        if (e.key === 'ArrowRight' && fileData.nav_data.next) {
          handleNextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fileData, isZoomed, navigate]);

  const getLanguageFromFilename = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: { [key: string]: string } = {
      'py': 'python',
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'jsx',
      'tsx': 'tsx',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'sql': 'sql',
      'sh': 'bash',
      'rb': 'ruby',
      'php': 'php',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
    };
    return langMap[ext || ''] || 'text';
  };

  const isCodeFile = (filename: string): boolean => {
    const codeExtensions = [
      'py', 'js', 'ts', 'jsx', 'tsx', 'java', 'cpp', 'c', 'cs', 
      'html', 'css', 'json', 'sql', 'sh', 'rb', 'php', 'go', 'rs',
      'swift', 'kt', 'xml', 'yaml', 'yml', 'md', 'txt'
    ];
    const ext = filename.split('.').pop()?.toLowerCase();
    return codeExtensions.includes(ext || '');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setCodeContent(null);
      
      // Get the file info
      await fetchFileData(currentPath);
      
      // Get directory info to find other images for navigation
      const pathParts = currentPath.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const dirPath = pathParts.slice(0, -1).join('/');
      
      // Fetch directory data to get all images
      const directoryData = await fetchDirectoryData(dirPath);
      const imageFiles = directoryData.items.filter(item => 
        item.type === 'file' && 
        item.extension && 
        ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(item.extension.toLowerCase())
      );
      
      // Transform to the expected format
      let fileType = 'unknown';
      
      if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        fileType = 'image';
      } else if (fileName.match(/\.pdf$/i)) {
        fileType = 'pdf';
      } else if (isCodeFile(fileName)) {
        fileType = 'code';
        // Fetch the code content
        try {
          const response = await fetch(`/school/${currentPath}`);
          const text = await response.text();
          setCodeContent(text);
        } catch (err) {
          console.error('Failed to load code content:', err);
        }
      }
      
      // Create navigation data for images
      let navData: {
        prev: string | null;
        next: string | null;
        current: number;
        total: number;
      } = {
        prev: null,
        next: null,
        current: 1,
        total: 1
      };
      
      if (fileType === 'image' && imageFiles.length > 1) {
        const currentIndex = imageFiles.findIndex(img => img.name === fileName);
        if (currentIndex !== -1) {
          const prevIndex = currentIndex === 0 ? imageFiles.length - 1 : currentIndex - 1;
          const nextIndex = currentIndex === imageFiles.length - 1 ? 0 : currentIndex + 1;
          
          navData = {
            current: currentIndex + 1,
            total: imageFiles.length,
            prev: imageFiles[prevIndex].path,
            next: imageFiles[nextIndex].path
          };
        }
      }
      
      const transformedData: FileData = {
        file_path: currentPath,
        file_name: fileName,
        file_type: fileType,
        nav_data: navData
      };
      
      setFileData(transformedData);
    } catch (err) {
      setError('Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    // Navigate back to the parent directory
    const pathParts = currentPath.split('/');
    pathParts.pop(); // Remove filename
    const parentPath = pathParts.join('/');
    navigate(parentPath ? `/browse/${parentPath}` : '/');
  };

  const handleImageZoom = () => {
    setIsZoomed(!isZoomed);
    document.body.style.overflow = isZoomed ? 'auto' : 'hidden';
  };

  const handleNavigation = (path: string) => {
    navigate(`/view/${path}`);
  };
  
  const handlePrevImage = () => {
    if (fileData && fileData.nav_data.prev) {
      handleNavigation(fileData.nav_data.prev);
    }
  };
  
  const handleNextImage = () => {
    if (fileData && fileData.nav_data.next) {
      handleNavigation(fileData.nav_data.next);
    }
  };

  if (loading) {
    return (
      <Loading>
        <div className="spinner" />
        <p>Loading file...</p>
      </Loading>
    );
  }

  if (error || !fileData) {
    return (
      <ViewerContainer>
        <UnknownFile>
          <div className="icon">[ERROR]</div>
          <div className="message">
            <p>Error loading file</p>
            <p>{error}</p>
          </div>
          <ActionBtn onClick={goBack}>← Back</ActionBtn>
        </UnknownFile>
      </ViewerContainer>
    );
  }

  const { file_path, file_name, file_type, nav_data } = fileData;
  const fileIcon = file_type === 'pdf' ? '📄' : file_type === 'image' ? '🖼️' : file_type === 'code' ? '💻' : '📎';

  return (
    <>
      <ViewerContainer>
        <PageHeader>
          <h1>File Viewer</h1>
        </PageHeader>

        <ViewerBox>
          <ViewerHeader>
            <FileInfo>
              <div className="icon">{fileIcon}</div>
              <div className="details">
                <h2>{file_name}</h2>
                <div className="meta">
                  Type: {file_type.toUpperCase()} • Path: /{file_path}
                </div>
              </div>
            </FileInfo>
            
            <ViewerActions>
              <ActionBtn onClick={goBack}>← Back</ActionBtn>
              <ActionBtn as="a" href={`/school/${file_path}`} download>
                Download
              </ActionBtn>
              <ActionBtn as="a" href={`/school/${file_path}`} target="_blank">
                Open Direct
              </ActionBtn>
              
              {file_type === 'image' && nav_data.total > 1 && (
                <ImageNav>
                  <NavBtn 
                    disabled={!nav_data.prev}
                    onClick={() => nav_data.prev && handleNavigation(nav_data.prev)}
                  >
                    ←
                  </NavBtn>
                  <ImageCounter>{nav_data.current}/{nav_data.total}</ImageCounter>
                  <NavBtn 
                    disabled={!nav_data.next}
                    onClick={() => nav_data.next && handleNavigation(nav_data.next)}
                  >
                    →
                  </NavBtn>
                </ImageNav>
              )}
            </ViewerActions>
          </ViewerHeader>
          
          <ViewerContent>
            {file_type === 'pdf' ? (
              <PDFViewer 
                src={`/school/${file_path}`}
                title={file_name}
              />
            ) : file_type === 'code' ? (
              <CodeViewerContainer>
                {codeContent ? (
                  <SyntaxHighlighter
                    language={getLanguageFromFilename(file_name)}
                    style={vscDarkPlus}
                    showLineNumbers
                    wrapLines
                    customStyle={{
                      margin: 0,
                      borderRadius: '8px',
                    }}
                  >
                    {codeContent}
                  </SyntaxHighlighter>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100%',
                    color: '#888' 
                  }}>
                    Loading code...
                  </div>
                )}
              </CodeViewerContainer>
            ) : file_type === 'image' ? (
              <>
                {nav_data.total > 1 && nav_data.prev && (
                  <ImageNavigationArrow 
                    className="prev"
                    onClick={handlePrevImage}
                    title={`Previous image (${nav_data.current - 1 === 0 ? nav_data.total : nav_data.current - 1}/${nav_data.total})`}
                  >
                    ←
                  </ImageNavigationArrow>
                )}
                
                <ImageViewer
                  src={`/school/${file_path}`}
                  alt={file_name}
                  className={isZoomed ? 'zoomed' : ''}
                  onClick={handleImageZoom}
                />
                
                {nav_data.total > 1 && nav_data.next && (
                  <ImageNavigationArrow 
                    className="next"
                    onClick={handleNextImage}
                    title={`Next image (${nav_data.current + 1 > nav_data.total ? 1 : nav_data.current + 1}/${nav_data.total})`}
                  >
                    →
                  </ImageNavigationArrow>
                )}
                
                {nav_data.total > 1 && (
                  <ImageCounter>
                    {nav_data.current} of {nav_data.total}
                  </ImageCounter>
                )}
              </>
            ) : (
              <UnknownFile>
                <div className="icon">❓</div>
                <div className="message">
                  <p>This file type cannot be previewed in the browser.</p>
                  <p>{file_name}</p>
                </div>
                <ActionBtn as="a" href={`/school/${file_path}`} download>
                  Download to view
                </ActionBtn>
              </UnknownFile>
            )}
          </ViewerContent>
        </ViewerBox>
      </ViewerContainer>
      
      <ZoomOverlay 
        className={isZoomed ? 'active' : ''}
        onClick={handleImageZoom}
      />
    </>
  );
};

export default FileViewer;