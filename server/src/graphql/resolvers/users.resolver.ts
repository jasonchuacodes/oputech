import {
  Query,
  Mutation,
  ResolveField,
  Resolver,
  Parent,
  Args,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../../features/users/users.service'
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard'
import {
  UserDocument,
  UserRole,
  UserStatus,
} from '../../features/users/schemas/user.schema'

interface CreateUserInput {
  username: string
  email?: string
  password: string
  role?: string
}

interface ActivityStatusInput {
  status: string
  message?: string
}

@UseGuards(JwtAuthGuard)
@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query()
  users() {
    return this.usersService.findAll()
  }

  @Mutation()
  async createUser(@Args('input') input: CreateUserInput) {
    const hashed = await bcrypt.hash(input.password, 10)
    return this.usersService.create({
      username: input.username,
      email: input.email,
      password: hashed,
      role: (input.role as UserRole) ?? UserRole.User,
    })
  }

  @Mutation()
  updateActivityStatus(
    @Args('id') id: string,
    @Args('input') input: ActivityStatusInput,
  ) {
    return this.usersService.updateStatus(id, {
      activityStatus: { status: input.status as UserStatus, message: input.message },
    })
  }

  @ResolveField('id')
  id(@Parent() user: UserDocument): string {
    return user._id.toString()
  }
}
