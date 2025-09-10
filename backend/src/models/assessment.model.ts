import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AssessmentDocument = Assessment & Document;

export class MCQOption {
  @Prop({ required: true })
  text: string;
  @Prop({ required: true })
  isCorrect: boolean;
}

export class MCQQuestion {
  @Prop({ required: true })
  prompt: string;
  @Prop({ type: [MCQOption], default: [] })
  options: MCQOption[];
}

@Schema({ timestamps: true })
export class Assessment {
  @Prop({ type: Types.ObjectId, ref: 'Topic' })
  topicId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Conservation' })
  conservationId?: Types.ObjectId;

  @Prop({ type: [MCQQuestion], default: [] })
  questions: MCQQuestion[];

  @Prop({ default: 'MCQ' })
  type: string;
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);

