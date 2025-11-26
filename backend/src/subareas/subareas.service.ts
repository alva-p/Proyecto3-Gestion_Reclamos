import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { SubareasRepository } from './repository/subareas.repository/subareas.repository';
import { CreateSubareaDto } from './dto/create-subarea.dto/create-subarea.dto';
import { UpdateSubareaDto } from './dto/update-subarea.dto/update-subarea.dto';
import { Subarea } from './Entidad/subarea.schema';

@Injectable()
export class SubareasService {
  constructor(private readonly subareasRepository: SubareasRepository) {}

  async create(createSubareaDto: CreateSubareaDto): Promise<Subarea> {
    const existingSubarea = await this.subareasRepository.findByNameAndArea(
      createSubareaDto.nombre,
      createSubareaDto.area,
    );
    if (existingSubarea) {
      throw new ConflictException('Ya existe una subárea con ese nombre en el área especificada');
    }
    return this.subareasRepository.create(createSubareaDto);
  }

  async findAll(esInterna?: boolean): Promise<Subarea[]> {
    // Si esInterna es false, solo devolver subáreas públicas (no internas)
    const filterInterna = esInterna === false ? false : undefined;
    return this.subareasRepository.findAll(filterInterna);
  }

  async findByArea(areaId: string, esInterna?: boolean): Promise<Subarea[]> {
    const filterInterna = esInterna === false ? false : undefined;
    return this.subareasRepository.findByArea(areaId, filterInterna);
  }

  async findById(id: string): Promise<Subarea> {
    const subarea = await this.subareasRepository.findById(id);
    if (!subarea) {
      throw new NotFoundException(`Subárea con ID ${id} no encontrada`);
    }
    return subarea;
  }

  async update(id: string, updateSubareaDto: UpdateSubareaDto): Promise<Subarea> {
    if (updateSubareaDto.nombre && updateSubareaDto.area) {
      const existingSubarea = await this.subareasRepository.findByNameAndArea(
        updateSubareaDto.nombre,
        updateSubareaDto.area,
      );
      if (existingSubarea && existingSubarea._id.toString() !== id) {
        throw new ConflictException('Ya existe una subárea con ese nombre en el área especificada');
      }
    }
    const subarea = await this.subareasRepository.update(id, updateSubareaDto);
    if (!subarea) {
      throw new NotFoundException(`Subárea con ID ${id} no encontrada`);
    }
    return subarea;
  }

  async remove(id: string): Promise<void> {
    const subarea = await this.subareasRepository.findOne(id);
    if (!subarea) {
      throw new NotFoundException(`Subárea con ID ${id} no encontrada`);
    }
    await this.subareasRepository.remove(id);
  }
}
