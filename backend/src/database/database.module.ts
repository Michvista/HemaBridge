import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { DonorProfile } from '../donors/entities/donor-profile.entity';
import { HospitalProfile } from '../hospitals/entities/hospital-profile.entity';
import { BloodRequest } from '../requests/entities/blood-request.entity';
import { DonorApplication } from '../applications/entities/donor-application.entity';
import { ChatMessage } from '../chat/entities/chat-message.entity';
import { Badge } from '../badges/entities/badge.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        const entities = [
          User,
          DonorProfile,
          HospitalProfile,
          BloodRequest,
          DonorApplication,
          ChatMessage,
          Badge,
        ];

        console.log('Connecting to Neon PostgreSQL Database via TypeORM...');
        return {
          type: 'postgres',
          url:
            dbUrl && dbUrl.trim().length > 0
              ? dbUrl
              : 'postgresql://postgres:postgres@localhost:5432/hemabridge', // placeholder until user inputs Neon string
          entities,
          synchronize: true, // Auto-create tables in development
          ssl:
            dbUrl && dbUrl.includes('neon.tech')
              ? { rejectUnauthorized: false }
              : false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
