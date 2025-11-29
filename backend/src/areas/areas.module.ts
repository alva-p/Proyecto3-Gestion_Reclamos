import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { Area, AreaSchema } from './Entidad/area.schema';
import { AreasRepository } from './repository/areas.repository/areas.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  controllers: [AreasController],
  providers: [AreasService, AreasRepository],
  exports: [AreasService, AreasRepository],
})
export class AreasModule {}
