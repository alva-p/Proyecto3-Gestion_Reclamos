import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ComentarioInterno extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Reclamo', required: true })
  reclamoId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuarioId: Types.ObjectId;

  @Prop({ required: true })
  texto: string;

  @Prop({ type: Date, default: Date.now })
  fechaCreacion: Date;
}

export const ComentarioInternoSchema = SchemaFactory.createForClass(ComentarioInterno);
