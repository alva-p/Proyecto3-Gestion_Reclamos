import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateEstadoReclamoDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  nombre?: string;
}
