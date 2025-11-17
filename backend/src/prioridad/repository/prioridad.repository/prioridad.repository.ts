import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prioridad } from '../../Entidad/prioridad.schema';

@Injectable()
export class PrioridadRepository {
  constructor(
    @InjectModel(Prioridad.name) private prioridadModel: Model<Prioridad>,
  ) {}

  async create(createPrioridadDto: { nombre: string }): Promise<Prioridad> {
    const createdPrioridad = new this.prioridadModel(createPrioridadDto);
    return createdPrioridad.save();
  }

  async findAll(): Promise<Prioridad[]> {
    return this.prioridadModel.find().exec();
  }

  async findOne(id: string): Promise<Prioridad | null> {
    return this.prioridadModel.findById(id).exec();
  }

  async findByName(nombre: string): Promise<Prioridad | null> {
    return this.prioridadModel.findOne({ nombre }).exec();
  }

  async update(id: string, updatePrioridadDto: Partial<{ nombre: string }>): Promise<Prioridad | null> {
    return this.prioridadModel.findByIdAndUpdate(id, updatePrioridadDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Prioridad | null> {
    return this.prioridadModel.findByIdAndDelete(id).exec();
  }
}
