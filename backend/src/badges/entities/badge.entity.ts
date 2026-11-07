import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('badges')
export class Badge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Vein of Hope' })
  title: string;

  @Column({
    type: 'text',
    default:
      'Recognized for exceptional voluntary blood donation and saving lives in Nigerian emergency healthcare.',
  })
  description: string;

  @Column({ default: 'BOiBr4Tx' })
  iconKey: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  donor: User;

  @Column({ nullable: true })
  awardedByHospitalName: string;

  @CreateDateColumn()
  awardedAt: Date;
}
