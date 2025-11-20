import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HistorialReclamoController } from './historial-reclamo.controller';
import { HistorialReclamoService } from './historial-reclamo.service';
import { HistorialReclamoRepository } from './repository/historial-reclamo.repository/historial-reclamo.repository';
import { HistorialReclamo, HistorialReclamoSchema } from './Entidad/historial-reclamo.schema';

import { ReclamosModule } from '../reclamos/reclamos.module';
import { EstadoReclamoModule } from '../estado-reclamo/estado-reclamo.module'; // <-- Agrega este import
import { AreasModule } from '../areas/areas.module'; // <-- Asegurate de que el path sea correcto
import { SubareasModule } from '../subareas/subareas.module'; // <-- Asegurate de que el path sea correcto
import { EmpleadosModule } from '../empleados/empleados.module'; // <-- Asegurate de que el path sea correcto


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistorialReclamo.name, schema: HistorialReclamoSchema },
    ]),
    AreasModule,
    forwardRef(() => ReclamosModule),
    forwardRef(() => EstadoReclamoModule), 
    SubareasModule,                   
    EmpleadosModule 
  ],
  controllers: [HistorialReclamoController],
  providers: [HistorialReclamoService, HistorialReclamoRepository],
  exports: [HistorialReclamoService, HistorialReclamoRepository],
})
export class HistorialReclamoModule {}