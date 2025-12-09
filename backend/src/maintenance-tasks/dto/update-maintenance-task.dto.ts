import { TaskPriority, TaskStatus } from '../maintenance-task.entity';

export class UpdateMaintenanceTaskDto {
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}
