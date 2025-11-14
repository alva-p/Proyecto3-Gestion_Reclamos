import { Module } from '@nestjs/common';
import { ReclamosController } from './reclamos.controller';
import { ReclamosService } from './reclamos.service';
import { ReclamosRepository } from './repository/reclamos.repository/reclamos.repository';

@Module({
  controllers: [ReclamosController],
  providers: [ReclamosService, ReclamosRepository]
})
export class ReclamosModule {}
