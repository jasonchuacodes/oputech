import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  username: string;
  email?: string;
  password: string;
  role?: UserRole;
}
