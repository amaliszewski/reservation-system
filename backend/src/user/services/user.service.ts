import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(): Promise<void> {
    try {
      await this.userRepository.createUser({
        username: 'admin',
        password: 'password',
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne('username', username);
  }

  async onModuleInit(): Promise<void> {
    await this.createUser();
  }
}
