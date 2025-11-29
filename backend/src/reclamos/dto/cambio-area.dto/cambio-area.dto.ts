import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CambiarAreaDto {
  @IsMongoId()
  @IsNotEmpty()
  areaId: string;

  @IsMongoId()
  @IsOptional()
  subareaId?: string;

  // Para historial
  @IsNotEmpty()
  detalleAccion: string;
}
