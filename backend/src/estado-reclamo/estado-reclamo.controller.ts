import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { EstadoReclamoService } from './estado-reclamo.service';

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
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Post('seed')
  seed() {
    return this.service.seedEstados();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
