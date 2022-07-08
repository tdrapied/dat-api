import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ValidateUserDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!?*$@#%_])([-+!?*$@#%_\w]{8,16})$/,
  )
  password: string;
}
