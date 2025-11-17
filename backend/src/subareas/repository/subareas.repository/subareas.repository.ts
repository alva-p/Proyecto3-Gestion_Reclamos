import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subarea } from '../../Entidad/subarea.schema';

@Injectable()
export class SubareasRepository {
  constructor(
    @InjectModel(Subarea.name) private subareaModel: Model<Subarea>,
  ) {}

  async create(createSubareaDto: { nombre: string; area: string; esInterna?: boolean }): Promise<Subarea> {
    const createdSubarea = new this.subareaModel(createSubareaDto);
    return createdSubarea.save();
  }

  async findAll(esInterna?: boolean): Promise<Subarea[]> {
    const filter = esInterna !== undefined ? { esInterna } : {};
    return this.subareaModel.find(filter).populate('area').exec();
  }

  async findByArea(areaId: string, esInterna?: boolean): Promise<Subarea[]> {
    const filter: any = { area: areaId };
    if (esInterna !== undefined) {
      filter.esInterna = esInterna;
    }
    return this.subareaModel.find(filter).populate('area').exec();
  }

  async findOne(id: string): Promise<Subarea | null> {
    return this.subareaModel.findById(id).populate('area').exec();
  }

  async findByNameAndArea(nombre: string, areaId: string): Promise<Subarea | null> {
    return this.subareaModel.findOne({ nombre, area: areaId }).exec();
  }

  async update(id: string, updateSubareaDto: Partial<{ nombre: string; area: string; esInterna: boolean }>): Promise<Subarea | null> {
    return this.subareaModel.findByIdAndUpdate(id, updateSubareaDto, { new: true }).populate('area').exec();
  }

  async remove(id: string): Promise<Subarea | null> {
    return this.subareaModel.findByIdAndDelete(id).exec();
  }
}
