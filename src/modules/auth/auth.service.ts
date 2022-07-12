import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from '../locations/entities/location.entity';
import { Application } from '../applications/entities/application.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly userRepository: UsersRepository,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly jwtService: JwtService,
  ) {}

  /********************************************
   * Users
   * ******************************************/

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User> {
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

    return user;
  }

  async validateUserPayload(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub,
      },
      relations: ['locations'],
    });
    if (!user) return null;

    if (user.role === UserRole.SUPER_ADMIN) {
      user.locations = await this.locationRepository.find();
    }

    // Clear user password
    user.password = null;

    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /********************************************
   * Applications
   * ******************************************/

  async validateAppKey(key: string): Promise<Application> {
    if (!key) return null;

    const app = await this.applicationRepository.findOne({
      where: {
        key,
        isActivated: true,
      },
    });

    return app;
  }
}
