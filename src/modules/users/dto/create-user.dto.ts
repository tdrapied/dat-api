import { UserRole } from '../entities/user.entity';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString, IsUUID,
  Length
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 25)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 25)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  locations: string[];
}
