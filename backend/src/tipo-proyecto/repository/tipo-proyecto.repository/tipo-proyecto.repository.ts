import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TipoProyecto } from '../../Entidad/tipo-proyecto.schema';

@Injectable()
export class TipoProyectoRepository {
  constructor(
    @InjectModel(TipoProyecto.name) private tipoProyectoModel: Model<TipoProyecto>,
  ) {}

  async create(createTipoProyectoDto: { nombre: string; descripcion?: string }): Promise<TipoProyecto> {
    const createdTipoProyecto = new this.tipoProyectoModel(createTipoProyectoDto);
    return createdTipoProyecto.save();
  }

  async findAll(): Promise<TipoProyecto[]> {
    return this.tipoProyectoModel.find().exec();
  }

  async findOne(id: string): Promise<TipoProyecto | null> {
    return this.tipoProyectoModel.findById(id).exec();
  }

  async findByName(nombre: string): Promise<TipoProyecto | null> {
    return this.tipoProyectoModel.findOne({ nombre }).exec();
  }

  async update(id: string, updateTipoProyectoDto: Partial<{ nombre: string; descripcion: string }>): Promise<TipoProyecto | null> {
    return this.tipoProyectoModel.findByIdAndUpdate(id, updateTipoProyectoDto, { new: true }).exec();
  }

  async remove(id: string): Promise<TipoProyecto | null> {
    return this.tipoProyectoModel.findByIdAndDelete(id).exec();
  }
}
