import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TipoReclamo } from '../../tipo-reclamo/Entidad/tipo-reclamo.schema';
import { Prioridad } from '../../prioridad/Entidad/prioridad.schema';
import { Criticidad } from '../../criticidad/Entidad/criticidad.schema';
import { EstadoReclamo } from '../../estado-reclamo/Entidad/estado-reclamo.schema';
import { Area } from '../../areas/Entidad/area.schema';
import { Subarea } from '../../subareas/Entidad/subarea.schema';
import { Empleado } from '../../empleados/Entidad/empleado.schema';
import { HistorialReclamo } from '../../historial-reclamo/Entidad/historial-reclamo.schema';
import { ResumenResolucion } from '../../resumen-resolucion/Entidad/resumen-resolucion.schema';
import { Types } from 'mongoose';
@Schema({ timestamps: true })
export class Reclamo extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ type: String, ref: TipoReclamo.name })
  tipoReclamo: TipoReclamo;

  @Prop({ type: String, ref: Prioridad.name })
  prioridad: Prioridad;

  @Prop({ type: String, ref: Criticidad.name })
  criticidad: Criticidad;

  @Prop({ type: String, ref: EstadoReclamo.name })
  estadoActual: EstadoReclamo;

  @Prop({ type: String, ref: Area.name })
  area: Area;

  @Prop({ type: String, ref: Subarea.name })
  subarea: Subarea;

  @Prop({ type: String, ref: Empleado.name })
  asignadoActual: Empleado;

  @Prop({ type: [Types.ObjectId], ref: 'HistorialReclamo', default: [] })
  historialIds: string[];

  @Prop({ type: Types.ObjectId, ref: 'ResumenResolucion', default: null })
  resumenResolucionId: string;

  @Prop({ required: true })
  proyectoId: string;

  @Prop({ required: true })
  clienteId: string;
}

export const ReclamoSchema = SchemaFactory.createForClass(Reclamo);
