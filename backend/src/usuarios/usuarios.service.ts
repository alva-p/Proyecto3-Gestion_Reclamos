import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsuariosRepository } from './repository/usuarios.repository';
import { Usuario } from './Entidad/usuario.schema';

@Injectable()
export class UsuariosService {
  constructor(private readonly usuariosRepository: UsuariosRepository) {}

  async create(data: Partial<Usuario>): Promise<Usuario> {
    // Verificar si el correo ya existe
    const existingUser = await this.usuariosRepository.findByEmail(data.correo);
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }
    return this.usuariosRepository.create(data);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.findAll();
  }

  async findById(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async findByEmail(correo: string): Promise<Usuario | null> {
    return this.usuariosRepository.findByEmail(correo);
  }

  async findByEmailWithPassword(correo: string): Promise<Usuario | null> {
    return this.usuariosRepository.findByEmailWithPassword(correo);
  }

  async update(id: string, data: Partial<Usuario>): Promise<Usuario> {
    // Si se está actualizando el correo, verificar que no exista
    if (data.correo) {
      const existingUser = await this.usuariosRepository.findByEmail(data.correo);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new ConflictException('El correo ya está registrado');
      }
    }

    const usuario = await this.usuariosRepository.update(id, data);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async delete(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.delete(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async findByRole(rolId: string): Promise<Usuario[]> {
    return this.usuariosRepository.findByRole(rolId);
  }

  async activateUser(id: string): Promise<Usuario> {
    return this.update(id, { activo: true });
  }

  async deactivateUser(id: string): Promise<Usuario> {
    return this.update(id, { activo: false });
  }
}

