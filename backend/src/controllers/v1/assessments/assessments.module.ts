import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { Assessment, AssessmentSchema } from '@models/assessment.model';
import { Student, StudentSchema } from '@models/student.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assessment.name, schema: AssessmentSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [MongooseModule, AssessmentsService],
})
export class AssessmentsModule {}

