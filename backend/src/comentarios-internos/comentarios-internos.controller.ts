import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ComentariosInternosService } from './comentarios-internos.service';
import { CreateComentarioInternoDto } from './dto/create-comentario-interno.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('reclamos/:reclamoId/comentarios-internos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('EMPLEADO', 'ADMIN')
export class ComentariosInternosController {
  constructor(private readonly service: ComentariosInternosService) {}

  @Post()
  async create(
    @Param('reclamoId') reclamoId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateComentarioInternoDto,
  ) {
    return this.service.create(reclamoId, user.id, dto);
  }

  @Get()
  async findByReclamoId(@Param('reclamoId') reclamoId: string) {
    return this.service.findByReclamoId(reclamoId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.delete(id, user.id);
  }
}
