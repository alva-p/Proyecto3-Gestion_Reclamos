import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HistorialReclamoController } from './historial-reclamo.controller';
import { HistorialReclamoService } from './historial-reclamo.service';
import { HistorialReclamoRepository } from './repository/historial-reclamo.repository/historial-reclamo.repository';

import { HistorialReclamo, HistorialReclamoSchema } from './Entidad/historial-reclamo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistorialReclamo.name, schema: HistorialReclamoSchema },
    ]),
  ],
  controllers: [HistorialReclamoController],
  providers: [HistorialReclamoService, HistorialReclamoRepository],
  exports: [HistorialReclamoService, HistorialReclamoRepository],
})
export class HistorialReclamoModule {}
