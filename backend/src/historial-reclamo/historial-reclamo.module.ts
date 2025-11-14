import { Module } from '@nestjs/common';
import { HistorialReclamoController } from './historial-reclamo.controller';
import { HistorialReclamoService } from './historial-reclamo.service';
import { HistorialReclamoRepository } from './repository/historial-reclamo.repository/historial-reclamo.repository';

@Module({
  controllers: [HistorialReclamoController],
  providers: [HistorialReclamoService, HistorialReclamoRepository]
})
export class HistorialReclamoModule {}
