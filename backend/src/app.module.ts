// app.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { TipoProyectoModule } from './tipo-proyecto/tipo-proyecto.module';
import { ReclamosModule } from './reclamos/reclamos.module';
import { HistorialReclamoModule } from './historial-reclamo/historial-reclamo.module';
import { AreasModule } from './areas/areas.module';
import { SubareasModule } from './subareas/subareas.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { TipoReclamoModule } from './tipo-reclamo/tipo-reclamo.module';
import { PrioridadModule } from './prioridad/prioridad.module';
import { CriticidadModule } from './criticidad/criticidad.module';
import { EstadoReclamoModule } from './estado-reclamo/estado-reclamo.module';
import { EstadoSolicitudModule } from './estado-solicitud/estado-solicitud.module';
import { ResumenResolucionModule } from './resumen-resolucion/resumen-resolucion.module';
import { HealthController } from './health/health.controller';
import { EstadoReclamoService } from './estado-reclamo/estado-reclamo.service'; // Asegúrate de tener esta importación

import { RolesService } from './roles/roles.service';
import { EstadoSolicitudService } from './estado-solicitud/estado-solicitud.service';
import { UsuariosService } from './usuarios/usuarios.service';
import { seedInitialData } from './seed/seed-initial-data';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsuariosModule,
    RolesModule,
    PermisosModule,
    ClientesModule,
    ProyectosModule,
    TipoProyectoModule,
    ReclamosModule,
    HistorialReclamoModule,
    AreasModule,
    SubareasModule,
    EmpleadosModule,
    TipoReclamoModule,
    PrioridadModule,
    CriticidadModule,
    EstadoReclamoModule,
    EstadoSolicitudModule,
    ResumenResolucionModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  // Nest te inyecta los servicios aquí
  constructor(
    private readonly rolesService: RolesService,
    private readonly estadoSolicitudService: EstadoSolicitudService,
    private readonly usuariosService: UsuariosService,
    private readonly estadoReclamoService: EstadoReclamoService,
  ) {}

  async onModuleInit() {
    await seedInitialData(
      this.rolesService,
      this.estadoSolicitudService,
      this.usuariosService,
      this.estadoReclamoService,
    );
  }
}
