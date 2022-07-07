import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { MailerUtil } from '../../utils/mailer.util';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidationCode,
  ValidationCodeType,
} from '../validation-codes/entities/validation-code.entity';
import { Repository } from 'typeorm';
import { ValidateUserDto } from './dto/validate-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    @InjectRepository(ValidationCode)
    private readonly validationCodeRepository: Repository<ValidationCode>,
    private readonly mailerUtil: MailerUtil,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('SUPER_ADMIN role is not allowed');
    }

    // Verify if the user already exists
    if (await this.userRepository.findByEmail(createUserDto.email)) {
      throw new BadRequestException('User already exists');
    }

    const user = new User(await this.userRepository.save(createUserDto));

    // Generate validation code
    const validationCode = await this.validationCodeRepository.save({
      code: randomUUID(),
      type: ValidationCodeType.USER_VERIFICATION,
      user,
    });

    // Send an activation email
    await this.mailerUtil.sendActivationEmail(user, validationCode.code);

    return user;
  }

  async validate(validateUserDto: ValidateUserDto): Promise<void> {
    const validationCode = await this.validationCodeRepository.findOne({
      where: {
        code: validateUserDto.code,
        type: ValidationCodeType.USER_VERIFICATION,
      },
      relations: ['user'],
    });
    if (!validationCode) {
      throw new BadRequestException('Code not valid');
    }

    // Create password encrypted
    const newPassword = await bcrypt.hash(validateUserDto.password, 10);

    console.log(validationCode.user);

    // Save user password and delete validation code
    await this.userRepository.update(validationCode.user.id, {
      password: newPassword,
      isEnabled: true,
    });
    await this.validationCodeRepository.delete(validationCode.id);
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
