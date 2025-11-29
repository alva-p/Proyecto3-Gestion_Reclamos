import { IsNotEmpty, IsString, IsMongoId, IsOptional } from 'class-validator';

export class CreateEmpleadoDto {
  @IsNotEmpty({ message: 'El puesto es obligatorio.' })
  @IsString({ message: 'El puesto debe ser una cadena de texto.' })
  puesto: string;

  @IsOptional()
  @IsMongoId({ message: 'El ID de la subárea debe ser un ID de Mongo válido.' })
  subarea?: string;
  
  @IsNotEmpty({ message: 'El ID de usuario es obligatorio.' })
  @IsMongoId({ message: 'El ID de usuario debe ser un ID de Mongo válido.' })
  usuarioId: string;
}