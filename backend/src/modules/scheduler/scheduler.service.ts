import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '../../entities/loan.entity';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    private websocketGateway: WebsocketGateway,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleInterestAccrual() {
    this.logger.log('Running interest accrual job');

    try {
      const activeLoans = await this.loanRepository.find({
        where: { status: 'active' },
        relations: ['user'],
      });

      for (const loan of activeLoans) {
        // Calculate interest for the last minute
        const interestRatePerMinute = (loan.interest_rate_annual / 100) / (365 * 24 * 60);
        const interestAccrued = loan.principal_usd * interestRatePerMinute;

        // Update loan with accrued interest (simplified - in real implementation, track separately)
        loan.principal_usd += interestAccrued;
        await this.loanRepository.save(loan);

        // Check for liquidation threshold
        // Simplified LTV check - in real implementation, get current collateral value
        const currentLtv = (loan.principal_usd / (loan.principal_usd / loan.ltv * 100)) * 100;

        if (currentLtv > 85) { // Liquidation threshold
          this.websocketGateway.emitNotification(loan.user_id, {
            type: 'warning',
            title: 'Liquidation Risk',
            message: `Your loan ${loan.id} is approaching liquidation threshold.`,
          });
        }

        this.logger.log(`Accrued interest for loan ${loan.id}: ${interestAccrued}`);
      }
    } catch (error) {
      this.logger.error('Error in interest accrual job', error);
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleLiquidationCheck() {
    this.logger.log('Running liquidation check job');

    try {
      const activeLoans = await this.loanRepository.find({
        where: { status: 'active' },
        relations: ['user'],
      });

      for (const loan of activeLoans) {
        // Simplified liquidation logic
        const currentLtv = (loan.principal_usd / (loan.principal_usd / loan.ltv * 100)) * 100;

        if (currentLtv > 90) { // Hard liquidation threshold
          // Mark loan as liquidated
          loan.status = 'liquidated';
          await this.loanRepository.save(loan);

          // Notify user
          this.websocketGateway.emitNotification(loan.user_id, {
            type: 'error',
            title: 'Position Liquidated',
            message: `Your loan ${loan.id} has been liquidated due to high LTV.`,
          });

          this.logger.log(`Liquidated loan ${loan.id}`);
        }
      }
    } catch (error) {
      this.logger.error('Error in liquidation check job', error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleReconciliation() {
    this.logger.log('Running reconciliation job');

    try {
      // TODO: Implement reconciliation logic
      // - Compare on-chain state with off-chain records
      // - Fix any discrepancies
      // - Update ledger

      this.logger.log('Reconciliation completed');
    } catch (error) {
      this.logger.error('Error in reconciliation job', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDigestEmails() {
    this.logger.log('Running digest email job');

    try {
      // TODO: Implement digest email logic
      // - Generate daily summaries for users
      // - Send via email service

      this.logger.log('Digest emails sent');
    } catch (error) {
      this.logger.error('Error in digest email job', error);
    }
  }
}