import { Injectable, NotFoundException } from '@nestjs/common';
import { ComentariosInternosRepository } from './repository/comentarios-internos.repository';
import { CreateComentarioInternoDto } from './dto/create-comentario-interno.dto';
import { ReclamosService } from '../reclamos/reclamos.service';

@Injectable()
export class ComentariosInternosService {
  constructor(
    private readonly repository: ComentariosInternosRepository,
    private readonly reclamosService: ReclamosService,
  ) {}

  async create(reclamoId: string, usuarioId: string, dto: CreateComentarioInternoDto) {
    // Verificar que el reclamo existe
    await this.reclamosService.findById(reclamoId);

    return this.repository.create({
      reclamoId: reclamoId as any,
      usuarioId: usuarioId as any,
      texto: dto.texto,
    });
  }

  async findByReclamoId(reclamoId: string) {
    // Verificar que el reclamo existe
    await this.reclamosService.findById(reclamoId);
    
    return this.repository.findByReclamoId(reclamoId);
  }

  async delete(id: string, usuarioId: string) {
    const comentario = await this.repository.findById(id);
    if (!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }

    // Verificar que el usuario que borra es el mismo que creó el comentario
    if (comentario.usuarioId.toString() !== usuarioId) {
      throw new NotFoundException('No tiene permisos para eliminar este comentario');
    }

    return this.repository.delete(id);
  }
}
