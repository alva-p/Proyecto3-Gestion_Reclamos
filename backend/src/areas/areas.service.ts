import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { AreasRepository } from './repository/areas.repository/areas.repository';
import { CreateAreaDto } from './dto/create-area.dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto/update-area.dto';
import { Area } from './Entidad/area.schema';

@Injectable()
export class AreasService {
  constructor(private readonly areasRepository: AreasRepository) {}

  async create(createAreaDto: CreateAreaDto): Promise<Area> {
    const existingArea = await this.areasRepository.findByName(createAreaDto.nombre);
    if (existingArea) {
      throw new ConflictException('Ya existe un área con ese nombre');
    }
    return this.areasRepository.create(createAreaDto);
  }

  async findAll(): Promise<Area[]> {
    return this.areasRepository.findAll();
  }

  async findOne(id: string): Promise<Area> {
    const area = await this.areasRepository.findOne(id);
    if (!area) {
      throw new NotFoundException(`Área con ID ${id} no encontrada`);
    }
    return area;
  }

  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<Area> {
    if (updateAreaDto.nombre) {
      const existingArea = await this.areasRepository.findByName(updateAreaDto.nombre);
      if (existingArea && existingArea._id.toString() !== id) {
        throw new ConflictException('Ya existe un área con ese nombre');
      }
    }
    const area = await this.areasRepository.update(id, updateAreaDto);
    if (!area) {
      throw new NotFoundException(`Área con ID ${id} no encontrada`);
    }
    return area;
  }

  async remove(id: string): Promise<void> {
    const area = await this.areasRepository.findOne(id);
    if (!area) {
      throw new NotFoundException(`Área con ID ${id} no encontrada`);
    }
    await this.areasRepository.remove(id);
  }
}
