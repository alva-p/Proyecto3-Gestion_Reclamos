import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EstadoReclamo } from '../../Entidad/estado-reclamo.schema';

@Injectable()
export class EstadoReclamoRepository {
  constructor(
    @InjectModel(EstadoReclamo.name) private estadoReclamoModel: Model<EstadoReclamo>,
  ) {}

  async create(createEstadoReclamoDto: { nombre: string }): Promise<EstadoReclamo> {
    const createdEstadoReclamo = new this.estadoReclamoModel(createEstadoReclamoDto);
    return createdEstadoReclamo.save();
  }

  async findAll(): Promise<EstadoReclamo[]> {
    return this.estadoReclamoModel.find().exec();
  }

  async findOne(id: string): Promise<EstadoReclamo | null> {
    return this.estadoReclamoModel.findById(id).exec();
  }

  async findByName(nombre: string): Promise<EstadoReclamo | null> {
    return this.estadoReclamoModel.findOne({ nombre }).exec();
  }

  async update(id: string, updateEstadoReclamoDto: Partial<{ nombre: string }>): Promise<EstadoReclamo | null> {
    return this.estadoReclamoModel.findByIdAndUpdate(id, updateEstadoReclamoDto, { new: true }).exec();
  }

  async remove(id: string): Promise<EstadoReclamo | null> {
    return this.estadoReclamoModel.findByIdAndDelete(id).exec();
  }

  async seedEstados(): Promise<void> {
    const estados = [
      'Pendiente',
      'En Proceso',
      'En Revisión',
      'Resuelto',
      'Cerrado',
      'Cancelado',
    ];

    for (const nombre of estados) {
      const existingEstado = await this.findByName(nombre);
      if (!existingEstado) {
        await this.create({ nombre });
      }
    }
  }
}
