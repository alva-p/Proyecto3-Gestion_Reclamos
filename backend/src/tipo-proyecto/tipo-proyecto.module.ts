import { Module } from '@nestjs/common';
import { TipoProyectoController } from './tipo-proyecto.controller';
import { TipoProyectoService } from './tipo-proyecto.service';
import { TipoProyectoRepository } from './repository/tipo-proyecto.repository/tipo-proyecto.repository';

@Module({
  controllers: [TipoProyectoController],
  providers: [TipoProyectoService, TipoProyectoRepository]
})
export class TipoProyectoModule {}
