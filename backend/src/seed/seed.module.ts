import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../users/entities/user.entity';
import { DonorProfile } from '../donors/entities/donor-profile.entity';
import { HospitalProfile } from '../hospitals/entities/hospital-profile.entity';
import { BloodRequest } from '../requests/entities/blood-request.entity';
import { DonorApplication } from '../applications/entities/donor-application.entity';
import { ChatMessage } from '../chat/entities/chat-message.entity';
import { Badge } from '../badges/entities/badge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      DonorProfile,
      HospitalProfile,
      BloodRequest,
      DonorApplication,
      ChatMessage,
      Badge,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
