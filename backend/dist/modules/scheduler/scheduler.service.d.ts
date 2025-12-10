import { Repository } from 'typeorm';
import { Loan } from '../../entities/loan.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';
export declare class SchedulerService {
    private loanRepository;
    private websocketGateway;
    private readonly logger;
    constructor(loanRepository: Repository<Loan>, websocketGateway: WebsocketGateway);
    handleInterestAccrual(): Promise<void>;
    handleLiquidationCheck(): Promise<void>;
    handleReconciliation(): Promise<void>;
    handleDigestEmails(): Promise<void>;
}
