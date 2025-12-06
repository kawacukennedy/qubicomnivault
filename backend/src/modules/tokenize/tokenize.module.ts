import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { TokenizeController } from './tokenize.controller';
import { TokenizeService } from './tokenize.service';
import { Document } from '../../entities/document.entity';
import { oqAsset } from '../../entities/oqAsset.entity';
import { ValuationJob } from '../../entities/valuationJob.entity';
import { User } from '../../entities/user.entity';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, oqAsset, ValuationJob, User]),
    BullModule.registerQueue({
      name: 'valuation',
    }),
    WebsocketModule,
  ],
  controllers: [TokenizeController],
  providers: [TokenizeService],
  exports: [TokenizeService],
})
export class TokenizeModule {}