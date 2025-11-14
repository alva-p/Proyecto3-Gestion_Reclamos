import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Rol extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion: string;
}

export const RolSchema = SchemaFactory.createForClass(Rol);
