import { Controller, Get, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Usuario } from './Entidad/usuario.schema';
@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard) // Protegemos todas las rutas
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Historia 9 y 2: El admin necesita ver usuarios
  @Get()
  @Roles('ADMIN') // Solo admin puede listar todos
  findAll() {
    return this.usuariosService.findAll();
  }

  // Historia 3: Perfil del usuario logueado
  @Get('perfil')
  getProfile(@Request() req) {
    return this.usuariosService.findById(req.user.userId);
  }

  // Historia 2: Aprobar usuario (Activar)
  @Patch(':id/activar')
  @Roles('ADMIN')
  activarUsuario(@Param('id') id: string) {
    return this.usuariosService.activateUser(id);
  }

  // Historia 2: Rechazar o desactivar
  @Patch(':id/desactivar')
  @Roles('ADMIN')
  desactivarUsuario(@Param('id') id: string) {
    return this.usuariosService.deactivateUser(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto as unknown as Partial<Usuario>);
  }
}