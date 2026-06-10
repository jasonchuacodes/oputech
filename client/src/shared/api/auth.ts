import apiClient from './client'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
  role: string
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>('/auth/login', input)
  return res.data
}

export async function register(input: RegisterInput): Promise<AuthUser> {
  const res = await apiClient.post<AuthUser>('/auth/register', input)
  return res.data
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function getMe(): Promise<AuthUser> {
  const res = await apiClient.get<AuthUser>('/auth/me')
  return res.data
}
