import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Empleado, EmpleadoSchema } from './Entidad/empleado.schema';
import { EmpleadosService } from './empleados.service';
import { EmpleadosRepository } from './repository/empleados.repository/empleados.repository';
import { EmpleadosController } from './empleados.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Empleado.name, schema: EmpleadoSchema },
    ]),
  ],
  controllers: [EmpleadosController],
  providers: [EmpleadosService, EmpleadosRepository],
  exports: [EmpleadosService], // <-- FUNDAMENTAL
})
export class EmpleadosModule {}
