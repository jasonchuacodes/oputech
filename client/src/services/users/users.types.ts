export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
}

export interface User {
  id: string
  username: string
  email?: string
  role: string
}

export interface CreateUserInput {
  username: string
  email?: string
  password: string
  role?: string
}
