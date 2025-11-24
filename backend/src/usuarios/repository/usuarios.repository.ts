import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Usuario } from '../Entidad/usuario.schema';

@Injectable()
export class UsuariosRepository {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const usuario = new this.usuarioModel(data);
    return usuario.save();
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().populate('rol').exec();
  }

  async findById(id: string): Promise<Usuario | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.usuarioModel.findById(id).populate('rol').exec();
  }

  async findByEmail(correo: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ correo }).populate('rol').exec();
  }

  async findByEmailWithPassword(correo: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ correo }).select('+contraseña').populate('rol').exec();
  }

  async update(id: string, data: Partial<Usuario>): Promise<Usuario | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.usuarioModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('rol')
      .exec();
  }

  async delete(id: string): Promise<Usuario | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.usuarioModel.findByIdAndDelete(id).exec();
  }

  async findByRole(rolId: string): Promise<Usuario[]> {
    if (!Types.ObjectId.isValid(rolId)) {
      return [];
    }
    return this.usuarioModel.find({ rol: rolId }).populate('rol').exec();
  }

  async countByEmail(correo: string): Promise<number> {
    return this.usuarioModel.countDocuments({ correo }).exec();
  }
}
