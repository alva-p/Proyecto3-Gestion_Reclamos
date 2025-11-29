import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reclamo, ReclamoDocument } from '../../Entidad/reclamo.schema';

@Injectable()
export class ReclamosRepository {
  constructor(
    @InjectModel(Reclamo.name)
    private readonly reclamoModel: Model<ReclamoDocument>,
  ) {}

  // Crear reclamo
  async create(data: any): Promise<ReclamoDocument> {
    return this.reclamoModel.create(data);
  }

  // Buscar por ID (sin new ObjectId para evitar el BSONError)
  async findById(id: string): Promise<ReclamoDocument | null> {
    return this.reclamoModel
      .findById(id)
      .populate(
        'tipoReclamo prioridad criticidad area subarea estadoActual asignadoActual historialIds resumenResolucionId',
      )
      .exec();
  }

  // Listado con filtros
  async findAll(filters: any = {}): Promise<ReclamoDocument[]> {
    return this.reclamoModel
      .find(filters)
      .populate(
        'tipoReclamo prioridad criticidad area subarea estadoActual asignadoActual historialIds resumenResolucionId',
      )
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

  // Contar reclamos por proyecto
  async countByProyecto(proyectoId: string): Promise<number> {
    return this.reclamoModel.countDocuments({ proyectoId }).exec();
  }
}
