import { Module } from '@nestjs/common';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';
import { ProyectosRepository } from './repository/proyectos.repository/proyectos.repository';

@Module({
  controllers: [ProyectosController],
  providers: [ProyectosService, ProyectosRepository]
})
export class ProyectosModule {}
