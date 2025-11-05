import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // assuming you already have this
import { UserRole } from 'src/constants/user.constants';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/analytics')
  @Roles(UserRole.ADMIN)
  async getTaskAndUserStats(@Req() req) {
    return this.dashboardService.getTaskAnalytics(req.user.userId);
  }

  @Get('/card-stats')
  @Roles(UserRole.ADMIN)
  async getCardStatistics(@Req() req) {
    return this.dashboardService.getCardsStatistics(req.user.userId);
  }
}
