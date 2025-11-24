import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rol } from '../Entidad/rol.schema';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectModel(Rol.name) private rolModel: Model<Rol>,
  ) {}

  async create(data: Partial<Rol>): Promise<Rol> {
    const rol = new this.rolModel(data);
    return rol.save();
  }

  async findAll(): Promise<Rol[]> {
    return this.rolModel.find().populate('permisos').exec();
  }

  async findById(id: string): Promise<Rol | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.rolModel.findById(id).populate('permisos').exec();
  }

  async findByName(nombre: string): Promise<Rol | null> {
    return this.rolModel.findOne({ nombre }).populate('permisos').exec();
  }

  async update(id: string, data: Partial<Rol>): Promise<Rol | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.rolModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('permisos')
      .exec();
  }

  async delete(id: string): Promise<Rol | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.rolModel.findByIdAndDelete(id).exec();
  }

  async addPermiso(rolId: string, permisoId: string): Promise<Rol | null> {
    if (!Types.ObjectId.isValid(rolId) || !Types.ObjectId.isValid(permisoId)) {
      return null;
    }
    return this.rolModel
      .findByIdAndUpdate(
        rolId,
        { $addToSet: { permisos: permisoId } },
        { new: true }
      )
      .populate('permisos')
      .exec();
  }

  async removePermiso(rolId: string, permisoId: string): Promise<Rol | null> {
    if (!Types.ObjectId.isValid(rolId) || !Types.ObjectId.isValid(permisoId)) {
      return null;
    }
    return this.rolModel
      .findByIdAndUpdate(
        rolId,
        { $pull: { permisos: permisoId } },
        { new: true }
      )
      .populate('permisos')
      .exec();
  }
}
