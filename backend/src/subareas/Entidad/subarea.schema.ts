import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Area } from '../../areas/Entidad/area.schema';

@Schema()
export class Subarea extends Document {
  @Prop({ required: true })
  nombre: string;

  // Guarda el ObjectId de Area como string (referencia), se tipa flexible para evitar errores TS
  @Prop({ type: String, ref: Area.name })
  area: string | Area;
}

export const SubareaSchema = SchemaFactory.createForClass(Subarea);
