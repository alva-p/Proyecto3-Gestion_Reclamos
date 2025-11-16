import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from '../../usuarios/usuarios.service';

export interface JwtPayload {
  sub: string; // userId
  correo: string;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecretKey',
    });
  }

  async validate(payload: JwtPayload) {
    const usuario = await this.usuariosService.findById(payload.sub);
    
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Usuario no autorizado o inactivo');
    }

    return {
      userId: payload.sub,
      correo: payload.correo,
      rol: usuario.rol,
    };
  }
}
