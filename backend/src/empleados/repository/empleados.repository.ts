import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Empleado } from '../Entidad/empleado.schema';

@Injectable()
export class EmpleadosRepository {
  constructor(
    @InjectModel(Empleado.name) private empleadoModel: Model<Empleado>,
  ) {}

  async create(data: Partial<Empleado>): Promise<Empleado> {
    const empleado = new this.empleadoModel(data);
    return empleado.save();
  }

  async findAll(): Promise<Empleado[]> {
    return this.empleadoModel.find().populate('subarea').populate('usuarioId').exec();
  }

  async findById(id: string): Promise<Empleado | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.empleadoModel.findById(id).populate('subarea').populate('usuarioId').exec();
  }

  async findByUsuarioId(usuarioId: string): Promise<Empleado | null> {
    if (!Types.ObjectId.isValid(usuarioId)) {
      return null;
    }
    // Convertir a ObjectId para la búsqueda
    return this.empleadoModel.findOne({ usuarioId: new Types.ObjectId(usuarioId) }).populate('subarea').populate('usuarioId').exec();
  }

  async findBySubarea(subareaId: string): Promise<Empleado[]> {
    if (!Types.ObjectId.isValid(subareaId)) {
      return [];
    }
    return this.empleadoModel.find({ subarea: subareaId }).populate('subarea').exec();
  }

  async update(id: string, data: Partial<Empleado>): Promise<Empleado | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.empleadoModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('subarea')
      .exec();
  }

  async delete(id: string): Promise<Empleado | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.empleadoModel.findByIdAndDelete(id).exec();
  }
}
