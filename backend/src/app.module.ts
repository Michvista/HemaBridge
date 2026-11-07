import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { DonorsModule } from './donors/donors.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { RequestsModule } from './requests/requests.module';
import { ApplicationsModule } from './applications/applications.module';
import { ChatModule } from './chat/chat.module';
import { BadgesModule } from './badges/badges.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    AuthModule,
    DonorsModule,
    HospitalsModule,
    RequestsModule,
    ApplicationsModule,
    ChatModule,
    BadgesModule,
    SeedModule,
  ],
})
export class AppModule {}
