import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {HistorialReclamo, HistorialReclamoDocument,} from '../../Entidad/historial-reclamo.schema';
import { ReclamosRepository } from '../../../reclamos/repository/reclamos.repository/reclamos.repository';
import { CreateHistorialReclamoDto } from '../../dto/create-historial-reclamo.dto/create-historial-reclamo.dto';

@Injectable()
export class HistorialReclamoRepository {
  constructor(
    @InjectModel(HistorialReclamo.name)
    private readonly historialModel: Model<HistorialReclamoDocument>,
    private readonly reclamosRepository: ReclamosRepository,
  ) {}

  // Crear registro simple de historial
  async create(data: CreateHistorialReclamoDto): Promise<HistorialReclamoDocument> {
    const {...rest} = data as any
    return this.historialModel.create({
      ...rest,
      fechaHora: data.fechaHora ?? new Date(),
    });
  }

  // Obtener historial completo de un reclamo
  async findByReclamo(reclamoId: string): Promise<HistorialReclamoDocument[]> {
    return this.historialModel
      .find({ reclamoId: new Types.ObjectId(reclamoId) })
      .populate('estadoreclamo area subarea empleado')
      .sort({ fechaHora: 1 })
      .exec();
  }

  // Crear historial y asociarlo al Reclamo
  async createAndAttach(reclamoId: string, data: CreateHistorialReclamoDto,): Promise<HistorialReclamoDocument> {
    const reclamo = await this.reclamosRepository.findById(reclamoId);
    if (!reclamo) {
      throw new NotFoundException('No se encontró el reclamo para agregar historial.');
    }
    const { ...rest } = data as any;
    const historial = await this.create({
      ...rest,
      reclamoId,
      fechaHora: new Date(),
    });
    await this.reclamosRepository.pushHistorial(reclamoId, historial._id as string);
    return historial;
  }
}
