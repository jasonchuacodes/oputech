import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService) {}

  async register(input: RegisterDto) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) throw new ConflictException('Email already in use');

    const password = await bcrypt.hash(input.password, 10);
    const user = await this.users.create({ ...input, password });

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}
