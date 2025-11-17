import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TipoProyectoRepository } from './repository/tipo-proyecto.repository/tipo-proyecto.repository';
import { CreateTipoProyectoDto } from './dto/create-tipo-proyecto.dto/create-tipo-proyecto.dto';
import { UpdateTipoProyectoDto } from './dto/update-tipo-proyecto.dto/update-tipo-proyecto.dto';
import { TipoProyecto } from './Entidad/tipo-proyecto.schema';

@Injectable()
export class TipoProyectoService {
  constructor(private readonly tipoProyectoRepository: TipoProyectoRepository) {}

  async create(createTipoProyectoDto: CreateTipoProyectoDto): Promise<TipoProyecto> {
    const existingTipoProyecto = await this.tipoProyectoRepository.findByName(createTipoProyectoDto.nombre);
    if (existingTipoProyecto) {
      throw new ConflictException('Ya existe un tipo de proyecto con ese nombre');
    }
    return this.tipoProyectoRepository.create(createTipoProyectoDto);
  }

  async findAll(): Promise<TipoProyecto[]> {
    return this.tipoProyectoRepository.findAll();
  }

  async findOne(id: string): Promise<TipoProyecto> {
    const tipoProyecto = await this.tipoProyectoRepository.findOne(id);
    if (!tipoProyecto) {
      throw new NotFoundException(`Tipo de proyecto con ID ${id} no encontrado`);
    }
    return tipoProyecto;
  }

  async update(id: string, updateTipoProyectoDto: UpdateTipoProyectoDto): Promise<TipoProyecto> {
    if (updateTipoProyectoDto.nombre) {
      const existingTipoProyecto = await this.tipoProyectoRepository.findByName(updateTipoProyectoDto.nombre);
      if (existingTipoProyecto && existingTipoProyecto._id.toString() !== id) {
        throw new ConflictException('Ya existe un tipo de proyecto con ese nombre');
      }
    }
    const tipoProyecto = await this.tipoProyectoRepository.update(id, updateTipoProyectoDto);
    if (!tipoProyecto) {
      throw new NotFoundException(`Tipo de proyecto con ID ${id} no encontrado`);
    }
    return tipoProyecto;
  }

  async remove(id: string): Promise<void> {
    const tipoProyecto = await this.tipoProyectoRepository.findOne(id);
    if (!tipoProyecto) {
      throw new NotFoundException(`Tipo de proyecto con ID ${id} no encontrado`);
    }
    await this.tipoProyectoRepository.remove(id);
  }
}
