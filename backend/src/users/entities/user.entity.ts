import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../../common/enums';
import { DonorProfile } from '../../donors/entities/donor-profile.entity';
import { HospitalProfile } from '../../hospitals/entities/hospital-profile.entity';
import { BloodRequest } from '../../requests/entities/blood-request.entity';
import { ChatMessage } from '../../chat/entities/chat-message.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true, length: 50 })
  phone: string;

  @Column({
    type: 'varchar',
    default: UserRole.DONOR,
  })
  role: UserRole;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToOne(() => DonorProfile, (profile) => profile.user, {
    cascade: true,
    nullable: true,
  })
  donorProfile: DonorProfile;

  @OneToOne(() => HospitalProfile, (hospital) => hospital.user, {
    cascade: true,
    nullable: true,
  })
  hospitalProfile: HospitalProfile;

  @OneToMany(() => BloodRequest, (request) => request.advocate)
  advocateRequests: BloodRequest[];

  @OneToMany(() => BloodRequest, (request) => request.matchedDonor)
  matchedRequests: BloodRequest[];

  @OneToMany(() => ChatMessage, (msg) => msg.sender)
  sentMessages: ChatMessage[];

  @OneToMany(() => ChatMessage, (msg) => msg.receiver)
  receivedMessages: ChatMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
