
import { ProyectosController } from './proyectos.controller';
import { Proyecto, ProyectoSchema } from './Entidad/proyectos.schema';
import { ProyectosService } from './proyectos.service';
import { ProyectosRepository } from './repository/proyectos.repository/proyectos.repository';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Proyecto.name, schema: ProyectoSchema },
    ]),
  ],
  controllers: [ProyectosController],
  providers: [ProyectosService, ProyectosRepository],
  exports: [ProyectosService],   // <-------- IMPORTANTE
})
export class ProyectosModule {}

