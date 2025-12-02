import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Reclamo, ReclamoDocument } from '../../Entidad/reclamo.schema';

@Injectable()
export class ReclamosRepository {
  constructor(
    @InjectModel(Reclamo.name)
    private readonly reclamoModel: Model<ReclamoDocument>,
  ) {}

  // Crear reclamo
  async create(data: any, session?: ClientSession): Promise<ReclamoDocument> {
    return this.reclamoModel.create([data], { session }).then(r => r[0]);
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
  async update(
    id: string,
    data: any,
    session?: ClientSession,
  ): Promise<ReclamoDocument | null> {
    return this.reclamoModel
      .findByIdAndUpdate(id, data, { new: true, session })
      .exec();
  }

  // Eliminar
  async delete(id: string, session?: ClientSession): Promise<ReclamoDocument | null> {
    return this.reclamoModel.findByIdAndDelete(id, { session }).exec();
  }

  // Agregar registro al historial
  async pushHistorial(
    reclamoId: string,
    historialId: string,
    session?: ClientSession,
  ): Promise<ReclamoDocument | null> {
    return this.reclamoModel
      .findByIdAndUpdate(
        reclamoId,
        { $push: { historialIds: historialId } },
        { new: true, session },
      )
      .exec();
  }

  // Cambiar estado
  async updateEstado(
    reclamoId: string,
    estadoId: string,
    session?: ClientSession,
  ): Promise<ReclamoDocument | null> {
    return this.reclamoModel
      .findByIdAndUpdate(
        reclamoId,
        { estadoActual: estadoId },
        { new: true, session },
      )
      .exec();
  }

  // Asignar empleado responsable
  async asignarEmpleado(
    reclamoId: string,
    empleadoId: string,
    session?: ClientSession,
  ): Promise<ReclamoDocument | null> {
    return this.reclamoModel
      .findByIdAndUpdate(
        reclamoId,
        { asignadoActual: empleadoId },
        { new: true, session },
      )
      .exec();
  }

  // Contar reclamos por proyecto
  async countByProyecto(proyectoId: string): Promise<number> {
    return this.reclamoModel.countDocuments({ proyectoId }).exec();
  }
}
