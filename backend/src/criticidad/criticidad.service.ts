import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CriticidadRepository } from './repository/criticidad.repository/criticidad.repository';
import { CreateCriticidadDto } from './dto/create-criticidad.dto/create-criticidad.dto';
import { UpdateCriticidadDto } from './dto/update-criticidad.dto/update-criticidad.dto';
import { Criticidad } from './Entidad/criticidad.schema';

@Injectable()
export class CriticidadService {
  constructor(private readonly criticidadRepository: CriticidadRepository) {}

  async create(createCriticidadDto: CreateCriticidadDto): Promise<Criticidad> {
    const existingCriticidad = await this.criticidadRepository.findByName(createCriticidadDto.nombre);
    if (existingCriticidad) {
      throw new ConflictException('Ya existe una criticidad con ese nombre');
    }
    return this.criticidadRepository.create(createCriticidadDto);
  }

  async findAll(): Promise<Criticidad[]> {
    return this.criticidadRepository.findAll();
  }

  async findOne(id: string): Promise<Criticidad> {
    const criticidad = await this.criticidadRepository.findOne(id);
    if (!criticidad) {
      throw new NotFoundException(`Criticidad con ID ${id} no encontrada`);
    }
    return criticidad;
  }

  async update(id: string, updateCriticidadDto: UpdateCriticidadDto): Promise<Criticidad> {
    if (updateCriticidadDto.nombre) {
      const existingCriticidad = await this.criticidadRepository.findByName(updateCriticidadDto.nombre);
      if (existingCriticidad && existingCriticidad._id.toString() !== id) {
        throw new ConflictException('Ya existe una criticidad con ese nombre');
      }
    }
    const criticidad = await this.criticidadRepository.update(id, updateCriticidadDto);
    if (!criticidad) {
      throw new NotFoundException(`Criticidad con ID ${id} no encontrada`);
    }
    return criticidad;
  }

  async remove(id: string): Promise<void> {
    const criticidad = await this.criticidadRepository.findOne(id);
    if (!criticidad) {
      throw new NotFoundException(`Criticidad con ID ${id} no encontrada`);
    }
    await this.criticidadRepository.remove(id);
  }
}
