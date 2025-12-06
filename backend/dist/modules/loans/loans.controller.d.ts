import { LoansService } from './loans.service';
export declare class LoansController {
    private readonly loansService;
    constructor(loansService: LoansService);
    createLoan(req: any, body: {
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
    getLoans(req: any): Promise<any>;
    getLoanDetails(req: any, loanId: string): Promise<{
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
    repayLoan(req: any, loanId: string, body: {
        amount: number;
    }): Promise<{
        loan_id: any;
        status: any;
        repaid_amount: number;
    }>;
}
