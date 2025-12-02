import { IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CambiarEstadoReclamoDto {
  @IsMongoId()
  @IsNotEmpty()
  nuevoEstadoId: string;

  @IsMongoId()
  @IsOptional()
  empleadoId?: string;

  // Comentario requerido si el nuevo estado es "Cerrado"
  @IsString()
  @IsOptional()
  @MinLength(10)
  comentario?: string;
}
