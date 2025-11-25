import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { SubareasRepository } from './repository/subareas.repository/subareas.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subarea } from './Entidad/subarea.schema';
import { Area } from '../areas/Entidad/area.schema';
import { Reclamo } from '../reclamos/Entidad/reclamo.schema';

@Injectable()
export class SubareasService {
	constructor(
		private readonly subareasRepository: SubareasRepository,
		@InjectModel(Area.name) private areaModel: Model<Area>,
		@InjectModel(Reclamo.name) private reclamoModel: Model<Reclamo>,
	) {}

	async create(createDto: { nombre: string; area: string }) {
		const area = await this.areaModel.findById(createDto.area).exec();
		if (!area) throw new NotFoundException('Area not found');
		// Persistimos el id de área como string
		return this.subareasRepository.create({ nombre: createDto.nombre, area: area.id });
	}

	findAll(areaId?: string) {
		const filter: any = {};
		if (areaId) filter.area = areaId;
		return this.subareasRepository.findAll(filter);
	}

	async delete(id: string, reassignTo?: string | null) {
		const subarea = await this.subareasRepository.findById(id);
		if (!subarea) throw new NotFoundException('Subarea not found');

		const reclamos = await this.reclamoModel.find({ subarea: id }).select('id titulo estadoActual').lean().exec();
		if (reclamos.length && (reassignTo === undefined || reassignTo === null)) {
			throw new ConflictException({ error: 'SUBAREA_HAS_ACTIVE_RECLAMOS', reclamos });
		}

		if (reclamos.length && reassignTo) {
			// if reassignTo provided, verify target
			if (reassignTo !== 'null') {
				const target = await this.subareasRepository.findById(reassignTo);
				if (!target) throw new NotFoundException('Target subarea not found');
				// update reclamos to new subarea and area
				await this.reclamoModel.updateMany({ subarea: id }, { $set: { subarea: reassignTo, area: target.area } }).exec();
			} else {
				// reassignTo == 'null' means remove subarea reference
				await this.reclamoModel.updateMany({ subarea: id }, { $set: { subarea: null } }).exec();
			}
		}

		return this.subareasRepository.deleteById(id);
	}

	update(id: string, updateDto: Partial<Subarea>) {
		return this.subareasRepository.updateById(id, updateDto);
	}

	findById(id: string) {
		return this.subareasRepository.findById(id);
	}
}
