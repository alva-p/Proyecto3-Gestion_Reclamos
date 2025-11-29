import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CriticidadService } from './criticidad.service';
import { CreateCriticidadDto } from './dto/create-criticidad.dto/create-criticidad.dto';
import { UpdateCriticidadDto } from './dto/update-criticidad.dto/update-criticidad.dto';

@Controller('criticidad')
export class CriticidadController {
  constructor(private readonly criticidadService: CriticidadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCriticidadDto: CreateCriticidadDto) {
    return this.criticidadService.create(createCriticidadDto);
  }

  @Get()
  findAll() {
    return this.criticidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.criticidadService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCriticidadDto: UpdateCriticidadDto) {
    return this.criticidadService.update(id, updateCriticidadDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.criticidadService.remove(id);
  }
}
