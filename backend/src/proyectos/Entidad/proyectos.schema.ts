import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TipoProyecto } from '../../tipo-proyecto/Entidad/tipo-proyecto.schema';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Proyecto extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion: string;

  @Prop({ type: Types.ObjectId, ref: TipoProyecto.name })
  tipoProyecto: Types.ObjectId | TipoProyecto;

  @Prop({ type: Types.ObjectId, ref: 'Cliente', required: true })
  clienteId: Types.ObjectId; // acá incluso podrías renombrar a cliente si querés
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);
