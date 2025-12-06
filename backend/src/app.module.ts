import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TokenizeModule } from './modules/tokenize/tokenize.module';
import { LoansModule } from './modules/loans/loans.module';
import { PoolsModule } from './modules/pools/pools.module';
import { GovernanceModule } from './modules/governance/governance.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { ValuationModule } from './modules/valuation/valuation.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { User } from './entities/user.entity';
import { Document } from './entities/document.entity';
import { oqAsset } from './entities/oqAsset.entity';
import { Loan } from './entities/loan.entity';
import { ValuationJob } from './entities/valuationJob.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'qubic_omnivault',
      entities: [User, Document, oqAsset, Loan, ValuationJob],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'valuation',
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    TokenizeModule,
    LoansModule,
    PoolsModule,
    GovernanceModule,
    WebsocketModule,
    ValuationModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
