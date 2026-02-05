import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.secondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
`;

const HeaderContent = styled.div`
  width: 100%;
  padding: 0 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 0.5rem;
  }
`;

const Logo = styled.div`
  font-family: ${props => props.theme.fonts.mono};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.accent.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all ${props => props.theme.animations.normal};
  cursor: pointer;
  
  &:hover {
    text-shadow: 0 0 10px ${props => props.theme.colors.accent.primary};
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    gap: 0.35rem;
  }
`;

const LogoImage = styled.img`
  width: 2rem;
  height: 2rem;
  object-fit: contain;
  
  @media (max-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const NavLink = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text.muted};
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  position: relative;
  transition: all 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: ${props => props.theme.colors.accent.primary};
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.theme.colors.accent.primary};
    
    &::after {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.2rem 0.3rem;
  }
`;

const Header = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo onClick={handleHomeClick}>
          <LogoImage src="/static/logo.png" alt="Malliaw's Vault Logo" />
          Malliaw's Vault
        </Logo>
        <NavBar>
          <NavLink onClick={() => navigate('/status')}>status</NavLink>
          <NavLink onClick={() => window.open('/api/directory?path=', '_blank')}>api</NavLink>
          <NavLink onClick={() => navigate('/docs')}>docs</NavLink>
        </NavBar>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;