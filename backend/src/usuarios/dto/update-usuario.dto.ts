import { IsEmail, IsString, MinLength, IsBoolean, IsOptional, IsMongoId } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  correo?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña?: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser booleano' })
  activo?: boolean;

  @IsOptional()
  @IsMongoId({ message: 'El ID de rol debe ser un ObjectId válido' })
  rol?: string;
}
