import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../store';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const user = useStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};