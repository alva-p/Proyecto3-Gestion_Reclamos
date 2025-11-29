import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsMongoId } from 'class-validator';

export class CrearResumenResolucionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(2000)
  descripcion: string;

  @IsMongoId()
  @IsNotEmpty()
  responsableId: string;
}
