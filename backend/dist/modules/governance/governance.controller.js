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
exports.GovernanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const governance_service_1 = require("./governance.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let GovernanceController = class GovernanceController {
    governanceService;
    constructor(governanceService) {
        this.governanceService = governanceService;
    }
    async getProposals() {
        return this.governanceService.getProposals();
    }
    async getProposalById(proposalId) {
        return this.governanceService.getProposalById(proposalId);
    }
    async voteOnProposal(req, proposalId, body) {
        return this.governanceService.voteOnProposal(req.user.userId, proposalId, body.vote);
    }
    async createProposal(req, body) {
        return this.governanceService.createProposal(req.user.userId, body);
    }
    async getUserVotingPower(req) {
        return this.governanceService.getUserVotingPower(req.user.userId);
    }
};
exports.GovernanceController = GovernanceController;
__decorate([
    (0, common_1.Get)('proposals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all proposals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Proposals retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "getProposals", null);
__decorate([
    (0, common_1.Get)('proposals/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get proposal details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Proposal details retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "getProposalById", null);
__decorate([
    (0, common_1.Post)('proposals/:id/vote'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Vote on a proposal' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vote cast successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "voteOnProposal", null);
__decorate([
    (0, common_1.Post)('proposals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new proposal' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Proposal created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "createProposal", null);
__decorate([
    (0, common_1.Get)('voting-power'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get user voting power' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voting power retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GovernanceController.prototype, "getUserVotingPower", null);
exports.GovernanceController = GovernanceController = __decorate([
    (0, swagger_1.ApiTags)('governance'),
    (0, common_1.Controller)('governance'),
    __metadata("design:paramtypes", [governance_service_1.GovernanceService])
], GovernanceController);
//# sourceMappingURL=governance.controller.js.map