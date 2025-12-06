import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { Document } from '../../entities/document.entity';
import { oqAsset } from '../../entities/oqAsset.entity';
import { ValuationJob } from '../../entities/valuationJob.entity';
import { User } from '../../entities/user.entity';
export declare class TokenizeService {
    private documentRepository;
    private oqAssetRepository;
    private valuationJobRepository;
    private userRepository;
    private valuationQueue;
    private s3;
    constructor(documentRepository: Repository<Document>, oqAssetRepository: Repository<oqAsset>, valuationJobRepository: Repository<ValuationJob>, userRepository: Repository<User>, valuationQueue: Queue);
    tokenize(userId: string, data: {
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
    mint(userId: string, data: {
        document_id: string;
        accepted_value_usd: number;
    }): Promise<{
        tx_hash: string;
        oqAsset_id: any;
        token_id: any;
        face_value_usd: number;
    }>;
    getDocuments(userId: string): Promise<any>;
    getOqAssets(userId: string): Promise<any>;
    private getWalletAddress;
}
