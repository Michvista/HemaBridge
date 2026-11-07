export enum UserRole {
  DONOR = 'donor',
  ADVOCATE = 'advocate',
  HOSPITAL = 'hospital',
  ADMIN = 'admin',
}

export enum BloodType {
  O_POS = 'O+',
  O_NEG = 'O-',
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  SCREENING_SCHEDULED = 'screening_scheduled',
  COMPLETED = 'completed',
  DECLINED = 'declined',
}

export enum UrgencyLevel {
  EMERGENCY = 'emergency',
  URGENT = 'urgent',
  NORMAL = 'normal',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  donorProfile?: DonorProfile;
  hospitalProfile?: HospitalProfile;
}

export interface DonorProfile {
  id: string;
  bloodType: BloodType;
  gender: Gender;
  area: string;
  isAvailable: boolean;
  lastDonationAt?: string;
  badgeEarnedCount: number;
  eligibility?: {
    eligible: boolean;
    daysRemaining: number;
    intervalMonths: number;
    nextEligibleAt: string;
    message: string;
  };
}

export interface HospitalProfile {
  id: string;
  name: string;
  address: string;
  distance: string;
  eta: string;
  openingTime: string;
  closingTime: string;
  neededBloodTypes: string[];
  isDeskOpen: boolean;
  requestDonorsActive: boolean;
  operatingLicence?: string;
}

export interface BloodRequest {
  id: string;
  bloodType: BloodType;
  urgency: UrgencyLevel;
  hospitalName: string;
  location: string;
  note?: string;
  status: RequestStatus;
  advocate?: User;
  matchedDonor?: User;
  createdAt: string;
}

export interface DonorApplication {
  id: string;
  donor: User;
  hospital: HospitalProfile;
  bloodType: BloodType;
  status: ApplicationStatus;
  screeningDate?: string;
  screeningTime?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: User;
  receiver: User;
  content: string;
  requestId?: string;
  applicationId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ConversationThread {
  otherUser: {
    id: string;
    name: string;
    role: UserRole;
    phone?: string;
    bloodType?: BloodType;
    hospitalName?: string;
  };
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
}
