import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { CabinsService } from './cabins.service';
import { CreateCabinDto } from './dto/create-cabin.dto';
import { Cabin } from './cabin.entity';
import { CabinSummaryDto } from './dto/cabin-summary.dto';
import { ValidateUUIDPipe } from '../common/pipes/validate-uuid.pipe';

@Controller('cabins')
export class CabinsController {
  constructor(private readonly cabinsService: CabinsService) {}

  @Post()
  create(@Body() createCabinDto: CreateCabinDto): Promise<Cabin> {
    return this.cabinsService.create(createCabinDto);
  }

  @Get()
  findAll(): Promise<Cabin[]> {
    try {
        console.log("Fetching all cabins");
        return this.cabinsService.findAll();
    } catch (err) {
        console.log("Error fetching cabins:", err);
        throw new NotFoundException();
    }
  }

  @Get('summary')
  getSummary(): Promise<CabinSummaryDto[]> {
    return this.cabinsService.getCabinsSummary();
  }

  @Get(':id')
  async findOne(@Param('id', ValidateUUIDPipe) id: string): Promise<Cabin> {
    const cabin = await this.cabinsService.findOne(id);
    if (!cabin) {
      throw new NotFoundException(`Cabin with ID ${id} not found`);
    }
    return cabin;
  }
}
