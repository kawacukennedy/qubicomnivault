import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TokenizeModule } from './modules/tokenize/tokenize.module';

@Module({
  imports: [AuthModule, TokenizeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
