import { BlockchainService } from './blockchain.service';
export declare class BlockchainController {
    private readonly blockchainService;
    constructor(blockchainService: BlockchainService);
    getBalance(address: string): Promise<string>;
    getOqAssetBalance(address: string): Promise<string>;
    getOqAssetMetadata(assetId: string): Promise<any>;
    mintOqAsset(req: any, body: {
        to: string;
        amount: string;
        metadata: any;
    }): Promise<{
        transactionHash: string;
    }>;
    createLoan(req: any, body: {
        oqAssetAmount: string;
        stablecoinAmount: string;
        assetId: string;
    }): Promise<{
        transactionHash: string;
    }>;
    repayLoan(loanId: string, body: {
        amount: string;
    }): Promise<{
        transactionHash: string;
    }>;
    getLoanDetails(loanId: string): Promise<any>;
    addLiquidity(body: {
        tokenAAmount: string;
        tokenBAmount: string;
    }): Promise<{
        transactionHash: string;
    }>;
    removeLiquidity(body: {
        liquidityAmount: string;
    }): Promise<{
        transactionHash: string;
    }>;
    swapTokens(body: {
        tokenIn: string;
        amountIn: string;
        minAmountOut: string;
    }): Promise<{
        transactionHash: string;
    }>;
    submitValuation(body: {
        assetId: string;
        value: string;
    }): Promise<{
        transactionHash: string;
    }>;
    getValuation(assetId: string): Promise<any>;
    createProposal(body: {
        description: string;
        target: string;
        data: string;
        value: string;
    }): Promise<{
        transactionHash: string;
    }>;
    castVote(body: {
        proposalId: string;
        support: boolean;
    }): Promise<{
        transactionHash: string;
    }>;
    getNetworkStatus(): Promise<{
        blockNumber: number;
        gasPrice: string;
    }>;
    getHealth(): Promise<{
        status: string;
        network: string;
        blockNumber: number;
        gasPrice: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        network: string;
        error: any;
        timestamp: string;
        blockNumber?: undefined;
        gasPrice?: undefined;
    }>;
    getContractAddresses(): {
        oqAsset: string;
        lendingPool: string;
        liquidityPool: string;
        oracle: string;
        governance: string;
    };
}
