import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('portfolio')
  @ApiOperation({ summary: 'Get user portfolio overview' })
  @ApiResponse({ status: 200, description: 'Portfolio data retrieved successfully' })
  async getPortfolio(@Request() req) {
    return this.dashboardService.getPortfolio(req.user.userId);
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get user activity feed' })
  @ApiResponse({ status: 200, description: 'Activity feed retrieved successfully' })
  async getActivityFeed(
    @Request() req,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit) : 20;
    return this.dashboardService.getActivityFeed(req.user.userId, limitNum);
  }

  @Get('positions')
  @ApiOperation({ summary: 'Get user positions' })
  @ApiResponse({ status: 200, description: 'Positions retrieved successfully' })
  async getPositions(@Request() req) {
    return this.dashboardService.getPositions(req.user.userId);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async getNotifications(@Request() req) {
    return this.dashboardService.getNotifications(req.user.userId);
  }
}