import { Module } from '@nestjs/common';
import { ResumenResolucionController } from './resumen-resolucion.controller';
import { ResumenResolucionService } from './resumen-resolucion.service';
import { ResumenResolucionRepository } from './repository/resumen-resolucion.repository/resumen-resolucion.repository';

@Module({
  controllers: [ResumenResolucionController],
  providers: [ResumenResolucionService, ResumenResolucionRepository]
})
export class ResumenResolucionModule {}
