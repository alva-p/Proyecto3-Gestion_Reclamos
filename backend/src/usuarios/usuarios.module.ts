import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { UsuariosRepository } from './repository/usuarios.repository';
import { Usuario, UsuarioSchema } from './Entidad/usuario.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuariosRepository],
  exports: [UsuariosService, UsuariosRepository, MongooseModule],
})
export class UsuariosModule {}
