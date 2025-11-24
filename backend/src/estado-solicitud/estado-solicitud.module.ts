import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstadoSolicitudController } from './estado-solicitud.controller';
import { EstadoSolicitudService } from './estado-solicitud.service';
import { EstadoSolicitudRepository } from './repository/estado-solicitud.repository';
import { EstadoSolicitud, EstadoSolicitudSchema } from './Entidad/estado-solicitud.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EstadoSolicitud.name, schema: EstadoSolicitudSchema }]),
  ],
  controllers: [EstadoSolicitudController],
  providers: [EstadoSolicitudService, EstadoSolicitudRepository],
  exports: [EstadoSolicitudService, EstadoSolicitudRepository, MongooseModule],
})
export class EstadoSolicitudModule {}
