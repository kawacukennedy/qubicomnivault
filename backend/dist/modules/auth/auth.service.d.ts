import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(data: {
        wallet_address: string;
        email?: string;
        referral_code?: string;
    }): Promise<{
        user_id: any;
        jwt: any;
        refresh_token: any;
        user: {
            id: any;
            wallet_address: any;
            email: any;
            q_score: any;
            kyc_status: any;
        };
    }>;
    login(data: {
        wallet_address: string;
        signature: string;
        nonce: string;
    }): Promise<{
        jwt: any;
        refresh_token: any;
        user: {
            id: any;
            wallet_address: any;
            email: any;
            q_score: any;
            kyc_status: any;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        jwt: any;
        refresh_token: any;
    }>;
    getNonce(): Promise<{
        nonce: string;
    }>;
    getProfile(userId: string): Promise<{
        id: any;
        wallet_address: any;
        email: any;
        q_score: any;
        kyc_status: any;
        created_at: any;
    }>;
}
