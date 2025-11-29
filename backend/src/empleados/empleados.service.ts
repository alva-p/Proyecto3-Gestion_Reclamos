import { Injectable, NotFoundException } from '@nestjs/common';
import { EmpleadosRepository } from './repository/empleados.repository';
import { Empleado } from './Entidad/empleado.schema';
import { CreateEmpleadoDto } from '../empleados/dto/create-empleado.dto/create-empleado.dto';
import { UpdateEmpleadoDto } from '../empleados/dto/update-empleado.dto/update-empleado.dto';
import { Types } from 'mongoose';
@Injectable()
export class EmpleadosService {
  constructor(private readonly empleadosRepository: EmpleadosRepository) {}

  async create(data: CreateEmpleadoDto): Promise<Empleado> {
    // 1. Crear el objeto que cumple con Partial<Empleado>
    const empleadoData: Partial<Empleado> = {
      puesto: data.puesto,
      usuarioId: new Types.ObjectId(data.usuarioId), // Conversión requerida
    };
    // 2. Si subarea existe, convertirla también
    if (data.subarea) {
      empleadoData.subarea = new Types.ObjectId(data.subarea); // Conversión requerida
    }
    // 3. Pasar el objeto transformado al repositorio
    return this.empleadosRepository.create(empleadoData);
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
  
async update(id: string, data: UpdateEmpleadoDto): Promise<Empleado> {
    // Para el update, también debes hacer la transformación:
    const updateData: Partial<Empleado> = {
        puesto: data.puesto,
    };
    if (data.subarea) {
        updateData.subarea = new Types.ObjectId(data.subarea);
    }
    if (data.usuarioId) {
        updateData.usuarioId = new Types.ObjectId(data.usuarioId);
    }
    const empleado = await this.empleadosRepository.update(id, updateData);
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

