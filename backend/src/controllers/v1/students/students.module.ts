import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student, StudentSchema } from '@models/student.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }])],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [MongooseModule, StudentsService],
})
export class StudentsModule {}

