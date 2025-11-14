import { Module } from '@nestjs/common';
import { PermisosController } from './permisos.controller';
import { PermisosService } from './permisos.service';
import { PermisosRepository } from './repository/permisos.repository/permisos.repository';

@Module({
  controllers: [PermisosController],
  providers: [PermisosService, PermisosRepository]
})
export class PermisosModule {}
