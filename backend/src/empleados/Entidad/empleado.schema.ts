import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Subarea } from '../../subareas/Entidad/subarea.schema';

@Schema({ timestamps: true })
export class Empleado extends Document {
  @Prop({ required: true })
  puesto: string;

  @Prop({ type: Types.ObjectId, ref: 'Subarea' })
  subarea: Types.ObjectId | Subarea;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuarioId: Types.ObjectId; // referencia al usuario base
}

export const EmpleadoSchema = SchemaFactory.createForClass(Empleado);
