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
@UseGuards(JwtAuthGuard, RolesGuard) // 🔐 activamos JWT + roles para TODO el controller
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
    // IMPORTANTÍSIMO: el campo que viene del JwtStrategy es user.userId, no "id"
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

    // Pasamos clienteId al service de reclamos
    return this.reclamosService.createReclamo(
      (cliente._id as any).toString(),
      createReclamoDto,
    );
  }

  // 2 - Listado con filtros
  @Get()
  // acá podrías poner @Roles('ADMIN', 'EMPLEADO') si querés restringir
  findAll(@Query() filters: any) {
    return this.reclamosService.findAll(filters);
  }

  // 3 - Buscar por ID
  @Get(':id')
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    const reclamo = await this.reclamosService.findById(id);

    // Si hay usuario logueado y su rol es CLIENTE -> sanitizamos
    if (user) {
      const rolNombre =
        typeof user.rol === 'object' && user.rol !== null
          ? (user.rol as any).nombre
          : user.rol;

      if (rolNombre === 'CLIENTE') {
        return sanitizeReclamoForClient(reclamo);
      }
    }

    // Admin / empleado ven el objeto completo
    return reclamo;
  }

  // 4 - Actualizar datos base
  @Patch(':id')
  // opcional: @Roles('ADMIN', 'EMPLEADO')
  update(@Param('id') id: string, @Body() dto: UpdateReclamoDto) {
    return this.reclamosService.update(id, dto);
  }

  // 5 - Cambiar estado
  @Patch(':id/estado')
  // opcional: @Roles('ADMIN', 'EMPLEADO')
  cambiarEstado(
    @Param('id') reclamoId: string,
    @Body() dto: CambiarEstadoReclamoDto,
  ) {
    return this.reclamosService.cambiarEstado(reclamoId, dto);
  }

  // 6 - Asignar empleado
  @Patch(':id/asignar')
  // opcional: @Roles('ADMIN')
  asignarEmpleado(
    @Param('id') reclamoId: string,
    @Body() dto: AsignarEmpleadoDto,
  ) {
    return this.reclamosService.asignarEmpleado(reclamoId, dto);
  }

  // 8 - Cerrar reclamo
  @Patch(':id/cerrar')
  // opcional: @Roles('ADMIN', 'EMPLEADO')
  cerrarReclamo(
    @Param('id') reclamoId: string,
    @Body() dto: CrearResumenResolucionDto,
  ) {
    // Opción A: todo el cierre se orquesta en el service
    return this.reclamosService.cerrarReclamo(reclamoId, dto);
  }
}
