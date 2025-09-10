import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConservationsController } from './conservations.controller';
import { ConservationsService } from './conservations.service';
import { Conservation, ConservationSchema } from '@models/conservation.model';
import { Topic, TopicSchema } from '@models/topic.model';
import { Student, StudentSchema } from '@models/student.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conservation.name, schema: ConservationSchema },
      { name: Topic.name, schema: TopicSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [ConservationsController],
  providers: [ConservationsService],
  exports: [MongooseModule, ConservationsService],
})
export class ConservationsModule {}

