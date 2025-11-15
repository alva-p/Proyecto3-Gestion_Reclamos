import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReclamosController } from './reclamos.controller';
import { ReclamosService } from './reclamos.service';
import { ReclamosRepository } from './repository/reclamos.repository/reclamos.repository';
import { Reclamo, ReclamoSchema } from './Entidad/reclamo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reclamo.name, schema: ReclamoSchema },
    ]),
  ],
  controllers: [ReclamosController],
  providers: [ReclamosService, ReclamosRepository],
  exports: [ReclamosService, ReclamosRepository],
})
export class ReclamosModule {}
