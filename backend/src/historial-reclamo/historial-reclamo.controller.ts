// HistorialReclamoController

import { Controller, Get, Param } from '@nestjs/common';
import { HistorialReclamoService } from './historial-reclamo.service';

@Controller('historial-reclamo')
export class HistorialReclamoController {
  constructor(private readonly historialService: HistorialReclamoService) {}

  @Get('reclamo/:reclamoId')
  findByReclamo(@Param('reclamoId') reclamoId: string) {
    return this.historialService.findByReclamo(reclamoId);
  }
}
