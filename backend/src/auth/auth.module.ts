import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { EmpleadosModule } from '../empleados/empleados.module';
import { ClientesModule } from '../clientes/clientes.module';
import { RolesModule } from '../roles/roles.module';
import { EstadoSolicitudModule } from '../estado-solicitud/estado-solicitud.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: {
        // El tipo de expiresIn en las versiones recientes de @nestjs/jwt es más estricto,
        // por lo que casteamos explícitamente el valor de entorno o el default.
        expiresIn: (process.env.JWT_EXPIRATION || '24h') as any,
      },
    }),
    UsuariosModule,
    EmpleadosModule,
    ClientesModule,
    RolesModule,
    EstadoSolicitudModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
