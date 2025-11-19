import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AsignarEmpleadoDto {
  @IsMongoId()
  @IsNotEmpty()
  empleadoId: string;
}
