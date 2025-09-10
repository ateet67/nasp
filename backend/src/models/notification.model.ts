import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  STUDENT_APPROVAL = 'STUDENT_APPROVAL',
  BADGE_EARNED = 'BADGE_EARNED',
  ASSESSMENT_COMPLETED = 'ASSESSMENT_COMPLETED',
  CONSERVATION_UNLOCKED = 'CONSERVATION_UNLOCKED',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Boolean, default: false })
  read: boolean;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
