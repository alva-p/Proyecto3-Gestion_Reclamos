import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Rol } from '../../roles/Entidad/rol.schema';

@Schema({ timestamps: true })
export class Usuario extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  correo: string;

  @Prop({ required: true, select: false }) // select: false para no incluirla en queries por defecto
  contraseña: string;

  @Prop({ default: true })
  activo: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Rol', required: true })
  rol: Types.ObjectId | Rol;

  @Prop()
  refreshToken?: string; // Para futuras implementaciones de refresh tokens
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
