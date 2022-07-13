import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Location } from '../../locations/entities/location.entity';

export enum DecisionType {
  WATERING_VINES = 'WATERING_VINES',
  COVER_VINES = 'COVER_VINES',
  TREAT_VINES = 'TREAT_VINES',
  TYING_VINES = 'TYING_VINES',
  SAV_VINES = 'SAV_VINES',
}

@Entity()
export class Decision {
  @Column({
    type: 'uuid',
    primary: true,
    generated: 'uuid',
  })
  id: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  value: number = null;

  @Column({
    type: 'enum',
    enum: DecisionType,
  })
  type: DecisionType;

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
