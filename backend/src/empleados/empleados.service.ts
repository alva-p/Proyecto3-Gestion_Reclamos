import { Injectable, NotFoundException } from '@nestjs/common';
import { EmpleadosRepository } from './repository/empleados.repository';
import { Empleado } from './Entidad/empleado.schema';

@Injectable()
export class EmpleadosService {
  constructor(private readonly empleadosRepository: EmpleadosRepository) {}

  async create(data: Partial<Empleado>): Promise<Empleado> {
    return this.empleadosRepository.create(data);
  }

  async findAll(): Promise<Empleado[]> {
    return this.empleadosRepository.findAll();
  }

  async findById(id: string): Promise<Empleado> {
    const empleado = await this.empleadosRepository.findById(id);
    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }
    return empleado;
  }

  async findByUsuarioId(usuarioId: string): Promise<Empleado | null> {
    return this.empleadosRepository.findByUsuarioId(usuarioId);
  }

  async findBySubarea(subareaId: string): Promise<Empleado[]> {
    return this.empleadosRepository.findBySubarea(subareaId);
  }

  async update(id: string, data: Partial<Empleado>): Promise<Empleado> {
    const empleado = await this.empleadosRepository.update(id, data);
    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }
    return empleado;
  }

  async delete(id: string): Promise<Empleado> {
    const empleado = await this.empleadosRepository.delete(id);
    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }
    return empleado;
  }
}

