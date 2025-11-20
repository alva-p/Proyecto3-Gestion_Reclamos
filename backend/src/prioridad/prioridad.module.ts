import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Prioridad, PrioridadSchema } from './Entidad/prioridad.schema';
import { PrioridadController } from './prioridad.controller';
import { PrioridadService } from './prioridad.service';
import { PrioridadRepository } from './repository/prioridad.repository/prioridad.repository';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Prioridad.name, schema: PrioridadSchema },
    ]),
  ],
  controllers: [PrioridadController],
  providers: [PrioridadService, PrioridadRepository],
  exports: [PrioridadService],  // <-- FUNDAMENTAL
})
export class PrioridadModule {}

