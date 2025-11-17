import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // assuming you already have this

import { UserRole } from 'src/constants/user.constants';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/analytics')
  @Roles(UserRole.ADMIN)
  async getTaskAndUserStats(@GetUser('userId') adminId: string) {
    return this.dashboardService.getTaskAnalytics(adminId);
  }

  @Get('/card-stats')
  @Roles(UserRole.ADMIN)
  async getCardStatistics(@GetUser('userId') adminId: string) {
    return this.dashboardService.getCardsStatistics(adminId);
  }
}
