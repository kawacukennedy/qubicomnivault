import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ValuationProcessor } from './valuation.processor';
import { ValuationJob } from '../../entities/valuationJob.entity';
import { Document } from '../../entities/document.entity';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ValuationJob, Document]),
    BullModule.registerQueue({
      name: 'valuation',
    }),
    WebsocketModule,
  ],
  providers: [ValuationProcessor],
  exports: [ValuationProcessor],
})
export class ValuationModule {}