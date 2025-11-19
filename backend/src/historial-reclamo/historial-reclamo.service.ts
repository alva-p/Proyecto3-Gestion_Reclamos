import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { HistorialReclamoRepository } from './repository/historial-reclamo.repository/historial-reclamo.repository';
import { EstadoReclamoService } from '../estado-reclamo/estado-reclamo.service';
import { AreaService } from '../areas/areas.service';
import { SubareaService } from '../subareas/subareas.service';
import { EmpleadoService } from '../empleados/empleados.service';

@Injectable()
export class HistorialReclamoService {
  constructor(
    private readonly historialRepository: HistorialReclamoRepository,
    private readonly estadoReclamoService: EstadoReclamoService,
    private readonly areaService: AreaService,
    private readonly subareaService: SubareaService,
    private readonly empleadoService: EmpleadoService,
  ) {}

  // Crear historial simple
  async create(dto: any) {
    const { estadoReclamo, area, subarea, empleado, detalleAccion, reclamoId } = dto;

    if (!detalleAccion || detalleAccion.trim().length === 0) {
      throw new BadRequestException('El detalle de acción es obligatorio.');
    }

    const estado = await this.estadoReclamoService.findById(estadoReclamo);
    if (!estado) throw new NotFoundException('Estado de reclamo inválido.');

    const areaFound = await this.areaService.findById(area);
    if (!areaFound) throw new NotFoundException('Área inválida.');

    let subareaFound = null;
    if (subarea) {
      subareaFound = await this.subareaService.findById(subarea);
      if (!subareaFound) throw new NotFoundException('Subárea inválida.');
    }

    let empleadoFound = null;
    if (empleado) {
      empleadoFound = await this.empleadoService.findById(empleado);
      if (!empleadoFound) throw new NotFoundException('Empleado inválido.');
    }

    return this.historialRepository.create({
      estadoReclamo: estadoReclamo,
      area,
      subarea: subarea ?? null,
      empleado: empleado ?? null,
      detalleAccion,
      reclamoId,
      fechaHora: new Date(),
    });
  }

  // Crear historial y asociarlo al reclamo
  async createAndAttach(reclamoId: string, dto: any) {
    const { detalleAccion } = dto;
    if (!detalleAccion || detalleAccion.trim().length === 0) {
      throw new BadRequestException('El detalle de acción es obligatorio.');
    }
    return this.historialRepository.createAndAttach(reclamoId, dto);
  }
    // Obtener historial completo de un reclamo
  async findByReclamo(reclamoId: string) {
    return this.historialRepository.findByReclamo(reclamoId);
  }
}
