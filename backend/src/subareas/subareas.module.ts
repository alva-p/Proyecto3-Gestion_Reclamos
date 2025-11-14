import { Module } from '@nestjs/common';
import { SubareasController } from './subareas.controller';
import { SubareasService } from './subareas.service';
import { SubareasRepository } from './repository/subareas.repository/subareas.repository';

@Module({
  controllers: [SubareasController],
  providers: [SubareasService, SubareasRepository]
})
export class SubareasModule {}
