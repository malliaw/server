import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Smooth page transitions */
  .main {
    transition: opacity 0.15s ease-in-out;
  }
  
  /* Optimize animations for performance */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* Enable hardware acceleration for smooth animations */
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  body {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text.primary};
    font-family: ${props => props.theme.fonts.sans};
    height: 100vh;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
    width: 100vw;
    margin: 0;
    padding: 0;
    /* Remove problematic font smoothing properties */
  }

  /* Animated background */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 0, 102, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(0, 170, 255, 0.03) 0%, transparent 50%);
    z-index: -1;
    animation: backgroundShift 20s ease-in-out infinite alternate;
  }

  @keyframes backgroundShift {
    0% { transform: translateX(-10px) translateY(-10px); }
    100% { transform: translateX(10px) translateY(10px); }
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.primary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.accent.primary};
  }
  
  ::-webkit-scrollbar-corner {
    background: ${props => props.theme.colors.primary};
  }

  .app {
    height: 100vh;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    width: 100vw;
    margin: 0;
    padding: 0;
  }

  .main {
    flex: 1;
    padding: 2rem 3rem;
    width: 100%;
    max-width: none;
    margin: 0;
    box-sizing: border-box;
    overflow-y: auto;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .main {
      padding: 1rem 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .main {
      padding: 0.75rem 1rem;
    }
  }

  /* Loading animations */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  @keyframes glitchAnim {
    0% { clip: rect(42px, 9999px, 44px, 0); }
    20% { clip: rect(24px, 9999px, 56px, 0); }
    40% { clip: rect(78px, 9999px, 23px, 0); }
    60% { clip: rect(12px, 9999px, 98px, 0); }
    80% { clip: rect(65px, 9999px, 43px, 0); }
    100% { clip: rect(33px, 9999px, 67px, 0); }
  }

  @keyframes glitchAnim2 {
    0% { clip: rect(65px, 9999px, 12px, 0); }
    20% { clip: rect(43px, 9999px, 78px, 0); }
    40% { clip: rect(23px, 9999px, 33px, 0); }
    60% { clip: rect(98px, 9999px, 56px, 0); }
    80% { clip: rect(67px, 9999px, 24px, 0); }
    100% { clip: rect(44px, 9999px, 42px, 0); }
  }

  /* Responsive design */
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    .main {
      padding: 1rem;
    }
  }
  
  /* App layout styles */
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .main {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  
  @media (max-width: 768px) {
    .main {
      padding: 1rem;
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export default GlobalStyles;