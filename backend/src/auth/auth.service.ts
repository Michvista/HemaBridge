import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { DonorProfile } from '../donors/entities/donor-profile.entity';
import { HospitalProfile } from '../hospitals/entities/hospital-profile.entity';
import { UserRole, BloodType, Gender } from '../common/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DonorProfile)
    private donorProfileRepository: Repository<DonorProfile>,
    @InjectRepository(HospitalProfile)
    private hospitalProfileRepository: Repository<HospitalProfile>,
    private jwtService: JwtService,
  ) {}

  async register(dto: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    bloodType?: BloodType;
    gender?: Gender;
    area?: string;
    hospitalName?: string;
    hospitalAddress?: string;
    operatingLicence?: string;
  }) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      phone: dto.phone || '',
      role: dto.role,
    });

    const savedUser = await this.userRepository.save(user);

    if (dto.role === UserRole.DONOR) {
      const donor = this.donorProfileRepository.create({
        user: savedUser,
        bloodType: dto.bloodType || BloodType.O_POS,
        gender: dto.gender || Gender.MALE,
        area: dto.area || 'Ikeja, Lagos',
        isAvailable: true,
        lastDonationAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago (eligible)
        badgeEarnedCount: 1,
      });
      await this.donorProfileRepository.save(donor);
    } else if (dto.role === UserRole.HOSPITAL) {
      const hospital = this.hospitalProfileRepository.create({
        user: savedUser,
        name: dto.hospitalName || dto.name,
        address: dto.hospitalAddress || 'Idi-Araba, Surulere, Lagos',
        operatingLicence: dto.operatingLicence || 'HEFAMAA-LG-2024-89',
        distance: '2.5 km',
        eta: '10 min',
        openingTime: '08:00',
        closingTime: '18:00',
        neededBloodTypes: ['O+', 'O-', 'A-'],
        isDeskOpen: true,
        requestDonorsActive: true,
      });
      await this.hospitalProfileRepository.save(hospital);
    }

    return this.buildAuthResponse(savedUser);
  }

  async login(email: string, pass: string) {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase().trim() },
      relations: ['donorProfile', 'hospitalProfile'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(user);
  }

  async quickLoginByRole(role: UserRole) {
    const user = await this.userRepository.findOne({
      where: { role },
      relations: ['donorProfile', 'hospitalProfile'],
    });

    if (!user) {
      throw new BadRequestException(`No dummy user found for role: ${role}`);
    }

    return this.buildAuthResponse(user);
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['donorProfile', 'hospitalProfile'],
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private async buildAuthResponse(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const fullUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['donorProfile', 'hospitalProfile'],
    });

    const { passwordHash, ...safeUser } = fullUser;

    return {
      accessToken,
      user: safeUser,
    };
  }
}
