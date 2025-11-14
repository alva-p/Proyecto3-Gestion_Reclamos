import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Subarea } from '../../subareas/Entidad/subarea.schema';

@Schema({ timestamps: true })
export class Empleado extends Document {
  @Prop({ required: true })
  puesto: string;

  @Prop({ type: String, ref: Subarea.name })
  subarea: Subarea;

  @Prop({ required: true })
  usuarioId: string; // referencia lógica al usuario base
}

export const EmpleadoSchema = SchemaFactory.createForClass(Empleado);
