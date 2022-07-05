import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateHumidityDto {
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
