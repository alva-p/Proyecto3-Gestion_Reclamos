import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpleadosController } from './empleados.controller';
import { EmpleadosService } from './empleados.service';
import { EmpleadosRepository } from './repository/empleados.repository';
import { Empleado, EmpleadoSchema } from './Entidad/empleado.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Empleado.name, schema: EmpleadoSchema }]),
  ],
  controllers: [EmpleadosController],
  providers: [EmpleadosService, EmpleadosRepository],
  exports: [EmpleadosService, EmpleadosRepository, MongooseModule],
})
export class EmpleadosModule {}
