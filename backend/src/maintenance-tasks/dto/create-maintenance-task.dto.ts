import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { TaskPriority, TaskStatus } from '../maintenance-task.entity';

export class CreateMaintenanceTaskDto {
  @IsUUID()
  cabinId: string;

  @IsString()
  description: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
