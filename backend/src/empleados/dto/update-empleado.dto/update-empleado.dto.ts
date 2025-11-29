import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpleadoDto } from '../create-empleado.dto/create-empleado.dto';
import { IsOptional, IsString, IsMongoId } from 'class-validator';

export class UpdateEmpleadoDto extends PartialType(CreateEmpleadoDto) {
  @IsOptional()
  @IsString({ message: 'El puesto debe ser una cadena de texto.' })
  puesto?: string;
  
  /**
   * ID de la Subárea a la que pertenece el empleado (referencia a Subarea).
   * @example "60d0fe4f5b24874d1a520c15"
   */
  @IsOptional()
  @IsMongoId({ message: 'El ID de la subárea debe ser un ID de Mongo válido.' })
  subarea?: string;

  /**
   * ID del Usuario asociado a este empleado (referencia a Usuario).
   * Nota: Aunque 'usuarioId' es obligatorio en Create, se hace opcional aquí.
   * @example "60d0fe4f5b24874d1a520c16"
   */
  @IsOptional()
  @IsMongoId({ message: 'El ID de usuario debe ser un ID de Mongo válido.' })
  usuarioId?: string;
}