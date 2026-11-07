import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('hospitals')
export class HospitalsController {
  constructor(private hospitalsService: HospitalsService) {}

  @Get()
  async getAllHospitals() {
    return this.hospitalsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-profile')
  async getMyHospitalProfile(@Request() req: any) {
    return this.hospitalsService.findByUserId(req.user.id);
  }

  @Get(':id')
  async getHospitalById(@Param('id') id: string) {
    return this.hospitalsService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('status')
  async updateStatus(
    @Request() req: any,
    @Body()
    body: {
      isDeskOpen?: boolean;
      requestDonorsActive?: boolean;
      neededBloodTypes?: string[];
    },
  ) {
    return this.hospitalsService.updateStatus(req.user.id, body);
  }
}
