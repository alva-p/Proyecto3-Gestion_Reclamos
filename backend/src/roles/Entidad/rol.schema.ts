import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Permiso } from '../../permisos/Entidad/permiso.schema';

@Schema({ timestamps: true })
export class Rol extends Document {
  @Prop({ required: true, unique: true })
  nombre: string;

  @Prop()
  descripcion: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Permiso' }], default: [] })
  permisos: Types.ObjectId[] | Permiso[];
}

export const RolSchema = SchemaFactory.createForClass(Rol);
