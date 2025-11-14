import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EstadoSolicitud extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion: string;
}

export const EstadoSolicitudSchema = SchemaFactory.createForClass(EstadoSolicitud);
