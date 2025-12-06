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
exports.LoansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const loan_entity_1 = require("../../entities/loan.entity");
const oqAsset_entity_1 = require("../../entities/oqAsset.entity");
const user_entity_1 = require("../../entities/user.entity");
let LoansService = class LoansService {
    loanRepository;
    oqAssetRepository;
    userRepository;
    constructor(loanRepository, oqAssetRepository, userRepository) {
        this.loanRepository = loanRepository;
        this.oqAssetRepository = oqAssetRepository;
        this.userRepository = userRepository;
    }
    async createLoan(userId, data) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const oqAssetEntity = await this.oqAssetRepository.findOne({
            where: { id: data.oqAsset_id, owner_address: user.wallet_address },
        });
        if (!oqAssetEntity) {
            throw new common_1.NotFoundException('oqAsset not found or not owned by user');
        }
        const existingLoan = await this.loanRepository.findOne({
            where: { oqAsset_id: data.oqAsset_id, status: 'active' },
        });
        if (existingLoan) {
            throw new common_1.BadRequestException('oqAsset is already used in an active loan');
        }
        const ltv = (data.principal_usd / oqAssetEntity.face_value_usd) * 100;
        if (ltv > 80) {
            throw new common_1.BadRequestException('Loan-to-Value ratio cannot exceed 80%');
        }
        const loan = this.loanRepository.create({
            user_id: userId,
            oqAsset_id: data.oqAsset_id,
            principal_usd: data.principal_usd,
            interest_rate_annual: data.interest_rate_annual,
            status: 'active',
            ltv,
        });
        const savedLoan = await this.loanRepository.save(loan);
        return {
            loan_id: savedLoan.id,
            principal_usd: savedLoan.principal_usd,
            interest_rate_annual: savedLoan.interest_rate_annual,
            ltv: savedLoan.ltv,
            status: savedLoan.status,
            created_at: savedLoan.created_at,
        };
    }
    async getLoans(userId) {
        const loans = await this.loanRepository.find({
            where: { user_id: userId },
            relations: ['oqAsset', 'oqAsset.document'],
            order: { created_at: 'DESC' },
        });
        return loans.map(loan => ({
            id: loan.id,
            principal_usd: loan.principal_usd,
            interest_rate_annual: loan.interest_rate_annual,
            status: loan.status,
            ltv: loan.ltv,
            oqAsset: {
                id: loan.oqAsset.id,
                token_id: loan.oqAsset.token_id,
                face_value_usd: loan.oqAsset.face_value_usd,
                document: {
                    id: loan.oqAsset.document.id,
                    hash: loan.oqAsset.document.hash,
                },
            },
            created_at: loan.created_at,
            updated_at: loan.updated_at,
        }));
    }
    async repayLoan(userId, loanId, amount) {
        const loan = await this.loanRepository.findOne({
            where: { id: loanId, user_id: userId },
            relations: ['oqAsset'],
        });
        if (!loan) {
            throw new common_1.NotFoundException('Loan not found');
        }
        if (loan.status !== 'active') {
            throw new common_1.BadRequestException('Loan is not active');
        }
        if (amount >= loan.principal_usd) {
            loan.status = 'repaid';
            await this.loanRepository.save(loan);
        }
        return {
            loan_id: loan.id,
            status: loan.status,
            repaid_amount: amount,
        };
    }
    async getLoanDetails(userId, loanId) {
        const loan = await this.loanRepository.findOne({
            where: { id: loanId, user_id: userId },
            relations: ['oqAsset', 'oqAsset.document', 'user'],
        });
        if (!loan) {
            throw new common_1.NotFoundException('Loan not found');
        }
        const now = new Date();
        const daysElapsed = Math.floor((now.getTime() - loan.created_at.getTime()) / (1000 * 60 * 60 * 24));
        const accruedInterest = (loan.principal_usd * loan.interest_rate_annual * daysElapsed) / 365;
        return {
            id: loan.id,
            principal_usd: loan.principal_usd,
            interest_rate_annual: loan.interest_rate_annual,
            status: loan.status,
            ltv: loan.ltv,
            accrued_interest_usd: accruedInterest,
            total_owed_usd: loan.principal_usd + accruedInterest,
            oqAsset: {
                id: loan.oqAsset.id,
                token_id: loan.oqAsset.token_id,
                face_value_usd: loan.oqAsset.face_value_usd,
                document: {
                    id: loan.oqAsset.document.id,
                    hash: loan.oqAsset.document.hash,
                },
            },
            created_at: loan.created_at,
            updated_at: loan.updated_at,
        };
    }
};
exports.LoansService = LoansService;
exports.LoansService = LoansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loan_entity_1.Loan)),
    __param(1, (0, typeorm_1.InjectRepository)(oqAsset_entity_1.oqAsset)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], LoansService);
//# sourceMappingURL=loans.service.js.map