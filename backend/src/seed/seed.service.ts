import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { DonorProfile } from '../donors/entities/donor-profile.entity';
import { HospitalProfile } from '../hospitals/entities/hospital-profile.entity';
import { BloodRequest } from '../requests/entities/blood-request.entity';
import { DonorApplication } from '../applications/entities/donor-application.entity';
import { ChatMessage } from '../chat/entities/chat-message.entity';
import { Badge } from '../badges/entities/badge.entity';
import {
  UserRole,
  BloodType,
  Gender,
  RequestStatus,
  ApplicationStatus,
  UrgencyLevel,
} from '../common/enums';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DonorProfile)
    private donorProfileRepository: Repository<DonorProfile>,
    @InjectRepository(HospitalProfile)
    private hospitalProfileRepository: Repository<HospitalProfile>,
    @InjectRepository(BloodRequest)
    private bloodRequestRepository: Repository<BloodRequest>,
    @InjectRepository(DonorApplication)
    private applicationRepository: Repository<DonorApplication>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(Badge)
    private badgeRepository: Repository<Badge>,
  ) {}

  async onApplicationBootstrap() {
    await this.seed();
  }

  async seed() {
    const userCount = await this.userRepository.count();
    if (userCount > 0) {
      console.log('Database already contains records. Skipping seed.');
      return;
    }

    console.log('Seeding initial Hemabridge users, hospitals, requests, and chats...');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password123!', salt);

    // ==========================================
    // 1. DONORS (2 Users)
    // ==========================================
    const donor1User = this.userRepository.create({
      name: 'Amara Miller',
      email: 'amara.miller@hemabridge.com',
      passwordHash,
      phone: '+234 803 555 0142',
      role: UserRole.DONOR,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
    await this.userRepository.save(donor1User);

    const donor1Profile = this.donorProfileRepository.create({
      user: donor1User,
      bloodType: BloodType.O_POS,
      gender: Gender.FEMALE,
      area: 'Ikeja, Lagos',
      isAvailable: true,
      lastDonationAt: new Date(Date.now() - 124 * 24 * 60 * 60 * 1000), // 124 days ago (eligible)
      badgeEarnedCount: 1,
    });
    await this.donorProfileRepository.save(donor1Profile);

    const donor2User = this.userRepository.create({
      name: 'Chidi Okafor',
      email: 'chidi.okafor@hemabridge.com',
      passwordHash,
      phone: '+234 805 555 0171',
      role: UserRole.DONOR,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });
    await this.userRepository.save(donor2User);

    const donor2Profile = this.donorProfileRepository.create({
      user: donor2User,
      bloodType: BloodType.A_POS,
      gender: Gender.MALE,
      area: 'Yaba, Lagos',
      isAvailable: true,
      lastDonationAt: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000), // 110 days ago (eligible)
      badgeEarnedCount: 2,
    });
    await this.donorProfileRepository.save(donor2Profile);

    // ==========================================
    // 2. PATIENT ADVOCATES (2 Users)
    // ==========================================
    const advocate1User = this.userRepository.create({
      name: 'Bolanle Adebayo',
      email: 'bolanle.advocate@hemabridge.com',
      passwordHash,
      phone: '+234 802 111 2345',
      role: UserRole.ADVOCATE,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    });
    await this.userRepository.save(advocate1User);

    const advocate2User = this.userRepository.create({
      name: 'Emeka Nwosu',
      email: 'emeka.advocate@hemabridge.com',
      passwordHash,
      phone: '+234 814 222 3456',
      role: UserRole.ADVOCATE,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    });
    await this.userRepository.save(advocate2User);

    // ==========================================
    // 3. HOSPITALS (2 Facilities)
    // ==========================================
    const hospital1User = this.userRepository.create({
      name: 'Lagos University Teaching Hospital (LUTH)',
      email: 'luth@hemabridge.com',
      passwordHash,
      phone: '+234 1 234 5678',
      role: UserRole.HOSPITAL,
    });
    await this.userRepository.save(hospital1User);

    const hospital1Profile = this.hospitalProfileRepository.create({
      user: hospital1User,
      name: 'Lagos University Teaching Hospital',
      address: 'Idi-Araba, Surulere, Lagos',
      distance: '1.2 km',
      eta: '5 min',
      openingTime: '08:00',
      closingTime: '18:00',
      neededBloodTypes: ['O+', 'O-', 'A-'],
      isDeskOpen: true,
      requestDonorsActive: true,
      operatingLicence: 'HEFAMAA-LG-LUTH-001',
    });
    await this.hospitalProfileRepository.save(hospital1Profile);

    const hospital2User = this.userRepository.create({
      name: 'Reddington Hospital',
      email: 'reddington@hemabridge.com',
      passwordHash,
      phone: '+234 1 890 1234',
      role: UserRole.HOSPITAL,
    });
    await this.userRepository.save(hospital2User);

    const hospital2Profile = this.hospitalProfileRepository.create({
      user: hospital2User,
      name: 'Reddington Hospital',
      address: '12 Idowu Martins Street, Victoria Island, Lagos',
      distance: '8.1 km',
      eta: '24 min',
      openingTime: '08:30',
      closingTime: '17:30',
      neededBloodTypes: ['O+', 'O-', 'A+', 'B+', 'AB+'],
      isDeskOpen: true,
      requestDonorsActive: true,
      operatingLicence: 'HEFAMAA-VI-REDD-042',
    });
    await this.hospitalProfileRepository.save(hospital2Profile);

    // ==========================================
    // 4. BADGES
    // ==========================================
    const badge1 = this.badgeRepository.create({
      donor: donor1User,
      title: 'Vein of Hope',
      awardedByHospitalName: 'Lagos University Teaching Hospital',
      description: 'Awarded for completing life-saving voluntary O+ blood donation.',
      iconKey: 'BOiBr4Tx',
    });
    await this.badgeRepository.save(badge1);

    const badge2 = this.badgeRepository.create({
      donor: donor2User,
      title: 'Vein of Hope',
      awardedByHospitalName: 'Reddington Hospital',
      description: 'Awarded for exceptional community blood mobilization.',
      iconKey: 'BOiBr4Tx',
    });
    await this.badgeRepository.save(badge2);

    // ==========================================
    // 5. SAMPLE REQUESTS
    // ==========================================
    const req1 = this.bloodRequestRepository.create({
      advocate: advocate1User,
      matchedDonor: donor1User,
      bloodType: BloodType.O_POS,
      urgency: UrgencyLevel.EMERGENCY,
      hospitalName: 'Lagos University Teaching Hospital',
      location: 'Surulere, Lagos',
      note: 'Urgent replacement units needed for post-op emergency surgery.',
      status: RequestStatus.ACCEPTED,
    });
    await this.bloodRequestRepository.save(req1);

    const req2 = this.bloodRequestRepository.create({
      advocate: advocate2User,
      matchedDonor: null,
      bloodType: BloodType.A_POS,
      urgency: UrgencyLevel.URGENT,
      hospitalName: 'Lagos State University Teaching Hospital',
      location: 'Ikeja, Lagos',
      note: 'Patient with severe anaemia crisis requiring compatible A+ blood.',
      status: RequestStatus.PENDING,
    });
    await this.bloodRequestRepository.save(req2);

    // ==========================================
    // 6. DONOR HOSPITAL APPLICATION & SCREENING
    // ==========================================
    const app1 = this.applicationRepository.create({
      donor: donor2User,
      hospital: hospital1Profile,
      bloodType: BloodType.A_POS,
      status: ApplicationStatus.SCREENING_SCHEDULED,
      screeningDate: '2026-11-10',
      screeningTime: '10:00',
    });
    await this.applicationRepository.save(app1);

    // ==========================================
    // 7. REALISTIC CHAT CONVERSATIONS
    // ==========================================
    // Chat 1: Patient Advocate (Bolanle) <-> Donor (Amara Miller)
    const msg1 = this.chatMessageRepository.create({
      sender: advocate1User,
      receiver: donor1User,
      content:
        'Hello Amara, thank you so much for accepting the blood request for our patient at LUTH!',
      requestId: req1.id,
      isRead: true,
      createdAt: new Date(Date.now() - 35 * 60 * 1000),
    });
    await this.chatMessageRepository.save(msg1);

    const msg2 = this.chatMessageRepository.create({
      sender: donor1User,
      receiver: advocate1User,
      content:
        'Hello Bolanle, happy to help. I am currently in Ikeja and can be at the LUTH Blood Transfusion Center in 30 minutes.',
      requestId: req1.id,
      isRead: true,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    });
    await this.chatMessageRepository.save(msg2);

    const msg3 = this.chatMessageRepository.create({
      sender: advocate1User,
      receiver: donor1User,
      content:
        'That would be amazing! Please ask for Dr. Adeleke at the Haematology lab on the 2nd floor.',
      requestId: req1.id,
      isRead: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
    });
    await this.chatMessageRepository.save(msg3);

    // Chat 2: Hospital (LUTH) <-> Donor (Chidi Okafor)
    const hospMsg1 = this.chatMessageRepository.create({
      sender: hospital1User,
      receiver: donor2User,
      content:
        'Good day Chidi. Your voluntary donation application at LUTH has been approved. Your screening is set for Tuesday at 10:00 AM.',
      applicationId: app1.id,
      isRead: true,
      createdAt: new Date(Date.now() - 120 * 60 * 1000),
    });
    await this.chatMessageRepository.save(hospMsg1);

    const hospMsg2 = this.chatMessageRepository.create({
      sender: donor2User,
      receiver: hospital1User,
      content:
        'Thank you! Should I fast before coming for the screening appointment?',
      applicationId: app1.id,
      isRead: true,
      createdAt: new Date(Date.now() - 90 * 60 * 1000),
    });
    await this.chatMessageRepository.save(hospMsg2);

    const hospMsg3 = this.chatMessageRepository.create({
      sender: hospital1User,
      receiver: donor2User,
      content:
        'No fasting required! Just drink plenty of water and have a light healthy meal 2-3 hours beforehand.',
      applicationId: app1.id,
      isRead: false,
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
    });
    await this.chatMessageRepository.save(hospMsg3);

    console.log('Hemabridge seed completed successfully!');
  }
}
