import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { oqAsset } from '../../entities/oqAsset.entity';
import { Loan } from '../../entities/loan.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(oqAsset)
    private oqAssetRepository: Repository<oqAsset>,
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
  ) {}

  async getPortfolio(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Get user's oqAssets
    const oqAssets = await this.oqAssetRepository.find({
      where: { owner_address: user.wallet_address },
    });

    // Get user's loans
    const loans = await this.loanRepository.find({
      where: { user_id: userId },
      relations: ['oqAsset'],
    });

    // Calculate portfolio value
    const oqAssetsValue = oqAssets.reduce((sum, asset) => sum + asset.face_value_usd, 0);
    const loansValue = loans.reduce((sum, loan) => sum + loan.principal_usd, 0);

    // Mock additional assets (USDC, LP tokens, etc.)
    const stablecoinsValue = 5000;
    const lpTokensValue = 2500;

    const totalValue = oqAssetsValue + loansValue + stablecoinsValue + lpTokensValue;

    // Calculate 24h change (mock)
    const change24h = (Math.random() - 0.5) * 0.1; // -5% to +5%

    return {
      total_value_usd: totalValue,
      change_24h_percentage: change24h,
      breakdown: [
        {
          name: 'oqAssets',
          value: oqAssetsValue / totalValue,
          usd_value: oqAssetsValue,
        },
        {
          name: 'Loans',
          value: loansValue / totalValue,
          usd_value: loansValue,
        },
        {
          name: 'Stablecoins',
          value: stablecoinsValue / totalValue,
          usd_value: stablecoinsValue,
        },
        {
          name: 'LP Tokens',
          value: lpTokensValue / totalValue,
          usd_value: lpTokensValue,
        },
      ],
      assets: {
        oqAssets: oqAssets.length,
        active_loans: loans.filter(l => l.status === 'active').length,
        stablecoins_balance: stablecoinsValue,
        lp_positions: 2,
      },
    };
  }

  async getActivityFeed(userId: string, limit: number = 20) {
    // Mock activity data
    const activities = [
      {
        id: '1',
        type: 'transaction',
        title: 'Interest Accrued',
        description: 'Interest accrued on loan position',
        amount: 5.23,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        metadata: { loan_id: 'loan-1' },
      },
      {
        id: '2',
        type: 'alert',
        title: 'LTV Threshold Warning',
        description: 'Loan position LTV approaching liquidation threshold',
        amount: null,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        metadata: { loan_id: 'loan-2', current_ltv: 72 },
      },
      {
        id: '3',
        type: 'transaction',
        title: 'oqAsset Minted',
        description: 'Successfully minted oqAsset from invoice',
        amount: 1000,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        metadata: { oqAsset_id: 'oq-1', document_id: 'doc-1' },
      },
      {
        id: '4',
        type: 'governance',
        title: 'Proposal Passed',
        description: 'Governance proposal "Reduce fees by 20%" has passed',
        amount: null,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        metadata: { proposal_id: 'prop-1' },
      },
      {
        id: '5',
        type: 'liquidity',
        title: 'Liquidity Added',
        description: 'Added liquidity to oqAsset/USDC pool',
        amount: 500,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        metadata: { pool_id: 'pool-1', lp_tokens: 100 },
      },
    ];

    return activities.slice(0, limit).map(activity => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      amount: activity.amount,
      timestamp: activity.timestamp,
      metadata: activity.metadata,
    }));
  }

  async getPositions(userId: string) {
    const loans = await this.loanRepository.find({
      where: { user_id: userId },
      relations: ['oqAsset', 'oqAsset.document'],
      order: { created_at: 'DESC' },
    });

    return loans.map(loan => ({
      id: loan.id,
      asset: `oqAsset: ${loan.oqAsset.document.hash.slice(0, 8)}...`,
      collateral_value: loan.oqAsset.face_value_usd,
      loan_amount: loan.principal_usd,
      ltv: loan.ltv,
      status: loan.status,
      interest_rate: loan.interest_rate_annual,
      created_at: loan.created_at,
    }));
  }

  async getNotifications(userId: string) {
    // Mock notifications
    return [
      {
        id: '1',
        type: 'warning',
        title: 'High LTV Alert',
        message: 'Your loan position in oqAsset #1234 has reached 75% LTV',
        read: false,
        created_at: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: '2',
        type: 'info',
        title: 'Valuation Complete',
        message: 'Document valuation for Invoice #5678 is now complete',
        read: true,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ];
  }
}