import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { MailerUtil } from '../../utils/mailer.util';
import { ValidationCode } from '../validation-codes/entities/validation-code.entity';
import { Location } from '../locations/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ValidationCode, Location])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, MailerUtil],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
