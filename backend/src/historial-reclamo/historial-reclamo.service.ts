import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { HistorialReclamoRepository } from './repository/historial-reclamo.repository/historial-reclamo.repository';
import { EstadoReclamoService } from '../estado-reclamo/estado-reclamo.service';
import { AreasService } from '../areas/areas.service';
import { SubareasService } from '../subareas/subareas.service';
import { EmpleadosService } from '../empleados/empleados.service';
import { sanitizeHistorialForClient } from '../common/helpers/historial-serializer';

@Injectable()
export class HistorialReclamoService {
  constructor(
    private readonly historialRepository: HistorialReclamoRepository,
    private readonly estadoReclamoService: EstadoReclamoService,
    private readonly areaService: AreasService,
    private readonly subareaService: SubareasService,
    private readonly empleadoService: EmpleadosService,
  ) {}

  // Crear historial simple (soporta transacción)
  async create(dto: any, session?: ClientSession) {
    const {
      estadoReclamo,
      area,
      subarea,
      empleado,
      detalleAccion,
      reclamoId,
    } = dto;

    // Validaciones mínimas
    if (!detalleAccion || detalleAccion.trim().length === 0) {
      throw new BadRequestException('El detalle de acción es obligatorio.');
    }

    // Si quisieras volver a activar validaciones fuertes:
    /*
    const estado = await this.estadoReclamoService.findById(estadoReclamo);
    if (!estado) throw new NotFoundException('Estado de reclamo inválido.');

    const areaFound = await this.areaService.findById(area);
    if (!areaFound) throw new NotFoundException('Área inválida.');

    let subareaFound = null;
    if (subarea) {
      subareaFound = await this.subareaService.findById(subarea);
      if (!subareaFound) throw new NotFoundException('Subárea inválida.');
    }
    */

    if (empleado) {
      await this.empleadoService.findById(empleado);
    }

    return this.historialRepository.create(
      {
        estadoReclamo,
        area,
        subarea: subarea ?? null,
        empleado: empleado ?? null,
        detalleAccion,
        reclamoId,
        fechaHora: new Date(),
      },
      session,
    );
  }

  // Crear historial y asociarlo al reclamo (soporta transacción)
  async createAndAttach(
    reclamoId: string,
    dto: any,
    session?: ClientSession,
  ) {
    const { detalleAccion } = dto;

    if (!detalleAccion || detalleAccion.trim().length === 0) {
      throw new BadRequestException('El detalle de acción es obligatorio.');
    }

    return this.historialRepository.createAndAttach(
      reclamoId,
      dto,
      session,
    );
  }

  // Obtener historial completo de un reclamo
  async findByReclamo(reclamoId: string) {
    return this.historialRepository.findByReclamo(reclamoId);
  }

  async findHistorialForClient(reclamoId: string) {
    const historial = await this.historialRepository.findByReclamo(reclamoId);
    return sanitizeHistorialForClient(historial);
  }
}
