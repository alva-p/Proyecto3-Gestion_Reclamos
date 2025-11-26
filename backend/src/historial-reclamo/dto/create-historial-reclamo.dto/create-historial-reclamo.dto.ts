import { IsMongoId, IsOptional, IsString, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateHistorialReclamoDto {
  @IsMongoId()
  @IsNotEmpty()
  estadoReclamo: string;

  @IsMongoId()
  @IsNotEmpty()
  area: string;

  @IsMongoId()
  @IsOptional()
  subarea?: string;

  @IsMongoId()
  @IsOptional()
  empleado?: string;

  @IsString()
  @IsNotEmpty()
  detalleAccion: string;

  @IsMongoId()
  @IsNotEmpty()
  reclamoId: string;

  @IsDate()
  @Type(() => Date) 
  fechaHora: Date;

}
