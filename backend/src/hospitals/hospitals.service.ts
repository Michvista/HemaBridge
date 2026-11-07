import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HospitalProfile } from './entities/hospital-profile.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(HospitalProfile)
    private hospitalProfileRepository: Repository<HospitalProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.hospitalProfileRepository.find({
      relations: ['user'],
    });
  }

  async findByUserId(userId: string) {
    const hospital = await this.hospitalProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'applications', 'applications.donor'],
    });
    if (!hospital) {
      throw new NotFoundException('Hospital profile not found');
    }
    return hospital;
  }

  async findById(id: string) {
    const hospital = await this.hospitalProfileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }
    return hospital;
  }

  async updateStatus(
    userId: string,
    update: {
      isDeskOpen?: boolean;
      requestDonorsActive?: boolean;
      neededBloodTypes?: string[];
    },
  ) {
    const hospital = await this.hospitalProfileRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!hospital) {
      throw new NotFoundException('Hospital profile not found');
    }

    if (update.isDeskOpen !== undefined) {
      hospital.isDeskOpen = update.isDeskOpen;
    }
    if (update.requestDonorsActive !== undefined) {
      hospital.requestDonorsActive = update.requestDonorsActive;
    }
    if (update.neededBloodTypes) {
      hospital.neededBloodTypes = update.neededBloodTypes;
    }

    return this.hospitalProfileRepository.save(hospital);
  }
}
