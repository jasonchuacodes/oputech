import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private user: Model<UserDocument>) {}

  findById(id: string): Promise<UserDocument | null> {
    return this.user.findById(id).select('-password').exec();
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return this.user.findOne({ email }).exec();
  }

  create(input: CreateUserDto): Promise<UserDocument> {
    return this.user.create(input);
  }
}
