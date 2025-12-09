import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceTasksController } from './maintenance-tasks.controller';
import { MaintenanceTasksService } from './maintenance-tasks.service';
import { MaintenanceTask } from './maintenance-task.entity';
import { Cabin } from '../cabins/cabin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceTask, Cabin])],
  controllers: [MaintenanceTasksController],
  providers: [MaintenanceTasksService],
  exports: [MaintenanceTasksService],
})
export class MaintenanceTasksModule {}
