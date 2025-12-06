"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const bull_1 = require("@nestjs/bull");
const platform_express_1 = require("@nestjs/platform-express");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const tokenize_module_1 = require("./modules/tokenize/tokenize.module");
const loans_module_1 = require("./modules/loans/loans.module");
const pools_module_1 = require("./modules/pools/pools.module");
const governance_module_1 = require("./modules/governance/governance.module");
const websocket_module_1 = require("./modules/websocket/websocket.module");
const valuation_module_1 = require("./modules/valuation/valuation.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const user_entity_1 = require("./entities/user.entity");
const document_entity_1 = require("./entities/document.entity");
const oqAsset_entity_1 = require("./entities/oqAsset.entity");
const loan_entity_1 = require("./entities/loan.entity");
const valuationJob_entity_1 = require("./entities/valuationJob.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 5432,
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'password',
                database: process.env.DB_NAME || 'qubic_omnivault',
                entities: [user_entity_1.User, document_entity_1.Document, oqAsset_entity_1.oqAsset, loan_entity_1.Loan, valuationJob_entity_1.ValuationJob],
                synchronize: process.env.NODE_ENV !== 'production',
                logging: process.env.NODE_ENV === 'development',
            }),
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '1h' },
            }),
            passport_1.PassportModule,
            bull_1.BullModule.forRoot({
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT) || 6379,
                },
            }),
            bull_1.BullModule.registerQueue({
                name: 'valuation',
            }),
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
            auth_module_1.AuthModule,
            tokenize_module_1.TokenizeModule,
            loans_module_1.LoansModule,
            pools_module_1.PoolsModule,
            governance_module_1.GovernanceModule,
            websocket_module_1.WebsocketModule,
            valuation_module_1.ValuationModule,
            dashboard_module_1.DashboardModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map