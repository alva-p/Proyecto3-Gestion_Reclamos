import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
//PONER AL CLIENTEEE
import { ReclamosService } from './reclamos.service';

import { CreateReclamoDto } from './dto/create-reclamo.dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto/update-reclamo.dto';
import { CambiarEstadoReclamoDto } from '../estado-reclamo/dto/cambiar-estado-reclamo-dto/cambiar-estado-reclamo-dto';
import { AsignarEmpleadoDto } from './dto/asignar-empleado.dto/asignar-empleado.dto';
import { CambiarAreaDto } from './dto/cambio-area.dto/cambio-area.dto';
import { CrearResumenResolucionDto } from '../resumen-resolucion/dto/create-resumen-resolucion.dto/create-resumen-resolucion.dto';
import { sanitizeReclamoForClient } from '../common/helpers/reclamo-serializer';

// @UseGuards(AuthGuard)  <-- CUANDO IMPLEMENTES JWT
@Controller('reclamos')
export class ReclamosController {
  constructor(private readonly reclamosService: ReclamosService) {}

  // 1 - Crear reclamo (cliente)
  @Post()
  createReclamo(@Body() dto: CreateReclamoDto, @Req() req) {
    const clienteId = req.user.id; // Real, no hardcodeado
    return this.reclamosService.createReclamo(dto, clienteId);
  }

  // 2 - Listado con filtros
  @Get()
  findAll(@Query() filters: any) {
    return this.reclamosService.findAll(filters);
  }

  // 3 - Buscar por ID
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.reclamosService.findById(id);
  }

  @Get(':id')
  async getReclamoCliente(@Param('id') id: string, @Req() req) {
    const reclamo = await this.reclamosService.findById(id);

    if (req.user.rol === 'cliente') {
      return sanitizeReclamoForClient(reclamo);
    }

    return reclamo;
  }


  // 4 - Actualizar datos base
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReclamoDto, @Req() req) {
    return this.reclamosService.update(id, dto);
  }

  // 5 - Cambiar estado
  @Patch(':id/estado')
  cambiarEstado(
    @Param('id') reclamoId: string,
    @Body() dto: CambiarEstadoReclamoDto,
    @Req() req,
  ) {
    return this.reclamosService.cambiarEstado(reclamoId, dto);
  }

  // 6 - Asignar empleado
  @Patch(':id/asignar')
  asignarEmpleado(
    @Param('id') reclamoId: string,
    @Body() dto: AsignarEmpleadoDto,
    @Req() req,
  ) {
    return this.reclamosService.asignarEmpleado(reclamoId, dto);
  }

  // 7 - Cambiar área
  @Patch(':id/area')
  cambiarArea(
    @Param('id') reclamoId: string,
    @Body() dto: CambiarAreaDto,
    @Req() req,
  ) {
    return this.reclamosService.cambiarArea(reclamoId, dto);
  }

  // 8 - Cerrar reclamo
  @Patch(':id/cerrar')
  cerrarReclamo(
    @Param('id') reclamoId: string,
    @Body() dto: CrearResumenResolucionDto,
    @Req() req,
  ) {
    return this.reclamosService.cerrarReclamo(reclamoId, dto);
  }
}
