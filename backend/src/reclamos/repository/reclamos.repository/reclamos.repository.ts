import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reclamo } from '../../Entidad/reclamo.schema';

@Injectable()
export class ReclamosRepository {
  constructor(
    @InjectModel(Reclamo.name) private reclamoModel: Model<Reclamo>,
  ) {}

  async countByProyecto(proyectoId: string): Promise<number> {
    return this.reclamoModel.countDocuments({ proyectoId }).exec();
  }
}
