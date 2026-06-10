import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import { App } from '../App'
import { ProtectedRoute } from '../components/ProtectedRoute'
import LoginPage from '../features/auth/LoginPage'
import AdminLoginPage from '../features/auth/AdminLoginPage'
import RegisterPage from '../features/auth/RegisterPage'
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage'
import { UserMainLayout } from '../features/user/UserMainLayout'
import UserHomePage from '../features/user/UserHomePage'
import UsersPage from '../features/user/UsersPage'
import { UserRole } from '../types'

export const PublicRoutes = {
  Login: '/login',
  LoginAdmin: '/admin/login',
  Register: '/register',
  ForgotPassword: '/forgot-password',
}

export const UserRoutes = {
  Home: '/',
  Users: '/users',
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      {/* Public Routes */}
      <Route path={PublicRoutes.Login} element={<LoginPage />} />
      <Route path={PublicRoutes.LoginAdmin} element={<AdminLoginPage />} />
      <Route path={PublicRoutes.Register} element={<RegisterPage />} />
      <Route
        path={PublicRoutes.ForgotPassword}
        element={<ForgotPasswordPage />}
      />

      {/* User Routes */}
      <Route
        path="/"
        element={<ProtectedRoute allowedRoles={[UserRole.USER]} />}
      >
        <Route element={<UserMainLayout />}>
          <Route index element={<UserHomePage />} />
          <Route path={UserRoutes.Users} element={<UsersPage />} />
        </Route>
      </Route>
    </Route>
  )
)
