import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicationStatus, BloodType } from '../../common/enums';
import { User } from '../../users/entities/user.entity';
import { HospitalProfile } from '../../hospitals/entities/hospital-profile.entity';

@Entity('donor_applications')
export class DonorApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  donor: User;

  @ManyToOne(() => HospitalProfile, (hospital) => hospital.applications, {
    onDelete: 'CASCADE',
  })
  hospital: HospitalProfile;

  @Column({
    type: 'varchar',
    default: BloodType.O_POS,
  })
  bloodType: BloodType;

  @Column({
    type: 'varchar',
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ nullable: true })
  screeningDate: string; // e.g. '2026-11-10'

  @Column({ nullable: true })
  screeningTime: string; // e.g. '09:30'

  @Column({ type: 'text', nullable: true })
  clinicalNotes: string;

  @Column({ nullable: true })
  labResults: string; // 'passed' | 'failed' | 'pending'

  @Column({ type: 'int', default: 5 })
  hospitalRating: number; // 1 to 5 stars

  @Column({ type: 'text', nullable: true })
  ratingFeedback: string;

  @Column({ type: 'int', default: 1 })
  unitsCollected: number;

  @Column({ default: false })
  awardedBadge: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
