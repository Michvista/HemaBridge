import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BloodType, Gender } from '../../common/enums';
import { User } from '../../users/entities/user.entity';

@Entity('donor_profiles')
export class DonorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    default: BloodType.O_POS,
  })
  bloodType: BloodType;

  @Column({
    type: 'varchar',
    default: Gender.MALE,
  })
  gender: Gender;

  @Column({ length: 100, default: 'Lagos' })
  area: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  lastDonationAt: Date;

  @Column({ default: 0 })
  badgeEarnedCount: number;

  @OneToOne(() => User, (user) => user.donorProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
