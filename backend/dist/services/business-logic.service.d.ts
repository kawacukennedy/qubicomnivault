export declare class BusinessLogicService {
    calculateLTV(faceValueUsd: number, loanPrincipalUsd: number, haircut: number): number;
    determineHaircut(confidence: number, assetClass: string): number;
    processMint(documentId: string, acceptedValue: number, userId: string): Promise<{
        txHash: string;
        oqAssetId: string;
    }>;
    accrueInterestCron(): Promise<void>;
    handleLiquidation(loanId: string): Promise<void>;
    updateQScore(userId: string, event: 'repaid' | 'defaulted'): Promise<void>;
}
