import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DonorsService } from './donors.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('donors')
export class DonorsController {
  constructor(private donorsService: DonorsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getMyProfile(@Request() req: any) {
    return this.donorsService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('availability')
  async toggleAvailability(
    @Request() req: any,
    @Body() body: { isAvailable: boolean },
  ) {
    return this.donorsService.toggleAvailability(req.user.id, body.isAvailable);
  }

  @Get('eligible')
  async getEligibleDonors(
    @Query('bloodType') bloodType?: string,
    @Query('area') area?: string,
  ) {
    return this.donorsService.findEligibleDonors({ bloodType, area });
  }

  @Get(':userId')
  async getDonorById(@Param('userId') userId: string) {
    return this.donorsService.getProfile(userId);
  }
}
