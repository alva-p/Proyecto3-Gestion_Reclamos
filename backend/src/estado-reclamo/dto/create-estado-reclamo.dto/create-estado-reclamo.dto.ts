import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateEstadoReclamoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  nombre: string;
}
