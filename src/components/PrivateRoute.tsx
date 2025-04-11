import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();

  console.log('PrivateRoute - Auth state:', { user, loading });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" />;
  }

  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};

export default PrivateRoute; 