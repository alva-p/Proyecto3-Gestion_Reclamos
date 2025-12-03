import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TipoProyectoService } from './tipo-proyecto.service';
import { CreateTipoProyectoDto } from './dto/create-tipo-proyecto.dto/create-tipo-proyecto.dto';
import { UpdateTipoProyectoDto } from './dto/update-tipo-proyecto.dto/update-tipo-proyecto.dto';

@Controller('tipo-proyecto')
// Si más adelante querés proteger esto, acá podrías agregar:
// @UseGuards(JwtAuthGuard, RolesGuard)
export class TipoProyectoController {
  constructor(private readonly tipoProyectoService: TipoProyectoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTipoProyectoDto: CreateTipoProyectoDto) {
    return this.tipoProyectoService.create(createTipoProyectoDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.tipoProyectoService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.tipoProyectoService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateTipoProyectoDto: UpdateTipoProyectoDto,
  ) {
    return this.tipoProyectoService.update(id, updateTipoProyectoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tipoProyectoService.remove(id);
  }
}
