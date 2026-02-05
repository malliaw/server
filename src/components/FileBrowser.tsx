import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { fetchDirectoryData, preloadDirectory, preloadImage } from '../utils/api';
import type { DirectoryItem, DirectoryData } from '../utils/api';

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-family: ${props => props.theme.fonts.mono};
  
  .breadcrumb-item {
    color: ${props => props.theme.colors.accent.primary};
    cursor: pointer;
    text-decoration: none;
    
    &:hover {
      color: ${props => props.theme.colors.accent.secondary};
    }
    
    &.current {
      color: ${props => props.theme.colors.text.primary};
      cursor: default;
    }
  }
  
  .separator {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const BouncingHint = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.85rem;
  color: #888;
  animation: bounce 2s ease-in-out infinite;
  z-index: 5;
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }
`;

const BrowserContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 100%;
  position: relative;
`;

const PageHeader = styled.div`
  h1 {
    position: relative;
    color: ${props => props.theme.colors.accent.primary};
    font-family: ${props => props.theme.fonts.mono};
    font-weight: 700;
    font-size: 2rem;
    
    &::before,
    &::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${props => props.theme.colors.primary};
      overflow: hidden;
    }
    
    &::before {
      left: 2px;
      color: ${props => props.theme.colors.accent.secondary};
      animation: glitchAnim 3s infinite linear alternate-reverse;
    }
    
    &::after {
      left: -2px;
      color: ${props => props.theme.colors.accent.tertiary};
      animation: glitchAnim2 2s infinite linear alternate-reverse;
    }
  }
`;

const StatsBar = styled.div`
  background: ${props => props.theme.colors.tertiary};
  padding: 1rem 2rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: ${props => props.theme.fonts.mono};
    font-size: 0.9rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem;
    
    div {
      font-size: 0.8rem;
      justify-content: center;
    }
  }
`;

const Stat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text.secondary};
  
  .value {
    color: ${props => props.theme.colors.accent.primary};
    font-weight: 600;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 1rem;
  }
`;

const Section = styled.div`
  background: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  transition: all ${props => props.theme.animations.normal};
  position: relative;
  
  &:hover {
    border-color: ${props => props.theme.colors.accent.primary};
    box-shadow: 0 0 20px ${props => props.theme.colors.shadow};
    transform: translateY(-2px);
  }
`;

const SectionHeader = styled.div`
  padding: 1rem 1.5rem;
  background: ${props => props.theme.colors.tertiary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-family: ${props => props.theme.fonts.mono};
  font-weight: 600;
  color: ${props => props.theme.colors.accent.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionBody = styled.div`
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
`;

const ItemList = styled.ul`
  list-style: none;
  overflow-x: hidden;
  width: 100%;
`;

const Item = styled.li`
  width: 100%;
  overflow: hidden;
  
  .item-content {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    transition: all 0.15s ease-out;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    will-change: transform, background-color;
    width: 100%;
    box-sizing: border-box;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background: ${props => props.theme.colors.tertiary};
      color: ${props => props.theme.colors.accent.primary};
      transform: translateX(8px);
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 0;
      background: linear-gradient(90deg, ${props => props.theme.colors.accent.primary}, transparent);
      transition: width 0.15s ease-out;
    }
    
    &:hover::before {
      width: 4px;
    }
    
    .icon {
      margin-right: 0.75rem;
      font-size: 1.2rem;
      width: 20px;
      text-align: center;
      transition: transform 0.15s ease-out;
    }
    
    &:hover .icon {
      transform: scale(1.16); /* Approximately 2px larger all around for 20px icon */
    }
    
    .name {
      flex: 1;
      font-weight: 500;
    }
    
    .meta {
      font-family: ${props => props.theme.fonts.mono};
      font-size: 0.8rem;
      color: ${props => props.theme.colors.text.muted};
      margin-left: 1rem;
      opacity: 0.7;
      transition: opacity 0.15s ease-out;
    }
    
    &:hover .meta {
      opacity: 1;
    }
  }
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${props => props.theme.colors.text.muted};
  font-family: ${props => props.theme.fonts.mono};
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.3;
  }
`;

const AcademicHelper = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  position: relative;
  
  &:hover {
    border-color: ${props => props.theme.colors.accent.primary};
  }
`;

const AcademicButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(45deg, #1a1a1a, #000000);
  border: 2px solid #333333;
  border-radius: 6px;
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.fonts.mono};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all ${props => props.theme.animations.normal};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
    border: 2px solid;
    border-image: linear-gradient(45deg, #FFD700, #000000, #FFD700) 1;
    animation: goldBorderPulse 2s infinite;
  }
  
  &:active {
    transform: translateY(0);
    background: linear-gradient(45deg, #000000, #1a1a1a);
    border-image: linear-gradient(45deg, #FFD700, #FFA500, #FFD700) 1;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  @keyframes goldBorderPulse {
    0%, 100% { border-image: linear-gradient(45deg, #FFD700, #000000, #FFD700) 1; }
    50% { border-image: linear-gradient(45deg, #FFA500, #1a1a1a, #FFA500) 1; }
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
  
  h2 {
    color: ${props => props.theme.colors.accent.primary};
    font-family: ${props => props.theme.fonts.mono};
    margin-bottom: 1.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.theme.animations.fast};
  
  &:hover {
    background: ${props => props.theme.colors.tertiary};
    color: ${props => props.theme.colors.text.primary};
    border-color: ${props => props.theme.colors.accent.primary};
  }
`;

const FileTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FileTypeButton = styled.button`
  padding: 1rem;
  background: ${props => props.theme.colors.tertiary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.fonts.mono};
  cursor: pointer;
  transition: all ${props => props.theme.animations.normal};
  text-align: center;
  
  &:hover {
    border-color: ${props => props.theme.colors.accent.primary};
    background: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
  }
  
  .emoji {
    font-size: 1.5rem;
    display: block;
    margin-bottom: 0.5rem;
  }
  
  .label {
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text.secondary};
    font-family: ${props => props.theme.fonts.mono};
    font-size: 0.9rem;
  }
  
  select, input {
    width: 100%;
    padding: 0.75rem;
    background: ${props => props.theme.colors.primary};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    color: ${props => props.theme.colors.text.primary};
    font-family: ${props => props.theme.fonts.mono};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.accent.primary};
    }
  }
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.accent.primary};
  border: 1px solid ${props => props.theme.colors.accent.primary};
  border-radius: 4px;
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.mono};
  font-weight: 600;
  cursor: pointer;
  transition: all ${props => props.theme.animations.normal};
  margin-right: 1rem;
  
  &:hover {
    background: transparent;
    color: ${props => props.theme.colors.accent.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: transparent;
  color: ${props => props.theme.colors.text.secondary};
  border-color: ${props => props.theme.colors.border};
  
  &:hover {
    background: ${props => props.theme.colors.tertiary};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const PathExplanationTrigger = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #888;
  cursor: pointer;
  text-decoration: underline;
  opacity: 0.8;
  transition: opacity ${props => props.theme.animations.fast};
  
  &:hover {
    opacity: 1;
    color: #aaa;
  }
`;

const PathExplanationPopup = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
  z-index: 1001;
  display: ${props => props.isVisible ? 'block' : 'none'};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  
  h3 {
    color: ${props => props.theme.colors.accent.primary};
    font-family: ${props => props.theme.fonts.mono};
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
  
  .path-breakdown {
    background: ${props => props.theme.colors.tertiary};
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
    font-family: ${props => props.theme.fonts.mono};
    font-size: 0.9rem;
  }
  
  .path-part {
    margin: 0.5rem 0;
    color: ${props => props.theme.colors.text.secondary};
  }
  
  .highlight {
    color: ${props => props.theme.colors.accent.primary};
    font-weight: 600;
  }
  
  .notes {
    margin-top: 1rem;
    font-size: 0.85rem;
    line-height: 1.4;
  }
  
  .note {
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text.secondary};
  }
  
  .ps {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid ${props => props.theme.colors.border};
    font-size: 0.8rem;
    color: ${props => props.theme.colors.text.muted};
    font-style: italic;
  }
  
  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    color: ${props => props.theme.colors.text.muted};
    cursor: pointer;
    font-size: 1.2rem;
    
    &:hover {
      color: ${props => props.theme.colors.text.primary};
    }
  }
`;

const PopupOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 2rem;
  background: ${props => props.theme.colors.tertiary};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border};
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.muted};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.2s ease-out;
  pointer-events: none;
  z-index: 10;
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .mini-spinner {
    width: 12px;
    height: 12px;
    border: 2px solid ${props => props.theme.colors.border};
    border-top: 2px solid ${props => props.theme.colors.accent.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
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

const FileBrowser = () => {
  const [data, setData] = useState<DirectoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [courseCode, setCourseCode] = useState('');
  const [unit, setUnit] = useState('');
  const [, setFileName] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [verificationDate, setVerificationDate] = useState('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [allFiles, setAllFiles] = useState<DirectoryItem[]>([]);
  const [showingAllFiles, setShowingAllFiles] = useState(false);
  const [showPathExplanation, setShowPathExplanation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname.replace('/browse', '').replace(/^\//, '');

  // Helper functions for academic file creation
  const parseCourseCode = (code: string) => {
    // Ontario course code format: XXXXX1 (e.g., MHF4U1, ICS3U1)
    if (code.length < 5) return null;
    
    const prefix = code.substring(0, 3).toUpperCase();
    const gradeDigit = code.substring(3, 4);
    
    // Special handling for computer science courses (ICS, ICD, TEJ, TGJ)
    let actualGrade = gradeDigit;
    if (prefix === 'ICS' || prefix === 'ICD' || prefix === 'TEJ' || prefix === 'TGJ') {
      // ICS2O = Grade 10, ICS3U = Grade 11, ICS4U = Grade 12
      const gradeMap: { [key: string]: string } = {
        '2': '10',
        '3': '11',
        '4': '12'
      };
      actualGrade = gradeMap[gradeDigit] || gradeDigit;
    }
    
    return {
      subject: code.substring(0, 1),
      descriptor: code.substring(1, 3),
      grade: actualGrade,
      destination: code.substring(4, 5),
      section: code.substring(5, 6) || '1'
    };
  };
  
  const getCourseType = (code: string) => {
    if (code.length < 3) return 'other';
    const prefix = code.substring(0, 3).toUpperCase();
    
    // Computer Science courses
    if (prefix === 'ICS' || prefix === 'ICD' || prefix === 'TEJ' || prefix === 'TGJ') {
      return 'computer-science';
    }
    // Math courses
    if (prefix.startsWith('M')) {
      return 'math';
    }
    // Science courses
    if (prefix.startsWith('S') || prefix === 'SBI' || prefix === 'SCH' || prefix === 'SPH') {
      return 'science';
    }
    // English/Essays
    if (prefix.startsWith('E') || prefix === 'ENG') {
      return 'english';
    }
    
    return 'other';
  };
  
  const getAllowedFileTypes = (code: string) => {
    const courseType = getCourseType(code);
    
    switch (courseType) {
      case 'computer-science':
        return {
          extensions: ['.py', '.java', '.cpp', '.c', '.js', '.ts', '.html', '.css', '.txt'],
          mimeTypes: ['text/x-python', 'text/plain', 'application/x-python-code', 'text/x-java-source', 'text/x-c', 'text/javascript', 'text/html', 'text/css'],
          description: 'Python, Java, C/C++, JavaScript files'
        };
      case 'math':
      case 'science':
        return {
          extensions: ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp'],
          mimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
          description: 'PDF and image files'
        };
      case 'english':
        return {
          extensions: ['.pdf', '.doc', '.docx', '.txt'],
          mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
          description: 'PDF, Word, and text files'
        };
      default:
        return {
          extensions: ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.txt'],
          mimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'text/plain'],
          description: 'PDF, image, and text files'
        };
    }
  };
  
  const usesUnits = (code: string) => {
    const courseType = getCourseType(code);
    return courseType !== 'computer-science';
  };
  
  const getSubjectName = (subject: string) => {
    const subjects: { [key: string]: string } = {
      'E': 'English',
      'M': 'Mathematics', 
      'S': 'Science',
      'H': 'Social Studies/History',
      'F': 'French',
      'T': 'Technology',
      'A': 'Arts',
      'P': 'Physical Education',
      'B': 'Business',
      'C': 'Career Studies'
    };
    return subjects[subject] || 'Unknown';
  };
  
  const generateFileName = () => {
    if (!selectedFileType || !courseCode || !unit) return '';
    
    const parsed = parseCourseCode(courseCode.toUpperCase());
    if (!parsed) return '';
    
    const typeMap: { [key: string]: string } = {
      'test': 'Test',
      'assignment': 'Assignment',
      'quiz': 'Quiz', 
      'exam': 'Exam',
      'essay': 'Essay'
    };
    
    // Get appropriate extension based on course type
    const courseType = getCourseType(courseCode);
    let extension = '.pdf';
    if (courseType === 'computer-science') {
      extension = uploadFiles.length > 0 ? '' : '.py'; // Use actual file extensions for CS
    }
    
    const dateStr = verificationDate && verificationDate !== 'idk' ? `_${verificationDate.replace(/-/g, '')}` : '';
    const baseFileName = customTitle.trim() || 
      `${typeMap[selectedFileType]}_${unit}_${courseCode.toUpperCase()}${dateStr}`;
    
    return uploadFiles.length > 0 ? baseFileName : `${baseFileName}${extension}`;
  };
  
  const getTargetDirectory = () => {
    const parsed = parseCourseCode(courseCode.toUpperCase());
    if (!parsed || !selectedFileType) return null;
    
    // Create submission-specific folder name (without type prefix)
    const dateStr = verificationDate && verificationDate !== 'idk' ? verificationDate.replace(/-/g, '') : new Date().toISOString().split('T')[0].replace(/-/g, '');
    const submissionFolder = customTitle.trim() || `${unit}_${courseCode.toUpperCase()}_${dateStr}_SUBMISSION`;
    
    // Structure: school/grade/class/unit_or_day/type/submissionFolder
    return `school/${parsed.grade}/${courseCode.toUpperCase()}/${unit}/${selectedFileType}/${submissionFolder}`;
  };
  
  const createAcademicFile = async () => {
    const targetDir = getTargetDirectory();
    const filename = generateFileName();
    
    if (!targetDir || !filename) {
      alert('Please fill in all required fields with valid values.');
      return;
    }
    
    if (uploadFiles.length === 0) {
      alert('Please select files to upload.');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('targetDirectory', targetDir);
      formData.append('baseFilename', filename.replace('.pdf', ''));
      formData.append('courseCode', courseCode);
      formData.append('unit', unit);
      formData.append('fileType', selectedFileType || '');
      formData.append('verificationDate', verificationDate);
      formData.append('customTitle', customTitle);
      
      uploadFiles.forEach((file) => {
        formData.append('files', file);
      });
      
      const response = await fetch('/api/upload-for-verification', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        await response.json();
        alert('Files submitted for verification! They will appear in the vault once approved.');
        setIsModalOpen(false);
        resetForm();
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('Error uploading files:', err);
      alert('Error uploading files. Please try again.');
    }
  };
  
  const processFiles = (files: File[]) => {
    setUploadError(null);
    
    // Get allowed file types based on course
    const allowedConfig = getAllowedFileTypes(courseCode);
    
    // Validate file types by extension and MIME type
    const invalidFiles = files.filter(file => {
      const hasValidExtension = allowedConfig.extensions.some(ext => file.name.toLowerCase().endsWith(ext));
      const hasValidMime = allowedConfig.mimeTypes.includes(file.type) || file.type === '';
      return !hasValidExtension && !hasValidMime;
    });
    
    if (invalidFiles.length > 0) {
      setUploadError(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}. Allowed: ${allowedConfig.description}`);
      return;
    }
    
    // Validate file sizes
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const maxSize = files.length === 1 ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB single, 50MB multiple
    
    if (totalSize > maxSize) {
      setUploadError(`Total file size exceeds ${files.length === 1 ? '10MB' : '50MB'} limit`);
      return;
    }
    
    // Check individual file size (no single file should be over 50MB)
    const oversizedFiles = files.filter(file => file.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setUploadError(`Files too large (max 50MB each): ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    setUploadFiles(files);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const removeFile = (index: number) => {
    setUploadFiles(files => files.filter((_, i) => i !== index));
  };
  
  const resetForm = () => {
    setSelectedFileType(null);
    setCourseCode('');
    setUnit('');
    setFileName('');
    setCustomTitle('');
    setVerificationDate('');
    setUploadFiles([]);
    setUploadError(null);
  };

  useEffect(() => {
    fetchData();
  }, [currentPath]);

  const fetchData = async () => {
    try {
      // Only show loading if we don't have cached data
      const hasCache = data !== null;
      if (!hasCache) {
        setLoading(true);
      }
      setError(null);
      
      const directoryData = await fetchDirectoryData(currentPath);
      
      // Check if path changed (due to redirect)
      if (directoryData.currentPath !== currentPath) {
        console.log(`Path redirected from "${currentPath}" to "${directoryData.currentPath}"`);
        // Update URL to match the redirected path
        if (directoryData.currentPath) {
          navigate(`/browse/${directoryData.currentPath}`, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
        return;
      }
      
      setData(directoryData);
      
      // Preload neighboring directories for instant navigation
      directoryData.items
        .filter(item => item.type === 'directory')
        .slice(0, 3) // Preload first 3 directories
        .forEach(item => {
          preloadDirectory(item.path);
        });
        
    } catch (err) {
      setError('Failed to load directory');
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = async (path: string) => {
    // Handle parent directory navigation
    if (path === '' || path === '.') {
      navigate(`/`);
      return;
    }
    
    // Navigate to the subdirectory
    navigate(`/browse/${path}`);
  };

  const clearAllFilesView = () => {
    setShowingAllFiles(false);
    setExpandedFolder(null);
    setAllFiles([]);
  };

  const handleFileClick = (path: string) => {
    navigate(`/view/${path}`);
  };
  
  const handleFolderHover = useCallback((path: string) => {
    // Preload directory on hover for instant navigation
    preloadDirectory(path);
  }, []);
  
  const handleImageHover = useCallback((item: DirectoryItem) => {
    // Preload images on hover for instant viewing
    if (item.extension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(item.extension.toLowerCase())) {
      const imageUrl = `/school/${item.path}`;
      preloadImage(imageUrl).catch(() => {});
    }
  }, []);

  const formatFileSize = (size: number) => {
    return size < 1024 * 1024 ? 
      `${(size / 1024).toFixed(1)} KB` : 
      `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading && !data) {
    return (
      <Loading>
        <div className="spinner" />
        <p>Loading...</p>
      </Loading>
    );
  }

  if (error || !data) {
    return (
      <EmptyState>
        <div className="icon">[ERROR]</div>
        <p>Error loading directory</p>
        <p>{error}</p>
      </EmptyState>
    );
  }

  const folders = data.items.filter(item => item.type === 'directory');
  const files = data.items.filter(item => item.type === 'file');

  // Create breadcrumb parts from currentPath
  const pathParts = currentPath ? currentPath.split('/').filter(Boolean) : [];
  const breadcrumbs = [
    { name: 'school', path: '' },
    ...pathParts.map((part, index) => ({
      name: part,
      path: pathParts.slice(0, index + 1).join('/')
    }))
  ];

  return (
    <BrowserContainer>
      <BouncingHint>click me :D</BouncingHint>
      
      {loading && data && (
        <LoadingOverlay className="visible">
          <div className="mini-spinner" />
          <span>Updating...</span>
        </LoadingOverlay>
      )}
      
      <PageHeader>
        <h1 data-text="Directory Contents">Directory Contents</h1>
      </PageHeader>

      <BreadcrumbNav>
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path}>
            {index > 0 && <span className="separator">/</span>}
            <span 
              className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'current' : ''}`}
              onClick={() => {
                if (index < breadcrumbs.length - 1) {
                  if (crumb.path === '') {
                    navigate('/');
                  } else {
                    navigate(`/browse/${crumb.path}`);
                  }
                }
              }}
            >
              {crumb.name}
            </span>
          </span>
        ))}
      </BreadcrumbNav>

      <StatsBar>
        <div>
          <Stat>
            Folders: <span className="value">{folders.length}</span>
          </Stat>
          <Stat>
            Files: <span className="value">{files.length}</span>
          </Stat>
          <Stat>access granted</Stat>
        </div>
      </StatsBar>

      <ContentGrid>
        {/* Folders Section */}
        <Section>
          <SectionHeader>
            <span>📁</span>
            <span>Directories ({folders.length})</span>
          </SectionHeader>
          <SectionBody>
            {folders.length > 0 ? (
              <ItemList>
                {folders.map((folder) => (
                  <Item key={folder.path}>
                    <div 
                      className="item-content" 
                      onClick={() => handleFolderClick(folder.path)}
                      onMouseEnter={() => handleFolderHover(folder.path)}
                    >
                      <span className="icon">📁</span>
                      <span className="name">{folder.name}</span>
                      {!folder.verified && (
                        <span style={{ 
                          fontSize: '0.7rem', 
                          color: '#ffa500', 
                          marginLeft: '0.5rem',
                          padding: '0.1rem 0.4rem',
                          background: 'rgba(255, 165, 0, 0.1)',
                          border: '1px solid #ffa500',
                          borderRadius: '3px'
                        }}>
                          UNVERIFIED
                        </span>
                      )}
                    </div>
                  </Item>
                ))}
              </ItemList>
            ) : (
              <EmptyState>
                <div className="icon">📂</div>
                <p>No directories found</p>
              </EmptyState>
            )}
          </SectionBody>
        </Section>

        {/* Files Section */}
        <Section>
          <SectionHeader>
            <span>📄</span>
            <span>
              {showingAllFiles 
                ? `All Files from ${expandedFolder} (${allFiles.length})`
                : `Files (${files.length})`
              }
            </span>
            {showingAllFiles && (
              <button 
                onClick={clearAllFilesView}
                style={{
                  marginLeft: 'auto',
                  padding: '0.25rem 0.5rem',
                  background: 'transparent',
                  border: '1px solid #666',
                  borderRadius: '4px',
                  color: '#ccc',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Clear Filter
              </button>
            )}
          </SectionHeader>
          <SectionBody>
            {(showingAllFiles ? allFiles : files).length > 0 ? (
              <ItemList>
                {(showingAllFiles ? allFiles : files).map((file) => (
                  <Item key={file.path}>
                    <div 
                      className="item-content" 
                      onClick={() => handleFileClick(file.path)}
                      onMouseEnter={() => handleImageHover(file)}
                    >
                      <span className="icon">
                        {file.extension && ['pdf'].includes(file.extension) ? '📄' : 
                         file.extension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(file.extension) ? '🖼️' : '📎'}
                      </span>
                      <span className="name">{file.name}</span>
                      {!file.verified && (
                        <span style={{ 
                          fontSize: '0.7rem', 
                          color: '#ffa500', 
                          marginLeft: '0.5rem',
                          padding: '0.1rem 0.4rem',
                          background: 'rgba(255, 165, 0, 0.1)',
                          border: '1px solid #ffa500',
                          borderRadius: '3px'
                        }}>
                          UNVERIFIED
                        </span>
                      )}
                      {showingAllFiles && (
                        <span className="path" style={{ 
                          fontSize: '0.8rem', 
                          color: '#888', 
                          marginLeft: '0.5rem',
                          fontStyle: 'italic'
                        }}>
                          {file.path.replace(file.name, '').replace(/\/$/, '') || '/'}
                        </span>
                      )}
                      {file.size && (
                        <span className="meta">{formatFileSize(file.size)}</span>
                      )}
                    </div>
                  </Item>
                ))}
              </ItemList>
            ) : (
              <EmptyState>
                <div className="icon">📄</div>
                <p>{showingAllFiles ? 'No files found in folder' : 'No files found'}</p>
              </EmptyState>
            )}
          </SectionBody>
        </Section>
      </ContentGrid>
      
      <AcademicHelper>
        <AcademicButton onClick={() => setIsModalOpen(true)}>
          Add to The Vault
        </AcademicButton>
      </AcademicHelper>
      
      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <CloseButton onClick={() => { setIsModalOpen(false); resetForm(); }}>
            ✕
          </CloseButton>
          
          <h2>Add to The Vault</h2>
          <p style={{ marginBottom: '1.5rem', color: '#888' }}>
            thank you for contributing to the vault
          </p>
          
          <FileTypeGrid>
            {[
              { type: 'test', emoji: '📝', label: 'Test' },
              { type: 'assignment', emoji: '📋', label: 'Assignment' },
              { type: 'quiz', emoji: '❓', label: 'Quiz' },
              { type: 'exam', emoji: '📊', label: 'Exam' },
              { type: 'essay', emoji: '📄', label: 'Essay' }
            ].map(item => (
              <FileTypeButton
                key={item.type}
                onClick={() => setSelectedFileType(item.type)}
                style={{
                  borderColor: selectedFileType === item.type ? '#00ff88' : undefined,
                  background: selectedFileType === item.type ? 'rgba(0, 255, 136, 0.1)' : undefined
                }}
              >
                <div className="emoji">{item.emoji}</div>
                <div className="label">{item.label}</div>
              </FileTypeButton>
            ))}
          </FileTypeGrid>
          
          <FormSection>
            <label>Course Code (e.g., MHF4U1)</label>
            <input 
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              placeholder="Enter course code"
              maxLength={6}
            />
            {courseCode && parseCourseCode(courseCode) && (
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                {getSubjectName(parseCourseCode(courseCode)!.subject)} - Grade {parseCourseCode(courseCode)!.grade} - 
                {parseCourseCode(courseCode)!.destination === 'U' ? 'University Prep' : 
                 parseCourseCode(courseCode)!.destination === 'M' ? 'Mixed Prep' :
                 parseCourseCode(courseCode)!.destination === 'C' ? 'College Prep' : 'Workplace Prep'}
              </div>
            )}
          </FormSection>
          
          <FormSection>
            <label>{usesUnits(courseCode) ? 'Unit' : 'Day'}</label>
            {usesUnits(courseCode) ? (
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="">Select unit</option>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <option key={num} value={`U${num}`}>
                    U{num}
                  </option>
                ))}
              </select>
            ) : (
              <input 
                type="number"
                value={unit.replace('D', '')}
                onChange={(e) => setUnit(e.target.value ? `D${e.target.value}` : '')}
                placeholder="Enter day number"
                min="1"
                max="100"
              />
            )}
          </FormSection>
          
          <FormSection>
            <label>Custom Title (Optional)</label>
            <input 
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Leave blank for auto-generated name"
            />
          </FormSection>
          
          <FormSection>
            <label>Verification Date</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input 
                type="date"
                value={verificationDate === 'idk' ? '' : verificationDate}
                onChange={(e) => setVerificationDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => setVerificationDate(new Date().toISOString().split('T')[0])}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid #00ff88',
                  borderRadius: '4px',
                  color: '#00ff88',
                  cursor: 'pointer',
                  fontFamily: "'Inconsolata', 'JetBrains Mono', monospace",
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setVerificationDate('idk')}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(136, 136, 136, 0.1)',
                  border: '1px solid #888',
                  borderRadius: '4px',
                  color: '#888',
                  cursor: 'pointer',
                  fontFamily: "'Inconsolata', 'JetBrains Mono', monospace",
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap'
                }}
              >
                IDK
              </button>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
              When was this content verified/created? Helps others know if material is current.
            </div>
          </FormSection>
          
          <FormSection>
            <label>Upload Files</label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '2rem',
                background: isDragging ? 'rgba(0, 255, 136, 0.05)' : 'rgba(32, 19, 56, 1)',
                border: isDragging ? '2px dashed #00ff88' : '2px dashed #666',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: "'Inconsolata', 'JetBrains Mono', monospace"
              }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input 
                id="file-input"
                type="file"
                multiple
                accept={getAllowedFileTypes(courseCode).extensions.join(',')}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <div style={{ textAlign: 'center', color: isDragging ? '#00ff88' : '#aaa' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
                <div style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                  {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>or click to browse</div>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
              Max 10MB for single file, 50MB for multiple files. {getAllowedFileTypes(courseCode).description}.
            </div>
            {uploadFiles.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Selected Files:</strong>
                {uploadFiles.map((file, index) => (
                  <div key={index} style={{ 
                    fontSize: '0.8rem', 
                    color: '#aaa', 
                    marginTop: '0.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    <button 
                      onClick={() => removeFile(index)}
                      style={{
                        background: 'none',
                        border: '1px solid #666',
                        borderRadius: '3px',
                        color: '#999',
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.4rem',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                  Total: {(uploadFiles.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
            )}
          </FormSection>
          
          {selectedFileType && courseCode && unit && (
            <div style={{ 
              background: 'rgba(0, 255, 136, 0.1)', 
              padding: '1rem', 
              borderRadius: '4px', 
              marginBottom: '1.5rem',
              border: '1px solid rgba(0, 255, 136, 0.3)'
            }}>
              <strong>Target Path:</strong> {getTargetDirectory()}/{generateFileName()}
              <PathExplanationTrigger 
                onClick={() => setShowPathExplanation(true)}
              >
                does this look right to you?
              </PathExplanationTrigger>
            </div>
          )}
          
          {uploadError && (
            <div style={{ 
              background: 'rgba(255, 0, 0, 0.1)', 
              padding: '1rem', 
              borderRadius: '4px', 
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              color: '#ff6b6b'
            }}>
              <strong>Error:</strong> {uploadError}
            </div>
          )}
          
          <div>
            <ActionButton 
              onClick={createAcademicFile}
              disabled={!selectedFileType || !courseCode || !unit || uploadFiles.length === 0}
            >
              Submit for Verification
            </ActionButton>
            <SecondaryButton onClick={() => { setIsModalOpen(false); resetForm(); }}>
              cancel
            </SecondaryButton>
          </div>
        </ModalContent>
      </Modal>
      
      <PopupOverlay 
        isVisible={showPathExplanation}
        onClick={() => setShowPathExplanation(false)}
      />
      
      <PathExplanationPopup isVisible={showPathExplanation}>
        <button 
          className="close-btn"
          onClick={() => setShowPathExplanation(false)}
        >
          ✕
        </button>
        
        <h3>Understanding Your File Path</h3>
        
        {selectedFileType && courseCode && unit && (
          <div className="path-breakdown">
            <div className="path-part">
              <span className="highlight">school/</span> - Base directory for all academic files
            </div>
            <div className="path-part">
              <span className="highlight">{parseCourseCode(courseCode)?.grade || 'X'}/</span> - Grade level from your course code
            </div>
            <div className="path-part">
              <span className="highlight">{courseCode.toUpperCase()}/</span> - Class code (full course identifier)
            </div>
            <div className="path-part">
              <span className="highlight">{unit}/</span> - Unit folder (U1, U2, etc.)
            </div>
            <div className="path-part">
              <span className="highlight">{selectedFileType}/</span> - Content type (test, answers, assignment, etc.)
            </div>
            <div className="path-part">
              <span className="highlight">
                {customTitle.trim() || `${selectedFileType}_${unit}_${courseCode.toUpperCase()}_${verificationDate ? verificationDate.replace(/-/g, '') : new Date().toISOString().split('T')[0].replace(/-/g, '')}`}/
              </span> - Submission folder (prevents overlaps)
            </div>
            <div className="path-part">
              <span className="highlight">{generateFileName()}</span> - Your file name
              {verificationDate && (
                <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: '#888' }}>
                  Verified: {new Date(verificationDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="notes">
          <div className="note">
            <strong>📁 Organization:</strong> Files are organized by grade → class code → unit → content type → submission folder for precise navigation.
          </div>
          <div className="note">
            <strong>📂 Submission Folders:</strong> Each submission gets its own folder to prevent overlaps. Multiple image files stay together.
          </div>
          <div className="note">
            <strong>🔤 Naming:</strong> Files follow the pattern: Type_Unit_CourseCode_Date.pdf (e.g., Test_U1_MHF4U1_20260205.pdf)
          </div>
          <div className="note">
            <strong>🎯 Custom Titles:</strong> Use the custom title field to override the auto-generated folder name while keeping the same structure.
          </div>
          <div className="note">
            <strong>🔍 Finding Files:</strong> Use the folder expansion feature to see all files from a unit at once.
          </div>
          <div className="note">
            <strong>📅 Verification Dates:</strong> Include when content was verified to help others assess accuracy and currency.
          </div>
          <div className="note">
            <strong>📷 Multiple Images:</strong> Tests split into multiple images are kept together in the same submission folder.
          </div>
        </div>
        
        <div className="ps">
          P.S. Support for grades 9, 10, 11, and post-secondary courses coming soon!
        </div>
      </PathExplanationPopup>
    </BrowserContainer>
  );
};

export default FileBrowser;