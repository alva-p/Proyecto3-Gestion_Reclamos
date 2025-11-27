import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { RolesRepository } from './repository/roles.repository';
import { Rol } from './Entidad/rol.schema';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async create(data: Partial<Rol>): Promise<Rol> {
    const { nombre } = data;
    if (!nombre) {
      throw new BadRequestException('El nombre del rol es obligatorio');
    }
    // Verificar que el nombre no exista
    const existingRol = await this.rolesRepository.findByName(nombre);
    if (existingRol) {
      throw new ConflictException(`El rol ${nombre} ya existe`);
    }
    return this.rolesRepository.create(data);
  }

  async findAll(): Promise<Rol[]> {
    return this.rolesRepository.findAll();
  }

  async findById(id: string): Promise<Rol> {
    const rol = await this.rolesRepository.findById(id);
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    return rol;
  }

  async findByName(nombre: string): Promise<Rol | null> {
    return this.rolesRepository.findByName(nombre);
  }

  async update(id: string, data: Partial<Rol>): Promise<Rol> {
    const rol = await this.rolesRepository.update(id, data);
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    return rol;
  }

  async delete(id: string): Promise<Rol> {
    const rol = await this.rolesRepository.delete(id);
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    return rol;
  }

  async addPermiso(rolId: string, permisoId: string): Promise<Rol> {
    const rol = await this.rolesRepository.addPermiso(rolId, permisoId);
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${rolId} no encontrado`);
    }
    return rol;
  }

  async removePermiso(rolId: string, permisoId: string): Promise<Rol> {
    const rol = await this.rolesRepository.removePermiso(rolId, permisoId);
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${rolId} no encontrado`);
    }
    return rol;
  }
}

