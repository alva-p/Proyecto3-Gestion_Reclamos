import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Permiso extends Document {
  @Prop({ required: true, unique: true })
  nombre: string;

  @Prop()
  descripcion: string;

  @Prop({ required: true })
  recurso: string; // Ej: 'reclamos', 'usuarios', 'clientes'

  @Prop({ required: true })
  accion: string; // Ej: 'crear', 'leer', 'actualizar', 'eliminar'
}

export const PermisoSchema = SchemaFactory.createForClass(Permiso);
