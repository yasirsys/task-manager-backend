// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { LoggerService } from './logger/logger.service'; // your custom logger

@Module({
  providers: [ResponseInterceptor, AllExceptionsFilter, LoggerService],
  exports: [ResponseInterceptor, AllExceptionsFilter, LoggerService]
})
export class CommonModule {}
