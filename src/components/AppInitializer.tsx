import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../features/auth/authSlice';
import { validateStoredToken } from '../utils/tokenUtils';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer = ({ children }: AppInitializerProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if stored token is expired on app startup
    if (!validateStoredToken()) {
      console.log('Token expired or invalid, logging out...');
      dispatch(clearCredentials());
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AppInitializer;