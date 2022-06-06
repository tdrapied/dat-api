import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateDetailDto {
  @IsNotEmpty()
  @IsUUID()
  locationId: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
