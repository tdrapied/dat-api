import { Column, Entity, ManyToOne } from 'typeorm';
import { Location } from '../../locations/entities/location.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class Detail {
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
