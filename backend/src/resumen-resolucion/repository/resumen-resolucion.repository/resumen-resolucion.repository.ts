import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  ResumenResolucion,
  ResumenResolucionDocument,
} from '../../Entidad/resumen-resolucion.schema';

@Injectable()
export class ResumenResolucionRepository {
  constructor(
    @InjectModel(ResumenResolucion.name)
    private readonly resumenModel: Model<ResumenResolucionDocument>,
  ) {}

  async create(data: any): Promise<ResumenResolucionDocument> {
    return this.resumenModel.create(data);
  }

  async findById(id: string): Promise<ResumenResolucionDocument | null> {
    return this.resumenModel
      .findById(new Types.ObjectId(id))
      .populate('responsable')
      .exec();
  }
  async findAll(filters: any = {}): Promise<ResumenResolucionDocument[]> {
    return this.resumenModel
      .find(filters)
      .populate('responsable')
      .exec();
  }

  async update(id: string, data: any,): Promise<ResumenResolucionDocument | null> {
    return this.resumenModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<ResumenResolucionDocument | null> {
    return this.resumenModel.findByIdAndDelete(id).exec();
  }
}
