import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsMongoId } from 'class-validator';

export class RegisterEmpleadoDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña: string;

  @IsString({ message: 'El puesto debe ser un texto' })
  @IsNotEmpty({ message: 'El puesto es obligatorio' })
  puesto: string;

  @IsOptional()
  @IsMongoId({ message: 'El ID de subárea debe ser un ObjectId válido' })
  subareaId?: string;
}
