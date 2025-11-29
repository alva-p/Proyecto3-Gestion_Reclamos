import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TipoReclamo } from '../../Entidad/tipo-reclamo.schema';

@Injectable()
export class TipoReclamoRepository {
  constructor(
    @InjectModel(TipoReclamo.name) private tipoReclamoModel: Model<TipoReclamo>,
  ) {}

  async create(createTipoReclamoDto: { nombre: string; descripcion?: string }): Promise<TipoReclamo> {
    const createdTipoReclamo = new this.tipoReclamoModel(createTipoReclamoDto);
    return createdTipoReclamo.save();
  }

  async findAll(): Promise<TipoReclamo[]> {
    return this.tipoReclamoModel.find().exec();
  }

  async findOne(id: string): Promise<TipoReclamo | null> {
    return this.tipoReclamoModel.findById(id).exec();
  }

  async findByName(nombre: string): Promise<TipoReclamo | null> {
    return this.tipoReclamoModel.findOne({ nombre }).exec();
  }

  async update(id: string, updateTipoReclamoDto: Partial<{ nombre: string; descripcion: string }>): Promise<TipoReclamo | null> {
    return this.tipoReclamoModel.findByIdAndUpdate(id, updateTipoReclamoDto, { new: true }).exec();
  }

  async remove(id: string): Promise<TipoReclamo | null> {
    return this.tipoReclamoModel.findByIdAndDelete(id).exec();
  }
}
