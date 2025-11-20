import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReclamosController } from './reclamos.controller';
import { ReclamosService } from './reclamos.service';
import { ReclamosRepository } from './repository/reclamos.repository/reclamos.repository';
import { Reclamo, ReclamoSchema } from './Entidad/reclamo.schema';

import { ProyectosModule } from '../proyectos/proyectos.module';
import { TipoReclamoModule } from '../tipo-reclamo/tipo-reclamo.module';
import { PrioridadModule } from '../prioridad/prioridad.module';
import { CriticidadModule } from '../criticidad/criticidad.module';
import { AreasModule } from '../areas/areas.module';
import { SubareasModule } from '../subareas/subareas.module';
import { EmpleadosModule } from '../empleados/empleados.module';

import { HistorialReclamoModule } from '../historial-reclamo/historial-reclamo.module';
import { EstadoReclamoModule } from '../estado-reclamo/estado-reclamo.module';
import { ResumenResolucionModule } from '../resumen-resolucion/resumen-resolucion.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reclamo.name, schema: ReclamoSchema },
    ]),

    // Dependencias directas del service
    ProyectosModule,
    TipoReclamoModule,
    PrioridadModule,
    CriticidadModule,
    AreasModule,
    SubareasModule,
    EmpleadosModule,

    // Relaciones cruzadas
    forwardRef(() => HistorialReclamoModule),
    forwardRef(() => EstadoReclamoModule),
    forwardRef(() => ResumenResolucionModule),
  ],
  controllers: [ReclamosController],
  providers: [ReclamosService, ReclamosRepository],
  exports: [ReclamosService, ReclamosRepository],
})
export class ReclamosModule {}
