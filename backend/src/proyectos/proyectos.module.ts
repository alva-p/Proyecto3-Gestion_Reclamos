import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';
import { ProyectosRepository } from './repository/proyectos.repository/proyectos.repository';
import { Proyecto, ProyectoSchema } from './Entidad/proyectos.schema';
import { TipoProyectoModule } from '../tipo-proyecto/tipo-proyecto.module';
import { ReclamosModule } from '../reclamos/reclamos.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Proyecto.name, schema: ProyectoSchema }]),
    TipoProyectoModule,
    ReclamosModule,
  ],
  controllers: [ProyectosController],
  providers: [ProyectosService, ProyectosRepository],
  exports: [ProyectosService, ProyectosRepository],
})
export class ProyectosModule {}
