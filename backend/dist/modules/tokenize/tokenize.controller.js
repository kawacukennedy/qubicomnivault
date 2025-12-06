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
exports.TokenizeController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const tokenize_service_1 = require("./tokenize.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TokenizeController = class TokenizeController {
    tokenizeService;
    constructor(tokenizeService) {
        this.tokenizeService = tokenizeService;
    }
    async tokenize(req, body, files) {
        return this.tokenizeService.tokenize(req.user.userId, body, files);
    }
    async getValuation(jobId) {
        return this.tokenizeService.getValuation(jobId);
    }
    async mint(req, body) {
        return this.tokenizeService.mint(req.user.userId, body);
    }
    async getDocuments(req) {
        return this.tokenizeService.getDocuments(req.user.userId);
    }
    async getOqAssets(req) {
        return this.tokenizeService.getOqAssets(req.user.userId);
    }
};
exports.TokenizeController = TokenizeController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('documents', 10, {
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
                return callback(new common_1.BadRequestException('Only PDF and DOC files are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Upload documents for tokenization' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                amount: { type: 'number' },
                due_date: { type: 'string' },
                documents: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Documents uploaded successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Array]),
    __metadata("design:returntype", Promise)
], TokenizeController.prototype, "tokenize", null);
__decorate([
    (0, common_1.Get)('valuation/:jobId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get valuation result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Valuation retrieved successfully' }),
    __param(0, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TokenizeController.prototype, "getValuation", null);
__decorate([
    (0, common_1.Post)('mint'),
    (0, swagger_1.ApiOperation)({ summary: 'Mint oqAsset token' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'oqAsset minted successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TokenizeController.prototype, "mint", null);
__decorate([
    (0, common_1.Get)('documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user documents' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Documents retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TokenizeController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Get)('oq-assets'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user oqAssets' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'oqAssets retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TokenizeController.prototype, "getOqAssets", null);
exports.TokenizeController = TokenizeController = __decorate([
    (0, swagger_1.ApiTags)('tokenize'),
    (0, common_1.Controller)('tokenize'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tokenize_service_1.TokenizeService])
], TokenizeController);
//# sourceMappingURL=tokenize.controller.js.map