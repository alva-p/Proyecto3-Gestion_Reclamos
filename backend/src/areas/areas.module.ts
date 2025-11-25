import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { AreasRepository } from './repository/areas.repository/areas.repository';
import { Area, AreaSchema } from './Entidad/area.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  controllers: [AreasController],
  providers: [AreasService, AreasRepository],
  exports: [AreasService],
})
export class AreasModule {}
