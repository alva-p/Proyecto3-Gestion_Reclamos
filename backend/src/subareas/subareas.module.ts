import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Subarea, SubareaSchema } from './Entidad/subarea.schema';
import { SubareasService } from './subareas.service';
import { SubareasRepository } from './repository/subareas.repository/subareas.repository';
import { SubareasController } from './subareas.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subarea.name, schema: SubareaSchema },
    ])
  ],
  controllers: [SubareasController],
  providers: [SubareasService, SubareasRepository],
  exports: [SubareasService], // <------ FUNDAMENTAL
})
export class SubareasModule {}
