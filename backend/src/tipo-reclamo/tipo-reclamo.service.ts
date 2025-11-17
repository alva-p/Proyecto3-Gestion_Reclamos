import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TipoReclamoRepository } from './repository/tipo-reclamo.repository/tipo-reclamo.repository';
import { CreateTipoReclamoDto } from './dto/create-tipo-reclamo.dto/create-tipo-reclamo.dto';
import { UpdateTipoReclamoDto } from './dto/update-tipo-reclamo.dto/update-tipo-reclamo.dto';
import { TipoReclamo } from './Entidad/tipo-reclamo.schema';

@Injectable()
export class TipoReclamoService {
  constructor(private readonly tipoReclamoRepository: TipoReclamoRepository) {}

  async create(createTipoReclamoDto: CreateTipoReclamoDto): Promise<TipoReclamo> {
    const existingTipoReclamo = await this.tipoReclamoRepository.findByName(createTipoReclamoDto.nombre);
    if (existingTipoReclamo) {
      throw new ConflictException('Ya existe un tipo de reclamo con ese nombre');
    }
    return this.tipoReclamoRepository.create(createTipoReclamoDto);
  }

  async findAll(): Promise<TipoReclamo[]> {
    return this.tipoReclamoRepository.findAll();
  }

  async findOne(id: string): Promise<TipoReclamo> {
    const tipoReclamo = await this.tipoReclamoRepository.findOne(id);
    if (!tipoReclamo) {
      throw new NotFoundException(`Tipo de reclamo con ID ${id} no encontrado`);
    }
    return tipoReclamo;
  }

  async update(id: string, updateTipoReclamoDto: UpdateTipoReclamoDto): Promise<TipoReclamo> {
    if (updateTipoReclamoDto.nombre) {
      const existingTipoReclamo = await this.tipoReclamoRepository.findByName(updateTipoReclamoDto.nombre);
      if (existingTipoReclamo && existingTipoReclamo._id.toString() !== id) {
        throw new ConflictException('Ya existe un tipo de reclamo con ese nombre');
      }
    }
    const tipoReclamo = await this.tipoReclamoRepository.update(id, updateTipoReclamoDto);
    if (!tipoReclamo) {
      throw new NotFoundException(`Tipo de reclamo con ID ${id} no encontrado`);
    }
    return tipoReclamo;
  }

  async remove(id: string): Promise<void> {
    const tipoReclamo = await this.tipoReclamoRepository.findOne(id);
    if (!tipoReclamo) {
      throw new NotFoundException(`Tipo de reclamo con ID ${id} no encontrado`);
    }
    await this.tipoReclamoRepository.remove(id);
  }
}
