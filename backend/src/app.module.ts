import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
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

@Module({
  imports: [DatabaseModule, UsuariosModule, RolesModule, PermisosModule, ClientesModule, ProyectosModule, TipoProyectoModule, ReclamosModule, HistorialReclamoModule, AreasModule, SubareasModule, EmpleadosModule, TipoReclamoModule, PrioridadModule, CriticidadModule, EstadoReclamoModule, EstadoSolicitudModule, ResumenResolucionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
