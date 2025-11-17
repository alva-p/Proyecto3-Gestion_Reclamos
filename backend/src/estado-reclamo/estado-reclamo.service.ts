import { Injectable, NotFoundException, ConflictException, OnModuleInit } from '@nestjs/common';
import { EstadoReclamoRepository } from './repository/estado-reclamo.repository/estado-reclamo.repository';
import { CreateEstadoReclamoDto } from './dto/create-estado-reclamo.dto/create-estado-reclamo.dto';
import { UpdateEstadoReclamoDto } from './dto/update-estado-reclamo.dto/update-estado-reclamo.dto';
import { EstadoReclamo } from './Entidad/estado-reclamo.schema';

@Injectable()
export class EstadoReclamoService implements OnModuleInit {
  constructor(private readonly estadoReclamoRepository: EstadoReclamoRepository) {}

  async onModuleInit() {
    // Crear estados funcionales del reclamo al iniciar el módulo
    await this.estadoReclamoRepository.seedEstados();
  }

  async create(createEstadoReclamoDto: CreateEstadoReclamoDto): Promise<EstadoReclamo> {
    const existingEstadoReclamo = await this.estadoReclamoRepository.findByName(createEstadoReclamoDto.nombre);
    if (existingEstadoReclamo) {
      throw new ConflictException('Ya existe un estado de reclamo con ese nombre');
    }
    return this.estadoReclamoRepository.create(createEstadoReclamoDto);
  }

  async findAll(): Promise<EstadoReclamo[]> {
    return this.estadoReclamoRepository.findAll();
  }

  async findOne(id: string): Promise<EstadoReclamo> {
    const estadoReclamo = await this.estadoReclamoRepository.findOne(id);
    if (!estadoReclamo) {
      throw new NotFoundException(`Estado de reclamo con ID ${id} no encontrado`);
    }
    return estadoReclamo;
  }

  async update(id: string, updateEstadoReclamoDto: UpdateEstadoReclamoDto): Promise<EstadoReclamo> {
    if (updateEstadoReclamoDto.nombre) {
      const existingEstadoReclamo = await this.estadoReclamoRepository.findByName(updateEstadoReclamoDto.nombre);
      if (existingEstadoReclamo && existingEstadoReclamo._id.toString() !== id) {
        throw new ConflictException('Ya existe un estado de reclamo con ese nombre');
      }
    }
    const estadoReclamo = await this.estadoReclamoRepository.update(id, updateEstadoReclamoDto);
    if (!estadoReclamo) {
      throw new NotFoundException(`Estado de reclamo con ID ${id} no encontrado`);
    }
    return estadoReclamo;
  }

  async remove(id: string): Promise<void> {
    const estadoReclamo = await this.estadoReclamoRepository.findOne(id);
    if (!estadoReclamo) {
      throw new NotFoundException(`Estado de reclamo con ID ${id} no encontrado`);
    }
    await this.estadoReclamoRepository.remove(id);
  }
}
