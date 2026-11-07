import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DonorApplication } from '../../applications/entities/donor-application.entity';

@Entity('hospital_profiles')
export class HospitalProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 50, default: '1.5 km' })
  distance: string;

  @Column({ length: 50, default: '10 min' })
  eta: string;

  @Column({ length: 10, default: '08:00' })
  openingTime: string;

  @Column({ length: 10, default: '18:00' })
  closingTime: string;

  @Column({ type: 'simple-array', default: 'O+,O-,A-' })
  neededBloodTypes: string[];

  @Column({ default: true })
  isDeskOpen: boolean;

  @Column({ default: true })
  requestDonorsActive: boolean;

  @Column({ nullable: true, length: 100 })
  operatingLicence: string;

  @OneToOne(() => User, (user) => user.hospitalProfile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => DonorApplication, (app) => app.hospital)
  applications: DonorApplication[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
