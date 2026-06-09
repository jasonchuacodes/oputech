import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async login(input: LoginDto, res: Response) {
    const user = await this.users.findByEmail(input.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(input.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwt.sign({ sub: user._id, role: user.role });

    const refreshToken = this.jwt.sign(
      { sub: user._id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as any,
      },
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

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
