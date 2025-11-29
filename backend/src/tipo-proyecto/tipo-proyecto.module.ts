import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoProyectoController } from './tipo-proyecto.controller';
import { TipoProyectoService } from './tipo-proyecto.service';
import { TipoProyectoRepository } from './repository/tipo-proyecto.repository/tipo-proyecto.repository';
import { TipoProyecto, TipoProyectoSchema } from './Entidad/tipo-proyecto.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TipoProyecto.name, schema: TipoProyectoSchema }]),
  ],
  controllers: [TipoProyectoController],
  providers: [TipoProyectoService, TipoProyectoRepository],
  exports: [TipoProyectoService, TipoProyectoRepository],
})
export class TipoProyectoModule {}
