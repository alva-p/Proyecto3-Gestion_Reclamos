import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subarea } from '../../Entidad/subarea.schema';

@Injectable()
export class SubareasRepository {
	constructor(@InjectModel(Subarea.name) private subareaModel: Model<Subarea>) {}

	create(dto: Partial<Subarea>) {
		return this.subareaModel.create(dto);
	}

	findAll(filter: any = {}) {
		return this.subareaModel.find(filter).exec();
	}

	findById(id: string) {
		return this.subareaModel.findById(id).exec();
	}

	updateById(id: string, update: Partial<Subarea>) {
		return this.subareaModel.findByIdAndUpdate(id, update, { new: true }).exec();
	}

	deleteById(id: string) {
		return this.subareaModel.findByIdAndDelete(id).exec();
	}
}
