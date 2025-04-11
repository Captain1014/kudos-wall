import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Hero = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled(Link)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const Home = () => {
  const { user } = useAuth();

  return (
    <HomeContainer>
      <Hero>
        <Title>Welcome to Kudos Wall</Title>
        <Subtitle>
          A space to grow together and encourage each other as a team.
        </Subtitle>
        <ButtonGroup>
          {user ? (
            <Button to="/dashboard">Go to Dashboard</Button>
          ) : (
            <>
              <Button to="/login">Login</Button>
              <Button to="/register">Register</Button>
            </>
          )}
        </ButtonGroup>
      </Hero>
    </HomeContainer>
  );
};

export default Home; 