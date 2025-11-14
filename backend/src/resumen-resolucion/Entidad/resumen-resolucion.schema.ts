import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Empleado } from '../../empleados/Entidad/empleado.schema';
import { Reclamo } from '../../reclamos/Entidad/reclamo.schema';

@Schema({ timestamps: true })
export class ResumenResolucion extends Document {

  @Prop({ type: Types.ObjectId, ref: Reclamo.name, required: true })
  reclamoId: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ type: Types.ObjectId, ref: Empleado.name, required: true })
  responsable: string;

  @Prop({ required: true })
  fechaHora: Date;

  @Prop({ type: [String], default: [] })
  adjuntos: string[];
}

export const ResumenResolucionSchema = SchemaFactory.createForClass(ResumenResolucion);
