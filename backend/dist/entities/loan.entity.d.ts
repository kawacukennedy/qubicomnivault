import { User } from './user.entity';
import { oqAsset } from './oqAsset.entity';
export declare class Loan {
    id: string;
    user_id: string;
    user: User;
    oqAsset_id: string;
    oqAsset: oqAsset;
    principal_usd: number;
    interest_rate_annual: number;
    status: string;
    ltv: number;
    created_at: Date;
    updated_at: Date;
}
