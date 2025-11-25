import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AreasService } from './areas.service';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  create(@Body() dto: { nombre: string }) {
    return this.areasService.create(dto);
  }

  @Get()
  findAll() {
    return this.areasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areasService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: { nombre: string }) {
    return this.areasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areasService.delete(id);
  }
}
