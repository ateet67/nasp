import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionsController } from './regions.controller';
import { RegionsService } from './regions.service';
import { Region, RegionSchema } from '@models/region.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Region.name, schema: RegionSchema }])],
  controllers: [RegionsController],
  providers: [RegionsService],
  exports: [MongooseModule, RegionsService],
})
export class RegionsModule {}

