import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesService } from './roles/roles.service';
import { EstadoSolicitudService } from './estado-solicitud/estado-solicitud.service';
import { AreasService } from './areas/areas.service';
import { TipoReclamoService } from './tipo-reclamo/tipo-reclamo.service';
import { PrioridadService } from './prioridad/prioridad.service';
import { CriticidadService } from './criticidad/criticidad.service';
import { EstadoReclamoService } from './estado-reclamo/estado-reclamo.service';
import { TipoProyectoService } from './tipo-proyecto/tipo-proyecto.service';
import { SubareasService } from './subareas/subareas.service';
import { ProyectosService } from './proyectos/proyectos.service';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from './usuarios/usuarios.service';
import { ClientesService } from './clientes/clientes.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const rolesService = app.get(RolesService);
  const estadoSolicitudService = app.get(EstadoSolicitudService);
  const usuariosService = app.get(UsuariosService);
  const areasService = app.get(AreasService);
  const subareasService = app.get(SubareasService);
  const tipoReclamoService = app.get(TipoReclamoService);
  const prioridadService = app.get(PrioridadService);
  const criticidadService = app.get(CriticidadService);
  const estadoReclamoService = app.get(EstadoReclamoService);
  const tipoProyectoService = app.get(TipoProyectoService);
  const clientesService = app.get(ClientesService);
  const proyectosService = app.get(ProyectosService);

  console.log('🌱 Iniciando seed de datos...');

  // Crear roles
  try {
    const adminRol = await rolesService.findByName('ADMIN');
    if (!adminRol) {
      await rolesService.create({
        nombre: 'ADMIN',
        descripcion: 'Administrador del sistema con acceso completo',
        permisos: [],
      });
      console.log('✅ Rol ADMIN creado');
    } else {
      console.log('ℹ️  Rol ADMIN ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando rol ADMIN:', error.message);
  }

  try {
    const empleadoRol = await rolesService.findByName('EMPLEADO');
    if (!empleadoRol) {
      await rolesService.create({
        nombre: 'EMPLEADO',
        descripcion: 'Empleado con acceso limitado',
        permisos: [],
      });
      console.log('✅ Rol EMPLEADO creado');
    } else {
      console.log('ℹ️  Rol EMPLEADO ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando rol EMPLEADO:', error.message);
  }

  try {
    const clienteRol = await rolesService.findByName('CLIENTE');
    if (!clienteRol) {
      await rolesService.create({
        nombre: 'CLIENTE',
        descripcion: 'Cliente externo',
        permisos: [],
      });
      console.log('✅ Rol CLIENTE creado');
    } else {
      console.log('ℹ️  Rol CLIENTE ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando rol CLIENTE:', error.message);
  }

  // Crear estados de solicitud
  try {
    const pendiente = await estadoSolicitudService.findByName('PENDIENTE');
    if (!pendiente) {
      await estadoSolicitudService.create({
        nombre: 'PENDIENTE',
        descripcion: 'Solicitud de registro pendiente de aprobación',
      });
      console.log('✅ Estado PENDIENTE creado');
    } else {
      console.log('ℹ️  Estado PENDIENTE ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando estado PENDIENTE:', error.message);
  }

  try {
    const aprobado = await estadoSolicitudService.findByName('APROBADO');
    if (!aprobado) {
      await estadoSolicitudService.create({
        nombre: 'APROBADO',
        descripcion: 'Solicitud de registro aprobada',
      });
      console.log('✅ Estado APROBADO creado');
    } else {
      console.log('ℹ️  Estado APROBADO ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando estado APROBADO:', error.message);
  }

  try {
    const rechazado = await estadoSolicitudService.findByName('RECHAZADO');
    if (!rechazado) {
      await estadoSolicitudService.create({
        nombre: 'RECHAZADO',
        descripcion: 'Solicitud de registro rechazada',
      });
      console.log('✅ Estado RECHAZADO creado');
    } else {
      console.log('ℹ️  Estado RECHAZADO ya existe');
    }
  } catch (error) {
    console.error('❌ Error creando estado RECHAZADO:', error.message);
  }

  // Crear usuario ADMIN
  // Crear usuario ADMIN
  try {
    const adminEmail = 'admin@sistema.com';
    const existingAdmin = await usuariosService.findByEmail(adminEmail);

    if (!existingAdmin) {
      // Volvemos a buscar el rol ADMIN
      const adminRol = await rolesService.findByName('ADMIN');

      if (!adminRol) {
        throw new Error('Rol ADMIN no encontrado. Verifica que el seed de roles se ejecutó correctamente.');
      }

      const hashedPassword = await bcrypt.hash('Admin123!', 10);

      await usuariosService.create({
        nombre: 'Admin Principal',
        correo: adminEmail,
        contraseña: hashedPassword,
        rol: (adminRol._id as any).toString(),
        activo: true,
      });

      console.log('✅ Usuario ADMIN creado (admin@sistema.com / Admin123!)');
    } else {
      console.log('ℹ️  Usuario ADMIN ya existe');
    }
  } catch (error: any) {
    console.error('❌ Error creando usuario ADMIN:', error.message);
  }

  // Crear usuario CLIENTE + Cliente aprobado
  try {
    const clienteEmail = 'cliente.demo@sistema.com';
    let clienteUsuario = await usuariosService.findByEmail(clienteEmail);

    // Rol CLIENTE
    const clienteRol = await rolesService.findByName('CLIENTE');
    if (!clienteRol) {
      throw new Error('Rol CLIENTE no encontrado.');
    }

    if (!clienteUsuario) {
      const hashedPassword = await bcrypt.hash('Cliente123!', 10);
      clienteUsuario = await usuariosService.create({
        nombre: 'Cliente Demo',
        correo: clienteEmail,
        contraseña: hashedPassword,
        rol: (clienteRol._id as any).toString(),
        activo: true,
      });
      console.log('✅ Usuario CLIENTE creado (cliente.demo@sistema.com / Cliente123!)');
    } else {
      console.log('ℹ️  Usuario CLIENTE ya existe');
    }

    // Estado APROBADO
    const estadoAprobado = await estadoSolicitudService.findByName('APROBADO');
    if (!estadoAprobado) {
      throw new Error('Estado APROBADO no encontrado.');
    }

    // Verificar si ya existe un cliente para este usuario
    const clienteExistente = await clientesService.findByUsuarioId((clienteUsuario._id as any).toString());
    let clienteCreadoId: string;
    let clienteRegistro: any;
    if (!clienteExistente) {
      clienteRegistro = await clientesService.create({
        empresa: 'Empresa Demo S.A.',
        telefono: '+54 11 5555-5555',
        direccion: 'Av. Siempre Viva 742',
        usuarioId: clienteUsuario._id as any,
        estadoSolicitud: estadoAprobado._id as any,
      } as any);
      clienteCreadoId = (clienteRegistro._id as any).toString();
      console.log(`✅ Cliente de prueba creado (ID: ${clienteCreadoId})`);
    } else {
      clienteRegistro = clienteExistente;
      clienteCreadoId = (clienteExistente._id as any).toString();
      console.log(`ℹ️  Cliente de prueba ya existe (ID: ${clienteCreadoId})`);
    }

    console.log('\n🔑 Usa este CLIENTE_ID en el frontend (.env):');
    console.log(`VITE_CLIENTE_ID=${clienteCreadoId}`);
    
    // Guardar referencia al cliente para usarla después en la creación del proyecto
    global.clienteDemoCreado = clienteRegistro;
  } catch (error: any) {
    console.error('❌ Error creando usuario/cliente DEMO:', error.message);
  }

  // Crear Tipo de Proyecto antes de usarlo
  console.log('\n📂 Creando Tipos de Proyecto...');
  const tiposProyecto = ['Software', 'Marketing', 'Consultoría', 'Soporte', 'Otro'];
  let tipoSoftwareId: string | undefined;
  
  for (const nombreTipoProyecto of tiposProyecto) {
    try {
      const existing = await tipoProyectoService.findAll();
      const found = existing.find(t => t.nombre === nombreTipoProyecto);
      if (!found) {
        const tipo = await tipoProyectoService.create({ nombre: nombreTipoProyecto });
        if (nombreTipoProyecto === 'Software') {
          tipoSoftwareId = (tipo._id as any).toString();
        }
        console.log(`✅ Tipo de Proyecto "${nombreTipoProyecto}" creado`);
      } else {
        if (nombreTipoProyecto === 'Software') {
          tipoSoftwareId = (found._id as any).toString();
        }
        console.log(`ℹ️  Tipo de Proyecto "${nombreTipoProyecto}" ya existe`);
      }
    } catch (error: any) {
      console.error(`❌ Error creando tipo de proyecto "${nombreTipoProyecto}":`, error.message);
    }
  }

  // Crear Áreas y Subáreas
  console.log('\n📁 Creando Áreas y Subáreas...');
  
  const areasConSubareas = {
    'Soporte Técnico': ['Nivel 1', 'Nivel 2', 'Nivel 3'],
    'Desarrollo': ['Frontend', 'Backend', 'Mobile', 'QA'],
    'Recursos Humanos': ['Administración de Personal', 'Capacitación', 'Selección'],
    'Infraestructura': ['Redes', 'Servidores', 'Seguridad'],
    'Calidad': ['Testing', 'Auditoría', 'Procesos']
  };
  
  for (const [nombreArea, subareas] of Object.entries(areasConSubareas)) {
    try {
      const existing = await areasService.findAll();
      let area = existing.find(a => a.nombre === nombreArea);
      
      if (!area) {
        area = await areasService.create({ nombre: nombreArea });
        console.log(`✅ Área "${nombreArea}" creada`);
      } else {
        console.log(`ℹ️  Área "${nombreArea}" ya existe`);
      }

      // Crear subáreas para esta área
      for (const nombreSubarea of subareas) {
        try {
          const existingSubareas = await subareasService.findByArea((area._id as any).toString());
          if (!existingSubareas.find(s => s.nombre === nombreSubarea)) {
            await subareasService.create({
              nombre: nombreSubarea,
              area: (area._id as any).toString(),
              esInterna: true,
            });
            console.log(`  ✅ Subárea "${nombreSubarea}" creada en "${nombreArea}"`);
          } else {
            console.log(`  ℹ️  Subárea "${nombreSubarea}" ya existe en "${nombreArea}"`);
          }
        } catch (error: any) {
          console.error(`  ❌ Error creando subárea "${nombreSubarea}":`, error.message);
        }
      }
    } catch (error: any) {
      console.error(`❌ Error creando área "${nombreArea}":`, error.message);
    }
  }

  // Crear Tipos de Reclamo
  console.log('\n🏷️  Creando Tipos de Reclamo...');
  const tiposReclamo = ['Error', 'Mejora', 'Consulta', 'Incidente', 'Otro'];
  
  for (const nombreTipo of tiposReclamo) {
    try {
      const existing = await tipoReclamoService.findAll();
      if (!existing.find(t => t.nombre === nombreTipo)) {
        await tipoReclamoService.create({ nombre: nombreTipo });
        console.log(`✅ Tipo de Reclamo "${nombreTipo}" creado`);
      } else {
        console.log(`ℹ️  Tipo de Reclamo "${nombreTipo}" ya existe`);
      }
    } catch (error: any) {
      console.error(`❌ Error creando tipo "${nombreTipo}":`, error.message);
    }
  }

  // Crear Prioridades
  console.log('\n⚡ Creando Prioridades...');
  const prioridades = ['Baja', 'Media', 'Alta', 'Crítica'];
  
  for (const nombrePrioridad of prioridades) {
    try {
      const existing = await prioridadService.findAll();
      if (!existing.find(p => p.nombre === nombrePrioridad)) {
        await prioridadService.create({ nombre: nombrePrioridad });
        console.log(`✅ Prioridad "${nombrePrioridad}" creada`);
      } else {
        console.log(`ℹ️  Prioridad "${nombrePrioridad}" ya existe`);
      }
    } catch (error: any) {
      console.error(`❌ Error creando prioridad "${nombrePrioridad}":`, error.message);
    }
  }

  // Crear Criticidades
  console.log('\n🔴 Creando Criticidades...');
  const criticidades = ['Baja', 'Media', 'Alta', 'Crítica'];
  
  for (const nombreCriticidad of criticidades) {
    try {
      const existing = await criticidadService.findAll();
      if (!existing.find(c => c.nombre === nombreCriticidad)) {
        await criticidadService.create({ nombre: nombreCriticidad });
        console.log(`✅ Criticidad "${nombreCriticidad}" creada`);
      } else {
        console.log(`ℹ️  Criticidad "${nombreCriticidad}" ya existe`);
      }
    } catch (error: any) {
      console.error(`❌ Error creando criticidad "${nombreCriticidad}":`, error.message);
    }
  }

  // Crear Estados de Reclamo
  console.log('\n📊 Creando Estados de Reclamo...');
  const estadosReclamo = [
    'Enviado',
    'En Revisión',
    'Asignado',
    'En Proceso',
    'Solucionado',
    'Cerrado',
    'Cancelado'
  ];
  
  for (const nombreEstado of estadosReclamo) {
    try {
      const existing = await estadoReclamoService.findAll();
      if (!existing.find(e => e.nombre === nombreEstado)) {
        await estadoReclamoService.create({ nombre: nombreEstado });
        console.log(`✅ Estado de Reclamo "${nombreEstado}" creado`);
      } else {
        console.log(`ℹ️  Estado de Reclamo "${nombreEstado}" ya existe`);
      }
    } catch (error: any) {
      console.error(`❌ Error creando estado "${nombreEstado}":`, error.message);
    }
  }



  // Crear proyecto demo AFTER tipos de proyecto exist
  console.log('\n📋 Creando Proyecto Demo...');
  try {
    // Usar el cliente que se creó/encontró arriba
    const clienteRegistro = (global as any).clienteDemoCreado;
    
    if (!clienteRegistro) {
      console.log('❌ No se pudo obtener el registro del cliente demo');
    } else {
      console.log(`✓ Cliente encontrado: ${clienteRegistro.empresa}`);
      const clienteId = (clienteRegistro._id as any).toString();
      const existingProjects = await proyectosService.findAll(clienteId);
      
      if (existingProjects.length === 0) {
        const tipoSoftware = (await tipoProyectoService.findAll()).find(t => t.nombre === 'Software');
        const tipoId = tipoSoftware ? (tipoSoftware._id as any).toString() : undefined;
        
        console.log(`✓ Creando proyecto con clienteId: ${clienteId}, tipoProyecto: ${tipoId}`);
        const proyectoCreado = await proyectosService.create({
          nombre: 'Proyecto Demo - Sistema Web',
          descripcion: 'Proyecto de prueba para realizar reclamos',
          tipoProyecto: tipoId,
          clienteId: clienteId,
        });
        console.log(`✅ Proyecto demo creado: ${(proyectoCreado as any)._id}`);
      } else {
        console.log(`ℹ️  Cliente demo ya tiene ${existingProjects.length} proyecto(s):`);
        existingProjects.forEach((p: any) => {
          console.log(`   - ${p.nombre} (ID: ${p._id})`);
        });
      }
    }
  } catch (error: any) {
    console.error('❌ Error creando proyecto demo:', error.message);
    console.error(error.stack);
  }

  console.log('\n🎉 Seed completado exitosamente');
  console.log('\n📝 Resumen:');
  console.log('   - Roles: ADMIN, EMPLEADO, CLIENTE');
  console.log('   - Estados de Solicitud: PENDIENTE, APROBADO, RECHAZADO');
  console.log('   - Áreas: 5 áreas con sus subáreas');
  console.log('   - Subáreas: ~15 subáreas internas creadas');
  console.log('   - Tipos de Reclamo: 5 tipos creados');
  console.log('   - Prioridades: 4 niveles creados');
  console.log('   - Criticidades: 4 niveles creados');
  console.log('   - Estados de Reclamo: 7 estados creados');
  console.log('   - Tipos de Proyecto: 5 tipos creados');
  console.log('   - Usuario Admin: admin@sistema.com / Admin123!');
  console.log('\n✅ Ya podés crear reclamos desde el frontend!\n');
  
  await app.close();
}

bootstrap();
