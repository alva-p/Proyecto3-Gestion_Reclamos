import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EstadoReclamo } from '../../estado-reclamo/Entidad/estado-reclamo.schema';
import { Area } from '../../areas/Entidad/area.schema';
import { Subarea } from '../../subareas/Entidad/subarea.schema';
import { Empleado } from '../../empleados/Entidad/empleado.schema';
import { Reclamo } from '../../reclamos/Entidad/reclamo.schema';

@Schema({ timestamps: true })
export class HistorialReclamo extends Document {
  
  @Prop({ type: Types.ObjectId, ref: Reclamo.name, required: true })
  reclamoId: string;

  @Prop({ type: Types.ObjectId, ref: EstadoReclamo.name, required: true })
  estado: string;

  @Prop({ type: Types.ObjectId, ref: Area.name })
  area: string;

  @Prop({ type: Types.ObjectId, ref: Subarea.name })
  subarea: string;

  @Prop({ type: Types.ObjectId, ref: Empleado.name })
  empleado: string;

  @Prop({ required: true })
  detalleAccion: string;

  @Prop({ required: true })
  fechaHora: Date;
}

export const HistorialReclamoSchema = SchemaFactory.createForClass(HistorialReclamo);
