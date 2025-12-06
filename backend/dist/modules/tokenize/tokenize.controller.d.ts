import { TokenizeService } from './tokenize.service';
export declare class TokenizeController {
    private readonly tokenizeService;
    constructor(tokenizeService: TokenizeService);
    tokenize(req: any, body: {
        title: string;
        amount: number;
        due_date: string;
    }, files: Express.Multer.File[]): Promise<{
        document_id: any;
        valuation_job_id: any;
        status: string;
    }>;
    getValuation(jobId: string): Promise<{
        job_id: any;
        suggested_value_usd: any;
        confidence: any;
        oracle_sources: any;
        status: any;
        manual_review_required: boolean;
    }>;
    mint(req: any, body: {
        document_id: string;
        accepted_value_usd: number;
    }): Promise<{
        tx_hash: string;
        oqAsset_id: any;
        token_id: any;
        face_value_usd: number;
    }>;
    getDocuments(req: any): Promise<any>;
    getOqAssets(req: any): Promise<any>;
}
