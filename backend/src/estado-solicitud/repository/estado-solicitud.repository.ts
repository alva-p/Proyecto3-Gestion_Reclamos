import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EstadoSolicitud } from '../Entidad/estado-solicitud.schema';

@Injectable()
export class EstadoSolicitudRepository {
  constructor(
    @InjectModel(EstadoSolicitud.name) private estadoSolicitudModel: Model<EstadoSolicitud>,
  ) {}

  async create(data: Partial<EstadoSolicitud>): Promise<EstadoSolicitud> {
    const estadoSolicitud = new this.estadoSolicitudModel(data);
    return estadoSolicitud.save();
  }

  async findAll(): Promise<EstadoSolicitud[]> {
    return this.estadoSolicitudModel.find().exec();
  }

  async findById(id: string): Promise<EstadoSolicitud | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.estadoSolicitudModel.findById(id).exec();
  }

  async findByName(nombre: string): Promise<EstadoSolicitud | null> {
    return this.estadoSolicitudModel.findOne({ nombre }).exec();
  }

  async update(id: string, data: Partial<EstadoSolicitud>): Promise<EstadoSolicitud | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.estadoSolicitudModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<EstadoSolicitud | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.estadoSolicitudModel.findByIdAndDelete(id).exec();
  }
}
