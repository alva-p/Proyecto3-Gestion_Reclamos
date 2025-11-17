import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Area } from '../../areas/Entidad/area.schema';

@Schema()
export class Subarea extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ type: String, ref: Area.name, required: true })
  area: Area;

  @Prop({ default: false })
  esInterna: boolean;
}

export const SubareaSchema = SchemaFactory.createForClass(Subarea);
