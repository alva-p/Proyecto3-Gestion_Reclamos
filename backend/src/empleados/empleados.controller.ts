import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { EmpleadosService } from './empleados.service';

// Importaciones de DTOs
import { CreateEmpleadoDto } from '../empleados/dto/create-empleado.dto/create-empleado.dto';
import { UpdateEmpleadoDto } from '../empleados/dto/update-empleado.dto/update-empleado.dto';

// Importaciones de Auth
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('empleados')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplica autenticación y roles a todo el controlador
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  // ------------------------------------------------------------------
  // 1. CREAR EMPLEADO
  // POST /empleados
  // Solo accesible por ADMIN
  // ------------------------------------------------------------------
  @Post()
  @Roles('ADMIN')
  async create(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    return this.empleadosService.create(createEmpleadoDto);
  }

  // ------------------------------------------------------------------
  // 2. OBTENER TODOS LOS EMPLEADOS
  // GET /empleados
  // Solo accesible por ADMIN
  // ------------------------------------------------------------------
  @Get()
  @Roles('ADMIN')
  async findAll() {
    return this.empleadosService.findAll();
  }

  // ------------------------------------------------------------------
  // 3. OBTENER EMPLEADO POR USUARIO ID (temporal debug)
  // GET /empleados/by-usuario/:usuarioId
  // ------------------------------------------------------------------
  @Get('by-usuario/:usuarioId')
  async findByUsuarioId(@Param('usuarioId') usuarioId: string) {
    const empleado = await this.empleadosService.findByUsuarioId(usuarioId);
    return empleado || { message: 'No se encontró empleado para este usuarioId' };
  }

  // ------------------------------------------------------------------
  // 4. OBTENER EMPLEADO POR ID
  // GET /empleados/:id
  // Accesible por ADMIN y EMPLEADO (para ver su propio perfil)
  // ------------------------------------------------------------------
  @Get(':id')
  @Roles('ADMIN', 'EMPLEADO')
  async findOne(@Param('id') id: string) {
    return this.empleadosService.findById(id);
  }

  // ------------------------------------------------------------------
  // 4. ACTUALIZAR EMPLEADO
  // PATCH /empleados/:id
  // Solo accesible por ADMIN
  // ------------------------------------------------------------------
  @Patch(':id')
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateEmpleadoDto: UpdateEmpleadoDto,
  ) {
    return this.empleadosService.update(id, updateEmpleadoDto);
  }

  // ------------------------------------------------------------------
  // 5. ELIMINAR EMPLEADO
  // DELETE /empleados/:id
  // Solo accesible por ADMIN
  // ------------------------------------------------------------------
  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content en caso de éxito
  async remove(@Param('id') id: string) {
    // El servicio maneja la excepción NotFound si no existe
    await this.empleadosService.delete(id);
    // No retorna cuerpo (gracias a HttpCode(HttpStatus.NO_CONTENT))
  }
}