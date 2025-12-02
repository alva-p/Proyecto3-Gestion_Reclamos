import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cliente } from '../Entidad/cliente.schema';

@Injectable()
export class ClientesRepository {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<Cliente>,
  ) {}

  async create(data: Partial<Cliente>): Promise<Cliente> {
    const cliente = new this.clienteModel(data);
    return cliente.save();
  }

  async findAll(): Promise<Cliente[]> {
    return this.clienteModel
      .find()
      .populate('estadoSolicitud')
      .populate('usuarioId', 'correo nombre')
      .exec();
  }

  async findById(id: string): Promise<Cliente | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.clienteModel
      .findById(id)
      .populate('estadoSolicitud')
      .populate('usuarioId', 'correo nombre')
      .exec();
  }

  async findByUsuarioId(usuarioId: string): Promise<Cliente | null> {
    if (!Types.ObjectId.isValid(usuarioId)) {
      return null;
    }
    return this.clienteModel
      .findOne({ usuarioId })
      .populate('estadoSolicitud')
      .populate('usuarioId', 'correo nombre')
      .exec();
  }

  async findByEstadoSolicitud(estadoId: string): Promise<Cliente[]> {
    if (!Types.ObjectId.isValid(estadoId)) {
      return [];
    }
    return this.clienteModel
      .find({ estadoSolicitud: estadoId })
      .populate('estadoSolicitud')
      .populate('usuarioId', 'correo nombre')
      .exec();
  }

  async update(id: string, data: Partial<Cliente>): Promise<Cliente | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.clienteModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('estadoSolicitud')
      .populate('usuarioId', 'correo nombre')
      .exec();
  }

  async delete(id: string): Promise<Cliente | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.clienteModel.findByIdAndDelete(id).exec();
  }

  async findPendingSolicitudes(): Promise<Cliente[]> {
    return this.clienteModel
      .find()
      .populate('estadoSolicitud')
      .populate('usuarioId', 'correo nombre')
      .then(clientes => 
        clientes.filter(cliente => {
          const estado = cliente.estadoSolicitud as any;
          return estado && estado.nombre === 'PENDIENTE';
        })
      );
  }
}
