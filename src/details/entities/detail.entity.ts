import { Column, Entity } from 'typeorm';

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

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
