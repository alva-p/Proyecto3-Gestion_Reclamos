import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { EstadoSolicitudRepository } from './repository/estado-solicitud.repository';
import { EstadoSolicitud } from './Entidad/estado-solicitud.schema';

@Injectable()
export class EstadoSolicitudService {
  constructor(private readonly estadoSolicitudRepository: EstadoSolicitudRepository) {}

  async create(data: Partial<EstadoSolicitud>): Promise<EstadoSolicitud> {
    // Verificar que el nombre no exista
    const existingEstado = await this.estadoSolicitudRepository.findByName(data.nombre);
    if (existingEstado) {
      throw new ConflictException(`El estado ${data.nombre} ya existe`);
    }
    return this.estadoSolicitudRepository.create(data);
  }

  async findAll(): Promise<EstadoSolicitud[]> {
    return this.estadoSolicitudRepository.findAll();
  }

  async findById(id: string): Promise<EstadoSolicitud> {
    const estado = await this.estadoSolicitudRepository.findById(id);
    if (!estado) {
      throw new NotFoundException(`Estado de solicitud con ID ${id} no encontrado`);
    }
    return estado;
  }

  async findByName(nombre: string): Promise<EstadoSolicitud | null> {
    return this.estadoSolicitudRepository.findByName(nombre);
  }

  async update(id: string, data: Partial<EstadoSolicitud>): Promise<EstadoSolicitud> {
    const estado = await this.estadoSolicitudRepository.update(id, data);
    if (!estado) {
      throw new NotFoundException(`Estado de solicitud con ID ${id} no encontrado`);
    }
    return estado;
  }

  async delete(id: string): Promise<EstadoSolicitud> {
    const estado = await this.estadoSolicitudRepository.delete(id);
    if (!estado) {
      throw new NotFoundException(`Estado de solicitud con ID ${id} no encontrado`);
    }
    return estado;
  }
}

