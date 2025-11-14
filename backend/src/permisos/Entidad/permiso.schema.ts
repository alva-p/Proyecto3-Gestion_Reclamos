import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Permiso extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion: string;
}

export const PermisoSchema = SchemaFactory.createForClass(Permiso);
