import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { LoggerService } from '../logger/logger.service';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && data.statusCode && data.success === false) return data; // leave error responses untouched

        this.logger.log('Response sent', { data });

        return {
          success: true,
          message: data?.message || 'Ok',
          data
        };
      })
    );
  }
}
