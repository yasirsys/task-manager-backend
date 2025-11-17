import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  log(message: string, meta?: any) {
    console.log(`[LOG] ${new Date().toISOString()} -`, message, meta || '');
  }

  error(message: string, meta?: any) {
    console.error(`[ERROR] ${new Date().toISOString()} -`, message, meta || '');
  }

  warn(message: string, meta?: any) {
    console.warn(`[WARN] ${new Date().toISOString()} -`, message, meta || '');
  }

  debug(message: string, meta?: any) {
    console.debug(`[DEBUG] ${new Date().toISOString()} -`, message, meta || '');
  }
}
