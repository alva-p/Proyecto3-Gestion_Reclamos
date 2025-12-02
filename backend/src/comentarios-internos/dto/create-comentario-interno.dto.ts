import { IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateComentarioInternoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'El comentario debe tener al menos 5 caracteres' })
  texto: string;
}
