import { Module } from '@nestjs/common';
import { PrioridadController } from './prioridad.controller';
import { PrioridadService } from './prioridad.service';
import { PrioridadRepository } from './repository/prioridad.repository/prioridad.repository';

@Module({
  controllers: [PrioridadController],
  providers: [PrioridadService, PrioridadRepository]
})
export class PrioridadModule {}
