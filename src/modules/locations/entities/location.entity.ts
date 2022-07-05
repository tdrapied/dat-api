import { Column, Entity } from 'typeorm';

@Entity()
export class Location {
  @Column({
    type: 'uuid',
    primary: true,
    generated: 'uuid',
  })
  id: string;

  @Column()
  name: string;
}
