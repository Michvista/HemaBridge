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
import { RequestsService } from './requests.service';
import { AuthGuard } from '@nestjs/passport';
import { BloodType, UrgencyLevel } from '../common/enums';

@Controller('requests')
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createRequest(
    @Request() req: any,
    @Body()
    body: {
      bloodType: BloodType;
      urgency?: UrgencyLevel;
      hospitalName: string;
      location: string;
      note?: string;
      targetDonorId?: string;
    },
  ) {
    return this.requestsService.createRequest(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-requests')
  async getMyRequests(@Request() req: any) {
    return this.requestsService.getAdvocateRequests(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('matching')
  async getMatchingRequests(@Request() req: any) {
    return this.requestsService.getMatchingDonorRequests(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/respond')
  async respondToRequest(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { action: 'accept' | 'decline' },
  ) {
    return this.requestsService.respondToRequest(id, req.user.id, body.action);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/cancel')
  async cancelRequest(@Request() req: any, @Param('id') id: string) {
    return this.requestsService.cancelRequest(id, req.user.id);
  }
}
