import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ProyectosRepository } from './repository/proyectos.repository/proyectos.repository';
import { CreateProyectoDto } from './dto/create-proyecto.dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto/update-proyecto.dto';
import { Proyecto } from './Entidad/proyectos.schema';
import { ReclamosRepository } from '../reclamos/repository/reclamos.repository/reclamos.repository';

@Injectable()
export class ProyectosService {
  constructor(
    private readonly proyectosRepository: ProyectosRepository,
    private readonly reclamosRepository: ReclamosRepository,
  ) {}

  async create(createProyectoDto: CreateProyectoDto, clienteId?: string): Promise<Proyecto> {
    // Si se proporciona clienteId, validar que coincida
    if (clienteId && createProyectoDto.clienteId !== clienteId) {
      throw new ForbiddenException('No puedes crear proyectos para otros clientes');
    }
    return this.proyectosRepository.create(createProyectoDto);
  }

  async findAll(clienteId?: string, tipoProyecto?: string, nombre?: string): Promise<Proyecto[]> {
    // Si se proporciona clienteId, solo devolver proyectos de ese cliente
    return this.proyectosRepository.findAll(clienteId, tipoProyecto, nombre);
  }

  async findById(id: string, clienteId?: string): Promise<Proyecto> {
    const proyecto = await this.proyectosRepository.findById(id);
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    // Si se proporciona clienteId, validar que el proyecto pertenezca a ese cliente
    if (clienteId && proyecto.clienteId !== clienteId) {
      throw new ForbiddenException('No tienes permiso para ver este proyecto');
    }
    return proyecto;
  }

  async update(id: string, updateProyectoDto: UpdateProyectoDto, clienteId?: string): Promise<Proyecto> {
    
    const proyecto = await this.proyectosRepository.findById(id);
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    // Si se proporciona clienteId, validar que el proyecto pertenezca a ese cliente
    if (clienteId && proyecto.clienteId !== clienteId) {
      throw new ForbiddenException('No tienes permiso para editar este proyecto');
    }
    // No permitir cambiar el clienteId del proyecto
    if (updateProyectoDto.clienteId && updateProyectoDto.clienteId !== proyecto.clienteId) {
      throw new BadRequestException('No se puede cambiar el cliente del proyecto');
    }
    const updatedProyecto = await this.proyectosRepository.update(id, updateProyectoDto);
    if (!updatedProyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    return updatedProyecto;
  }

  async remove(id: string, clienteId?: string): Promise<void> {
    const proyecto = await this.proyectosRepository.findById(id);
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    // Si se proporciona clienteId, validar que el proyecto pertenezca a ese cliente
    if (clienteId && proyecto.clienteId !== clienteId) {
      throw new ForbiddenException('No tienes permiso para eliminar este proyecto');
    }
    // Verificar si hay reclamos asociados
    const reclamosCount = await this.reclamosRepository.countByProyecto(id);
    if (reclamosCount > 0) {
      throw new BadRequestException(`No se puede eliminar el proyecto porque tiene ${reclamosCount} reclamo(s) asociado(s)`);
    }
    await this.proyectosRepository.remove(id);
  }
}
