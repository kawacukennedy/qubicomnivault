import { Module } from '@nestjs/common';
import { TokenizeController } from './tokenize.controller';
import { TokenizeService } from './tokenize.service';

@Module({
  controllers: [TokenizeController],
  providers: [TokenizeService],
})
export class TokenizeModule {}