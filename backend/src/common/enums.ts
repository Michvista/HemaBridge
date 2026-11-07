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
