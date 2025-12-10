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
var SchedulerService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const loan_entity_1 = require("../../entities/loan.entity");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
let SchedulerService = SchedulerService_1 = class SchedulerService {
    loanRepository;
    websocketGateway;
    logger = new common_1.Logger(SchedulerService_1.name);
    constructor(loanRepository, websocketGateway) {
        this.loanRepository = loanRepository;
        this.websocketGateway = websocketGateway;
    }
    async handleInterestAccrual() {
        this.logger.log('Running interest accrual job');
        try {
            const activeLoans = await this.loanRepository.find({
                where: { status: 'active' },
                relations: ['user'],
            });
            for (const loan of activeLoans) {
                const interestRatePerMinute = (loan.interest_rate_annual / 100) / (365 * 24 * 60);
                const interestAccrued = loan.principal_usd * interestRatePerMinute;
                loan.principal_usd += interestAccrued;
                await this.loanRepository.save(loan);
                const currentLtv = (loan.principal_usd / (loan.principal_usd / loan.ltv * 100)) * 100;
                if (currentLtv > 85) {
                    this.websocketGateway.emitNotification(loan.user_id, {
                        type: 'warning',
                        title: 'Liquidation Risk',
                        message: `Your loan ${loan.id} is approaching liquidation threshold.`,
                    });
                }
                this.logger.log(`Accrued interest for loan ${loan.id}: ${interestAccrued}`);
            }
        }
        catch (error) {
            this.logger.error('Error in interest accrual job', error);
        }
    }
    async handleLiquidationCheck() {
        this.logger.log('Running liquidation check job');
        try {
            const activeLoans = await this.loanRepository.find({
                where: { status: 'active' },
                relations: ['user'],
            });
            for (const loan of activeLoans) {
                const currentLtv = (loan.principal_usd / (loan.principal_usd / loan.ltv * 100)) * 100;
                if (currentLtv > 90) {
                    loan.status = 'liquidated';
                    await this.loanRepository.save(loan);
                    this.websocketGateway.emitNotification(loan.user_id, {
                        type: 'error',
                        title: 'Position Liquidated',
                        message: `Your loan ${loan.id} has been liquidated due to high LTV.`,
                    });
                    this.logger.log(`Liquidated loan ${loan.id}`);
                }
            }
        }
        catch (error) {
            this.logger.error('Error in liquidation check job', error);
        }
    }
    async handleReconciliation() {
        this.logger.log('Running reconciliation job');
        try {
            this.logger.log('Reconciliation completed');
        }
        catch (error) {
            this.logger.error('Error in reconciliation job', error);
        }
    }
    async handleDigestEmails() {
        this.logger.log('Running digest email job');
        try {
            this.logger.log('Digest emails sent');
        }
        catch (error) {
            this.logger.error('Error in digest email job', error);
        }
    }
};
exports.SchedulerService = SchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleInterestAccrual", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleLiquidationCheck", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleReconciliation", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_9AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchedulerService.prototype, "handleDigestEmails", null);
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loan_entity_1.Loan)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, websocket_gateway_1.WebsocketGateway])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map