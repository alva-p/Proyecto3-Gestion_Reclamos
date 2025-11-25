import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area } from '../../Entidad/area.schema';

@Injectable()
export class AreasRepository {
  constructor(@InjectModel(Area.name) private areaModel: Model<Area>) {}

  create(dto: Partial<Area>) {
    return this.areaModel.create(dto);
  }

  findAll() {
    return this.areaModel.find().exec();
  }

  findById(id: string) {
    return this.areaModel.findById(id).exec();
  }

  updateById(id: string, update: Partial<Area>) {
    return this.areaModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  deleteById(id: string) {
    return this.areaModel.findByIdAndDelete(id).exec();
  }
}
