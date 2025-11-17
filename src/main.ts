import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as express from 'express';

import { AppModule } from './app.module';

import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false
  });

  const logger = await app.resolve(LoggerService);
  app.use(express.json());

  app.setGlobalPrefix('api/v1');
  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL, // your React frontend origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw an error if unknown properties are sent
      transform: true
    })
  );

  app.useGlobalInterceptors(app.get(ResponseInterceptor));
  app.useGlobalFilters(app.get(AllExceptionsFilter));

  await app.listen(process.env.PORT || 3000);

  logger.log('🚀 Server Is Running');
}
bootstrap();
