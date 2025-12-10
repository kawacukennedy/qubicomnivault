import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import type { NotificationPayload } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send a notification' })
  @ApiResponse({ status: 200, description: 'Notification sent successfully' })
  async sendNotification(@Body() notification: NotificationPayload) {
    await this.notificationService.sendNotification(notification);
    return { status: 'sent' };
  }

  @Post('test')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send a test notification' })
  @ApiResponse({ status: 200, description: 'Test notification sent' })
  async sendTestNotification(@Request() req) {
    await this.notificationService.sendNotification({
      userId: req.user.userId,
      type: 'email',
      title: 'Test Notification',
      message: 'This is a test notification from Qubic OmniVault.',
    });
    return { status: 'test_sent' };
  }

  @Get('preferences')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user notification preferences' })
  @ApiResponse({ status: 200, description: 'Preferences retrieved successfully' })
  async getPreferences(@Request() req) {
    // TODO: Implement user preferences from database
    return {
      userId: req.user.userId,
      email: true,
      sms: false,
      push: true,
      easyconnect: true,
    };
  }

  @Post('preferences')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user notification preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  async updatePreferences(@Request() req, @Body() preferences: any) {
    // TODO: Save preferences to database
    return {
      userId: req.user.userId,
      ...preferences,
      status: 'updated',
    };
  }
}