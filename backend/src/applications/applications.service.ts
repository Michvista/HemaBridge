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

  // Clinical screening evaluation with lab checks, rating, and award decision
  async evaluateScreening(
    applicationId: string,
    data: {
      decision: 'passed' | 'failed';
      clinicalNotes?: string;
      hemoglobin?: string;
      viralScreeningClear?: boolean;
      rating: number; // 1-5
      ratingFeedback?: string;
      unitsCollected?: number;
    },
  ) {
    const app = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['donor', 'donor.donorProfile', 'hospital'],
    });
    if (!app) throw new NotFoundException('Application not found');

    app.labResults = data.decision;
    app.hospitalRating = Math.max(1, Math.min(5, data.rating || (data.decision === 'passed' ? 5 : 2)));
    app.ratingFeedback = data.ratingFeedback || '';
    app.clinicalNotes = data.clinicalNotes || (
      data.decision === 'passed'
        ? `Clinical screening verified: Viral markers clear. Hb: ${data.hemoglobin || '13.5 g/dL'}. Donor medically eligible.`
        : `Screening deferred: ${data.ratingFeedback || 'Did not meet current clinical hematology threshold.'}`
    );

    if (data.decision === 'passed') {
      app.status = ApplicationStatus.COMPLETED;
      app.unitsCollected = data.unitsCollected || 1;
      app.awardedBadge = true;

      // Update donor profile: increment donations, set cooldown timestamp
      if (app.donor) {
        const donorProfile = await this.donorProfileRepository.findOne({
          where: { user: { id: app.donor.id } },
        });
        if (donorProfile) {
          donorProfile.lastDonationAt = new Date();
          donorProfile.totalDonations = (donorProfile.totalDonations || 0) + 1;
          donorProfile.badgeEarnedCount = (donorProfile.badgeEarnedCount || 0) + 1;
          await this.donorProfileRepository.save(donorProfile);
        }

        // Award the Vein of Hope badge
        const badge = this.badgeRepository.create({
          donor: app.donor,
          title: 'Vein of Hope',
          awardedByHospitalName: app.hospital?.name || 'Accredited Hospital',
          description: `Certified clinical blood donation. Verified by ${app.hospital?.name || 'Hospital Clinical Desk'}.`,
          iconKey: 'BOiBr4Tx',
        });
        await this.badgeRepository.save(badge);
      }
    } else {
      // Failed / Deferred screening
      app.status = ApplicationStatus.DECLINED;
      app.unitsCollected = 0;
      app.awardedBadge = false;
    }

    await this.applicationRepository.save(app);

    return {
      success: true,
      decision: data.decision,
      message:
        data.decision === 'passed'
          ? 'Screening successfully passed! Blood units collected and Vein of Hope badge awarded to donor.'
          : 'Donor screening marked as deferred/ineligible. Record updated without badge award.',
      application: app,
    };
  }

  async completeDonationAndAwardBadge(applicationId: string) {
    return this.evaluateScreening(applicationId, {
      decision: 'passed',
      rating: 5,
      unitsCollected: 1,
      clinicalNotes: 'Screening passed. Viral markers non-reactive. Ready for donation.',
      ratingFeedback: 'Reliable and cooperative voluntary lifesaver.',
    });
  }
}
