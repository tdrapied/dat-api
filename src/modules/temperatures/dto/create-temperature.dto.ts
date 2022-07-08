import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { TemperatureType } from '../entities/temperature.entity';

export class CreateTemperatureDto {
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsEnum(TemperatureType)
  type: TemperatureType;
}
