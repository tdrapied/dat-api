import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { MailerUtil } from '../../utils/mailer.util';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly mailerUtil: MailerUtil,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verify if the user already exists
    if (await this.userRepository.findByEmail(createUserDto.email)) {
      throw new BadRequestException('User already exists');
    }

    const user = new User(await this.userRepository.save(createUserDto));

    // TODO: Generate a random verification code

    // Send an activation email
    await this.mailerUtil.sendActivationEmail(user, 'fake-code');

    return user;
  }

  findAll(): Promise<User[]> {
    // TODO: Add pagination
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
