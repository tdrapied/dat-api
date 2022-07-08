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
import { Location } from '../locations/entities/location.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    @InjectRepository(ValidationCode)
    private readonly validationCodeRepository: Repository<ValidationCode>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
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

    // If the user is assigned to locations, check if they valid
    let locations: Location[] = [];
    if (createUserDto.locations.length > 0) {
      // Reformat dto locations id
      const locationsId: Array<{ id: string }> = createUserDto.locations.map(
        (string) => ({
          id: string,
        }),
      );

      // Get locations by ids
      locations = await this.locationRepository.find({
        where: locationsId,
      });

      // Verify if the locations exists
      if (locations.length !== locationsId.length) {
        throw new BadRequestException('One or more locations does not valid');
      }
    }

    const user = new User(
      await this.userRepository.save({
        ...createUserDto,
        locations,
      }),
    );

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

    // Save user password and delete validation code
    await this.userRepository.update(validationCode.user.id, {
      password: newPassword,
      isEnabled: true,
    });
    await this.validationCodeRepository.delete(validationCode.id);
  }

  findAll(): Promise<User[]> {
    // TODO: Add pagination
    return this.userRepository.find({
      relations: ['locations'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['locations'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
