import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getNonce(): Promise<{
        nonce: string;
    }>;
    register(body: {
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
    login(body: {
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
    refresh(body: {
        refresh_token: string;
    }): Promise<{
        jwt: any;
        refresh_token: any;
    }>;
    getProfile(req: any): Promise<{
        id: any;
        wallet_address: any;
        email: any;
        q_score: any;
        kyc_status: any;
        created_at: any;
    }>;
}
