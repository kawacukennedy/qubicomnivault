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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../../entities/user.entity");
const ethers = __importStar(require("ethers"));
let AuthService = class AuthService {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(data) {
        const existingUser = await this.userRepository.findOne({
            where: { wallet_address: data.wallet_address },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const user = this.userRepository.create({
            wallet_address: data.wallet_address,
            email: data.email,
            q_score: 50,
            kyc_status: 'unverified',
        });
        const savedUser = await this.userRepository.save(user);
        const payload = { sub: savedUser.id, wallet: savedUser.wallet_address };
        const jwt = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        return {
            user_id: savedUser.id,
            jwt,
            refresh_token: refreshToken,
            user: {
                id: savedUser.id,
                wallet_address: savedUser.wallet_address,
                email: savedUser.email,
                q_score: savedUser.q_score,
                kyc_status: savedUser.kyc_status,
            },
        };
    }
    async login(data) {
        const message = `Login to Qubic OmniVault with nonce: ${data.nonce}`;
        const recoveredAddress = ethers.verifyMessage(message, data.signature);
        if (recoveredAddress.toLowerCase() !== data.wallet_address.toLowerCase()) {
            throw new common_1.UnauthorizedException('Invalid signature');
        }
        let user = await this.userRepository.findOne({
            where: { wallet_address: data.wallet_address },
        });
        if (!user) {
            user = this.userRepository.create({
                wallet_address: data.wallet_address,
                q_score: 50,
                kyc_status: 'unverified',
            });
            user = await this.userRepository.save(user);
        }
        const payload = { sub: user.id, wallet: user.wallet_address };
        const jwt = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        return {
            jwt,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                wallet_address: user.wallet_address,
                email: user.email,
                q_score: user.q_score,
                kyc_status: user.kyc_status,
            },
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const newJwt = this.jwtService.sign({ sub: payload.sub, wallet: payload.wallet });
            const newRefresh = this.jwtService.sign({ sub: payload.sub, wallet: payload.wallet }, { expiresIn: '30d' });
            return { jwt: newJwt, refresh_token: newRefresh };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async getNonce() {
        const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return { nonce };
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            id: user.id,
            wallet_address: user.wallet_address,
            email: user.email,
            q_score: user.q_score,
            kyc_status: user.kyc_status,
            created_at: user.created_at,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map