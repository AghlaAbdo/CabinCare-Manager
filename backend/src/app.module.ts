import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CabinsModule } from './cabins/cabins.module';
import { MaintenanceTasksModule } from './maintenance-tasks/maintenance-tasks.module';
import { Cabin } from './cabins/cabin.entity';
import { MaintenanceTask } from './maintenance-tasks/maintenance-task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Cabin, MaintenanceTask],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    CabinsModule,
    MaintenanceTasksModule,
  ],
})
export class AppModule {}
