import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BloodType, RequestStatus, UrgencyLevel } from '../../common/enums';
import { User } from '../../users/entities/user.entity';

@Entity('blood_requests')
export class BloodRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    default: BloodType.O_POS,
  })
  bloodType: BloodType;

  @Column({
    type: 'varchar',
    default: UrgencyLevel.EMERGENCY,
  })
  urgency: UrgencyLevel;

  @Column({ length: 150 })
  hospitalName: string;

  @Column({ length: 150 })
  location: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({
    type: 'varchar',
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @ManyToOne(() => User, (user) => user.advocateRequests, { onDelete: 'CASCADE' })
  advocate: User;

  @ManyToOne(() => User, (user) => user.matchedRequests, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  matchedDonor: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
