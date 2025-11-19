import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ReclamosService } from './reclamos.service';

import { CreateReclamoDto } from './dto/create-reclamo.dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto/update-reclamo.dto';
import { CambiarEstadoReclamoDto } from '../estado-reclamo/dto/cambiar-estado-reclamo-dto/cambiar-estado-reclamo-dto';
import { AsignarEmpleadoDto } from './dto/asignar-empleado.dto/asignar-empleado.dto';
import { CambiarAreaDto } from './dto/cambio-area.dto/cambio-area.dto';
import { CrearResumenResolucionDto } from '../resumen-resolucion/dto/create-resumen-resolucion.dto/create-resumen-resolucion.dto';

@Controller('reclamos')
export class ReclamosController {
  constructor(private readonly reclamosService: ReclamosService) {}

  // 1 - Crear reclamo (cliente)
    @Post()
    createReclamo(@Body() dto: CreateReclamoDto) { // <- Cambiado de 'create' a 'createReclamo'
        // **NOTA:** Necesitas saber cómo obtienes el 'clienteId' en el controlador. 
        // Asumiré que lo obtienes de un guardia de autenticación (AuthGuard).
        const clienteId = 'ID_DEL_CLIENTE_DESDE_EL_TOKEN'; // <--- AQUI DEBES OBTENER EL ID REAL
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

  // 4 - Actualizar reclamo (solo datos base)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReclamoDto) {
    return this.reclamosService.update(id, dto);
  }

  // 5 - Cambiar estado
  @Patch(':id/estado')
  cambiarEstado(
    @Param('id') reclamoId: string,
    @Body() dto: CambiarEstadoReclamoDto,
  ) {
    return this.reclamosService.cambiarEstado(reclamoId, dto);
  }

  // 6 - Asignar empleado
  @Patch(':id/asignar')
  asignarEmpleado(
    @Param('id') reclamoId: string,
    @Body() dto: AsignarEmpleadoDto,
  ) {
    return this.reclamosService.asignarEmpleado(reclamoId, dto);
  }

  // 7 - Cambiar área
  @Patch(':id/area')
  cambiarArea(
    @Param('id') reclamoId: string,
    @Body() dto: CambiarAreaDto,
  ) {
    return this.reclamosService.cambiarArea(reclamoId, dto);
  }

  // 8 - Cerrar reclamo
  @Patch(':id/cerrar')
  cerrarReclamo(
    @Param('id') reclamoId: string,
    @Body() dto: CrearResumenResolucionDto,
  ) {
    return this.reclamosService.cerrarReclamo(reclamoId, dto);
  }
}
