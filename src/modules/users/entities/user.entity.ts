import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Location } from '../../locations/entities/location.entity';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @Column({
    type: 'uuid',
    primary: true,
    generated: 'uuid',
  })
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @ApiHideProperty()
  @Exclude()
  @Column({
    nullable: true,
  })
  password: string = null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole = UserRole.USER;

  @ApiHideProperty()
  @Exclude()
  @Column({
    type: 'boolean',
    default: false,
  })
  // If user email is verified, then it's true
  isEnabled = false;

  @Expose()
  @ManyToMany(() => Location)
  @JoinTable({
    name: 'user_locations',
  })
  locations: Location[];

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

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
