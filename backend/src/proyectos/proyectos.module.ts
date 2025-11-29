import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProyectosController } from './proyectos.controller';
import { Proyecto, ProyectoSchema } from './Entidad/proyectos.schema';
import { ProyectosService } from './proyectos.service';
import { ProyectosRepository } from './repository/proyectos.repository/proyectos.repository';
import { TipoProyectoModule } from '../tipo-proyecto/tipo-proyecto.module';
import { ReclamosModule } from '../reclamos/reclamos.module';
import { ClientesModule } from '../clientes/clientes.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Proyecto.name, schema: ProyectoSchema },
    ]),
    TipoProyectoModule,
    forwardRef(() => ReclamosModule),
    ClientesModule,
  ],
  controllers: [ProyectosController],
  providers: [ProyectosService, ProyectosRepository],
  exports: [ProyectosService],
})
export class ProyectosModule {}
