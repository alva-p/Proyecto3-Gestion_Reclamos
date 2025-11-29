import { IsString, IsMongoId, IsOptional, IsBoolean } from 'class-validator';
export class CreateCriticidadDto {
  @IsString()
  nombre: string;
}
