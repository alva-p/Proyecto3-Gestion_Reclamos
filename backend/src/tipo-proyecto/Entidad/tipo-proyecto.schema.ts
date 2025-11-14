import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TipoProyecto extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion: string;
}

export const TipoProyectoSchema = SchemaFactory.createForClass(TipoProyecto);
