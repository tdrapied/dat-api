import { Column, Entity } from 'typeorm';

@Entity()
export class Application {
  @Column({
    type: 'uuid',
    primary: true,
    generated: 'uuid',
  })
  id: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description: string = null;

  @Column()
  key: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActivated = true;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
