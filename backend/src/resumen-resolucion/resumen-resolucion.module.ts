import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ResumenResolucionController } from './resumen-resolucion.controller';
import { ResumenResolucionService } from './resumen-resolucion.service';
import { ResumenResolucionRepository } from './repository/resumen-resolucion.repository/resumen-resolucion.repository';
import { ResumenResolucion, ResumenResolucionSchema } from './Entidad/resumen-resolucion.schema';

import { ReclamosModule } from '../reclamos/reclamos.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResumenResolucion.name, schema: ResumenResolucionSchema },
    ]),
    forwardRef(() => ReclamosModule),
  ],
  controllers: [ResumenResolucionController],
  providers: [ResumenResolucionService, ResumenResolucionRepository],
  exports: [ResumenResolucionService, ResumenResolucionRepository],
})
export class ResumenResolucionModule {}