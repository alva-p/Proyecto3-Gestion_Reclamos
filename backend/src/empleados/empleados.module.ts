import { Module } from '@nestjs/common';
import { EmpleadosController } from './empleados.controller';
import { EmpleadosService } from './empleados.service';
import { EmpleadosRepository } from './repository/empleados.repository/empleados.repository';

@Module({
  controllers: [EmpleadosController],
  providers: [EmpleadosService, EmpleadosRepository]
})
export class EmpleadosModule {}
