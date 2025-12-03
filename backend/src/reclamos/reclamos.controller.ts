import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ReclamosService } from './reclamos.service';

import { CreateReclamoDto } from './dto/create-reclamo.dto/create-reclamo.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto/update-reclamo.dto';
import { CambiarEstadoReclamoDto } from '../estado-reclamo/dto/cambiar-estado-reclamo-dto/cambiar-estado-reclamo-dto';
import { AsignarEmpleadoDto } from './dto/asignar-empleado.dto/asignar-empleado.dto';
import { CrearResumenResolucionDto } from '../resumen-resolucion/dto/create-resumen-resolucion.dto/create-resumen-resolucion.dto';

import { sanitizeReclamoForClient } from '../common/helpers/reclamo-serializer';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { ClientesService } from '../clientes/clientes.service';

@Controller('reclamos')
// Cuando quieras volver a activar seguridad, descomentá esto:
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReclamosController {
  constructor(
    private readonly reclamosService: ReclamosService,
    private readonly clientesService: ClientesService,
  ) {}

  // 1 - Crear reclamo (cliente)
  @Post()
  @Roles('CLIENTE')
  async createReclamo(
    @Body() createReclamoDto: CreateReclamoDto,
    @CurrentUser() user: any,
  ) {
    if (!user) {
      throw new BadRequestException('Usuario no autenticado');
    }

    const usuarioId = user.userId;

    const cliente = await this.clientesService.findByUsuarioId(usuarioId);
    if (!cliente) {
      throw new BadRequestException(
        'El usuario logueado no está asociado a un cliente válido',
      );
    }

    return this.reclamosService.createReclamo(
      (cliente._id as any).toString(),
      createReclamoDto,
    );
  }

  // 2 - Estadísticas por empleado
  // ⚠ Importante: esta ruta debe ir ANTES de @Get(':id') para evitar conflictos
  @Get('estadisticas-empleado')
  // Cuando vuelvas a activar seguridad:
  // @Roles('EMPLEADO', 'ADMIN')
  getEstadisticasEmpleado(
    @Query('empleadoId') empleadoId: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.reclamosService.obtenerEstadisticasEmpleado(
      empleadoId,
      fechaInicio,
      fechaFin,
    );
  }

  // 3 - Estadísticas por cliente
  @Get('estadisticas-cliente')
  // Cuando vuelvas a activar seguridad:
  // @Roles('CLIENTE')
  getEstadisticasCliente(
    @Query('clienteId') clienteId: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.reclamosService.obtenerEstadisticasCliente(
      clienteId,
      fechaInicio,
      fechaFin,
    );
  }

  // 4 - Estadísticas ADMIN (dashboard general)
  @Get('estadisticas-admin')
  // Cuando vuelvas a activar seguridad:
  // @Roles('ADMIN')
  getEstadisticasAdmin(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.reclamosService.obtenerEstadisticasAdmin(
      fechaInicio,
      fechaFin,
    );
  }

  // 5 - Listado con filtros
  @Get()
  findAll(@Query() filters: any) {
    return this.reclamosService.findAll(filters);
  }

  // 🔹 Endpoint de prueba para ver el usuario logueado
  @Get('me-test')
  @Roles('CLIENTE') // opcional, pero útil para probar RolesGuard
  meTest(@CurrentUser() user: any) {
    console.log('USER EN me-test =>', user);
    return { user };
  }

  // 6 - Buscar por ID
  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    const reclamo = await this.reclamosService.findById(id);

    if (user) {
      const rolNombre =
        typeof user.rol === 'object' && user.rol !== null
          ? (user.rol as any).nombre
          : user.rol;

      if (rolNombre === 'CLIENTE') {
        return sanitizeReclamoForClient(reclamo);
      }
    }

    return reclamo;
  }

  // 7 - Actualizar datos base
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReclamoDto) {
    return this.reclamosService.update(id, dto);
  }

  // 8 - Cambiar estado
  @Patch(':id/estado')
  cambiarEstado(
    @Param('id') reclamoId: string,
    @Body() dto: CambiarEstadoReclamoDto,
  ) {
    return this.reclamosService.cambiarEstado(reclamoId, dto);
  }

  // 9 - Asignar empleado
  @Patch(':id/asignar')
  asignarEmpleado(
    @Param('id') reclamoId: string,
    @Body() dto: AsignarEmpleadoDto,
  ) {
    return this.reclamosService.asignarEmpleado(reclamoId, dto);
  }

  // 11 - Cerrar reclamo
  @Patch(':id/cerrar')
  cerrarReclamo(
    @Param('id') reclamoId: string,
    @Body() dto: CrearResumenResolucionDto,
  ) {
    return this.reclamosService.cerrarReclamo(reclamoId, dto);
  }
}
