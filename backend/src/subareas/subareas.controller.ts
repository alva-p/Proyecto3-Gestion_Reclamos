import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SubareasService } from './subareas.service';
import { CreateSubareaDto } from './dto/create-subarea.dto/create-subarea.dto';
import { UpdateSubareaDto } from './dto/update-subarea.dto/update-subarea.dto';

@Controller('subareas')
export class SubareasController {
  constructor(private readonly subareasService: SubareasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSubareaDto: CreateSubareaDto) {
    return this.subareasService.create(createSubareaDto);
  }

  @Get()
  findAll(@Query('esInterna') esInterna?: string) {
    const esInternaBool = esInterna === 'true' ? true : esInterna === 'false' ? false : undefined;
    return this.subareasService.findAll(esInternaBool);
  }

  @Get('area/:areaId')
  findByArea(@Param('areaId') areaId: string, @Query('esInterna') esInterna?: string) {
    const esInternaBool = esInterna === 'true' ? true : esInterna === 'false' ? false : undefined;
    return this.subareasService.findByArea(areaId, esInternaBool);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subareasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubareaDto: UpdateSubareaDto) {
    return this.subareasService.update(id, updateSubareaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.subareasService.remove(id);
  }
}
