import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EstadoReclamo, EstadoReclamoSchema } from './Entidad/estado-reclamo.schema';
import { EstadoReclamoService } from './estado-reclamo.service';
import { EstadoReclamoRepository } from './repository/estado-reclamo.repository/estado-reclamo.repository';
import { EstadoReclamoController } from './estado-reclamo.controller';

import { ReclamosModule } from '../reclamos/reclamos.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EstadoReclamo.name, schema: EstadoReclamoSchema },
    ]),
    forwardRef(() => ReclamosModule),
  ],
  controllers: [EstadoReclamoController],
  providers: [EstadoReclamoService, EstadoReclamoRepository],
  exports: [EstadoReclamoService, EstadoReclamoRepository],
})
export class EstadoReclamoModule {}