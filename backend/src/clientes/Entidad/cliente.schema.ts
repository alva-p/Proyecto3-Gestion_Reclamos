import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EstadoSolicitud } from '../../estado-solicitud/Entidad/estado-solicitud.schema';

@Schema({ timestamps: true })
export class Cliente extends Document {
  @Prop({ required: true })
  empresa: string;

  @Prop({ required: true })
  telefono: string;

  @Prop({ required: true })
  direccion: string;

  @Prop({ type: Types.ObjectId, ref: 'EstadoSolicitud', default: null })
  estadoSolicitud: Types.ObjectId | EstadoSolicitud;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuarioId: Types.ObjectId; // referencia al usuario base
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);
