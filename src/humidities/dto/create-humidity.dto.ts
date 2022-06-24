import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateHumidityDto {
  @IsNotEmpty()
  @IsUUID()
  locationId: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
