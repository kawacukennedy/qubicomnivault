"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notification_service_1 = require("./notification.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async sendNotification(notification) {
        await this.notificationService.sendNotification(notification);
        return { status: 'sent' };
    }
    async sendTestNotification(req) {
        await this.notificationService.sendNotification({
            userId: req.user.userId,
            type: 'email',
            title: 'Test Notification',
            message: 'This is a test notification from Qubic OmniVault.',
        });
        return { status: 'test_sent' };
    }
    async getPreferences(req) {
        return {
            userId: req.user.userId,
            email: true,
            sms: false,
            push: true,
            easyconnect: true,
        };
    }
    async updatePreferences(req, preferences) {
        return {
            userId: req.user.userId,
            ...preferences,
            status: 'updated',
        };
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Post)('send'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Send a notification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification sent successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Post)('test'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Send a test notification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test notification sent' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "sendTestNotification", null);
__decorate([
    (0, common_1.Get)('preferences'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get user notification preferences' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferences retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getPreferences", null);
__decorate([
    (0, common_1.Post)('preferences'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update user notification preferences' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preferences updated successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "updatePreferences", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map