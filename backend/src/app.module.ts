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
import { ComentariosInternosModule } from './comentarios-internos/comentarios-internos.module';
import { HealthController } from './health/health.controller';

// Servicios que ya usabas en el seed
import { RolesService } from './roles/roles.service';
import { EstadoSolicitudService } from './estado-solicitud/estado-solicitud.service';
import { UsuariosService } from './usuarios/usuarios.service';
import { EstadoReclamoService } from './estado-reclamo/estado-reclamo.service';

// NUEVOS servicios necesarios para el seed extendido
import { AreasService } from './areas/areas.service';
import { ProyectosService } from './proyectos/proyectos.service';
import { ClientesService } from './clientes/clientes.service';
import { TipoProyectoService } from './tipo-proyecto/tipo-proyecto.service';
import { PrioridadService } from './prioridad/prioridad.service';
import { CriticidadService } from './criticidad/criticidad.service';
import { ReclamosService } from './reclamos/reclamos.service';

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
    ComentariosInternosModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly rolesService: RolesService,
    private readonly estadoSolicitudService: EstadoSolicitudService,
    private readonly usuariosService: UsuariosService,
    private readonly estadoReclamoService: EstadoReclamoService,
    // nuevos inyectados
    private readonly areasService: AreasService,
    private readonly proyectosService: ProyectosService,
    private readonly clientesService: ClientesService,
    private readonly tipoProyectoService: TipoProyectoService,
    private readonly prioridadService: PrioridadService,
    private readonly criticidadService: CriticidadService,
    private readonly reclamosService: ReclamosService,
  ) {}

  async onModuleInit() {
    await seedInitialData(
      this.rolesService,
      this.estadoSolicitudService,
      this.usuariosService,
      this.estadoReclamoService,
      this.areasService,
      this.proyectosService,
      this.clientesService,
      this.tipoProyectoService,
      this.prioridadService,
      this.criticidadService,
      this.reclamosService,
    );
  }
}
