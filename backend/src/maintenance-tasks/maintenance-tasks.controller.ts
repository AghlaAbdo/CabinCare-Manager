import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { MaintenanceTasksService } from './maintenance-tasks.service';
import { CreateMaintenanceTaskDto } from './dto/create-maintenance-task.dto';
import { UpdateMaintenanceTaskDto } from './dto/update-maintenance-task.dto';
import { MaintenanceTask } from './maintenance-task.entity';
import { ValidateUUIDPipe } from '../common/pipes/validate-uuid.pipe';

@Controller('tasks')
export class MaintenanceTasksController {
  constructor(private readonly tasksService: MaintenanceTasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateMaintenanceTaskDto): Promise<MaintenanceTask> {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(): Promise<MaintenanceTask[]> {
    return this.tasksService.findAll();
  }

  @Get('cabin/:cabinId')
  async findByCabinId(
    @Param('cabinId', ValidateUUIDPipe) cabinId: string,
  ): Promise<MaintenanceTask[]> {
    return this.tasksService.findByCabinId(cabinId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ValidateUUIDPipe) id: string,
  ): Promise<MaintenanceTask> {
    const task = await this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  @Patch(':id')
  async update(
    @Param('id', ValidateUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateMaintenanceTaskDto,
  ): Promise<MaintenanceTask> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id', ValidateUUIDPipe) id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
}
