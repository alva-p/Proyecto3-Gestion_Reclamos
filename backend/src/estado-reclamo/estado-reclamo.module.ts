import { Module } from '@nestjs/common';
import { EstadoReclamoController } from './estado-reclamo.controller';
import { EstadoReclamoService } from './estado-reclamo.service';
import { EstadoReclamoRepository } from './repository/estado-reclamo.repository/estado-reclamo.repository';

@Module({
  controllers: [EstadoReclamoController],
  providers: [EstadoReclamoService, EstadoReclamoRepository]
})
export class EstadoReclamoModule {}
