import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { BloodRequest } from './entities/blood-request.entity';
import { User } from '../users/entities/user.entity';
import { DonorProfile } from '../donors/entities/donor-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BloodRequest, User, DonorProfile])],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
