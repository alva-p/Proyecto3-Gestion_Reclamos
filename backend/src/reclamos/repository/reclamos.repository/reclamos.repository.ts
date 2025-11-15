import { Injectable } from '@nestjs/common';
import { Reclamo, ReclamoDocument } from '../../Entidad/reclamo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ReclamosRepository {
    constructor(
        @InjectModel(Reclamo.name)
        private readonly reclamoModel: Model<ReclamoDocument>,
    ) {}

    async create(data: any): Promise<ReclamoDocument> {
        return this.reclamoModel.create(data);
    }

    async findById(id: string): Promise<ReclamoDocument | null> {
    return this.reclamoModel
      .findById(new Types.ObjectId(id))
      .populate('cliente proyecto area subarea estado empleadoAsignado')
      .exec();
  }
    // Listado con filtros
  async findAll(filters: any = {}): Promise<ReclamoDocument[]> {
    return this.reclamoModel
      .find(filters)
      .populate('cliente proyecto area subarea estado empleadoAsignado')
      .exec();
  }
    // Actualizar
  async update(id: string, data: any): Promise<ReclamoDocument | null> {
    return this.reclamoModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  // Eliminar
  async delete(id: string): Promise<ReclamoDocument | null> {
    return this.reclamoModel.findByIdAndDelete(id).exec();
  }

    // Agregar registro al historial
  async pushHistorial(
    reclamoId: string,
    historialId: string,
  ): Promise<ReclamoDocument | null> {
    return this.reclamoModel
      .findByIdAndUpdate(
        reclamoId,
        { $push: { historialIds: historialId } },
        { new: true },
      )
      .exec();
  }

  // Cambiar estado
  async updateEstado(
    reclamoId: string,
    estadoId: string,
  ): Promise<ReclamoDocument | null> {
    return this.reclamoModel
      .findByIdAndUpdate(
        reclamoId,
        { estadoActual: estadoId },
        { new: true },
      )
      .exec();
  }

  // Asignar empleado responsable
  async asignarEmpleado(
    reclamoId: string,
    empleadoId: string,
  ): Promise<ReclamoDocument | null> {
    return this.reclamoModel
      .findByIdAndUpdate(
        reclamoId,
        { asignadoActual: empleadoId },
        { new: true },
      )
      .exec();
  }

  // Cambiar área y subárea
  async cambiarArea(
    reclamoId: string,
    areaId: string,
    subareaId?: string,
  ): Promise<ReclamoDocument | null> {
    const updateData: any = {
      area: areaId,
      subarea: subareaId ?? null,
    };

    return this.reclamoModel
      .findByIdAndUpdate(reclamoId, updateData, { new: true })
      .exec();
  }
}
