import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterClienteDto {
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

  @IsString({ message: 'La empresa debe ser un texto' })
  @IsNotEmpty({ message: 'La empresa es obligatoria' })
  empresa: string;

  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  telefono: string;

  @IsString({ message: 'La dirección debe ser un texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  direccion: string;
}
