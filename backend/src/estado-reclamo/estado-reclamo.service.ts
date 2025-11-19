import { Injectable, BadRequestException } from '@nestjs/common';
import { EstadoReclamoRepository } from './repository/estado-reclamo.repository/estado-reclamo.repository';

@Injectable()
export class EstadoReclamoService {
  constructor(private readonly repo: EstadoReclamoRepository) {}

  async findAll() {
    return this.repo.findAll();
  }

  async findById(id: string) {
    const estado = await this.repo.findById(id);
    if (!estado) throw new BadRequestException('Estado no encontrado.');
    return estado;
  }

  async findByNombre(nombre: string) {
    return this.repo.findByNombre(nombre);
  }

  async create(data: any) {
    return this.repo.create(data);
  }

  async update(id: string, data: any) {
    return this.repo.update(id, data);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  async seedEstados() {
    const estados = [
      'Enviado',
      'En revisión',
      'Asignado',
      'En proceso',
      'Solucionado',
      'Cerrado',
      'Cancelado',
    ];

    for (const nombre of estados) {
      const existe = await this.repo.findByNombre(nombre);
      if (!existe) await this.repo.create({ nombre });
    }

    return { message: 'Estados cargados correctamente' };
  }
}
