import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { ClientesRepository } from './repository/clientes.repository';
import { Cliente, ClienteSchema } from './Entidad/cliente.schema';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { EstadoSolicitudModule } from '../estado-solicitud/estado-solicitud.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cliente.name, schema: ClienteSchema }]),
    forwardRef(() => UsuariosModule),
    EstadoSolicitudModule,
  ],
  controllers: [ClientesController],
  providers: [ClientesService, ClientesRepository],
  exports: [ClientesService, ClientesRepository, MongooseModule],
})
export class ClientesModule {}
