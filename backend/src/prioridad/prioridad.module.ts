import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrioridadController } from './prioridad.controller';
import { PrioridadService } from './prioridad.service';
import { PrioridadRepository } from './repository/prioridad.repository/prioridad.repository';
import { Prioridad, PrioridadSchema } from './Entidad/prioridad.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Prioridad.name, schema: PrioridadSchema },
    ]),
  ],
  controllers: [PrioridadController],
  providers: [PrioridadService, PrioridadRepository],
  exports: [PrioridadService],
})
export class PrioridadModule {}
