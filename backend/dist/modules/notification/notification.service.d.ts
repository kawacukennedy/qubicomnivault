import { ConfigService } from '@nestjs/config';
export interface NotificationPayload {
    userId: string;
    type: 'email' | 'sms' | 'push' | 'easyconnect';
    title: string;
    message: string;
    data?: any;
}
export declare class NotificationService {
    private configService;
    private readonly logger;
    private emailTransporter;
    private twilioClient;
    constructor(configService: ConfigService);
    private initializeServices;
    sendNotification(notification: NotificationPayload): Promise<void>;
    private sendEmail;
    private sendSMS;
    private sendPushNotification;
    private sendEasyConnect;
    private getUserEmail;
    private getUserPhone;
    notifyLoanCreated(userId: string, loanId: string, amount: string): Promise<void>;
    notifyLiquidationWarning(userId: string, assetId: string, ltv: number): Promise<void>;
    notifyValuationComplete(userId: string, assetId: string, value: string): Promise<void>;
    notifyProposalCreated(userId: string, proposalId: string, title: string): Promise<void>;
}
