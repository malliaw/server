import { useState } from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const LoginForm = styled.div`
  background: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 400px;
  margin: 4rem auto;
  
  h2 {
    color: ${props => props.theme.colors.accent.primary};
    font-family: ${props => props.theme.fonts.mono};
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    background: ${props => props.theme.colors.primary};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    color: ${props => props.theme.colors.text.primary};
    font-family: ${props => props.theme.fonts.mono};
    margin-bottom: 1rem;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.accent.primary};
    }
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    background: ${props => props.theme.colors.accent.primary};
    border: 1px solid ${props => props.theme.colors.accent.primary};
    border-radius: 4px;
    color: ${props => props.theme.colors.primary};
    font-family: ${props => props.theme.fonts.mono};
    cursor: pointer;
    
    &:hover {
      background: transparent;
      color: ${props => props.theme.colors.accent.primary};
    }
  }
`;

const PendingSubmission = styled.div`
  background: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SubmissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    color: ${props => props.theme.colors.accent.primary};
    font-family: ${props => props.theme.fonts.mono};
    margin: 0;
  }
  
  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-family: ${props => props.theme.fonts.mono};
    background: rgba(255, 165, 0, 0.2);
    border: 1px solid #ffa500;
    color: #ffa500;
  }
`;

const SubmissionDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  .detail {
    font-family: ${props => props.theme.fonts.mono};
    font-size: 0.9rem;
    
    .label {
      color: ${props => props.theme.colors.text.secondary};
      margin-bottom: 0.25rem;
    }
    
    .value {
      color: ${props => props.theme.colors.text.primary};
      font-weight: 600;
    }
  }
`;

const FileList = styled.div`
  margin: 1rem 0;
  
  .file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    margin: 0.25rem 0;
    background: ${props => props.theme.colors.tertiary};
    border-radius: 4px;
    font-family: ${props => props.theme.fonts.mono};
    font-size: 0.9rem;
    
    .file-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .file-name {
      color: ${props => props.theme.colors.text.primary};
    }
    
    .file-size {
      color: ${props => props.theme.colors.text.muted};
      font-size: 0.8rem;
    }
    
    .file-actions {
      display: flex;
      gap: 0.5rem;
      
      button {
        padding: 0.25rem 0.5rem;
        background: transparent;
        border: 1px solid ${props => props.theme.colors.border};
        border-radius: 3px;
        color: ${props => props.theme.colors.text.secondary};
        font-size: 0.8rem;
        cursor: pointer;
        
        &:hover {
          border-color: ${props => props.theme.colors.accent.primary};
          color: ${props => props.theme.colors.accent.primary};
        }
        
        &.preview {
          border-color: #4a9eff;
          color: #4a9eff;
          
          &:hover {
            background: rgba(74, 158, 255, 0.1);
          }
        }
        
        &.view-code {
          border-color: #00ff88;
          color: #00ff88;
          
          &:hover {
            background: rgba(0, 255, 136, 0.1);
          }
        }
      }
    }
  }
`;

const EditableField = styled.div`
  margin: 0.5rem 0;
  
  label {
    display: block;
    margin-bottom: 0.25rem;
    color: ${props => props.theme.colors.text.secondary};
    font-family: ${props => props.theme.fonts.mono};
    font-size: 0.8rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    background: ${props => props.theme.colors.primary};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    color: ${props => props.theme.colors.text.primary};
    font-family: ${props => props.theme.fonts.mono};
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.accent.primary};
    }
  }
`;

const CodePreviewContainer = styled.div`
  margin: 1rem 0;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e1e;
  
  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: ${props => props.theme.colors.secondary};
    border-bottom: 1px solid ${props => props.theme.colors.border};
    
    .file-name {
      color: ${props => props.theme.colors.accent.primary};
      font-family: ${props => props.theme.fonts.mono};
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    button {
      padding: 0.25rem 0.75rem;
      background: transparent;
      border: 1px solid ${props => props.theme.colors.border};
      border-radius: 4px;
      color: ${props => props.theme.colors.text.secondary};
      font-family: ${props => props.theme.fonts.mono};
      font-size: 0.75rem;
      cursor: pointer;
      
      &:hover {
        border-color: #ff4444;
        color: #ff4444;
      }
    }
  }
  
  .code-content {
    max-height: 400px;
    overflow: auto;
    
    /* Custom scrollbar */
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #1e1e1e;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #555;
      border-radius: 4px;
      
      &:hover {
        background: #666;
      }
    }
    
    pre {
      margin: 0 !important;
      padding: 1rem !important;
      background: #1e1e1e !important;
      font-size: 0.85rem !important;
      line-height: 1.5 !important;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  button {
    padding: 0.75rem 1.5rem;
    border: 1px solid;
    border-radius: 4px;
    font-family: ${props => props.theme.fonts.mono};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &.approve {
      background: #28a745;
      border-color: #28a745;
      color: white;
      
      &:hover {
        background: transparent;
        color: #28a745;
      }
    }
    
    &.reject {
      background: #dc3545;
      border-color: #dc3545;
      color: white;
      
      &:hover {
        background: transparent;
        color: #dc3545;
      }
    }
    
    &.edit {
      background: transparent;
      border-color: ${props => props.theme.colors.border};
      color: ${props => props.theme.colors.text.secondary};
      
      &:hover {
        border-color: ${props => props.theme.colors.accent.primary};
        color: ${props => props.theme.colors.accent.primary};
      }
    }
  }
`;

interface PendingFile {
  id: string;
  originalName: string;
  editedName: string;
  size: number;
  type: string;
  url: string;
}

interface PendingSubmission {
  id: string;
  targetDirectory: string;
  baseFilename: string;
  courseCode: string;
  unit: string;
  fileType: string;
  verificationDate: string;
  customTitle: string;
  files: PendingFile[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState<PendingSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [codePreview, setCodePreview] = useState<{ [key: string]: string }>({});
  
  // Random hints for login
  const hints = [
    "hint: it's a type of bird",
    "hint: something I allegedly owned once",
    "hint: rhymes with 'okay'",
    "hint: not as good as michael jordan",
    "hint: plays basketball... sometimes",
    "hint: starts with 'lebron'",
    "hint: 4 NBA championships (so far)",
    "hint: the king 👑",
    "hint: #23 or #6",
    "hint: space jam 2 (sorry)",
    "hint: bald",
    "hint: i miss you",
    "hint: remember that time we shared a pizza? yeah, me neither",
    "hint: you look nice today",
    "hint: my therapist said i should tell you",
    "hint: it's pronounced 'luh-BRAWN'",
    "hint: he's behind you",
    "hint: not a pokemon but could be",
    "hint: probably taller than you",
    "hint: the password is... wait no i can't tell you",
    "hint: starts with L ends with Y and has REDACTED in the middle",
    "hint: i believe in you",
    "hint: what if the password was the friends we made along the way",
    "hint: okay fine it's a basketball player",
    "hint: *whispers* check the .env file",
    "hint: i'm watching you type",
    "hint: three more tries and the vault explodes (jk... unless?)",
    "hint: fun fact: this hint changes every refresh",
    "hint: you're doing great sweetie",
    "hint: imagine a world where lebron was a chef",
    "hint: the password yearns for you",
    "hint: it's me, the password, i'm here for you",
    "hint: lebron called, he wants his password back",
    "hint: roses are red, violets are blue, the password is lebron, james is kinda okay too",
    "hint: what would scooby doo?",
    "hint: *sweats nervously*",
    "hint: the password has commitment issues",
    "hint: it's literally just his name with 'iskindaokay' at the end bestie",
    "hint: shhh the password is sleeping",
    "hint: password-chan is waiting for you uwu"
  ];
  const [currentHint] = useState(() => hints[Math.floor(Math.random() * hints.length)]);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        fetchSubmissions();
      } else {
        alert('Invalid password');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed');
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/submissions');
      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFileName = (submissionId: string, fileIndex: number, newName: string) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? {
              ...sub,
              files: sub.files.map((file, index) =>
                index === fileIndex ? { ...file, editedName: newName } : file
              )
            }
          : sub
      )
    );
  };

  const approveSubmission = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: submissions.find(s => s.id === submissionId)?.files || []
        })
      });
      
      if (response.ok) {
        fetchSubmissions();
        alert('Submission approved and files moved to vault!');
      }
    } catch (err) {
      console.error('Approval failed:', err);
      alert('Failed to approve submission');
    }
  };

  const rejectSubmission = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}/reject`, {
        method: 'POST'
      });
      
      if (response.ok) {
        fetchSubmissions();
        alert('Submission rejected');
      }
    } catch (err) {
      console.error('Rejection failed:', err);
      alert('Failed to reject submission');
    }
  };

  const loadCodePreview = async (fileUrl: string, fileKey: string) => {
    if (codePreview[fileKey]) {
      // If already loaded, toggle it off
      const newPreview = { ...codePreview };
      delete newPreview[fileKey];
      setCodePreview(newPreview);
      return;
    }
    
    try {
      const response = await fetch(fileUrl);
      const text = await response.text();
      setCodePreview(prev => ({ ...prev, [fileKey]: text }));
    } catch (err) {
      console.error('Failed to load code:', err);
      alert('Failed to load code preview');
    }
  };

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
    };
    return langMap[ext || ''] || 'text';
  };

  const isCodeFile = (filename: string): boolean => {
    const codeExtensions = ['py', 'js', 'ts', 'jsx', 'tsx', 'java', 'cpp', 'c', 'cs', 'html', 'css', 'json', 'sql', 'sh'];
    const ext = filename.split('.').pop()?.toLowerCase();
    return codeExtensions.includes(ext || '');
  };

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm>
          <h2>employees only</h2>
          <input
            type="password"
            placeholder="enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'enter' && handleLogin()}
          />
          <button onClick={handleLogin}>Login</button>
        </LoginForm>
        <div style={{
          textAlign: 'center',
          marginTop: '-2rem',
          color: '#666',
          fontSize: '0.85rem',
          fontFamily: 'monospace',
          fontStyle: 'italic'
        }}>
          {currentHint}
        </div>
      </>
    );
  }

  return (
    <AdminContainer>
      <h1 style={{ 
        color: '#00ff88', 
        fontFamily: 'monospace', 
        textAlign: 'center',
        marginBottom: '2rem' 
      }}>
        Vault Verification System
      </h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading submissions...</div>
      ) : (
        <>
          {submissions.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem', 
              color: '#888' 
            }}>
              No pending submissions
            </div>
          ) : (
            submissions.map((submission) => (
              <PendingSubmission key={submission.id}>
                <SubmissionHeader>
                  <h3>{submission.fileType} - {submission.courseCode} {submission.unit}</h3>
                  <div className="status">{submission.status}</div>
                </SubmissionHeader>
                
                <SubmissionDetails>
                  <div className="detail">
                    <div className="label">Target Directory</div>
                    <div className="value">{submission.targetDirectory}</div>
                  </div>
                  <div className="detail">
                    <div className="label">Base Filename</div>
                    <div className="value">{submission.baseFilename}</div>
                  </div>
                  <div className="detail">
                    <div className="label">Verification Date</div>
                    <div className="value">{submission.verificationDate || 'Not provided'}</div>
                  </div>
                  <div className="detail">
                    <div className="label">Submitted At</div>
                    <div className="value">{new Date(submission.submittedAt).toLocaleString()}</div>
                  </div>
                </SubmissionDetails>
                
                <FileList>
                  <strong>Files ({submission.files.length}):</strong>
                  {submission.files.map((file, index) => (
                    <div key={index} className="file-item">
                      <div className="file-info">
                        <div className="file-name">
                          {editMode === `${submission.id}-${index}` ? (
                            <EditableField>
                              <input
                                value={file.editedName}
                                onChange={(e) => updateFileName(submission.id, index, e.target.value)}
                                onBlur={() => setEditMode(null)}
                                onKeyPress={(e) => e.key === 'Enter' && setEditMode(null)}
                                autoFocus
                              />
                            </EditableField>
                          ) : (
                            <span onClick={() => setEditMode(`${submission.id}-${index}`)}>
                              {file.editedName || file.originalName}
                            </span>
                          )}
                        </div>
                        <div className="file-size">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                      <div className="file-actions">
                        {isCodeFile(file.originalName) && (
                          <button 
                            className="view-code"
                            onClick={() => loadCodePreview(file.url, `${submission.id}-${index}`)}
                          >
                            {codePreview[`${submission.id}-${index}`] ? 'Hide Code' : 'View Code'}
                          </button>
                        )}
                        <button 
                          className="preview"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          Preview
                        </button>
                        <button onClick={() => setEditMode(`${submission.id}-${index}`)}>
                          Rename
                        </button>
                      </div>
                    </div>
                  ))}
                  {submission.files.map((file, index) => {
                    const fileKey = `${submission.id}-${index}`;
                    const code = codePreview[fileKey];
                    if (!code) return null;
                    
                    return (
                      <CodePreviewContainer key={`preview-${fileKey}`}>
                        <div className="code-header">
                          <div className="file-name">{file.editedName || file.originalName}</div>
                          <button onClick={() => loadCodePreview(file.url, fileKey)}>
                            Close
                          </button>
                        </div>
                        <div className="code-content">
                          <SyntaxHighlighter
                            language={getLanguageFromFilename(file.originalName)}
                            style={vscDarkPlus}
                            showLineNumbers
                            wrapLines
                          >
                            {code}
                          </SyntaxHighlighter>
                        </div>
                      </CodePreviewContainer>
                    );
                  })}
                </FileList>
                
                <ActionButtons>
                  <button 
                    className="approve"
                    onClick={() => approveSubmission(submission.id)}
                  >
                    Approve & Add to Vault
                  </button>
                  <button 
                    className="reject"
                    onClick={() => rejectSubmission(submission.id)}
                  >
                    Reject
                  </button>
                </ActionButtons>
              </PendingSubmission>
            ))
          )}
        </>
      )}
    </AdminContainer>
  );
};

export default AdminPanel;