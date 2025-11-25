import { Injectable } from '@nestjs/common';
import { AreasRepository } from './repository/areas.repository/areas.repository';
import { Area } from './Entidad/area.schema';

@Injectable()
export class AreasService {
  constructor(private readonly areasRepository: AreasRepository) {}

  create(createDto: { nombre: string }) {
    return this.areasRepository.create(createDto);
  }

  findAll() {
    return this.areasRepository.findAll();
  }

  findById(id: string) {
    return this.areasRepository.findById(id);
  }

  update(id: string, updateDto: Partial<Area>) {
    return this.areasRepository.updateById(id, updateDto);
  }

  delete(id: string) {
    return this.areasRepository.deleteById(id);
  }
}
