import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComentariosInternosController } from './comentarios-internos.controller';
import { ComentariosInternosService } from './comentarios-internos.service';
import { ComentariosInternosRepository } from './repository/comentarios-internos.repository';
import { ComentarioInterno, ComentarioInternoSchema } from './Entidad/comentario-interno.schema';
import { ReclamosModule } from '../reclamos/reclamos.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ComentarioInterno.name, schema: ComentarioInternoSchema },
    ]),
    forwardRef(() => ReclamosModule),
  ],
  controllers: [ComentariosInternosController],
  providers: [ComentariosInternosService, ComentariosInternosRepository],
  exports: [ComentariosInternosService],
})
export class ComentariosInternosModule {}
