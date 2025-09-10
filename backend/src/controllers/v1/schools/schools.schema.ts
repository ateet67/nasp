import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SchoolDocument = School & Document;

@Schema({ timestamps: true })
export class School {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Region', required: true })
  regionId: Types.ObjectId;

  @Prop()
  address?: string;

  @Prop()
  imageUrl?: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);

