import { Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '../types';
import { PublicRoutes } from '../routes';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ allowedRoles: _allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to={PublicRoutes.Login} replace />;
  }

  return <Outlet />;
}
