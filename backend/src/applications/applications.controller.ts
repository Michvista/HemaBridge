import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { AuthGuard } from '@nestjs/passport';
import { BloodType } from '../common/enums';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('apply')
  async applyToHospital(
    @Request() req: any,
    @Body() body: { hospitalId: string; bloodType: BloodType },
  ) {
    return this.applicationsService.applyToHospital(
      req.user.id,
      body.hospitalId,
      body.bloodType,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-applications')
  async getMyApplications(@Request() req: any) {
    return this.applicationsService.getDonorApplications(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('hospital-queue')
  async getHospitalQueue(@Request() req: any) {
    return this.applicationsService.getHospitalQueue(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/schedule-screening')
  async scheduleScreening(
    @Param('id') id: string,
    @Body() body: { screeningDate: string; screeningTime: string },
  ) {
    return this.applicationsService.scheduleScreening(
      id,
      body.screeningDate,
      body.screeningTime,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/complete')
  async completeDonation(@Param('id') id: string) {
    return this.applicationsService.completeDonationAndAwardBadge(id);
  }
}
