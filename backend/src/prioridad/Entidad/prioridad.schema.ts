import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Prioridad extends Document {
  @Prop({ required: true })
  nombre: string;
}

export const PrioridadSchema = SchemaFactory.createForClass(Prioridad);
