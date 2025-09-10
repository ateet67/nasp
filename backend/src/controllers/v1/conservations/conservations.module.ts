import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConservationsController } from './conservations.controller';
import { ConservationsService } from './conservations.service';
import { Conservation, ConservationSchema } from '@models/conservation.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Conservation.name, schema: ConservationSchema }])],
  controllers: [ConservationsController],
  providers: [ConservationsService],
  exports: [MongooseModule, ConservationsService],
})
export class ConservationsModule {}

