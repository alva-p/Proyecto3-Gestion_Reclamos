import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  NotFoundException,
  Patch,
  Delete,
} from '@nestjs/common';

import { ResumenResolucionService } from './resumen-resolucion.service';
import { CrearResumenResolucionDto } from './dto/create-resumen-resolucion.dto/create-resumen-resolucion.dto';

@Controller('resumen-resolucion')
export class ResumenResolucionController {
  constructor(
    private readonly resumenService: ResumenResolucionService,
  ) {}

  @Post(':reclamoId')
  async crearResumen(
    @Param('reclamoId') reclamoId: string,
    @Body() dto: CrearResumenResolucionDto,
  ) {
    const resumen = await this.resumenService.crearResumen(dto, reclamoId);
    return {
      message: 'Resumen de resolución creado correctamente.',
      data: resumen,
    };
  }
  @Get('reclamo/:reclamoId')
  async obtenerPorReclamo(@Param('reclamoId') reclamoId: string) {
    return this.resumenService.findByReclamo(reclamoId);
  }
  @Get()
  async findAll() {
    return this.resumenService.findAll({});
  }
  @Get(':id')
  async findById(@Param('id') id: string) {
    const resumen = await this.resumenService.findById(id);
    if (!resumen) {
      throw new NotFoundException('Resumen no encontrado.');
    }
    return resumen;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.resumenService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.resumenService.delete(id);
  }
}
