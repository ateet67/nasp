import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';
import { School, SchoolSchema } from '@models/school.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }])],
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [MongooseModule, SchoolsService],
})
export class SchoolsModule {}

