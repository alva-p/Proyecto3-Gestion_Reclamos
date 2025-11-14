import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TipoProyecto } from '../../tipo-proyecto/Entidad/tipo-proyecto.schema';

@Schema({ timestamps: true })
export class Proyecto extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion: string;

  @Prop({ type: String, ref: TipoProyecto.name })
  tipoProyecto: TipoProyecto;

  @Prop({ required: true })
  clienteId: string;
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);
