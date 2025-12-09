import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceTask } from './maintenance-task.entity';
import { CreateMaintenanceTaskDto } from './dto/create-maintenance-task.dto';
import { UpdateMaintenanceTaskDto } from './dto/update-maintenance-task.dto';
import { Cabin } from '../cabins/cabin.entity';

@Injectable()
export class MaintenanceTasksService {
  constructor(
    @InjectRepository(MaintenanceTask)
    private tasksRepository: Repository<MaintenanceTask>,
    @InjectRepository(Cabin)
    private cabinsRepository: Repository<Cabin>,
  ) {}

  async create(createTaskDto: CreateMaintenanceTaskDto): Promise<MaintenanceTask> {
    // Validate that cabin exists
    const cabin = await this.cabinsRepository.findOne({
      where: { id: createTaskDto.cabinId },
    });
    if (!cabin) {
      throw new BadRequestException(
        `Cabin with ID ${createTaskDto.cabinId} does not exist`,
      );
    }

    const task = this.tasksRepository.create(createTaskDto);
    return this.tasksRepository.save(task);
  }

  async findAll(): Promise<MaintenanceTask[]> {
    return this.tasksRepository.find({
      relations: ['cabin'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCabinId(cabinId: string): Promise<MaintenanceTask[]> {
    const cabin = await this.cabinsRepository.findOne({
      where: { id: cabinId },
    });
    if (!cabin) {
      throw new NotFoundException(`Cabin with ID ${cabinId} not found`);
    }

    return this.tasksRepository.find({
      where: { cabinId },
      relations: ['cabin'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<MaintenanceTask | null> {
    return this.tasksRepository.findOne({
      where: { id },
      relations: ['cabin'],
    });
  }

  async update(
    id: string,
    updateTaskDto: UpdateMaintenanceTaskDto,
  ): Promise<MaintenanceTask> {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
