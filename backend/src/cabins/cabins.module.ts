import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabinsController } from './cabins.controller';
import { CabinsService } from './cabins.service';
import { Cabin } from './cabin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cabin])],
  controllers: [CabinsController],
  providers: [CabinsService],
  exports: [CabinsService],
})
export class CabinsModule {}
