import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonorProfile } from './entities/donor-profile.entity';
import { User } from '../users/entities/user.entity';
import { Gender, BloodType } from '../common/enums';

@Injectable()
export class DonorsService {
  constructor(
    @InjectRepository(DonorProfile)
    private donorProfileRepository: Repository<DonorProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.donorProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Donor profile not found');
    }

    const eligibility = this.calculateEligibility(
      profile.lastDonationAt,
      profile.gender,
    );

    return {
      ...profile,
      eligibility,
    };
  }

  async toggleAvailability(userId: string, isAvailable: boolean) {
    const profile = await this.donorProfileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!profile) {
      throw new NotFoundException('Donor profile not found');
    }

    profile.isAvailable = isAvailable;
    await this.donorProfileRepository.save(profile);

    return {
      success: true,
      isAvailable: profile.isAvailable,
      message: isAvailable
        ? 'You are now marked as available for blood donation requests.'
        : 'You are now marked as unavailable.',
    };
  }

  async findEligibleDonors(filters: { bloodType?: string; area?: string }) {
    const query = this.donorProfileRepository
      .createQueryBuilder('donor')
      .leftJoinAndSelect('donor.user', 'user')
      .where('donor.isAvailable = :isAvailable', { isAvailable: true });

    if (filters.bloodType) {
      // Blood compatibility: If needed is O+, O- and O+ can donate, etc.
      // Or direct match
      query.andWhere('donor.bloodType = :bloodType', {
        bloodType: filters.bloodType,
      });
    }

    if (filters.area) {
      query.andWhere('LOWER(donor.area) LIKE LOWER(:area)', {
        area: `%${filters.area}%`,
      });
    }

    const donors = await query.getMany();

    // Map and sanitize to protect donor privacy before connection is approved
    return donors.map((d) => {
      const eligibility = this.calculateEligibility(d.lastDonationAt, d.gender);
      const nameParts = (d.user?.name || 'Anonymous Donor').split(' ');
      const initials = nameParts
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      return {
        id: d.id,
        userId: d.user?.id,
        name: d.user?.name,
        initials,
        bloodType: d.bloodType,
        gender: d.gender,
        area: d.area,
        isAvailable: d.isAvailable,
        lastDonationAt: d.lastDonationAt,
        badgeEarnedCount: d.badgeEarnedCount,
        phone: d.user?.phone ? `${d.user.phone.slice(0, 7)}****` : '+234 803 *** ****',
        eligibility,
      };
    });
  }

  calculateEligibility(lastDonationAt: Date | null, gender: Gender) {
    const intervalMonths = gender === Gender.MALE ? 3 : 4;
    const now = Date.now();

    if (!lastDonationAt) {
      return {
        eligible: true,
        daysRemaining: 0,
        intervalMonths,
        nextEligibleAt: new Date(now),
        message: 'Eligible to donate now',
      };
    }

    const lastDate = new Date(lastDonationAt);
    const nextEligible = new Date(lastDate);
    nextEligible.setMonth(nextEligible.getMonth() + intervalMonths);

    const diffMs = nextEligible.getTime() - now;
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    return {
      eligible: daysRemaining === 0,
      daysRemaining,
      intervalMonths,
      nextEligibleAt: nextEligible,
      message:
        daysRemaining === 0
          ? 'Eligible to donate now'
          : `Can donate again in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`,
    };
  }
}
