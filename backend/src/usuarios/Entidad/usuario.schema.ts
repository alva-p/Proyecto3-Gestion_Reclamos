import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Rol } from '../../roles/Entidad/rol.schema';

@Schema({ timestamps: true })
export class Usuario extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  correo: string;

  @Prop({ required: true })
  contraseña: string;

  @Prop({ default: true })
  activo: boolean;

  @Prop({ type: String, ref: Rol.name, required: true })
  rol: Rol;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
