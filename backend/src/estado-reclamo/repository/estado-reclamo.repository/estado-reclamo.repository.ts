import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EstadoReclamo,
  EstadoReclamoDocument,
} from '../../Entidad/estado-reclamo.schema';

@Injectable()
export class EstadoReclamoRepository {
  constructor(
    @InjectModel(EstadoReclamo.name)
    private readonly estadoModel: Model<EstadoReclamoDocument>,
  ) {}

  async findAll() {
    return this.estadoModel.find().exec();
  }

  async findById(id: string) {
    return this.estadoModel.findById(id).exec();
  }

  async findByNombre(nombre: string) {
    return this.estadoModel.findOne({ nombre }).exec();
  }

  async create(data: any) {
    return this.estadoModel.create(data);
  }

  async update(id: string, data: any) {
    return this.estadoModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    return this.estadoModel.findByIdAndDelete(id).exec();
  }
}
