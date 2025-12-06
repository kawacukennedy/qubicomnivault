import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Setup Swagger
  const config = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3001}`);
  console.log(`Swagger documentation: http://localhost:${process.env.PORT ?? 3001}/api`);
}
bootstrap();
