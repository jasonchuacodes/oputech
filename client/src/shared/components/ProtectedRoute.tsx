import { Navigate, Outlet } from 'react-router-dom'
import { UserRole } from '../types'
import { PublicRoutes } from '../routes'
import { useMe } from '../hooks/useMe'

interface ProtectedRouteProps {
  allowedRoles: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { data, isLoading, isError } = useMe()

  if (isLoading) return null
  if (isError || !data) return <Navigate to={PublicRoutes.Login} replace />
  if (!allowedRoles.includes(data.role as UserRole)) return <Navigate to={PublicRoutes.Login} replace />

  return <Outlet />
}
