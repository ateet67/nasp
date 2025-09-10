import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { Topic, TopicSchema } from '@models/topic.model';
import { Student, StudentSchema } from '@models/student.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Topic.name, schema: TopicSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [MongooseModule, TopicsService],
})
export class TopicsModule {}

