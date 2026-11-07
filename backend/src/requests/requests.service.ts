import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BloodRequest } from './entities/blood-request.entity';
import { User } from '../users/entities/user.entity';
import { BloodType, RequestStatus, UrgencyLevel } from '../common/enums';
import { DonorProfile } from '../donors/entities/donor-profile.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(BloodRequest)
    private bloodRequestRepository: Repository<BloodRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DonorProfile)
    private donorProfileRepository: Repository<DonorProfile>,
  ) {}

  async createRequest(
    advocateId: string,
    dto: {
      bloodType: BloodType;
      urgency?: UrgencyLevel;
      hospitalName: string;
      location: string;
      note?: string;
      targetDonorId?: string;
    },
  ) {
    const advocate = await this.userRepository.findOne({
      where: { id: advocateId },
    });
    if (!advocate) {
      throw new NotFoundException('Advocate not found');
    }

    let matchedDonor: User | null = null;
    if (dto.targetDonorId) {
      matchedDonor = await this.userRepository.findOne({
        where: { id: dto.targetDonorId },
      });
    }

    const request = this.bloodRequestRepository.create({
      advocate,
      matchedDonor,
      bloodType: dto.bloodType,
      urgency: dto.urgency || UrgencyLevel.EMERGENCY,
      hospitalName: dto.hospitalName,
      location: dto.location,
      note: dto.note || '',
      status: RequestStatus.PENDING,
    });

    return this.bloodRequestRepository.save(request);
  }

  async getAdvocateRequests(advocateId: string) {
    return this.bloodRequestRepository.find({
      where: { advocate: { id: advocateId } },
      relations: ['matchedDonor', 'matchedDonor.donorProfile'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMatchingDonorRequests(donorUserId: string) {
    const donorProfile = await this.donorProfileRepository.findOne({
      where: { user: { id: donorUserId } },
    });

    if (!donorProfile) {
      throw new NotFoundException('Donor profile not found');
    }

    // Matching: Direct assignment to this donor OR matches blood type and is pending
    return this.bloodRequestRepository.find({
      where: [
        { matchedDonor: { id: donorUserId } },
        { bloodType: donorProfile.bloodType, status: RequestStatus.PENDING },
      ],
      relations: ['advocate'],
      order: { createdAt: 'DESC' },
    });
  }

  async respondToRequest(
    requestId: string,
    donorUserId: string,
    action: 'accept' | 'decline',
  ) {
    const request = await this.bloodRequestRepository.findOne({
      where: { id: requestId },
      relations: ['advocate', 'matchedDonor'],
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const donor = await this.userRepository.findOne({
      where: { id: donorUserId },
    });

    if (action === 'accept') {
      request.status = RequestStatus.ACCEPTED;
      request.matchedDonor = donor;
    } else {
      request.status = RequestStatus.DECLINED;
    }

    return this.bloodRequestRepository.save(request);
  }

  async cancelRequest(requestId: string, advocateId: string) {
    const request = await this.bloodRequestRepository.findOne({
      where: { id: requestId, advocate: { id: advocateId } },
    });

    if (!request) {
      throw new NotFoundException('Request not found or not owned by you');
    }

    request.status = RequestStatus.CANCELLED;
    return this.bloodRequestRepository.save(request);
  }
}
