import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ResumenResolucionRepository } from './repository/resumen-resolucion.repository/resumen-resolucion.repository';
import { ReclamosRepository } from '../reclamos/repository/reclamos.repository/reclamos.repository';
import { CrearResumenResolucionDto } from './dto/create-resumen-resolucion.dto/create-resumen-resolucion.dto';

@Injectable()
export class ResumenResolucionService {
  constructor(
    private readonly resumenRepo: ResumenResolucionRepository,
    private readonly reclamosRepo: ReclamosRepository,
  ) {}

  async crearResumen(dto: CrearResumenResolucionDto, reclamoId: string) {
    const reclamo = await this.reclamosRepo.findById(reclamoId);
    if (!reclamo) {
      throw new NotFoundException('El reclamo no existe.');
    }
    const resumen = await this.resumenRepo.create({
      reclamoId,
      descripcion: dto.descripcion,
      responsable: dto.responsableId,
      fechaHora: new Date(),
    });
    await this.reclamosRepo.update(reclamoId, {
      resumenResolucionId: resumen._id,
    });

    return resumen;
  }


  async findByReclamo(reclamoId: string) {
    const reclamo = await this.reclamosRepo.findById(reclamoId);
    if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');
    if (!reclamo.resumenResolucionId) {
      throw new NotFoundException(
        'El reclamo no tiene resumen de resolución aún.',
      );
    }
    return this.resumenRepo.findById(reclamo.resumenResolucionId);
  }
  async findAll(filters: any) {
    return this.resumenRepo.findAll(filters);
  }

  async findById(id: string) {
    const resumen = await this.resumenRepo.findById(id);
    if (!resumen) throw new NotFoundException('Resumen no encontrado.');
    return resumen;
  }

  async update(id: string, data: any) {
    return this.resumenRepo.update(id, data);
  }

  async delete(id: string) {
    return this.resumenRepo.delete(id);
  }
}
