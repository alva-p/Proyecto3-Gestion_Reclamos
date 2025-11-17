import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstadoReclamoController } from './estado-reclamo.controller';
import { EstadoReclamoService } from './estado-reclamo.service';
import { EstadoReclamoRepository } from './repository/estado-reclamo.repository/estado-reclamo.repository';
import { EstadoReclamo, EstadoReclamoSchema } from './Entidad/estado-reclamo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EstadoReclamo.name, schema: EstadoReclamoSchema }]),
  ],
  controllers: [EstadoReclamoController],
  providers: [EstadoReclamoService, EstadoReclamoRepository],
  exports: [EstadoReclamoService, EstadoReclamoRepository],
})
export class EstadoReclamoModule {}
