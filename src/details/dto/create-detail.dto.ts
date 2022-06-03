import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDetailDto {
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
