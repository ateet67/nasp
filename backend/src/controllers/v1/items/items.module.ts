import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Item, ItemSchema } from '@models/item.model';
import { Topic, TopicSchema } from '@models/topic.model';
import { Student, StudentSchema } from '@models/student.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Topic.name, schema: TopicSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [MongooseModule, ItemsService],
})
export class ItemsModule {}

