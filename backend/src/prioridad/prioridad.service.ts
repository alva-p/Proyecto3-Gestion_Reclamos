import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrioridadRepository } from './repository/prioridad.repository/prioridad.repository';
import { CreatePrioridadDto } from './dto/create-prioridad.dto/create-prioridad.dto';
import { UpdatePrioridadDto } from './dto/update-prioridad.dto/update-prioridad.dto';
import { Prioridad } from './Entidad/prioridad.schema';

@Injectable()
export class PrioridadService {
  constructor(private readonly prioridadRepository: PrioridadRepository) {}

  async create(createPrioridadDto: CreatePrioridadDto): Promise<Prioridad> {
    const existingPrioridad = await this.prioridadRepository.findByName(createPrioridadDto.nombre);
    if (existingPrioridad) {
      throw new ConflictException('Ya existe una prioridad con ese nombre');
    }
    return this.prioridadRepository.create(createPrioridadDto);
  }

  async findAll(): Promise<Prioridad[]> {
    return this.prioridadRepository.findAll();
  }

  async findOne(id: string): Promise<Prioridad> {
    const prioridad = await this.prioridadRepository.findOne(id);
    if (!prioridad) {
      throw new NotFoundException(`Prioridad con ID ${id} no encontrada`);
    }
    return prioridad;
  }

  async update(id: string, updatePrioridadDto: UpdatePrioridadDto): Promise<Prioridad> {
    if (updatePrioridadDto.nombre) {
      const existingPrioridad = await this.prioridadRepository.findByName(updatePrioridadDto.nombre);
      if (existingPrioridad && existingPrioridad._id.toString() !== id) {
        throw new ConflictException('Ya existe una prioridad con ese nombre');
      }
    }
    const prioridad = await this.prioridadRepository.update(id, updatePrioridadDto);
    if (!prioridad) {
      throw new NotFoundException(`Prioridad con ID ${id} no encontrada`);
    }
    return prioridad;
  }

  async remove(id: string): Promise<void> {
    const prioridad = await this.prioridadRepository.findOne(id);
    if (!prioridad) {
      throw new NotFoundException(`Prioridad con ID ${id} no encontrada`);
    }
    await this.prioridadRepository.remove(id);
  }
}
