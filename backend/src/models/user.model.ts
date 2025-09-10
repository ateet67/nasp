import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  REGIONAL_ADMIN = 'REGIONAL_ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ type: String, enum: UserRole, required: true })
  role: UserRole;

  @Prop()
  regionId?: string;

  @Prop()
  schoolId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
