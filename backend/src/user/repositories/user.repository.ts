import { Injectable } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(userData: Partial<User>): Promise<void> {
    const existingUser = await this.userModel.findOne({
      username: userData.username,
    });
    if (!existingUser) {
      const newUser = new this.userModel(userData);
      await newUser.save();
    }
  }

  async findOne(field: string, value: string): Promise<User> {
    const user = await this.userModel.findOne({
      [field]: value,
    });

    return user;
  }
}
