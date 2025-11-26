import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermisosController } from './permisos.controller';
import { PermisosService } from './permisos.service';
import { PermisosRepository } from './repository/permisos.repository';
import { Permiso, PermisoSchema } from './Entidad/permiso.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Permiso.name, schema: PermisoSchema }]),
  ],
  controllers: [PermisosController],
  providers: [PermisosService, PermisosRepository],
  exports: [PermisosService, PermisosRepository, MongooseModule],
})
export class PermisosModule {}
