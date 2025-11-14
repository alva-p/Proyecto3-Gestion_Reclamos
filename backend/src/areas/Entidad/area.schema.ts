import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Area extends Document {
  @Prop({ required: true })
  nombre: string;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
