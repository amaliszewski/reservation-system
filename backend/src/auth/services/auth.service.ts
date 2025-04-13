import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(userId: string) {
    return await this.generateTokens(userId);
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    const isPasswordCorrect = password === user.password;

    if (user && isPasswordCorrect) {
      return {
        id: user._id,
        username: user.username,
      };
    }

    return null;
  }

  async generateTokens(userId: string): Promise<string> {
    const payload = { sub: userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60,
    });

    return accessToken;
  }
}
