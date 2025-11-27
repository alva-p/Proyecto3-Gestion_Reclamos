import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PermisosRepository } from './repository/permisos.repository';
import { Permiso } from './Entidad/permiso.schema';

@Injectable()
export class PermisosService {
  constructor(private readonly permisosRepository: PermisosRepository) {}

  async create(data: Partial<Permiso>): Promise<Permiso> {
    const { nombre } = data;
    if (!nombre) {
      throw new BadRequestException('El nombre del permiso es obligatorio');
    }
    // Verificar que el nombre no exista
    const existingPermiso = await this.permisosRepository.findByName(nombre);
    if (existingPermiso) {
      throw new ConflictException(`El permiso ${nombre} ya existe`);
    }
    return this.permisosRepository.create(data);
  }

  async findAll(): Promise<Permiso[]> {
    return this.permisosRepository.findAll();
  }

  async findById(id: string): Promise<Permiso> {
    const permiso = await this.permisosRepository.findById(id);
    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }
    return permiso;
  }

  async findByName(nombre: string): Promise<Permiso | null> {
    return this.permisosRepository.findByName(nombre);
  }

  async findByRecurso(recurso: string): Promise<Permiso[]> {
    return this.permisosRepository.findByRecurso(recurso);
  }

  async update(id: string, data: Partial<Permiso>): Promise<Permiso> {
    const permiso = await this.permisosRepository.update(id, data);
    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }
    return permiso;
  }

  async delete(id: string): Promise<Permiso> {
    const permiso = await this.permisosRepository.delete(id);
    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }
    return permiso;
  }
}

