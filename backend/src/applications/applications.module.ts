import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { DonorApplication } from './entities/donor-application.entity';
import { HospitalProfile } from '../hospitals/entities/hospital-profile.entity';
import { User } from '../users/entities/user.entity';
import { DonorProfile } from '../donors/entities/donor-profile.entity';
import { Badge } from '../badges/entities/badge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DonorApplication,
      HospitalProfile,
      User,
      DonorProfile,
      Badge,
    ]),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
