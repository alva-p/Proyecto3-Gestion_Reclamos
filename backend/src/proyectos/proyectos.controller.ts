import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto/update-proyecto.dto';

@Controller('proyectos')
export class ProyectosController {
  constructor(private readonly proyectosService: ProyectosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProyectoDto: CreateProyectoDto) {
    // TODO: Obtener clienteId del token JWT cuando se implemente autenticación
    // Por ahora, se usa el clienteId del DTO
    return this.proyectosService.create(createProyectoDto);
  }

  @Get()
  findAll(
    @Query('clienteId') clienteId?: string,
    @Query('tipoProyecto') tipoProyecto?: string,
    @Query('nombre') nombre?: string,
  ) {
    // TODO: Obtener clienteId del token JWT cuando se implemente autenticación
    // Por ahora, se puede pasar como query parameter
    return this.proyectosService.findAll(clienteId, tipoProyecto, nombre);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: Obtener clienteId del token JWT cuando se implemente autenticación
    return this.proyectosService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProyectoDto: UpdateProyectoDto) {
    // TODO: Obtener clienteId del token JWT cuando se implemente autenticación
    return this.proyectosService.update(id, updateProyectoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    // TODO: Obtener clienteId del token JWT cuando se implemente autenticación
    return this.proyectosService.remove(id);
  }
}
