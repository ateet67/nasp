import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConservationDocument = Conservation & Document;

@Schema({ timestamps: true })
export class Conservation {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Region', required: true })
  regionId: Types.ObjectId;

  @Prop({ default: '' })
  description?: string;

  @Prop({ type: Number, default: 0 })
  order: number;
}

export const ConservationSchema = SchemaFactory.createForClass(Conservation);
