import { IsString, IsNotEmpty, IsOptional, IsMongoId, MaxLength, MinLength } from 'class-validator';

export class CreateReclamoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(2000)
  descripcion: string;

  @IsMongoId()
  @IsNotEmpty()
  tipoReclamo: string;

  @IsMongoId()
  @IsNotEmpty()
  prioridad: string;

  @IsMongoId()
  @IsNotEmpty()
  criticidad: string;

  @IsMongoId()
  @IsNotEmpty()
  area: string;

  @IsMongoId()
  @IsOptional()
  subarea?: string;

  @IsMongoId()
  @IsNotEmpty()
  proyectoId: string;
}
