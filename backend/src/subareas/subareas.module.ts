import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubareasController } from './subareas.controller';
import { SubareasService } from './subareas.service';
import { SubareasRepository } from './repository/subareas.repository/subareas.repository';
import { Subarea, SubareaSchema } from './Entidad/subarea.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subarea.name, schema: SubareaSchema },
    ]),
  ],
  controllers: [SubareasController],
  providers: [SubareasService, SubareasRepository],
  exports: [SubareasService],
})
export class SubareasModule {}
