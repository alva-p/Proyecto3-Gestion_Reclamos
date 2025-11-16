import { Controller, Get, Put, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('clientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @Roles('ADMIN', 'EMPLEADO')
  async findAll() {
    return this.clientesService.findAll();
  }

  @Get('solicitudes/pendientes')
  @Roles('ADMIN')
  async findPendingSolicitudes() {
    return this.clientesService.findPendingSolicitudes();
  }

  @Get(':id')
  @Roles('ADMIN', 'EMPLEADO')
  async findOne(@Param('id') id: string) {
    return this.clientesService.findById(id);
  }

  @Put(':id/aprobar')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async aprobarSolicitud(@Param('id') id: string) {
    return this.clientesService.aprobarSolicitud(id);
  }

  @Put(':id/rechazar')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async rechazarSolicitud(@Param('id') id: string) {
    return this.clientesService.rechazarSolicitud(id);
  }
}

