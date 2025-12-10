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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenizeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const bull_2 = require("bull");
const document_entity_1 = require("../../entities/document.entity");
const oqAsset_entity_1 = require("../../entities/oqAsset.entity");
const valuationJob_entity_1 = require("../../entities/valuationJob.entity");
const user_entity_1 = require("../../entities/user.entity");
const blockchain_service_1 = require("../blockchain/blockchain.service");
const AWS = __importStar(require("aws-sdk"));
const crypto = __importStar(require("crypto"));
const ethers = __importStar(require("ethers"));
let TokenizeService = class TokenizeService {
    documentRepository;
    oqAssetRepository;
    valuationJobRepository;
    userRepository;
    valuationQueue;
    blockchainService;
    s3;
    constructor(documentRepository, oqAssetRepository, valuationJobRepository, userRepository, valuationQueue, blockchainService) {
        this.documentRepository = documentRepository;
        this.oqAssetRepository = oqAssetRepository;
        this.valuationJobRepository = valuationJobRepository;
        this.userRepository = userRepository;
        this.valuationQueue = valuationQueue;
        this.blockchainService = blockchainService;
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION || 'us-east-1',
        });
    }
    async tokenize(userId, data, files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('At least one file is required');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const uploadedFiles = await Promise.all(files.map(async (file) => {
            const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');
            const key = `documents/${userId}/${Date.now()}-${file.originalname}`;
            await this.s3
                .upload({
                Bucket: process.env.AWS_S3_BUCKET || 'qubic-omnivault',
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            })
                .promise();
            return { key, hash };
        }));
        const document = this.documentRepository.create({
            user_id: userId,
            object_store_key: uploadedFiles[0].key,
            hash: uploadedFiles[0].hash,
            status: 'uploaded',
        });
        const savedDocument = await this.documentRepository.save(document);
        const valuationJob = this.valuationJobRepository.create({
            document_id: savedDocument.id,
            suggested_value: data.amount,
            confidence: 0,
            oracle_sources: [],
            status: 'pending',
        });
        const savedJob = await this.valuationJobRepository.save(valuationJob);
        await this.valuationQueue.add('process-valuation', {
            jobId: savedJob.id,
            documentId: savedDocument.id,
            fileKeys: uploadedFiles.map(f => f.key),
            userData: data,
        });
        return {
            document_id: savedDocument.id,
            valuation_job_id: savedJob.id,
            status: 'processing',
        };
    }
    async getValuation(jobId) {
        const job = await this.valuationJobRepository.findOne({
            where: { id: jobId },
        });
        if (!job) {
            throw new common_1.NotFoundException('Valuation job not found');
        }
        return {
            job_id: job.id,
            suggested_value_usd: job.suggested_value,
            confidence: job.confidence,
            oracle_sources: job.oracle_sources,
            status: job.status,
            manual_review_required: job.status === 'manual_review',
        };
    }
    async mint(userId, data) {
        const document = await this.documentRepository.findOne({
            where: { id: data.document_id, user_id: userId },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        if (document.status !== 'valued') {
            throw new common_1.BadRequestException('Document must be valued before minting');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const maturityDate = new Date();
        maturityDate.setFullYear(maturityDate.getFullYear() + 1);
        const metadata = {
            documentHash: document.hash,
            valuation: Math.floor(data.accepted_value_usd * 100),
            maturityDate: Math.floor(maturityDate.getTime() / 1000),
            assetType: 'invoice',
        };
        const txHash = await this.blockchainService.mintOqAsset(user.wallet_address, (data.accepted_value_usd / 100).toString(), metadata);
        const tokenId = ethers.keccak256(ethers.toUtf8Bytes(`${document.id}-${txHash}`));
        const oqAssetEntity = this.oqAssetRepository.create({
            document_id: document.id,
            token_id: tokenId,
            face_value_usd: data.accepted_value_usd,
            mint_tx_hash: txHash,
            owner_address: user.wallet_address,
        });
        const savedOqAsset = await this.oqAssetRepository.save(oqAssetEntity);
        document.status = 'minted';
        await this.documentRepository.save(document);
        return {
            tx_hash: txHash,
            oqAsset_id: savedOqAsset.id,
            token_id: tokenId,
            face_value_usd: data.accepted_value_usd,
        };
    }
    async getDocuments(userId) {
        const documents = await this.documentRepository.find({
            where: { user_id: userId },
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
        return documents.map(doc => ({
            id: doc.id,
            status: doc.status,
            hash: doc.hash,
            created_at: doc.created_at,
        }));
    }
    async getOqAssets(userId) {
        const oqAssets = await this.oqAssetRepository.find({
            where: { owner_address: await this.getWalletAddress(userId) },
            relations: ['document'],
            order: { created_at: 'DESC' },
        });
        return oqAssets.map(asset => ({
            id: asset.id,
            token_id: asset.token_id,
            face_value_usd: asset.face_value_usd,
            mint_tx_hash: asset.mint_tx_hash,
            owner_address: asset.owner_address,
            document: {
                id: asset.document.id,
                hash: asset.document.hash,
            },
            created_at: asset.created_at,
        }));
    }
    async getWalletAddress(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user.wallet_address;
    }
};
exports.TokenizeService = TokenizeService;
exports.TokenizeService = TokenizeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __param(1, (0, typeorm_1.InjectRepository)(oqAsset_entity_1.oqAsset)),
    __param(2, (0, typeorm_1.InjectRepository)(valuationJob_entity_1.ValuationJob)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, bull_1.InjectQueue)('valuation')),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof bull_2.Queue !== "undefined" && bull_2.Queue) === "function" ? _e : Object, blockchain_service_1.BlockchainService])
], TokenizeService);
//# sourceMappingURL=tokenize.service.js.map