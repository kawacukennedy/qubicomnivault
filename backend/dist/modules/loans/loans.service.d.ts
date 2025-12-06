import { Repository } from 'typeorm';
import { Loan } from '../../entities/loan.entity';
import { oqAsset } from '../../entities/oqAsset.entity';
import { User } from '../../entities/user.entity';
export declare class LoansService {
    private loanRepository;
    private oqAssetRepository;
    private userRepository;
    constructor(loanRepository: Repository<Loan>, oqAssetRepository: Repository<oqAsset>, userRepository: Repository<User>);
    createLoan(userId: string, data: {
        oqAsset_id: string;
        principal_usd: number;
        interest_rate_annual: number;
    }): Promise<{
        loan_id: any;
        principal_usd: any;
        interest_rate_annual: any;
        ltv: any;
        status: any;
        created_at: any;
    }>;
    getLoans(userId: string): Promise<any>;
    repayLoan(userId: string, loanId: string, amount: number): Promise<{
        loan_id: any;
        status: any;
        repaid_amount: number;
    }>;
    getLoanDetails(userId: string, loanId: string): Promise<{
        id: any;
        principal_usd: any;
        interest_rate_annual: any;
        status: any;
        ltv: any;
        accrued_interest_usd: number;
        total_owed_usd: any;
        oqAsset: {
            id: any;
            token_id: any;
            face_value_usd: any;
            document: {
                id: any;
                hash: any;
            };
        };
        created_at: any;
        updated_at: any;
    }>;
}
