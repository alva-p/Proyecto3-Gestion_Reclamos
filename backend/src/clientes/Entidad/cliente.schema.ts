import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EstadoSolicitud } from '../../estado-solicitud/Entidad/estado-solicitud.schema';

@Schema({ timestamps: true })
export class Cliente extends Document {
  @Prop({ required: true })
  empresa: string;

  @Prop({ required: true })
  telefono: string;

  @Prop({ required: true })
  direccion: string;

  @Prop({ type: String, ref: EstadoSolicitud.name })
  estadoSolicitud: EstadoSolicitud;

  @Prop({ required: true })
  usuarioId: string; // referencia lógica al usuario base
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);
