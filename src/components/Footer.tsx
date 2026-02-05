import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.secondary};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 1rem 2rem;
  margin-top: 4rem;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    margin-top: 2rem;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  color: ${props => props.theme.colors.text.muted};
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
  
  p {
    margin: 0.25rem 0;
    
    @media (max-width: 768px) {
      margin: 0.15rem 0;
    }
  }
`;

const Love = styled.span`
  color: ${props => props.theme.colors.accent.secondary};
  animation: pulse 2s ease-in-out infinite;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>
          unauthorized access to educational materials • made with <Love>love</Love> by yours truly, malliaw • 2026
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: '0.7' }} className="disclaimer">
          tests for your class may not be accurate to the ones your teacher gives you, check verification date
        </p>
        <style>{`
          @media (max-width: 768px) {
            .disclaimer {
              font-size: 0.65rem !important;
              margin-top: 0.25rem !important;
            }
          }
        `}</style>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;