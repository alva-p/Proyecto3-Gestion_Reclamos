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
<<<<<<< HEAD

// NUEVOS servicios necesarios para el seed extendido
import { AreasService } from './areas/areas.service';
import { ProyectosService } from './proyectos/proyectos.service';
import { ClientesService } from './clientes/clientes.service';
import { TipoProyectoService } from './tipo-proyecto/tipo-proyecto.service';
import { PrioridadService } from './prioridad/prioridad.service';
import { CriticidadService } from './criticidad/criticidad.service';
import { ReclamosService } from './reclamos/reclamos.service';
=======
import { AreasService } from './areas/areas.service';
import { SubareasService } from './subareas/subareas.service';
import { PrioridadService } from './prioridad/prioridad.service';
import { CriticidadService } from './criticidad/criticidad.service';
import { TipoReclamoService } from './tipo-reclamo/tipo-reclamo.service';
import { ClientesService } from './clientes/clientes.service';
import { ProyectosService } from './proyectos/proyectos.service';
import { TipoProyectoService } from './tipo-proyecto/tipo-proyecto.service';
import { EmpleadosService } from './empleados/empleados.service';
import { ReclamosService } from './reclamos/reclamos.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
>>>>>>> 34e460aa92248652377dc01aee14c2ee14920a51

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
<<<<<<< HEAD
    // nuevos inyectados
    private readonly areasService: AreasService,
    private readonly proyectosService: ProyectosService,
    private readonly clientesService: ClientesService,
    private readonly tipoProyectoService: TipoProyectoService,
    private readonly prioridadService: PrioridadService,
    private readonly criticidadService: CriticidadService,
    private readonly reclamosService: ReclamosService,
=======
    private readonly areasService: AreasService,
    private readonly subareasService: SubareasService,
    private readonly prioridadService: PrioridadService,
    private readonly criticidadService: CriticidadService,
    private readonly tipoReclamoService: TipoReclamoService,
    private readonly clientesService: ClientesService,
    private readonly empleadosService: EmpleadosService, 
    private readonly proyectosService: ProyectosService,
    private readonly reclamosService: ReclamosService,
    @InjectConnection() private readonly connection: Connection, // 👈 IMPORTANTE
>>>>>>> 34e460aa92248652377dc01aee14c2ee14920a51
  ) {}


  async onModuleInit() {
    await seedInitialData(
      this.rolesService,
      this.estadoSolicitudService,
      this.usuariosService,
      this.estadoReclamoService,
      this.areasService,
<<<<<<< HEAD
      this.proyectosService,
      this.clientesService,
      this.tipoProyectoService,
      this.prioridadService,
      this.criticidadService,
      this.reclamosService,
=======
      this.subareasService,
      this.prioridadService,
      this.criticidadService,
      this.tipoReclamoService,
      this.clientesService,
      this.empleadosService,   // 👈 este va primero
      this.proyectosService,
      this.reclamosService,
      this.connection,
>>>>>>> 34e460aa92248652377dc01aee14c2ee14920a51
    );
  }

}
