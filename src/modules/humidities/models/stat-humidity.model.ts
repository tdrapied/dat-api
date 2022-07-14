import { ApiProperty } from '@nestjs/swagger';

export class StatHumidityModel {
  @ApiProperty({
    type: Number,
  })
  min: number;

  @ApiProperty({
    type: Number,
  })
  mean: number;

  @ApiProperty({
    type: Number,
  })
  max: number;

  @ApiProperty({
    type: Date,
  })
  fromDate: Date;

  @ApiProperty({
    type: Date,
  })
  toDate: Date;

  constructor(data) {
    this.min = data.min;
    this.mean = data.mean;
    this.max = data.max;
    this.fromDate = data.from;
    this.toDate = data.to;
  }
}
