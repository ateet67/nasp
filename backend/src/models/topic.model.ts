import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema({ timestamps: true })
export class Topic {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Conservation', required: true })
  conservationId: Types.ObjectId;

  @Prop({ default: '' })
  description?: string;

  @Prop({ type: Number, default: 0 })
  order: number;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
