import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getPortfolio(req: any): Promise<{
        total_value_usd: any;
        change_24h_percentage: number;
        breakdown: {
            name: string;
            value: number;
            usd_value: any;
        }[];
        assets: {
            oqAssets: any;
            active_loans: any;
            stablecoins_balance: number;
            lp_positions: number;
        };
    }>;
    getActivityFeed(req: any, limit?: string): Promise<{
        id: string;
        type: string;
        title: string;
        description: string;
        amount: number | null;
        timestamp: Date;
        metadata: {
            loan_id: string;
            current_ltv?: undefined;
            oqAsset_id?: undefined;
            document_id?: undefined;
            proposal_id?: undefined;
            pool_id?: undefined;
            lp_tokens?: undefined;
        } | {
            loan_id: string;
            current_ltv: number;
            oqAsset_id?: undefined;
            document_id?: undefined;
            proposal_id?: undefined;
            pool_id?: undefined;
            lp_tokens?: undefined;
        } | {
            oqAsset_id: string;
            document_id: string;
            loan_id?: undefined;
            current_ltv?: undefined;
            proposal_id?: undefined;
            pool_id?: undefined;
            lp_tokens?: undefined;
        } | {
            proposal_id: string;
            loan_id?: undefined;
            current_ltv?: undefined;
            oqAsset_id?: undefined;
            document_id?: undefined;
            pool_id?: undefined;
            lp_tokens?: undefined;
        } | {
            pool_id: string;
            lp_tokens: number;
            loan_id?: undefined;
            current_ltv?: undefined;
            oqAsset_id?: undefined;
            document_id?: undefined;
            proposal_id?: undefined;
        };
    }[]>;
    getPositions(req: any): Promise<any>;
    getNotifications(req: any): Promise<{
        id: string;
        type: string;
        title: string;
        message: string;
        read: boolean;
        created_at: Date;
    }[]>;
}
