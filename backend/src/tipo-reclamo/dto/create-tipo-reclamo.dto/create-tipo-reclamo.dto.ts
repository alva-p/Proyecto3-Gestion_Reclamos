import { IsString, IsMongoId, IsOptional, IsBoolean } from 'class-validator';
export class CreateTipoReclamoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
