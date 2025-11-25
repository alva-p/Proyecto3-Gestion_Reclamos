import { Module } from '@nestjs/common';
import { SubareasController } from './subareas.controller';
import { SubareasService } from './subareas.service';
import { SubareasRepository } from './repository/subareas.repository/subareas.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Subarea, SubareaSchema } from './Entidad/subarea.schema';
import { Area, AreaSchema } from '../areas/Entidad/area.schema';
import { Reclamo, ReclamoSchema } from '../reclamos/Entidad/reclamo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subarea.name, schema: SubareaSchema },
      { name: Area.name, schema: AreaSchema },
      { name: Reclamo.name, schema: ReclamoSchema },
    ]),
  ],
  controllers: [SubareasController],
  providers: [SubareasService, SubareasRepository],
  exports: [SubareasService],
})
export class SubareasModule {}
