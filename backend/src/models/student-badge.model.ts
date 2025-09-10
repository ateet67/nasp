import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentBadgeDocument = StudentBadge & Document;

@Schema({ timestamps: true })
export class StudentBadge {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Badge', required: true })
  badgeId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  earnedAt: Date;

  @Prop({ type: Number, default: 0 })
  score: number; // Score achieved when badge was earned
}

export const StudentBadgeSchema = SchemaFactory.createForClass(StudentBadge);
