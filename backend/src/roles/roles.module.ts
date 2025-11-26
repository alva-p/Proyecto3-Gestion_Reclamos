import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RolesRepository } from './repository/roles.repository';
import { Rol, RolSchema } from './Entidad/rol.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rol.name, schema: RolSchema }]),
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  exports: [RolesService, RolesRepository, MongooseModule],
})
export class RolesModule {}
