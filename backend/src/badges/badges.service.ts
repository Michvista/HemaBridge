import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(Badge)
    private badgeRepository: Repository<Badge>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getDonorBadges(donorUserId: string) {
    const badges = await this.badgeRepository.find({
      where: { donor: { id: donorUserId } },
      order: { awardedAt: 'DESC' },
    });

    // All available badges in Hemabridge gamification
    const catalogue = [
      {
        id: 'vein_of_hope',
        title: 'Vein of Hope',
        tier: 'Platinum Donor',
        description: 'Completed life-saving blood donation under clinical supervision.',
        iconKey: 'BOiBr4Tx',
        isEarned: badges.length > 0,
        earnedCount: badges.length,
        awardedAt: badges[0]?.awardedAt || null,
        awardedBy: badges[0]?.awardedByHospitalName || null,
      },
      {
        id: 'rapid_responder',
        title: 'Rapid Responder',
        tier: 'Emergency Ready',
        description: 'Accepted and fulfilled an emergency blood request within 2 hours.',
        iconKey: 'rapid_badge',
        isEarned: badges.length >= 2,
        earnedCount: Math.floor(badges.length / 2),
        awardedAt: null,
        awardedBy: null,
      },
      {
        id: 'community_guardian',
        title: 'Community Guardian',
        tier: 'Distinguished Champion',
        description: 'Consistent voluntary donor with 3+ donations and awareness advocate.',
        iconKey: 'guardian_badge',
        isEarned: badges.length >= 3,
        earnedCount: Math.floor(badges.length / 3),
        awardedAt: null,
        awardedBy: null,
      },
    ];

    return {
      totalEarned: badges.length,
      badges: catalogue,
      history: badges,
    };
  }
}
