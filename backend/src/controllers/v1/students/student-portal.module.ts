import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentPortalController } from './student-portal.controller';
import { StudentsService } from './students.service';
import { AuthModule } from '../../../auth/auth.module';
import { Student, StudentSchema } from '../../../models/student.model';
import { Conservation, ConservationSchema } from '../../../models/conservation.model';
import { Topic, TopicSchema } from '../../../models/topic.model';
import { Item, ItemSchema } from '../../../models/item.model';
import { Assessment, AssessmentSchema } from '../../../models/assessment.model';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Conservation.name, schema: ConservationSchema },
      { name: Topic.name, schema: TopicSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Assessment.name, schema: AssessmentSchema },
    ]),
  ],
  controllers: [StudentPortalController],
  providers: [StudentsService],
})
export class StudentPortalModule {}
