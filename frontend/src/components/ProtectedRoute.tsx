import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const isAuth = !!(isConnected && token);
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      navigate('/connect');
    }
  }, [isConnected, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;