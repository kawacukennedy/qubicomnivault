import { NotificationService } from './notification.service';
import type { NotificationPayload } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    sendNotification(notification: NotificationPayload): Promise<{
        status: string;
    }>;
    sendTestNotification(req: any): Promise<{
        status: string;
    }>;
    getPreferences(req: any): Promise<{
        userId: any;
        email: boolean;
        sms: boolean;
        push: boolean;
        easyconnect: boolean;
    }>;
    updatePreferences(req: any, preferences: any): Promise<any>;
}
