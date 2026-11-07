import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('badges')
export class BadgesController {
  constructor(private badgesService: BadgesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('my-collection')
  async getMyBadges(@Request() req: any) {
    return this.badgesService.getDonorBadges(req.user.id);
  }

  @Get('donor/:donorUserId')
  async getDonorBadgesById(@Param('donorUserId') donorUserId: string) {
    return this.badgesService.getDonorBadges(donorUserId);
  }
}
