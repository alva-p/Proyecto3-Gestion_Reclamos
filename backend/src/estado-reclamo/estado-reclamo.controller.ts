import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { EstadoReclamoService } from './estado-reclamo.service';
import { CreateEstadoReclamoDto } from './dto/create-estado-reclamo.dto/create-estado-reclamo.dto';
import { UpdateEstadoReclamoDto } from './dto/update-estado-reclamo.dto/update-estado-reclamo.dto';

@Controller('estado-reclamo')
export class EstadoReclamoController {
  constructor(private readonly service: EstadoReclamoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('nombre/:nombre')
  findByNombre(@Param('nombre') nombre: string) {
    return this.service.findByNombre(nombre);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: CreateEstadoReclamoDto) {
    return this.service.create(dto);
  }

  @Post('seed')
  seed() {
    return this.service.seedEstados();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEstadoReclamoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
