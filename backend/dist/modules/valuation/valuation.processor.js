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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ValuationProcessor_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValuationProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const bull_2 = require("bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const valuationJob_entity_1 = require("../../entities/valuationJob.entity");
const document_entity_1 = require("../../entities/document.entity");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
const AWS = __importStar(require("aws-sdk"));
let ValuationProcessor = ValuationProcessor_1 = class ValuationProcessor {
    valuationJobRepository;
    documentRepository;
    websocketGateway;
    logger = new common_1.Logger(ValuationProcessor_1.name);
    s3;
    constructor(valuationJobRepository, documentRepository, websocketGateway) {
        this.valuationJobRepository = valuationJobRepository;
        this.documentRepository = documentRepository;
        this.websocketGateway = websocketGateway;
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION || 'us-east-1',
        });
    }
    async handleValuation(job) {
        const { jobId, documentId, fileKeys, userData } = job.data;
        this.logger.log(`Processing valuation job ${jobId} for document ${documentId}`);
        try {
            await this.valuationJobRepository.update(jobId, { status: 'pending' });
            this.websocketGateway.emitValuationUpdate(jobId, {
                status: 'processing',
                progress: 10,
                message: 'Analyzing document content...',
            });
            await this.delay(2000);
            this.websocketGateway.emitValuationUpdate(jobId, {
                status: 'processing',
                progress: 30,
                message: 'Extracting financial data...',
            });
            await this.delay(3000);
            this.websocketGateway.emitValuationUpdate(jobId, {
                status: 'processing',
                progress: 60,
                message: 'Consulting oracle sources...',
            });
            const oracleSources = [
                { name: 'Chainlink', value: userData.amount * 0.95, confidence: 0.85 },
                { name: 'Custom API', value: userData.amount * 1.02, confidence: 0.78 },
                { name: 'Market Data', value: userData.amount * 0.98, confidence: 0.92 },
            ];
            await this.delay(2000);
            this.websocketGateway.emitValuationUpdate(jobId, {
                status: 'processing',
                progress: 90,
                message: 'Finalizing valuation...',
            });
            const totalWeight = oracleSources.reduce((sum, oracle) => sum + oracle.confidence, 0);
            const suggestedValue = oracleSources.reduce((sum, oracle) => sum + (oracle.value * oracle.confidence), 0) / totalWeight;
            const averageConfidence = totalWeight / oracleSources.length;
            await this.valuationJobRepository.update(jobId, {
                suggested_value: Math.round(suggestedValue * 100) / 100,
                confidence: Math.round(averageConfidence * 100) / 100,
                oracle_sources: oracleSources,
                status: averageConfidence > 0.7 ? 'done' : 'manual_review',
            });
            await this.documentRepository.update(documentId, {
                status: averageConfidence > 0.7 ? 'valued' : 'uploaded',
            });
            this.websocketGateway.emitValuationUpdate(jobId, {
                status: 'completed',
                progress: 100,
                message: 'Valuation completed',
                result: {
                    suggested_value_usd: Math.round(suggestedValue * 100) / 100,
                    confidence: Math.round(averageConfidence * 100) / 100,
                    oracle_sources: oracleSources,
                    manual_review_required: averageConfidence <= 0.7,
                },
            });
            this.logger.log(`Valuation job ${jobId} completed successfully`);
        }
        catch (error) {
            this.logger.error(`Error processing valuation job ${jobId}:`, error);
            await this.valuationJobRepository.update(jobId, {
                status: 'manual_review',
                oracle_sources: [{ name: 'Error', value: userData.amount, confidence: 0 }],
            });
            this.websocketGateway.emitValuationUpdate(jobId, {
                status: 'error',
                progress: 0,
                message: 'Valuation failed, requires manual review',
                error: error.message,
            });
        }
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.ValuationProcessor = ValuationProcessor;
__decorate([
    (0, bull_1.Process)('process-valuation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof bull_2.Job !== "undefined" && bull_2.Job) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ValuationProcessor.prototype, "handleValuation", null);
exports.ValuationProcessor = ValuationProcessor = ValuationProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, bull_1.Processor)('valuation'),
    __param(0, (0, typeorm_1.InjectRepository)(valuationJob_entity_1.ValuationJob)),
    __param(1, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, websocket_gateway_1.WebsocketGateway])
], ValuationProcessor);
//# sourceMappingURL=valuation.processor.js.map