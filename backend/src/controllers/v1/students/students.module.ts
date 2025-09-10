import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student, StudentSchema } from '@models/student.model';
import { User, UserSchema } from '@models/user.model';
import { Topic, TopicSchema } from '@models/topic.model';
import { Item, ItemSchema } from '@models/item.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: User.name, schema: UserSchema },
      { name: Topic.name, schema: TopicSchema },
      { name: Item.name, schema: ItemSchema },
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [MongooseModule, StudentsService],
})
export class StudentsModule {}

