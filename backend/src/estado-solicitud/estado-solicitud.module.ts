import { Module } from '@nestjs/common';
import { EstadoSolicitudController } from './estado-solicitud.controller';
import { EstadoSolicitudService } from './estado-solicitud.service';
import { EstadoSolicitudRepository } from './repository/estado-solicitud.repository/estado-solicitud.repository';

@Module({
  controllers: [EstadoSolicitudController],
  providers: [EstadoSolicitudService, EstadoSolicitudRepository]
})
export class EstadoSolicitudModule {}
