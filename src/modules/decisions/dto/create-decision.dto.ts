import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { DecisionType } from '../entities/decision.entity';

export class CreateDecisionDto {
  @IsOptional()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsEnum(DecisionType)
  type: DecisionType;
}
