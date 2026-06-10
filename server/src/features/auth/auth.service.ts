import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService
  ) {}

  async login(input: LoginDto, res: Response) {
    const user = await this.users.findByUsername(input.username)
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const match = await bcrypt.compare(input.password, user.password)
    if (!match) throw new UnauthorizedException('Invalid credentials')

    const accessToken = this.jwt.sign({ sub: user._id, role: user.role })

    const refreshToken = this.jwt.sign(
      { sub: user._id },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as any,
      }
    )

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return {
      user: {
        id: user._id,
        ...user,
      },
    }
  }

  async refresh(req: Request, res: Response) {
    const token = req.cookies?.refresh_token
    if (!token) throw new UnauthorizedException('No refresh token')

    let payload: { sub: string }
    try {
      payload = this.jwt.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      })
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    const user = await this.users.findById(payload.sub)
    if (!user) throw new UnauthorizedException('User not found')

    const accessToken = this.jwt.sign({ sub: user._id, role: user.role })

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })
  }

  async me(payload: { userId: string }) {
    return this.users.findById(payload.userId)
  }

  logout(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
  }

  async register(input: RegisterDto) {
    const existing = await this.users.findByUsername(input.username)
    if (existing) throw new ConflictException('Username already in use')

    const password = await bcrypt.hash(input.password, 10)
    const user = await this.users.create({ ...input, password })

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    }
  }
}
