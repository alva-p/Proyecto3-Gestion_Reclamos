import { IsString, IsMongoId, IsOptional, IsBoolean } from 'class-validator';

export class CreateSubareaDto {
  @IsString()
  nombre: string;

  @IsMongoId()
  area: string;

  @IsOptional()
  @IsBoolean()
  esInterna?: boolean;
}
