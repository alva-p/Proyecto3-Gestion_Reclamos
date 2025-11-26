import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proyecto } from '../../Entidad/proyectos.schema';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';


@Injectable()
export class ProyectosRepository {
  constructor(
    @InjectModel(Proyecto.name) private proyectoModel: Model<Proyecto>,
  ) {}

  async create(createProyectoDto: { nombre: string; descripcion?: string; tipoProyecto?: string; clienteId: string }): Promise<Proyecto> {
    const createdProyecto = new this.proyectoModel(createProyectoDto);
    return createdProyecto.save();
  }

  async findAll(clienteId?: string, tipoProyecto?: string, nombre?: string): Promise<Proyecto[]> {
    const filter: any = {};
    if (clienteId) {
      filter.clienteId = clienteId;
    }
    if (tipoProyecto) {
      filter.tipoProyecto = tipoProyecto;
    }
    if (nombre) {
      filter.nombre = { $regex: nombre, $options: 'i' };
    }
    return this.proyectoModel.find(filter).populate('tipoProyecto').exec();
  }
  async findById(id: string, clienteId?: string): Promise<Proyecto> {
    const proyecto = await this.proyectoModel.findById(id).exec(); 
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    if (clienteId && proyecto.clienteId !== clienteId) {
      throw new ForbiddenException('No tienes permiso para ver este proyecto');
    }
    return proyecto;
  }

  async findByCliente(clienteId: string): Promise<Proyecto[]> {
    return this.proyectoModel.find({ clienteId }).populate('tipoProyecto').exec();
  }

  async update(id: string, updateProyectoDto: Partial<{ nombre: string; descripcion: string; tipoProyecto: string; clienteId: string }>): Promise<Proyecto | null> {
    return this.proyectoModel.findByIdAndUpdate(id, updateProyectoDto, { new: true }).populate('tipoProyecto').exec();
  }

  async remove(id: string): Promise<Proyecto | null> {
    return this.proyectoModel.findByIdAndDelete(id).exec();
  }
}
