import { Module } from '@nestjs/common';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { AreasRepository } from './repository/areas.repository/areas.repository';

@Module({
  controllers: [AreasController],
  providers: [AreasService, AreasRepository]
})
export class AreasModule {}
