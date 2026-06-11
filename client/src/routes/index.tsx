import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom'
import { App } from '../App'
import { ProtectedRoute } from '../components/ProtectedRoute'
import Login from '../features/auth/Login'
import AdminLogin from '../features/auth/AdminLogin'
import Register from '../features/auth/Register'
import ForgotPassword from '../features/auth/ForgotPassword'
import { UserMainLayout } from '../features/user/MainLayout'
import UserHome from '../features/dashboard'
import Users from '../features/user'
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
      <Route path={PublicRoutes.Login} element={<Login />} />
      <Route path={PublicRoutes.LoginAdmin} element={<AdminLogin />} />
      <Route path={PublicRoutes.Register} element={<Register />} />
      <Route path={PublicRoutes.ForgotPassword} element={<ForgotPassword />} />

      {/* User Routes */}
      <Route
        path="/"
        element={<ProtectedRoute allowedRoles={[UserRole.USER]} />}
      >
        <Route element={<UserMainLayout />}>
          <Route index element={<UserHome />} />
          <Route path={UserRoutes.Users} element={<Users />} />
        </Route>
      </Route>
    </Route>
  )
)
