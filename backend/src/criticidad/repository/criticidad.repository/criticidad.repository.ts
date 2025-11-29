import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Criticidad } from '../../Entidad/criticidad.schema';

@Injectable()
export class CriticidadRepository {
  constructor(
    @InjectModel(Criticidad.name) private criticidadModel: Model<Criticidad>,
  ) {}

  async create(createCriticidadDto: { nombre: string }): Promise<Criticidad> {
    const createdCriticidad = new this.criticidadModel(createCriticidadDto);
    return createdCriticidad.save();
  }

  async findAll(): Promise<Criticidad[]> {
    return this.criticidadModel.find().exec();
  }

  async findOne(id: string): Promise<Criticidad | null> {
    return this.criticidadModel.findById(id).exec();
  }

  async findByName(nombre: string): Promise<Criticidad | null> {
    return this.criticidadModel.findOne({ nombre }).exec();
  }

  async update(id: string, updateCriticidadDto: Partial<{ nombre: string }>): Promise<Criticidad | null> {
    return this.criticidadModel.findByIdAndUpdate(id, updateCriticidadDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Criticidad | null> {
    return this.criticidadModel.findByIdAndDelete(id).exec();
  }
}
