import axios from '../../lib/axios'
import {
  AuthUser,
  LoginInput,
  LoginResponse,
  RegisterInput,
} from './auth.types'

export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await axios.post<LoginResponse>('/auth/login', input)
  return res.data
}

export async function register(input: RegisterInput): Promise<AuthUser> {
  const res = await axios.post<AuthUser>('/auth/register', input)
  return res.data
}

export async function logout(): Promise<void> {
  await axios.post('/auth/logout')
}

export async function getMe(): Promise<AuthUser> {
  const res = await axios.get<AuthUser>('/auth/me')
  return res.data
}
