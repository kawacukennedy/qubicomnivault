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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const oqAsset_entity_1 = require("../../entities/oqAsset.entity");
const loan_entity_1 = require("../../entities/loan.entity");
let DashboardService = class DashboardService {
    userRepository;
    oqAssetRepository;
    loanRepository;
    constructor(userRepository, oqAssetRepository, loanRepository) {
        this.userRepository = userRepository;
        this.oqAssetRepository = oqAssetRepository;
        this.loanRepository = loanRepository;
    }
    async getPortfolio(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const oqAssets = await this.oqAssetRepository.find({
            where: { owner_address: user.wallet_address },
        });
        const loans = await this.loanRepository.find({
            where: { user_id: userId },
            relations: ['oqAsset'],
        });
        const oqAssetsValue = oqAssets.reduce((sum, asset) => sum + asset.face_value_usd, 0);
        const loansValue = loans.reduce((sum, loan) => sum + loan.principal_usd, 0);
        const stablecoinsValue = 5000;
        const lpTokensValue = 2500;
        const totalValue = oqAssetsValue + loansValue + stablecoinsValue + lpTokensValue;
        const change24h = (Math.random() - 0.5) * 0.1;
        return {
            total_value_usd: totalValue,
            change_24h_percentage: change24h,
            breakdown: [
                {
                    name: 'oqAssets',
                    value: oqAssetsValue / totalValue,
                    usd_value: oqAssetsValue,
                },
                {
                    name: 'Loans',
                    value: loansValue / totalValue,
                    usd_value: loansValue,
                },
                {
                    name: 'Stablecoins',
                    value: stablecoinsValue / totalValue,
                    usd_value: stablecoinsValue,
                },
                {
                    name: 'LP Tokens',
                    value: lpTokensValue / totalValue,
                    usd_value: lpTokensValue,
                },
            ],
            assets: {
                oqAssets: oqAssets.length,
                active_loans: loans.filter(l => l.status === 'active').length,
                stablecoins_balance: stablecoinsValue,
                lp_positions: 2,
            },
        };
    }
    async getActivityFeed(userId, limit = 20) {
        const activities = [
            {
                id: '1',
                type: 'transaction',
                title: 'Interest Accrued',
                description: 'Interest accrued on loan position',
                amount: 5.23,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                metadata: { loan_id: 'loan-1' },
            },
            {
                id: '2',
                type: 'alert',
                title: 'LTV Threshold Warning',
                description: 'Loan position LTV approaching liquidation threshold',
                amount: null,
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                metadata: { loan_id: 'loan-2', current_ltv: 72 },
            },
            {
                id: '3',
                type: 'transaction',
                title: 'oqAsset Minted',
                description: 'Successfully minted oqAsset from invoice',
                amount: 1000,
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                metadata: { oqAsset_id: 'oq-1', document_id: 'doc-1' },
            },
            {
                id: '4',
                type: 'governance',
                title: 'Proposal Passed',
                description: 'Governance proposal "Reduce fees by 20%" has passed',
                amount: null,
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                metadata: { proposal_id: 'prop-1' },
            },
            {
                id: '5',
                type: 'liquidity',
                title: 'Liquidity Added',
                description: 'Added liquidity to oqAsset/USDC pool',
                amount: 500,
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                metadata: { pool_id: 'pool-1', lp_tokens: 100 },
            },
        ];
        return activities.slice(0, limit).map(activity => ({
            id: activity.id,
            type: activity.type,
            title: activity.title,
            description: activity.description,
            amount: activity.amount,
            timestamp: activity.timestamp,
            metadata: activity.metadata,
        }));
    }
    async getPositions(userId) {
        const loans = await this.loanRepository.find({
            where: { user_id: userId },
            relations: ['oqAsset', 'oqAsset.document'],
            order: { created_at: 'DESC' },
        });
        return loans.map(loan => ({
            id: loan.id,
            asset: `oqAsset: ${loan.oqAsset.document.hash.slice(0, 8)}...`,
            collateral_value: loan.oqAsset.face_value_usd,
            loan_amount: loan.principal_usd,
            ltv: loan.ltv,
            status: loan.status,
            interest_rate: loan.interest_rate_annual,
            created_at: loan.created_at,
        }));
    }
    async getNotifications(userId) {
        return [
            {
                id: '1',
                type: 'warning',
                title: 'High LTV Alert',
                message: 'Your loan position in oqAsset #1234 has reached 75% LTV',
                read: false,
                created_at: new Date(Date.now() - 30 * 60 * 1000),
            },
            {
                id: '2',
                type: 'info',
                title: 'Valuation Complete',
                message: 'Document valuation for Invoice #5678 is now complete',
                read: true,
                created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
        ];
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(oqAsset_entity_1.oqAsset)),
    __param(2, (0, typeorm_1.InjectRepository)(loan_entity_1.Loan)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map