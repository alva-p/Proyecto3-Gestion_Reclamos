import { Module } from '@nestjs/common';
import { CriticidadController } from './criticidad.controller';
import { CriticidadService } from './criticidad.service';
import { CriticidadRepository } from './repository/criticidad.repository/criticidad.repository';

@Module({
  controllers: [CriticidadController],
  providers: [CriticidadService, CriticidadRepository]
})
export class CriticidadModule {}
