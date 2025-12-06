"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Qubic OmniVault API')
        .setDescription('API for Qubic OmniVault - Tokenize, Borrow, and Earn')
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('tokenize', 'Document tokenization endpoints')
        .addTag('loans', 'Loan management endpoints')
        .addTag('pools', 'Liquidity pool endpoints')
        .addTag('governance', 'Governance endpoints')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3001);
    console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3001}`);
    console.log(`Swagger documentation: http://localhost:${process.env.PORT ?? 3001}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map