import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateProyectoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsMongoId({ message: 'tipoProyecto debe ser un ObjectId válido' })
  tipoProyecto?: string;

  @IsMongoId({ message: 'clienteId debe ser un ObjectId válido' })
  @IsNotEmpty()
  clienteId: string;
}
