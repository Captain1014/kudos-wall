import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuth } from '../hooks/useAuth';

// Styled Components
const RegisterContainer = styled.div`
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 30px;
  font-size: 1.8rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: ${props => props.theme.colors.primary}dd;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginLink = styled(Link)`
  text-align: center;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  margin-top: 20px;
  display: block;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  background-color: #fff2f2;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;

const PasswordRequirements = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
`;

// Firebase error codes
const FIREBASE_ERROR_CODES = {
  EMAIL_IN_USE: 'auth/email-already-in-use',
  OPERATION_NOT_ALLOWED: 'auth/operation-not-allowed',
  WEAK_PASSWORD: 'auth/weak-password',
  INVALID_EMAIL: 'auth/invalid-email',
};

// Error messages mapping
const ERROR_MESSAGES = {
  [FIREBASE_ERROR_CODES.EMAIL_IN_USE]: 'Email is already in use. Please use a different email or login.',
  [FIREBASE_ERROR_CODES.OPERATION_NOT_ALLOWED]: 'Email/Password sign up is not enabled. Please contact the administrator.',
  [FIREBASE_ERROR_CODES.WEAK_PASSWORD]: 'Password is too weak. Please use at least 6 characters.',
  [FIREBASE_ERROR_CODES.INVALID_EMAIL]: 'Invalid email address. Please enter a valid email.',
  DEFAULT: 'Registration failed. Please try again.',
};

const Register = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const getErrorMessage = (error: Error): string => {
    const errorCode = Object.values(FIREBASE_ERROR_CODES).find(code => 
      error.message.includes(code)
    );
    return errorCode ? ERROR_MESSAGES[errorCode] : ERROR_MESSAGES.DEFAULT;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { email, password, displayName } = formData;
      await signUp(email, password, displayName);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(getErrorMessage(error));
      } else {
        setError(ERROR_MESSAGES.DEFAULT);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    const { email, password, displayName } = formData;
    return email && password && displayName && password.length >= 6;
  };

  return (
    <RegisterContainer>
      <Title>Create Account</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="displayName">Name</Label>
          <Input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="Enter your name"
            disabled={isLoading}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            minLength={6}
            placeholder="Enter password"
            disabled={isLoading}
          />
          <PasswordRequirements>
            Password must be at least 6 characters long
          </PasswordRequirements>
        </FormGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button 
          type="submit" 
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </Button>
      </Form>
      <LoginLink to="/login">
        Already have an account? Login
      </LoginLink>
    </RegisterContainer>
  );
};

export default Register; 