import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as twilio from 'twilio';
import axios from 'axios';

export interface NotificationPayload {
  userId: string;
  type: 'email' | 'sms' | 'push' | 'easyconnect';
  title: string;
  message: string;
  data?: any;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private emailTransporter: nodemailer.Transporter;
  private twilioClient: twilio.Twilio;

  constructor(private configService: ConfigService) {
    this.initializeServices();
  }

  private initializeServices() {
    // Initialize email transporter
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');

    if (smtpHost && smtpUser && smtpPass) {
      this.emailTransporter = nodemailer.createTransporter({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.logger.log('Email service initialized');
    }

    // Initialize Twilio for SMS
    const twilioSid = this.configService.get<string>('TWILIO_SID');
    const twilioToken = this.configService.get<string>('TWILIO_TOKEN');

    if (twilioSid && twilioToken) {
      this.twilioClient = twilio(twilioSid, twilioToken);
      this.logger.log('SMS service initialized');
    }
  }

  async sendNotification(notification: NotificationPayload): Promise<void> {
    try {
      switch (notification.type) {
        case 'email':
          await this.sendEmail(notification);
          break;
        case 'sms':
          await this.sendSMS(notification);
          break;
        case 'push':
          await this.sendPushNotification(notification);
          break;
        case 'easyconnect':
          await this.sendEasyConnect(notification);
          break;
        default:
          this.logger.warn(`Unknown notification type: ${notification.type}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send ${notification.type} notification`, error);
      throw error;
    }
  }

  private async sendEmail(notification: NotificationPayload): Promise<void> {
    if (!this.emailTransporter) {
      this.logger.warn('Email service not configured, skipping email notification');
      return;
    }

    // TODO: Get user email from database
    const userEmail = await this.getUserEmail(notification.userId);
    if (!userEmail) {
      this.logger.warn(`No email found for user ${notification.userId}`);
      return;
    }

    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM', 'noreply@qubicomnivault.com'),
      to: userEmail,
      subject: notification.title,
      text: notification.message,
      html: `<h2>${notification.title}</h2><p>${notification.message}</p>`,
    };

    await this.emailTransporter.sendMail(mailOptions);
    this.logger.log(`Email sent to ${userEmail}`);
  }

  private async sendSMS(notification: NotificationPayload): Promise<void> {
    if (!this.twilioClient) {
      this.logger.warn('SMS service not configured, skipping SMS notification');
      return;
    }

    // TODO: Get user phone from database
    const userPhone = await this.getUserPhone(notification.userId);
    if (!userPhone) {
      this.logger.warn(`No phone number found for user ${notification.userId}`);
      return;
    }

    const twilioPhone = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    if (!twilioPhone) {
      this.logger.error('Twilio phone number not configured');
      return;
    }

    await this.twilioClient.messages.create({
      body: `${notification.title}: ${notification.message}`,
      from: twilioPhone,
      to: userPhone,
    });

    this.logger.log(`SMS sent to ${userPhone}`);
  }

  private async sendPushNotification(notification: NotificationPayload): Promise<void> {
    // TODO: Implement push notification service (e.g., Firebase, OneSignal)
    // For now, just log
    this.logger.log(`Push notification would be sent to user ${notification.userId}: ${notification.title}`);
  }

  private async sendEasyConnect(notification: NotificationPayload): Promise<void> {
    // EasyConnect integration - assuming it's a messaging service
    const easyConnectUrl = this.configService.get<string>('EASYCONNECT_URL');
    const easyConnectToken = this.configService.get<string>('EASYCONNECT_TOKEN');

    if (!easyConnectUrl || !easyConnectToken) {
      this.logger.warn('EasyConnect not configured, skipping notification');
      return;
    }

    try {
      await axios.post(
        easyConnectUrl,
        {
          userId: notification.userId,
          title: notification.title,
          message: notification.message,
          data: notification.data,
        },
        {
          headers: {
            Authorization: `Bearer ${easyConnectToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.log(`EasyConnect notification sent to user ${notification.userId}`);
    } catch (error) {
      this.logger.error('Failed to send EasyConnect notification', error);
      throw error;
    }
  }

  // Helper methods - TODO: Implement with actual database queries
  private async getUserEmail(userId: string): Promise<string | null> {
    // Mock implementation - replace with database query
    const mockEmails = {
      'user1': 'user1@example.com',
      'user2': 'user2@example.com',
    };
    return mockEmails[userId] || null;
  }

  private async getUserPhone(userId: string): Promise<string | null> {
    // Mock implementation - replace with database query
    const mockPhones = {
      'user1': '+1234567890',
      'user2': '+0987654321',
    };
    return mockPhones[userId] || null;
  }

  // Predefined notification templates
  async notifyLoanCreated(userId: string, loanId: string, amount: string): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'email',
      title: 'Loan Created Successfully',
      message: `Your loan ${loanId} for ${amount} has been created and is now active.`,
    });
  }

  async notifyLiquidationWarning(userId: string, assetId: string, ltv: number): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'sms',
      title: 'Liquidation Warning',
      message: `Your position for asset ${assetId} has reached ${ltv}% LTV. Consider adding collateral or repaying loan.`,
    });
  }

  async notifyValuationComplete(userId: string, assetId: string, value: string): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'push',
      title: 'Asset Valuation Complete',
      message: `Valuation for asset ${assetId} is now complete. Current value: ${value}`,
    });
  }

  async notifyProposalCreated(userId: string, proposalId: string, title: string): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'easyconnect',
      title: 'New Governance Proposal',
      message: `A new proposal "${title}" has been created. Proposal ID: ${proposalId}`,
    });
  }
}