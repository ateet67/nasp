import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({ type: Types.ObjectId, ref: 'Region' })
  regionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'School' })
  schoolId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  teacherId?: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  approved: boolean;

  @Prop({ type: Object, default: {} })
  progress?: Record<string, any>;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

