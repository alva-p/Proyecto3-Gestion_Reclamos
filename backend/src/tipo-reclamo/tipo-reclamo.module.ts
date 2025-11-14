import { Module } from '@nestjs/common';
import { TipoReclamoController } from './tipo-reclamo.controller';
import { TipoReclamoService } from './tipo-reclamo.service';
import { TipoReclamoRepository } from './repository/tipo-reclamo.repository/tipo-reclamo.repository';

@Module({
  controllers: [TipoReclamoController],
  providers: [TipoReclamoService, TipoReclamoRepository]
})
export class TipoReclamoModule {}
