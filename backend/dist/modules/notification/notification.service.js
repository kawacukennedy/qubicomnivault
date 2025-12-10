"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NotificationService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const twilio = __importStar(require("twilio"));
const axios_1 = __importDefault(require("axios"));
let NotificationService = NotificationService_1 = class NotificationService {
    configService;
    logger = new common_1.Logger(NotificationService_1.name);
    emailTransporter;
    twilioClient;
    constructor(configService) {
        this.configService = configService;
        this.initializeServices();
    }
    initializeServices() {
        const smtpHost = this.configService.get('SMTP_HOST');
        const smtpPort = this.configService.get('SMTP_PORT', 587);
        const smtpUser = this.configService.get('SMTP_USER');
        const smtpPass = this.configService.get('SMTP_PASS');
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
        const twilioSid = this.configService.get('TWILIO_SID');
        const twilioToken = this.configService.get('TWILIO_TOKEN');
        if (twilioSid && twilioToken) {
            this.twilioClient = twilio(twilioSid, twilioToken);
            this.logger.log('SMS service initialized');
        }
    }
    async sendNotification(notification) {
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
        }
        catch (error) {
            this.logger.error(`Failed to send ${notification.type} notification`, error);
            throw error;
        }
    }
    async sendEmail(notification) {
        if (!this.emailTransporter) {
            this.logger.warn('Email service not configured, skipping email notification');
            return;
        }
        const userEmail = await this.getUserEmail(notification.userId);
        if (!userEmail) {
            this.logger.warn(`No email found for user ${notification.userId}`);
            return;
        }
        const mailOptions = {
            from: this.configService.get('SMTP_FROM', 'noreply@qubicomnivault.com'),
            to: userEmail,
            subject: notification.title,
            text: notification.message,
            html: `<h2>${notification.title}</h2><p>${notification.message}</p>`,
        };
        await this.emailTransporter.sendMail(mailOptions);
        this.logger.log(`Email sent to ${userEmail}`);
    }
    async sendSMS(notification) {
        if (!this.twilioClient) {
            this.logger.warn('SMS service not configured, skipping SMS notification');
            return;
        }
        const userPhone = await this.getUserPhone(notification.userId);
        if (!userPhone) {
            this.logger.warn(`No phone number found for user ${notification.userId}`);
            return;
        }
        const twilioPhone = this.configService.get('TWILIO_PHONE_NUMBER');
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
    async sendPushNotification(notification) {
        this.logger.log(`Push notification would be sent to user ${notification.userId}: ${notification.title}`);
    }
    async sendEasyConnect(notification) {
        const easyConnectUrl = this.configService.get('EASYCONNECT_URL');
        const easyConnectToken = this.configService.get('EASYCONNECT_TOKEN');
        if (!easyConnectUrl || !easyConnectToken) {
            this.logger.warn('EasyConnect not configured, skipping notification');
            return;
        }
        try {
            await axios_1.default.post(easyConnectUrl, {
                userId: notification.userId,
                title: notification.title,
                message: notification.message,
                data: notification.data,
            }, {
                headers: {
                    Authorization: `Bearer ${easyConnectToken}`,
                    'Content-Type': 'application/json',
                },
            });
            this.logger.log(`EasyConnect notification sent to user ${notification.userId}`);
        }
        catch (error) {
            this.logger.error('Failed to send EasyConnect notification', error);
            throw error;
        }
    }
    async getUserEmail(userId) {
        const mockEmails = {
            'user1': 'user1@example.com',
            'user2': 'user2@example.com',
        };
        return mockEmails[userId] || null;
    }
    async getUserPhone(userId) {
        const mockPhones = {
            'user1': '+1234567890',
            'user2': '+0987654321',
        };
        return mockPhones[userId] || null;
    }
    async notifyLoanCreated(userId, loanId, amount) {
        await this.sendNotification({
            userId,
            type: 'email',
            title: 'Loan Created Successfully',
            message: `Your loan ${loanId} for ${amount} has been created and is now active.`,
        });
    }
    async notifyLiquidationWarning(userId, assetId, ltv) {
        await this.sendNotification({
            userId,
            type: 'sms',
            title: 'Liquidation Warning',
            message: `Your position for asset ${assetId} has reached ${ltv}% LTV. Consider adding collateral or repaying loan.`,
        });
    }
    async notifyValuationComplete(userId, assetId, value) {
        await this.sendNotification({
            userId,
            type: 'push',
            title: 'Asset Valuation Complete',
            message: `Valuation for asset ${assetId} is now complete. Current value: ${value}`,
        });
    }
    async notifyProposalCreated(userId, proposalId, title) {
        await this.sendNotification({
            userId,
            type: 'easyconnect',
            title: 'New Governance Proposal',
            message: `A new proposal "${title}" has been created. Proposal ID: ${proposalId}`,
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], NotificationService);
//# sourceMappingURL=notification.service.js.map