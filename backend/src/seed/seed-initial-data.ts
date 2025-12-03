interface SeedMetadata {
  _id: string;
  createdAt: Date;
}
import * as bcrypt from 'bcrypt';
import { Connection } from 'mongoose';

import { RolesService } from '../roles/roles.service';
import { EstadoSolicitudService } from '../estado-solicitud/estado-solicitud.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { EstadoReclamoService } from '../estado-reclamo/estado-reclamo.service';

<<<<<<< HEAD
// NUEVOS IMPORTS
import { AreasService } from '../areas/areas.service';
import { ProyectosService } from '../proyectos/proyectos.service';
import { ClientesService } from '../clientes/clientes.service';
import { TipoProyectoService } from '../tipo-proyecto/tipo-proyecto.service';
import { PrioridadService } from '../prioridad/prioridad.service';
import { CriticidadService } from '../criticidad/criticidad.service';
import { ReclamosService } from '../reclamos/reclamos.service';

// =====================
// Helper para fechas
// =====================
function randomDateAroundToday(): Date {
  const now = new Date();
  const threeMonthsMs = 1000 * 60 * 60 * 24 * 30 * 3; // Aprox 3 meses
  const offsetMs = Math.floor(Math.random() * threeMonthsMs * 2) - threeMonthsMs;
  return new Date(now.getTime() + offsetMs);
}
=======
import { AreasService } from '../areas/areas.service';
import { SubareasService } from '../subareas/subareas.service';
import { PrioridadService } from '../prioridad/prioridad.service';
import { CriticidadService } from '../criticidad/criticidad.service';
import { TipoReclamoService } from '../tipo-reclamo/tipo-reclamo.service';
import { ClientesService } from '../clientes/clientes.service';
import { EmpleadosService } from '../empleados/empleados.service';
import { ProyectosService } from '../proyectos/proyectos.service';
import { ReclamosService } from '../reclamos/reclamos.service';
>>>>>>> 34e460aa92248652377dc01aee14c2ee14920a51

export async function seedInitialData(
  rolesService: RolesService,
  estadoSolicitudService: EstadoSolicitudService,
  usuariosService: UsuariosService,
  estadoReclamoService: EstadoReclamoService,
<<<<<<< HEAD
  // NUEVOS SERVICIOS
  areasService: AreasService,
  proyectosService: ProyectosService,
  clientesService: ClientesService,
  tipoProyectoService: TipoProyectoService,
  prioridadService: PrioridadService,
  criticidadService: CriticidadService,
  reclamosService: ReclamosService,
) {
  console.log('🌱 Iniciando seed de datos...');

  // ===== ESTADOS DE RECLAMO =====
  try {
    await estadoReclamoService.seedEstados();
    console.log('✅ Estados de reclamo seedados correctamente');
  } catch (error: any) {
    console.error('❌ Error seedeando estados de reclamo:', error.message);
  }
=======
  areasService: AreasService,
  subareasService: SubareasService,
  prioridadService: PrioridadService,
  criticidadService: CriticidadService,
  tipoReclamoService: TipoReclamoService,
  clientesService: ClientesService,
  empleadosService: EmpleadosService,   // 👈
  proyectosService: ProyectosService,   // 👈
  reclamosService: ReclamosService,
  connection: Connection,
) {
  console.log('🌱 Iniciando seed de datos...');

  // ========================= CONTROL: SOLO 1ª VEZ =========================
  const seedCollection = connection.collection<SeedMetadata>('seed_metadata');
  const already = await seedCollection.findOne({ _id: 'INITIAL_SEED' });
>>>>>>> 34e460aa92248652377dc01aee14c2ee14920a51

  if (already) {
    console.log('ℹ️ Seed inicial ya fue ejecutado previamente. No se vuelve a correr.');
    return;
  }

  // ========================= DROP DATABASE (SOLO 1ª VEZ) ==================
  console.log('⚠️ Eliminando base de datos completa...');
  await connection.dropDatabase();
  console.log('✅ Base de datos limpia, comenzando creación de datos iniciales...');

  // ========================= ESTADOS DE RECLAMO ===========================
  try {
    await estadoReclamoService.seedEstados();
    console.log('✅ Estados de reclamo seedados correctamente');
  } catch (error: any) {
    console.error('❌ Error seedeando estados de reclamo:', error.message);
  }

  // ========================= ROLES ========================================
  let adminRol: any;
  let empleadoRol: any;
  let clienteRol: any;

  try {
    adminRol = await rolesService.findByName('ADMIN');
    if (!adminRol) {
      adminRol = await rolesService.create({
        nombre: 'ADMIN',
        descripcion: 'Administrador del sistema con acceso completo',
        permisos: [],
      });
      console.log('✅ Rol ADMIN creado');
    } else {
      console.log('ℹ️ Rol ADMIN ya existe');
    }
  } catch (error: any) {
    console.error('❌ Error creando rol ADMIN:', error.message);
  }

  try {
    empleadoRol = await rolesService.findByName('EMPLEADO');
    if (!empleadoRol) {
      empleadoRol = await rolesService.create({
        nombre: 'EMPLEADO',
        descripcion: 'Empleado con acceso limitado',
        permisos: [],
      });
      console.log('✅ Rol EMPLEADO creado');
    } else {
      console.log('ℹ️ Rol EMPLEADO ya existe');
    }
  } catch (error: any) {
    console.error('❌ Error creando rol EMPLEADO:', error.message);
  }

  try {
    clienteRol = await rolesService.findByName('CLIENTE');
    if (!clienteRol) {
      clienteRol = await rolesService.create({
        nombre: 'CLIENTE',
        descripcion: 'Cliente externo',
        permisos: [],
      });
      console.log('✅ Rol CLIENTE creado');
    } else {
      console.log('ℹ️ Rol CLIENTE ya existe');
    }
  } catch (error: any) {
    console.error('❌ Error creando rol CLIENTE:', error.message);
  }

  // ========================= ESTADOS DE SOLICITUD =========================
  let pendienteEstado: any;
  let aprobadoEstado: any;
  let rechazadoEstado: any;

  try {
    pendienteEstado = await estadoSolicitudService.findByName('PENDIENTE');
    if (!pendienteEstado) {
      pendienteEstado = await estadoSolicitudService.create({
        nombre: 'PENDIENTE',
        descripcion: 'Solicitud de registro pendiente de aprobación',
      });
      console.log('✅ Estado PENDIENTE creado');
    } else {
      console.log('ℹ️ Estado PENDIENTE ya existe');
    }
  } catch (error: any) {
    console.error('❌ Error creando estado PENDIENTE:', error.message);
  }

  try {
    aprobadoEstado = await estadoSolicitudService.findByName('APROBADO');
    if (!aprobadoEstado) {
      aprobadoEstado = await estadoSolicitudService.create({
        nombre: 'APROBADO',
        descripcion: 'Solicitud de registro aprobada',
      });
      console.log('✅ Estado APROBADO creado');
    } else {
      console.log('ℹ️ Estado APROBADO ya existe');
    }
  } catch (error: any) {
    console.error('❌ Error creando estado APROBADO:', error.message);
  }

  try {
    rechazadoEstado = await estadoSolicitudService.findByName('RECHAZADO');
    if (!rechazadoEstado) {
      rechazadoEstado = await estadoSolicitudService.create({
        nombre: 'RECHAZADO',
        descripcion: 'Solicitud de registro rechazada',
      });
      console.log('✅ Estado RECHAZADO creado');
    } else {
      console.log('ℹ️ Estado RECHAZADO ya existe');
    }
  } catch (error: any) {
    console.error('❌ Error creando estado RECHAZADO:', error.message);
  }

  // ========================= ÁREAS / SUBÁREAS =============================
  let areaSoporte: any;
  let subareaMesaAyuda: any;

  try {
    areaSoporte = await areasService.create({
      nombre: 'Soporte Técnico',
    } as any);
    console.log('✅ Área Soporte Técnico creada');

    subareaMesaAyuda = await subareasService.create({
      nombre: 'Mesa de Ayuda',
      area: areaSoporte._id,
    } as any);
    console.log('✅ Subárea Mesa de Ayuda creada');
  } catch (error: any) {
    console.error('❌ Error creando áreas/subáreas:', error.message);
  }

  // ========================= PRIORIDAD / CRITICIDAD =======================
  let prioridadAlta: any;
  let prioridadMedia: any;
  let criticidadAlta: any;
  let criticidadMedia: any;

  try {
    prioridadAlta = await prioridadService.create({ nombre: 'Alta' } as any);
    prioridadMedia = await prioridadService.create({ nombre: 'Media' } as any);
    console.log('✅ Prioridades creadas');
  } catch (error: any) {
    console.error('❌ Error creando prioridades:', error.message);
  }

  try {
    criticidadAlta = await criticidadService.create({ nombre: 'Alta' } as any);
    criticidadMedia = await criticidadService.create({ nombre: 'Media' } as any);
    console.log('✅ Criticidades creadas');
  } catch (error: any) {
    console.error('❌ Error creando criticidades:', error.message);
  }

  // ========================= TIPOS DE RECLAMO =============================
  let tipoIncidencia: any;
  let tipoConsulta: any;

  try {
    tipoIncidencia = await tipoReclamoService.create({
      nombre: 'Incidencia',
      descripcion: 'Falla o problema técnico en el sistema',
    } as any);

    tipoConsulta = await tipoReclamoService.create({
      nombre: 'Consulta',
      descripcion: 'Pregunta general sobre el uso del sistema',
    } as any);

    console.log('✅ Tipos de reclamo creados');
  } catch (error: any) {
    console.error('❌ Error creando tipos de reclamo:', error.message);
  }

  // ========================= USUARIO ADMIN INICIAL ========================
  let adminUsuario: any;

  try {
    const adminEmail = 'admin@sistema.com';
    const existingAdmin = await usuariosService.findByEmail(adminEmail);

    if (!existingAdmin) {
      if (!adminRol) {
        adminRol = await rolesService.findByName('ADMIN');
        if (!adminRol) {
          throw new Error('Rol ADMIN no encontrado para crear usuario admin');
        }
      }

      const hashedPassword = await bcrypt.hash('Admin123!', 10);

      adminUsuario = await usuariosService.create({
        nombre: 'Admin Principal',
        correo: adminEmail,
        contraseña: hashedPassword,
        rol: (adminRol._id as any).toString(),
        activo: true,
      } as any);

      console.log('✅ Usuario ADMIN creado (admin@sistema.com / Admin123!)');
    } else {
      adminUsuario = existingAdmin;
      console.log('ℹ️ Usuario ADMIN ya existe');
    }
  } catch (error: any) {
    console.error('❌ Error creando usuario ADMIN:', error.message);
  }

<<<<<<< HEAD
  console.log('🎉 Seed base completado (roles, estados solicitud y admin)');

  // ================================
  // NUEVO: ÁREAS, PROYECTOS, RECLAMOS
  // ================================

  // 1) ÁREAS
  const areas = await seedAreas(areasService);

  // 2) PROYECTOS (requiere clientes + tipos de proyecto existentes)
  const proyectos = await seedProyectos(
    proyectosService,
    clientesService,
    tipoProyectoService,
  );

  // 3) RECLAMOS DEMO (requiere proyectos, áreas, prioridad, criticidad)
  await seedReclamosDemo(
    reclamosService,
    clientesService,
    areas,
    proyectos,
    prioridadService,
    criticidadService,
  );

  console.log('🎉 Seed extendido completado (áreas, proyectos, reclamos demo)');
}

// =====================
// Funciones auxiliares
// =====================

async function seedAreas(areasService: AreasService) {
  try {
    const existentes = await areasService.findAll();
    if (Array.isArray(existentes) && existentes.length > 0) {
      console.log('ℹ️  Ya existen áreas, no se crean nuevas');
      return existentes;
    }

    const areasToCreate = [
      {
        nombre: 'Soporte Técnico',
        descripcion: 'Atención de incidentes técnicos y fallas de sistemas',
      },
      {
        nombre: 'Atención Comercial',
        descripcion: 'Consultas y reclamos comerciales de clientes',
      },
      {
        nombre: 'Facturación',
        descripcion: 'Gestión de facturación, cobros y pagos',
      },
      {
        nombre: 'Infraestructura',
        descripcion: 'Redes, servidores y hardware',
      },
    ];

    const created: any[] = [];
    for (const area of areasToCreate) {
      const a = await areasService.create(area as any);
      created.push(a);
    }

    console.log(`✅ Áreas creadas: ${created.length}`);
    return created;
  } catch (error: any) {
    console.error('❌ Error seedeando áreas:', error.message);
    return [];
  }
}

async function seedProyectos(
  proyectosService: ProyectosService,
  clientesService: ClientesService,
  tipoProyectoService: TipoProyectoService,
) {
  try {
    const existing = await proyectosService.findAll(undefined, undefined, undefined);
    if (Array.isArray(existing) && existing.length > 0) {
      console.log('ℹ️  Ya existen proyectos, no se crean nuevos');
      return existing;
    }

    const clientes = await clientesService.findAll();
    if (!Array.isArray(clientes) || clientes.length === 0) {
      console.log('ℹ️  No hay clientes en BD, se omite seed de proyectos');
      return [];
    }

    const tipos = await tipoProyectoService.findAll();
    if (!Array.isArray(tipos) || tipos.length === 0) {
      console.log('ℹ️  No hay tipos de proyecto en BD, se omite seed de proyectos');
      return [];
    }

    const proyectosToCreate: any[] = [];

    // Creamos 1–2 proyectos por los primeros clientes
    const maxClientes = Math.min(clientes.length, 3);
    for (let i = 0; i < maxClientes; i++) {
      const cliente = clientes[i];
      const tipo = tipos[i % tipos.length];

      // Usamos solo empresa, con fallback
      const etiquetaCliente =
        (cliente as any).empresa || `Cliente ${i + 1}`;

      proyectosToCreate.push({
        nombre: `Proyecto Core - ${etiquetaCliente}`,
        descripcion: 'Proyecto principal de implementación para este cliente (seed demo).',
        tipoProyecto: (tipo as any)._id?.toString(),
        clienteId: (cliente as any)._id?.toString(),
      });

      proyectosToCreate.push({
        nombre: `Proyecto Soporte - ${etiquetaCliente}`,
        descripcion: 'Proyecto de soporte y mantenimiento evolutivo (seed demo).',
        tipoProyecto: (tipo as any)._id?.toString(),
        clienteId: (cliente as any)._id?.toString(),
      });
    }

    const created: any[] = [];
    for (const proj of proyectosToCreate) {
      const p = await proyectosService.create(proj);
      created.push(p);
    }

    console.log(`✅ Proyectos creados: ${created.length}`);
    return created;
  } catch (error: any) {
    console.error('❌ Error seedeando proyectos:', error.message);
    return [];
  }
}


async function seedReclamosDemo(
  reclamosService: ReclamosService,
  clientesService: ClientesService,
  areas: any[],
  proyectos: any[],
  prioridadService: PrioridadService,
  criticidadService: CriticidadService,
) {
  try {
    if (!Array.isArray(proyectos) || proyectos.length === 0) {
      console.log('ℹ️  No hay proyectos, se omite seed de reclamos demo');
      return;
    }

    if (!Array.isArray(areas) || areas.length === 0) {
      console.log('ℹ️  No hay áreas, se omite seed de reclamos demo');
      return;
    }

    const clientes = await clientesService.findAll();
    if (!Array.isArray(clientes) || clientes.length === 0) {
      console.log('ℹ️  No hay clientes, se omite seed de reclamos demo');
      return;
    }

    const prioridades = await prioridadService.findAll();
    const criticidades = await criticidadService.findAll();

    if (!Array.isArray(prioridades) || prioridades.length === 0) {
      console.log('ℹ️  No hay prioridades, se omite seed de reclamos demo');
      return;
    }

    if (!Array.isArray(criticidades) || criticidades.length === 0) {
      console.log('ℹ️  No hay niveles de criticidad, se omite seed de reclamos demo');
      return;
    }

    // Cantidad de reclamos demo a crear
    const TOTAL_RECLAMOS = 60;
    let creados = 0;

    for (let i = 0; i < TOTAL_RECLAMOS; i++) {
      const cliente = clientes[i % clientes.length];
      const proyecto = proyectos[i % proyectos.length];
      const area = areas[i % areas.length];
      const prioridad = prioridades[i % prioridades.length];
      const criticidad = criticidades[i % criticidades.length];

      const fechaRandom = randomDateAroundToday();

      // ⚠️ IMPORTANTE:
      // Ajustá estos campos para que coincidan EXACTAMENTE con tu CreateReclamoDto y schema.
      // Por ejemplo: titulo/asunto, descripcion, proyectoId, areaId, prioridadId, criticidadId, etc.
      const dto: any = {
        titulo: `Reclamo demo #${i + 1}`,
        descripcion: `Reclamo generado por seed para el proyecto ${proyecto.nombre}.`,
        proyectoId: (proyecto as any)._id?.toString(),
        areaId: (area as any)._id?.toString(),           // TODO: renombrar al campo real de área en el DTO
        prioridadId: (prioridad as any)._id?.toString(), // TODO: renombrar al campo real de prioridad
        criticidadId: (criticidad as any)._id?.toString(), // TODO: renombrar al campo real de criticidad
        fechaReclamo: fechaRandom,                       // TODO: si usás otro nombre de campo de fecha, ajustalo
      };

      const clienteId = (cliente as any)._id?.toString();
      await reclamosService.createReclamo(clienteId, dto);
      creados++;
    }

    console.log(`✅ Reclamos demo creados: ${creados}`);
  } catch (error: any) {
    console.error('❌ Error seedeando reclamos demo:', error.message);
  }
=======
  // ========================= USUARIO + CLIENTE ============================
  let clienteUsuario: any;
  let clienteEntidad: any;

  try {
    const clienteEmail = 'cliente@demo.com';
    const existingCliente = await usuariosService.findByEmail(clienteEmail);

    if (!existingCliente) {
      if (!clienteRol) {
        clienteRol = await rolesService.findByName('CLIENTE');
      }
      const hashedPassword = await bcrypt.hash('Cliente123!', 10);

      clienteUsuario = await usuariosService.create({
        nombre: 'Cliente Demo',
        correo: clienteEmail,
        contraseña: hashedPassword,
        rol: (clienteRol._id as any).toString(),
        activo: true,
      } as any);

      clienteEntidad = await clientesService.create({
        empresa: 'Empresa Demo S.A.',
        telefono: '+54 9 351 555-5555',
        direccion: 'Av. Ejemplo 123, Córdoba',
        usuarioId: clienteUsuario._id,
        estadoSolicitud: aprobadoEstado?._id,
      } as any);

      console.log('✅ Cliente Demo creado (cliente@demo.com / Cliente123!)');
    } else {
      clienteUsuario = existingCliente;
      // Intentar buscar clienteEntidad por usuarioId, si tu servicio lo soporta
      try {
        const todosClientes = await clientesService.findAll?.();
        clienteEntidad = todosClientes?.find(
          (c: any) =>
            String(c.usuarioId) === String(clienteUsuario._id) ||
            String(c.usuarioId?._id) === String(clienteUsuario._id),
        );
      } catch {
        clienteEntidad = null;
      }
      console.log('ℹ️ Usuario CLIENTE ya existe');
    }
  } catch (error: any) {
    console.error('❌ Error creando cliente demo:', error.message);
  }

  // ========================= USUARIO + EMPLEADO ===========================
  let empleadoUsuario: any;
  let empleadoEntidad: any;

  try {
    const empleadoEmail = 'empleado@demo.com';
    const existingEmpleado = await usuariosService.findByEmail(empleadoEmail);

    if (!existingEmpleado) {
      if (!empleadoRol) {
        empleadoRol = await rolesService.findByName('EMPLEADO');
      }
      const hashedPassword = await bcrypt.hash('Empleado123!', 10);

      empleadoUsuario = await usuariosService.create({
        nombre: 'Empleado Demo',
        correo: empleadoEmail,
        contraseña: hashedPassword,
        rol: (empleadoRol._id as any).toString(),
        activo: true,
      } as any);

      empleadoEntidad = await empleadosService.create({
        usuarioId: empleadoUsuario._id,
        puesto: 'Soporte Nivel 1',
        subarea: subareaMesaAyuda?._id,
      } as any);

      console.log('✅ Empleado Demo creado (empleado@demo.com / Empleado123!)');
    } else {
      empleadoUsuario = existingEmpleado;
      // Buscar entidad empleado por usuarioId si tenés un método
      try {
        const todosEmpleados = await empleadosService.findAll?.();
        empleadoEntidad = todosEmpleados?.find(
          (e: any) =>
            String(e.usuarioId) === String(empleadoUsuario._id) ||
            String(e.usuarioId?._id) === String(empleadoUsuario._id),
        );
      } catch {
        empleadoEntidad = null;
      }
      console.log('ℹ️ Usuario EMPLEADO ya existe');
    }
  } catch (error: any) {
    console.error('❌ Error creando empleado demo:', error.message);
  }

  // ========================= PROYECTO DEL CLIENTE =========================
  let proyectoDemo: any;

  try {
    if (!clienteEntidad) {
      throw new Error('No se pudo determinar la entidad Cliente para crear proyecto demo');
    }

    proyectoDemo = await proyectosService.create({
      nombre: 'Sistema de Gestión Comercial',
      descripcion: 'Proyecto demo para probar reclamos y dashboards',
      clienteId: clienteEntidad._id,
      // tipoProyecto opcional
    } as any);

    console.log('✅ Proyecto demo creado para el cliente');
  } catch (error: any) {
    console.error('❌ Error creando proyecto demo:', error.message);
  }

  // ========================= RECLAMOS DEL CLIENTE =========================
  try {
    if (!clienteEntidad || !proyectoDemo) {
      throw new Error('Faltan cliente o proyecto demo para crear reclamos');
    }

    const clienteIdStr = String(clienteEntidad._id);
    const proyectoIdStr = String(proyectoDemo._id);
    const tipoIncidenciaId = String(tipoIncidencia?._id);
    const tipoConsultaId = String(tipoConsulta?._id);
    const prioridadAltaId = String(prioridadAlta?._id);
    const prioridadMediaId = String(prioridadMedia?._id);
    const criticidadAltaId = String(criticidadAlta?._id);
    const criticidadMediaId = String(criticidadMedia?._id);

    // Reclamo 1 (hace 2 meses)
    const reclamo1 = (await reclamosService.createReclamo(clienteIdStr, {
      titulo: 'Error al generar reporte mensual',
      descripcion:
        'Al intentar generar el reporte mensual de ventas, el sistema muestra un error 500.',
      tipoReclamo: tipoIncidenciaId,
      prioridad: prioridadAltaId,
      criticidad: criticidadAltaId,
      proyectoId: proyectoIdStr,
    } as any)) as any;

    // Reclamo 2 (mes pasado)
    const reclamo2 = (await reclamosService.createReclamo(clienteIdStr, {
      titulo: 'Consulta sobre exportación a Excel',
      descripcion:
        'El cliente desea saber cómo exportar los listados de clientes a Excel.',
      tipoReclamo: tipoConsultaId,
      prioridad: prioridadMediaId,
      criticidad: criticidadMediaId,
      proyectoId: proyectoIdStr,
    } as any)) as any;

    // Reclamo 3 (este mes)
    const reclamo3 = (await reclamosService.createReclamo(clienteIdStr, {
      titulo: 'Lentitud en el sistema de tickets',
      descripcion:
        'El módulo de tickets responde muy lento durante el horario pico.',
      tipoReclamo: tipoIncidenciaId,
      prioridad: prioridadAltaId,
      criticidad: criticidadAltaId,
      proyectoId: proyectoIdStr,
    } as any)) as any;

    // Por seguridad, chequear que no sean null/undefined
    if (!reclamo1 || !reclamo2 || !reclamo3) {
      throw new Error('No se pudieron crear los reclamos demo correctamente');
    }

    // Fechas diferentes para los gráficos
    const now = new Date();
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 10);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 5);

    const reclamosCollection = connection.collection('reclamos');

    await reclamosCollection.updateOne(
      { _id: reclamo1._id as any }, // 👈 cast a any para evitar el error de Condition<ObjectId>
      { $set: { createdAt: twoMonthsAgo, fechaCreacion: twoMonthsAgo } } as any,
    );
    await reclamosCollection.updateOne(
      { _id: reclamo2._id as any },
      { $set: { createdAt: lastMonth, fechaCreacion: lastMonth } } as any,
    );
    await reclamosCollection.updateOne(
      { _id: reclamo3._id as any },
      { $set: { createdAt: thisMonth, fechaCreacion: thisMonth } } as any,
    );

    console.log('✅ Reclamos demo creados con fechas distribuidas');

    // ===================== ASIGNAR Y CERRAR RECLAMOS =====================
    if (empleadoEntidad) {
      const empleadoIdStr = String(empleadoEntidad._id);

      // Asignar los 3 reclamos al empleado
      await reclamosService.asignarEmpleado(String(reclamo1._id), {
        empleadoId: empleadoIdStr,
      } as any);
      await reclamosService.asignarEmpleado(String(reclamo2._id), {
        empleadoId: empleadoIdStr,
      } as any);
      await reclamosService.asignarEmpleado(String(reclamo3._id), {
        empleadoId: empleadoIdStr,
      } as any);

      // Cerrar 2 reclamos para que haya estados diferentes
      await reclamosService.cerrarReclamo(String(reclamo1._id), {
        descripcion:
          'Se corrigió la consulta de base de datos que causaba el error 500 en el reporte mensual.',
        responsableId: empleadoIdStr,
      } as any);

      await reclamosService.cerrarReclamo(String(reclamo2._id), {
        descripcion:
          'Se envió documentación y se habilitó un botón de exportación directa a Excel.',
        responsableId: empleadoIdStr,
      } as any);

      // El reclamo3 queda abierto para mostrarlo como abierto/enviado
      console.log('✅ Reclamos asignados y algunos cerrados por el empleado demo');
    } else {
      console.log(
        '⚠️ No se pudo asignar y cerrar reclamos porque no se encontró empleadoEntidad',
      );
    }
  } catch (error: any) {
    console.error('❌ Error creando/asignando reclamos demo:', error.message);
  }

  // ========================= MARCAR SEED COMO EJECUTADO ===================
  await seedCollection.insertOne({
    _id: 'INITIAL_SEED',
    createdAt: new Date(),
  });

  console.log('🎉 Seed completado (roles, estados, usuarios, cliente, empleado, proyecto y reclamos demo)');
>>>>>>> 34e460aa92248652377dc01aee14c2ee14920a51
}
