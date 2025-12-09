import { TaskPriority, TaskStatus } from '../maintenance-task.entity';
import { IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateMaintenanceTaskDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
