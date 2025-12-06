import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../../entities/user.entity';
import { oqAsset } from '../../entities/oqAsset.entity';
import { Loan } from '../../entities/loan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, oqAsset, Loan])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}