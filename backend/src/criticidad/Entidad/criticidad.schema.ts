import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Criticidad extends Document {
  @Prop({ required: true })
  nombre: string;
}

export const CriticidadSchema = SchemaFactory.createForClass(Criticidad);
