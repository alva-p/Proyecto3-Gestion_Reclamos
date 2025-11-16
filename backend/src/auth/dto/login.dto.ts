import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña: string;
}
