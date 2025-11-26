import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area, AreaSchema } from '../../Entidad/area.schema';

@Injectable()
export class AreasRepository {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<Area>,
  ) {}

  async create(createAreaDto: { nombre: string }): Promise<Area> {
    const createdArea = new this.areaModel(createAreaDto);
    return createdArea.save();
  }

  async findAll(): Promise<Area[]> {
    return this.areaModel.find().exec();
  }

  async findById(id: string): Promise<Area | null> {
    return this.areaModel.findById(id).exec();
  }

  async findByName(nombre: string): Promise<Area | null> {
    return this.areaModel.findOne({ nombre }).exec();
  }

  async update(id: string, updateAreaDto: Partial<{ nombre: string }>): Promise<Area | null> {
    return this.areaModel.findByIdAndUpdate(id, updateAreaDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Area | null> {
    return this.areaModel.findByIdAndDelete(id).exec();
  }
}
