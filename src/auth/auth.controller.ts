import {
  Get,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  register(@Body() registerDto: SignupDto, @Req() req) {
    return this.authService.registerAdmin(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body(ValidationPipe) loginDto: LoginDto, @Req() req) {
    return this.authService.login(req.user);
  }
}
