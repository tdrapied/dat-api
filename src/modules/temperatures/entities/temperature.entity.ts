import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Location } from '../../locations/entities/location.entity';

export enum TemperatureType {
  AIR = 'AIR',
  SOIL = 'SOIL',
}

@Entity()
export class Temperature {
  @Column({
    type: 'uuid',
    primary: true,
    generated: 'uuid',
  })
  id: string;

  @Column({
    type: 'float',
  })
  value: number;

  @Column({
    type: 'enum',
    enum: TemperatureType,
  })
  type: TemperatureType;

  @ApiHideProperty()
  @Exclude()
  @ManyToOne(() => Location, {
    nullable: false,
  })
  location: Location;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
