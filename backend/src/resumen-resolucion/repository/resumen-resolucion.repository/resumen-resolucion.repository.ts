import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
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

  // Crear resumen (soporta transacción)
  async create(
    data: any,
    session?: ClientSession,
  ): Promise<ResumenResolucionDocument> {
    const doc = new this.resumenModel(data);
    return doc.save(session ? { session } : undefined);
  }

  async findAll(filters: any = {}): Promise<ResumenResolucionDocument[]> {
    return this.resumenModel.find(filters).exec();
  }

  async findById(id: string): Promise<ResumenResolucionDocument | null> {
    return this.resumenModel.findById(id).exec();
  }

  async update(
    id: string,
    data: any,
    session?: ClientSession,
  ): Promise<ResumenResolucionDocument | null> {
    return this.resumenModel
      .findByIdAndUpdate(id, data, { new: true, session })
      .exec();
  }

  async delete(
    id: string,
    session?: ClientSession,
  ): Promise<ResumenResolucionDocument | null> {
    return this.resumenModel.findByIdAndDelete(id, { session }).exec();
  }
}
