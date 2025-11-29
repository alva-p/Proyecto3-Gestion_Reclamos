import { IsString, IsMongoId, IsOptional, IsBoolean } from 'class-validator';
export class CreatePrioridadDto {

  @IsString()
  nombre: string;
}
