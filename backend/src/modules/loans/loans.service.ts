import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '../../entities/loan.entity';
import { oqAsset } from '../../entities/oqAsset.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(oqAsset)
    private oqAssetRepository: Repository<oqAsset>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createLoan(
    userId: string,
    data: { oqAsset_id: string; principal_usd: number; interest_rate_annual: number },
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const oqAssetEntity = await this.oqAssetRepository.findOne({
      where: { id: data.oqAsset_id, owner_address: user.wallet_address },
    });
    if (!oqAssetEntity) {
      throw new NotFoundException('oqAsset not found or not owned by user');
    }

    // Check if oqAsset is already used in a loan
    const existingLoan = await this.loanRepository.findOne({
      where: { oqAsset_id: data.oqAsset_id, status: 'active' },
    });
    if (existingLoan) {
      throw new BadRequestException('oqAsset is already used in an active loan');
    }

    // Calculate LTV
    const ltv = (data.principal_usd / oqAssetEntity.face_value_usd) * 100;
    if (ltv > 80) {
      throw new BadRequestException('Loan-to-Value ratio cannot exceed 80%');
    }

    const loan = this.loanRepository.create({
      user_id: userId,
      oqAsset_id: data.oqAsset_id,
      principal_usd: data.principal_usd,
      interest_rate_annual: data.interest_rate_annual,
      status: 'active',
      ltv,
    });

    const savedLoan = await this.loanRepository.save(loan);

    return {
      loan_id: savedLoan.id,
      principal_usd: savedLoan.principal_usd,
      interest_rate_annual: savedLoan.interest_rate_annual,
      ltv: savedLoan.ltv,
      status: savedLoan.status,
      created_at: savedLoan.created_at,
    };
  }

  async getLoans(userId: string) {
    const loans = await this.loanRepository.find({
      where: { user_id: userId },
      relations: ['oqAsset', 'oqAsset.document'],
      order: { created_at: 'DESC' },
    });

    return loans.map(loan => ({
      id: loan.id,
      principal_usd: loan.principal_usd,
      interest_rate_annual: loan.interest_rate_annual,
      status: loan.status,
      ltv: loan.ltv,
      oqAsset: {
        id: loan.oqAsset.id,
        token_id: loan.oqAsset.token_id,
        face_value_usd: loan.oqAsset.face_value_usd,
        document: {
          id: loan.oqAsset.document.id,
          hash: loan.oqAsset.document.hash,
        },
      },
      created_at: loan.created_at,
      updated_at: loan.updated_at,
    }));
  }

  async repayLoan(userId: string, loanId: string, amount: number) {
    const loan = await this.loanRepository.findOne({
      where: { id: loanId, user_id: userId },
      relations: ['oqAsset'],
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    if (loan.status !== 'active') {
      throw new BadRequestException('Loan is not active');
    }

    // TODO: Implement actual repayment logic
    // For now, just mark as repaid if full amount
    if (amount >= loan.principal_usd) {
      loan.status = 'repaid';
      await this.loanRepository.save(loan);
    }

    return {
      loan_id: loan.id,
      status: loan.status,
      repaid_amount: amount,
    };
  }

  async getLoanDetails(userId: string, loanId: string) {
    const loan = await this.loanRepository.findOne({
      where: { id: loanId, user_id: userId },
      relations: ['oqAsset', 'oqAsset.document', 'user'],
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    // Calculate accrued interest (simplified)
    const now = new Date();
    const daysElapsed = Math.floor((now.getTime() - loan.created_at.getTime()) / (1000 * 60 * 60 * 24));
    const accruedInterest = (loan.principal_usd * loan.interest_rate_annual * daysElapsed) / 365;

    return {
      id: loan.id,
      principal_usd: loan.principal_usd,
      interest_rate_annual: loan.interest_rate_annual,
      status: loan.status,
      ltv: loan.ltv,
      accrued_interest_usd: accruedInterest,
      total_owed_usd: loan.principal_usd + accruedInterest,
      oqAsset: {
        id: loan.oqAsset.id,
        token_id: loan.oqAsset.token_id,
        face_value_usd: loan.oqAsset.face_value_usd,
        document: {
          id: loan.oqAsset.document.id,
          hash: loan.oqAsset.document.hash,
        },
      },
      created_at: loan.created_at,
      updated_at: loan.updated_at,
    };
  }
}