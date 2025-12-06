import { Injectable } from '@nestjs/common';

@Injectable()
export class BusinessLogicService {
  calculateLTV(faceValueUsd: number, loanPrincipalUsd: number, haircut: number): number {
    const adjustedValue = faceValueUsd * (1 - haircut);
    const ltv = loanPrincipalUsd / adjustedValue;
    return Math.round(ltv * 10000) / 10000; // round to 4 decimals
  }

  determineHaircut(confidence: number, assetClass: string): number {
    let base = 0.12;
    if (assetClass === 'invoice') base = 0.08;
    if (confidence < 0.6) base += 0.07;
    return Math.max(0.03, Math.min(base, 0.5));
  }

  async processMint(documentId: string, acceptedValue: number, userId: string) {
    // 1. Validate user owns documentId and valuation exists.
    // 2. Reserve funds for gas fees (client submits signed tx via wallet).
    // 3. Create DB transaction: create oqAsset record with status 'minting'.
    // 4. Call on-chain mint via Qubic SDK; monitor tx until confirmed.
    // 5. On success: update oqAsset.token_id, status 'minted'; emit event 'oqAssetMinted'.
    // 6. Update Accounting ledger with entry: { type: 'mint', amount: acceptedValue, userId, txHash }.
    // 7. If tx fails after retries: revert DB changes and notify user.
    return { txHash: '0x123...', oqAssetId: 'oq-1' };
  }

  async accrueInterestCron() {
    // every minute:
    // for each active loan:
    //   calculate interest = principal * (annual_rate / 525600) // minutes in year
    //   update loan.accrued_interest += interest
    //   if accumulated_interest crosses threshold push event
    //   persist ledger entry for accrual
    //   if ltv > maintenance_threshold push liquidation event
    console.log('Accruing interest...');
  }

  async handleLiquidation(loanId: string) {
    // 1. Create snapshot of position and notify owner via websocket and EasyConnect.
    // 2. Attempt partial liquidation: sell part of collateral on DEX or call protocol function.
    // 3. Record on-chain tx and update loan.status if closed.
    // 4. If automatic liquidation can't cover outstanding, mark for governance review.
    console.log('Handling liquidation for loan:', loanId);
  }

  async updateQScore(userId: string, event: 'repaid' | 'defaulted') {
    // when loan_repaid in full:
    //   qDelta = min(10, computeDeltaBasedOnTimeliness())
    //   user.q_score = clamp(user.q_score + qDelta, 0, 100)
    // when loan_defaulted:
    //   user.q_score = max(0, user.q_score - 20)
    // persist history for audit
    console.log('Updating Q-Score for user:', userId, 'event:', event);
  }
}