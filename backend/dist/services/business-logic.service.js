"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessLogicService = void 0;
const common_1 = require("@nestjs/common");
let BusinessLogicService = class BusinessLogicService {
    calculateLTV(faceValueUsd, loanPrincipalUsd, haircut) {
        const adjustedValue = faceValueUsd * (1 - haircut);
        const ltv = loanPrincipalUsd / adjustedValue;
        return Math.round(ltv * 10000) / 10000;
    }
    determineHaircut(confidence, assetClass) {
        let base = 0.12;
        if (assetClass === 'invoice')
            base = 0.08;
        if (confidence < 0.6)
            base += 0.07;
        return Math.max(0.03, Math.min(base, 0.5));
    }
    async processMint(documentId, acceptedValue, userId) {
        return { txHash: '0x123...', oqAssetId: 'oq-1' };
    }
    async accrueInterestCron() {
        console.log('Accruing interest...');
    }
    async handleLiquidation(loanId) {
        console.log('Handling liquidation for loan:', loanId);
    }
    async updateQScore(userId, event) {
        console.log('Updating Q-Score for user:', userId, 'event:', event);
    }
};
exports.BusinessLogicService = BusinessLogicService;
exports.BusinessLogicService = BusinessLogicService = __decorate([
    (0, common_1.Injectable)()
], BusinessLogicService);
//# sourceMappingURL=business-logic.service.js.map