import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.primary};
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: ${props => props.theme.colors.text};
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary}dd;
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Description>Page Not Found</Description>
      <HomeLink to="/">Home</HomeLink>
    </NotFoundContainer>
  );
};

export default NotFound; 