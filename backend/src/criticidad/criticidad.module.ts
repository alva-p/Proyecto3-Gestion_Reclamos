import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CriticidadController } from './criticidad.controller';
import { CriticidadService } from './criticidad.service';
import { CriticidadRepository } from './repository/criticidad.repository/criticidad.repository';
import { Criticidad, CriticidadSchema } from './Entidad/criticidad.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Criticidad.name, schema: CriticidadSchema },
      ]),
    ],
  controllers: [CriticidadController],
  providers: [CriticidadService, CriticidadRepository],
  exports: [CriticidadService],  
})
export class CriticidadModule {}
