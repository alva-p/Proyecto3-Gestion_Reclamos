import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EstadoReclamo extends Document {
  @Prop({ required: true })
  nombre: string;
}
export type EstadoReclamoDocument = EstadoReclamo & Document;
export const EstadoReclamoSchema = SchemaFactory.createForClass(EstadoReclamo);
