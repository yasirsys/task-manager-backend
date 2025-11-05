import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    DashboardModule,
    DatabaseModule,
    TasksModule,
    UsersModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
