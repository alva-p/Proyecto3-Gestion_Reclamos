import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoReclamoController } from './tipo-reclamo.controller';
import { TipoReclamoService } from './tipo-reclamo.service';
import { TipoReclamoRepository } from './repository/tipo-reclamo.repository/tipo-reclamo.repository';
import { TipoReclamo, TipoReclamoSchema } from './Entidad/tipo-reclamo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TipoReclamo.name, schema: TipoReclamoSchema },
    ]),
  ],
  controllers: [TipoReclamoController],
  providers: [TipoReclamoService, TipoReclamoRepository],
  exports: [TipoReclamoService],
})
export class TipoReclamoModule {}
