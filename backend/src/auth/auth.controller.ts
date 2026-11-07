import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserRole, BloodType, Gender } from '../common/enums';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
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
    },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('quick-login/:role')
  async quickLogin(@Param('role') role: UserRole) {
    return this.authService.quickLoginByRole(role);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req: any) {
    return this.authService.getMe(req.user.id);
  }
}
