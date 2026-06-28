export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
}

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export interface ActivityStatus {
  status: UserStatus
  message?: string
}

export interface User {
  id: string
  username: string
  email?: string
  role: string
  activityStatus: ActivityStatus
}

export interface UpdateActivityStatusInput {
  status: UserStatus
  message?: string
}

export interface CreateUserInput {
  username: string
  email?: string
  password: string
  role?: string
}
