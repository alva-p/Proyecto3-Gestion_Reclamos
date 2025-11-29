import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CambiarEstadoReclamoDto {
  @IsMongoId()
  @IsNotEmpty()
  nuevoEstadoId: string;

  @IsMongoId()
  @IsOptional()
  empleadoId?: string;
}
