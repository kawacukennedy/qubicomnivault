import { Job } from 'bull';
import { Repository } from 'typeorm';
import { ValuationJob } from '../../entities/valuationJob.entity';
import { Document } from '../../entities/document.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';
export declare class ValuationProcessor {
    private valuationJobRepository;
    private documentRepository;
    private websocketGateway;
    private logger;
    private s3;
    constructor(valuationJobRepository: Repository<ValuationJob>, documentRepository: Repository<Document>, websocketGateway: WebsocketGateway);
    handleValuation(job: Job<{
        jobId: string;
        documentId: string;
        fileKeys: string[];
        userData: any;
    }>): Promise<void>;
    private consultOracles;
    private callChainlinkOracle;
    private callExternalAPI;
    private callMarketData;
    private delay;
}
