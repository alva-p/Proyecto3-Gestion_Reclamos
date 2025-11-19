import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { HistorialReclamoService } from './historial-reclamo.service';

@Controller('historial-reclamo')
export class HistorialReclamoController {
  constructor(private readonly historialService: HistorialReclamoService) {}
  @Post()
  async create(@Body() dto: any) {
    return this.historialService.create(dto);
  }

  // Crear historial y asociarlo a un reclamo (flujo real)
  @Post(':reclamoId/agregar')
  async createAndAttach(@Param('reclamoId') reclamoId: string,@Body() dto: any,) {
    const result = await this.historialService.createAndAttach(reclamoId, dto);
    if (!result) {
      throw new NotFoundException('No se pudo registrar el historial.');
    }
    return {
      message: 'Historial agregado correctamente.',
      data: result,
    };
  }
  // historial completo de un reclamo
  @Get(':reclamoId')
  async findByReclamo(@Param('reclamoId') reclamoId: string) {
    const historial = await this.historialService.findByReclamo(reclamoId);
    if (!historial || historial.length === 0) {
      throw new NotFoundException(
        'No se encontraron registros de historial para este reclamo.',
      );
    }
    return historial;
  }
}
