import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonorApplication } from './entities/donor-application.entity';
import { HospitalProfile } from '../hospitals/entities/hospital-profile.entity';
import { User } from '../users/entities/user.entity';
import { DonorProfile } from '../donors/entities/donor-profile.entity';
import { Badge } from '../badges/entities/badge.entity';
import { ApplicationStatus, BloodType } from '../common/enums';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(DonorApplication)
    private applicationRepository: Repository<DonorApplication>,
    @InjectRepository(HospitalProfile)
    private hospitalRepository: Repository<HospitalProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DonorProfile)
    private donorProfileRepository: Repository<DonorProfile>,
    @InjectRepository(Badge)
    private badgeRepository: Repository<Badge>,
  ) {}

  async applyToHospital(
    donorUserId: string,
    hospitalId: string,
    bloodType: BloodType,
  ) {
    const donor = await this.userRepository.findOne({
      where: { id: donorUserId },
    });
    if (!donor) throw new NotFoundException('Donor not found');

    const hospital = await this.hospitalRepository.findOne({
      where: { id: hospitalId },
    });
    if (!hospital) throw new NotFoundException('Hospital not found');

    const application = this.applicationRepository.create({
      donor,
      hospital,
      bloodType,
      status: ApplicationStatus.PENDING,
    });

    return this.applicationRepository.save(application);
  }

  async getDonorApplications(donorUserId: string) {
    return this.applicationRepository.find({
      where: { donor: { id: donorUserId } },
      relations: ['hospital', 'hospital.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getHospitalQueue(hospitalUserId: string) {
    const hospital = await this.hospitalRepository.findOne({
      where: { user: { id: hospitalUserId } },
    });
    if (!hospital) throw new NotFoundException('Hospital profile not found');

    return this.applicationRepository.find({
      where: { hospital: { id: hospital.id } },
      relations: ['donor', 'donor.donorProfile'],
      order: { createdAt: 'DESC' },
    });
  }

  async scheduleScreening(
    applicationId: string,
    screeningDate: string,
    screeningTime: string,
  ) {
    const app = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['donor', 'hospital'],
    });
    if (!app) throw new NotFoundException('Application not found');

    app.screeningDate = screeningDate;
    app.screeningTime = screeningTime;
    app.status = ApplicationStatus.SCREENING_SCHEDULED;

    return this.applicationRepository.save(app);
  }

  async completeDonationAndAwardBadge(applicationId: string) {
    const app = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['donor', 'donor.donorProfile', 'hospital'],
    });
    if (!app) throw new NotFoundException('Application not found');

    app.status = ApplicationStatus.COMPLETED;
    await this.applicationRepository.save(app);

    // Update donor cooldown & badge count
    if (app.donor) {
      const donorProfile = await this.donorProfileRepository.findOne({
        where: { user: { id: app.donor.id } },
      });
      if (donorProfile) {
        donorProfile.lastDonationAt = new Date();
        donorProfile.badgeEarnedCount += 1;
        await this.donorProfileRepository.save(donorProfile);
      }

      // Create new Vein of Hope badge record
      const badge = this.badgeRepository.create({
        donor: app.donor,
        title: 'Vein of Hope',
        awardedByHospitalName: app.hospital?.name || 'Accredited Hospital',
        description: `Awarded for completing life-saving blood donation at ${app.hospital?.name || 'Lagos Healthcare Facility'}.`,
        iconKey: 'BOiBr4Tx',
      });
      await this.badgeRepository.save(badge);
    }

    return {
      success: true,
      message: 'Donation successfully confirmed and Vein of Hope badge awarded to donor!',
      application: app,
    };
  }
}
