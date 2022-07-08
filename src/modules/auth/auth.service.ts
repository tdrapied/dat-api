import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { IsNull, Not } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async validateUserCredentials(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      email,
      password: Not(IsNull()),
      isEnabled: true,
    });
    if (!user) return null;

    // If user password is not correct
    if (!(await bcrypt.compare(password, user.password))) {
      return null;
    }

    // Clear user password
    user.password = null;

    return user;
  }

  validateUserPayload(payload: any): Promise<User> {
    return this.userRepository.findOneBy({
      id: payload.sub,
    });
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
