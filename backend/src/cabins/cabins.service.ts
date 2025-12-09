import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cabin } from './cabin.entity';
import { CreateCabinDto } from './dto/create-cabin.dto';
import { CabinSummaryDto } from './dto/cabin-summary.dto';

@Injectable()
export class CabinsService {
  constructor(
    @InjectRepository(Cabin)
    private cabinsRepository: Repository<Cabin>,
  ) {}

  async create(createCabinDto: CreateCabinDto): Promise<Cabin> {
    const cabin = this.cabinsRepository.create(createCabinDto);
    return this.cabinsRepository.save(cabin);
  }

  async findAll(): Promise<Cabin[]> {
    return this.cabinsRepository.find({
    //   relations: ['maintenanceTasks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Cabin | null> {
    return this.cabinsRepository.findOne({
      where: { id },
      relations: ['maintenanceTasks'],
    });
  }

  async getCabinsSummary(): Promise<CabinSummaryDto[]> {
    const cabins = await this.cabinsRepository
      .createQueryBuilder('cabin')
    //   .leftJoinAndSelect(
    //     'cabin.maintenanceTasks',
    //     'task',
    //     "task.status = 'Pending'",
    //   )
      .orderBy('cabin.createdAt', 'DESC')
      .getMany();

    return cabins.map((cabin) => ({
      id: cabin.id,
      name: cabin.name,
      location: cabin.location,
      description: cabin.description,
      pendingHighPriority: 0,
      pendingMediumPriority: 0,
      pendingLowPriority: 0,
      totalPendingTasks: 0,
    //   pendingHighPriority: cabin.maintenanceTasks.filter(
    //     (t) => t.priority === 'High',
    //   ).length,
    //   pendingMediumPriority: cabin.maintenanceTasks.filter(
    //     (t) => t.priority === 'Medium',
    //   ).length,
    //   pendingLowPriority: cabin.maintenanceTasks.filter(
    //     (t) => t.priority === 'Low',
    //   ).length,
    //   totalPendingTasks: cabin.maintenanceTasks.length,
    }));
  }
}
