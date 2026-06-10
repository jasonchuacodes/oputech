import { Navigate, Outlet } from 'react-router-dom'
import { UserRole } from '../types'
import { PublicRoutes } from '../routes'
import { useAuthContext } from '../context/auth/useAuthContext'

interface ProtectedRouteProps {
  allowedRoles: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { auth, loading } = useAuthContext()

  if (loading) return null

  if (!auth) return <Navigate to={PublicRoutes.Login} replace />

  if (!allowedRoles.includes(auth.role as UserRole))
    return <Navigate to={PublicRoutes.Login} replace />

  return <Outlet />
}
