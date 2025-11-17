import { Get, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';

import { SignupDto } from './dto/signup.dto';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  register(@Body() registerDto: SignupDto) {
    return this.authService.registerAdmin(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser('userId') userId) {
    return this.authService.getProfile(userId);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req) {
    return this.authService.login(req.user);
  }
}
