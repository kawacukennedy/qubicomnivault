import { Module } from '@nestjs/common';
import { GovernanceController } from './governance.controller';
import { GovernanceService } from './governance.service';
import { BlockchainModule } from '../blockchain/blockchain.module';

@Module({
  imports: [BlockchainModule],
  controllers: [GovernanceController],
  providers: [GovernanceService],
  exports: [GovernanceService],
})
export class GovernanceModule {}