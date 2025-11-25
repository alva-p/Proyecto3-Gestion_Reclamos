import { Controller, Post, Body, Get, Query, Delete, Param } from '@nestjs/common';
import { SubareasService } from './subareas.service';
import { CreateSubareaDto } from './dto/create-subarea.dto/create-subarea.dto';

@Controller('subareas')
export class SubareasController {
	constructor(private readonly subareasService: SubareasService) {}

	@Post()
	create(@Body() dto: CreateSubareaDto) {
		return this.subareasService.create(dto as any);
	}

	@Get()
	findAll(@Query('areaId') areaId?: string) {
		return this.subareasService.findAll(areaId);
	}

	@Delete(':id')
	remove(@Param('id') id: string, @Query('reassignTo') reassignTo?: string) {
		// if reassignTo is the string 'null' it will remove the subarea reference
		const reassign = reassignTo === undefined ? undefined : reassignTo;
		return this.subareasService.delete(id, reassign);
	}
}
