import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTipoProyectoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
