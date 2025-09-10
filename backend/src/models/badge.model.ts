import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BadgeDocument = Badge & Document;

export enum BadgeType {
  TOPIC_COMPLETION = 'TOPIC_COMPLETION',
  CONSERVATION_COMPLETION = 'CONSERVATION_COMPLETION',
  ASSESSMENT_EXCELLENCE = 'ASSESSMENT_EXCELLENCE',
  CONSERVATION_MASTER = 'CONSERVATION_MASTER',
  WILDLIFE_EXPERT = 'WILDLIFE_EXPERT',
}

@Schema({ timestamps: true })
export class Badge {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: String, enum: BadgeType, required: true })
  type: BadgeType;

  @Prop({ required: true })
  iconUrl: string;

  @Prop({ type: Number, default: 0 })
  points: number;

  @Prop({ type: Types.ObjectId, ref: 'Conservation' })
  conservationId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Topic' })
  topicId?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  requiredScore?: number; // Minimum score percentage required
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
