import * as bcrypt from 'bcrypt';
import { RolesService } from '../roles/roles.service';
import { EstadoSolicitudService } from '../estado-solicitud/estado-solicitud.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { EstadoReclamoService } from '../estado-reclamo/estado-reclamo.service';

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

export async function seedInitialData(
  rolesService: RolesService,
  estadoSolicitudService: EstadoSolicitudService,
  usuariosService: UsuariosService,
  estadoReclamoService: EstadoReclamoService,
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

  // ===== ROLES =====
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('❌ Error creando rol CLIENTE:', error.message);
  }

  // ===== ESTADOS DE SOLICITUD =====
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('❌ Error creando estado RECHAZADO:', error.message);
  }

  // ===== USUARIO ADMIN INICIAL =====
  try {
    const adminEmail = 'admin@sistema.com';
    const existingAdmin = await usuariosService.findByEmail(adminEmail);

    if (!existingAdmin) {
      const adminRol = await rolesService.findByName('ADMIN');
      if (!adminRol) {
        throw new Error('Rol ADMIN no encontrado para crear usuario admin');
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
}
