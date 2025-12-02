import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ComentarioInterno } from '../Entidad/comentario-interno.schema';

@Injectable()
export class ComentariosInternosRepository {
  constructor(
    @InjectModel(ComentarioInterno.name)
    private readonly comentarioModel: Model<ComentarioInterno>,
  ) {}

  async create(data: Partial<ComentarioInterno>): Promise<ComentarioInterno> {
    const comentario = new this.comentarioModel(data);
    return comentario.save();
  }

  async findByReclamoId(reclamoId: string): Promise<ComentarioInterno[]> {
    return this.comentarioModel
      .find({ reclamoId })
      .populate('usuarioId', 'nombre correo')
      .sort({ fechaCreacion: -1 })
      .exec();
  }

  async findById(id: string): Promise<ComentarioInterno | null> {
    return this.comentarioModel
      .findById(id)
      .populate('usuarioId', 'nombre correo')
      .exec();
  }

  async delete(id: string): Promise<ComentarioInterno | null> {
    return this.comentarioModel.findByIdAndDelete(id).exec();
  }
}
