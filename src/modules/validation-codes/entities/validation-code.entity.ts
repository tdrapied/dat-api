import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ValidationCodeType {
  USER_VERIFICATION = 'USER_VERIFICATION',
}

@Entity()
export class ValidationCode {
  @Column({
    type: 'uuid',
    primary: true,
    generated: 'uuid',
  })
  id: string;

  @Column()
  code: string;

  @Column({
    type: 'enum',
    enum: ValidationCodeType,
  })
  type: ValidationCodeType;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
