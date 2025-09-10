import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Topic', required: true })
  topicId: Types.ObjectId;

  @Prop({ default: '' })
  description?: string;

  @Prop({ type: [String], default: [] })
  imageUrls: string[];

  @Prop({ type: [String], default: [] })
  videoUrls: string[];

  @Prop({ type: Number, default: 0 })
  order: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
