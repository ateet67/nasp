import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RegionDocument = Region & Document;

@Schema({ timestamps: true })
export class Region {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ type: [String], default: [] })
  conservationTitles: string[];
}

export const RegionSchema = SchemaFactory.createForClass(Region);
