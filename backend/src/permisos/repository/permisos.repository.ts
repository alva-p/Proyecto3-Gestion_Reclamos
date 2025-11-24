import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Permiso } from '../Entidad/permiso.schema';

@Injectable()
export class PermisosRepository {
  constructor(
    @InjectModel(Permiso.name) private permisoModel: Model<Permiso>,
  ) {}

  async create(data: Partial<Permiso>): Promise<Permiso> {
    const permiso = new this.permisoModel(data);
    return permiso.save();
  }

  async findAll(): Promise<Permiso[]> {
    return this.permisoModel.find().exec();
  }

  async findById(id: string): Promise<Permiso | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.permisoModel.findById(id).exec();
  }

  async findByName(nombre: string): Promise<Permiso | null> {
    return this.permisoModel.findOne({ nombre }).exec();
  }

  async findByRecurso(recurso: string): Promise<Permiso[]> {
    return this.permisoModel.find({ recurso }).exec();
  }

  async findByRecursoAndAccion(recurso: string, accion: string): Promise<Permiso | null> {
    return this.permisoModel.findOne({ recurso, accion }).exec();
  }

  async update(id: string, data: Partial<Permiso>): Promise<Permiso | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.permisoModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Permiso | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.permisoModel.findByIdAndDelete(id).exec();
  }
}
