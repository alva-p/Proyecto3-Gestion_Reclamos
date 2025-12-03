import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ReclamosRepository } from './repository/reclamos.repository/reclamos.repository';
import { CambiarEstadoReclamoDto } from '../estado-reclamo/dto/cambiar-estado-reclamo-dto/cambiar-estado-reclamo-dto';
import { ProyectosService } from '../proyectos/proyectos.service';
import { TipoReclamoService } from '../tipo-reclamo/tipo-reclamo.service';
import { PrioridadService } from '../prioridad/prioridad.service';
import { CriticidadService } from '../criticidad/criticidad.service';
import { AreasService } from '../areas/areas.service';
import { SubareasService } from '../subareas/subareas.service';
import { EstadoReclamoService } from '../estado-reclamo/estado-reclamo.service';
import { HistorialReclamoService } from '../historial-reclamo/historial-reclamo.service';
import { ResumenResolucionService } from '../resumen-resolucion/resumen-resolucion.service';
import { EmpleadosService } from '../empleados/empleados.service';
import { AsignarEmpleadoDto } from './dto/asignar-empleado.dto/asignar-empleado.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto/update-reclamo.dto';
import { CrearResumenResolucionDto } from '../resumen-resolucion/dto/create-resumen-resolucion.dto/create-resumen-resolucion.dto';
import { CreateReclamoDto } from './dto/create-reclamo.dto/create-reclamo.dto';
import { Types } from 'mongoose';
import { getAreaIdFromSubarea } from '../common/helpers/area-subarea';
import { UnitOfWork } from '../common/database/unit-of-work';

@Injectable()
export class ReclamosService {
  constructor(
    private readonly reclamosRepository: ReclamosRepository,
    private readonly proyectosService: ProyectosService,
    private readonly tipoReclamoService: TipoReclamoService,
    private readonly prioridadService: PrioridadService,
    private readonly criticidadService: CriticidadService,
    private readonly areaService: AreasService,
    private readonly subareaService: SubareasService,
    private readonly estadoReclamoService: EstadoReclamoService,
    private readonly historialReclamoService: HistorialReclamoService,
    private readonly resumenResolucionService: ResumenResolucionService,
    private readonly empleadosService: EmpleadosService,
    private readonly uow: UnitOfWork,
  ) {}

  // ========================= CREAR RECLAMO =========================
  async createReclamo(clienteId: string, dto: CreateReclamoDto) {
    return this.uow.withTransaction(async (session) => {
      const {
        titulo,
        descripcion,
        tipoReclamo,
        prioridad,
        criticidad,
        proyectoId,
      } = dto;

      const proyecto = await this.proyectosService.findById(proyectoId);
      if (!proyecto) {
        throw new NotFoundException('El proyecto no existe.');
      }
      const proyectoClienteId =
        typeof proyecto.clienteId === 'object' && proyecto.clienteId !== null
          ? ((proyecto.clienteId as any)._id?.toString() ?? (proyecto.clienteId as any).toString())
          : (proyecto.clienteId as any)?.toString();

      if (!proyectoClienteId || proyectoClienteId !== clienteId.toString()) {
        throw new BadRequestException('El proyecto no pertenece al cliente.');
      }

      const tipoReclamoFound =
        await this.tipoReclamoService.findOne(tipoReclamo);
      if (!tipoReclamoFound) {
        throw new NotFoundException('Tipo de reclamo inválido.');
      }

      const prioridadFound = await this.prioridadService.findOne(prioridad);
      if (!prioridadFound) {
        throw new NotFoundException('Prioridad inválida.');
      }

      const criticidadFound = await this.criticidadService.findOne(criticidad);
      if (!criticidadFound) {
        throw new NotFoundException('Criticidad inválida.');
      }

    const estadoInicial = await this.estadoReclamoService.findByNombre('Enviado');
    if (!estadoInicial) {
      throw new NotFoundException('No se encontró el estado inicial "Enviado".');
    }

        // Generar numeroReclamo único (simple contador incremental)
        const totalReclamos = await this.reclamosRepository.countAll();
        const numeroReclamo = `REC-${String(totalReclamos + 1).padStart(6, '0')}`;
        // 1) Crear reclamo
        const reclamo = await this.reclamosRepository.create(
          {
            numeroReclamo,
            titulo,
            descripcion,
            tipoReclamo,
            prioridad,
            criticidad,
            area: null,
            subarea: null,
            estadoActual: estadoInicial._id,
            asignadoActual: null,
            historialIds: [],
            resumenResolucionId: null,
            proyectoId,
            clienteId,
          },
          session,
        );

      // 2) Crear historial inicial
      const historial = await this.historialReclamoService.create(
        {
          fechaHora: new Date(),
          detalleAccion: 'Reclamo creado.',
          estadoReclamo: estadoInicial._id,
          area: null,
          subarea: null,
          empleado: null,
          reclamoId: reclamo._id,
        },
        session,
      );

      // 3) Adjuntar historial al reclamo
      await this.reclamosRepository.pushHistorial(
        reclamo._id as any,
        historial._id as any,
        session,
      );

      // 4) Devolver reclamo actualizado
      return this.reclamosRepository.findById(reclamo._id as any);
    });
  }

  async findAll(filters: any) {
    const query: any = {};

    if (filters.estado) query.estadoActual = filters.estado;
    if (filters.area) query.area = filters.area;
    if (filters.clienteId) query.clienteId = filters.clienteId;
    if (filters.proyectoId) query.proyectoId = filters.proyectoId;
    
    // Convertir asignadoActual a ObjectId si es un string válido
    if (filters.asignadoActual) {
        if (Types.ObjectId.isValid(filters.asignadoActual)) {
            query.asignadoActual = new Types.ObjectId(filters.asignadoActual);
        } else {
            query.asignadoActual = filters.asignadoActual;
        }
    }

    return this.reclamosRepository.findAll(query);
  }

  async findById(id: string) {
    const reclamo = await this.reclamosRepository.findById(id);
    if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');
    return reclamo;
  }

  async update(id: string, dto: UpdateReclamoDto) {
    const reclamo = await this.reclamosRepository.update(id, dto);
    if (!reclamo) {
      throw new NotFoundException('Reclamo no encontrado.');
    }
    return reclamo;
  }

  // ========================= CAMBIAR ESTADO =========================
  async cambiarEstado(reclamoId: string, dto: CambiarEstadoReclamoDto) {
    return this.uow.withTransaction(async (session) => {
      const { nuevoEstadoId, empleadoId } = dto;

      const reclamo = await this.reclamosRepository.findById(reclamoId);
      if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');

      const nuevoEstado =
        await this.estadoReclamoService.findById(nuevoEstadoId);
      if (!nuevoEstado) throw new NotFoundException('Estado inválido.');

    const estadoActual = await this.estadoReclamoService.findById(
      reclamo.estadoActual as any,
    );

      if (estadoActual.nombre === 'Cerrado' || estadoActual.nombre === 'Cancelado') {
        throw new ConflictException('El reclamo no permite modificaciones en estado actual.');
      }

      if (empleadoId) {
        const empleado = await this.empleadosService.findById(empleadoId);
        if (!empleado) throw new NotFoundException('Empleado no encontrado.');
      }

      await this.reclamosRepository.updateEstado(
        reclamoId,
        nuevoEstadoId,
        session,
      );

      await this.historialReclamoService.createAndAttach(
        reclamoId,
        {
          detalleAccion: `Cambio de estado a: ${nuevoEstado.nombre}`,
          estadoReclamo: nuevoEstadoId,
          empleado: empleadoId ?? null,
          area: reclamo.area,
          subarea: reclamo.subarea,
        },
        session,
      );

      return this.reclamosRepository.findById(reclamoId);
    });
  }

  // ========================= ASIGNAR EMPLEADO =========================
  async asignarEmpleado(reclamoId: string, dto: AsignarEmpleadoDto) {
    return this.uow.withTransaction(async (session) => {
      const { empleadoId } = dto;

      const reclamo = await this.reclamosRepository.findById(reclamoId);
      if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');

      const estadoActual = await this.estadoReclamoService.findById(
        reclamo.estadoActual as any,
      );
      if (estadoActual.nombre === 'Cerrado') {
        throw new ConflictException('El reclamo ya está cerrado.');
      }

      const empleado = await this.empleadosService.findById(empleadoId);
      if (!empleado) throw new NotFoundException('Empleado no encontrado.');

      if (!empleado.subarea) {
        throw new BadRequestException(
          'El empleado no tiene subárea asignada. No se puede asignar al reclamo.',
        );
      }

      const subareaDoc = empleado.subarea as any;
      const areaId = getAreaIdFromSubarea(subareaDoc);

      // 1) Actualizar reclamo
      await this.reclamosRepository.update(
        reclamoId,
        {
          asignadoActual: empleado._id,
          subarea: subareaDoc._id ?? subareaDoc,
          area: areaId,
        },
        session,
      );

      // 2) Registrar historial
      await this.historialReclamoService.createAndAttach(
        reclamoId,
        {
          detalleAccion: 'Asignación de empleado responsable.',
          empleado: empleado._id,
          estadoReclamo: reclamo.estadoActual,
          area: areaId,
          subarea: subareaDoc._id ?? subareaDoc,
        },
        session,
      );

      return this.reclamosRepository.findById(reclamoId);
    });
  }

  // ========================= CERRAR RECLAMO =========================
  async cerrarReclamo(reclamoId: string, dto: CrearResumenResolucionDto) {
    return this.uow.withTransaction(async (session) => {
      const { descripcion, responsableId } = dto;

      const reclamo = await this.reclamosRepository.findById(reclamoId);
      if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');

      const estadoActual = await this.estadoReclamoService.findById(
        reclamo.estadoActual as any,
      );
      if (estadoActual.nombre === 'Cerrado') {
        throw new ConflictException('El reclamo ya está cerrado.');
      }

      if (!descripcion || descripcion.trim().length < 20) {
        throw new BadRequestException(
          'El resumen debe contener al menos 20 caracteres.',
        );
      }

      const estadoCerrado =
        await this.estadoReclamoService.findByNombre('Cerrado');
      if (!estadoCerrado) {
        throw new NotFoundException(
          'Debe existir el estado "Cerrado" en el sistema.',
        );
      }

      const empleado = await this.empleadosService.findById(responsableId);
      if (!empleado) {
        throw new NotFoundException('Empleado responsable no encontrado.');
      }

      // 1) Cambiar estado a "Cerrado"
      await this.reclamosRepository.update(
        reclamoId,
        { estadoActual: estadoCerrado._id },
        session,
      );

      // 2) Crear resumen de resolución
      const resumen = await this.resumenResolucionService.crearResumen(
        { descripcion, responsableId },
        reclamoId,
        session,
      );

      // 3) Registrar historial
      await this.historialReclamoService.createAndAttach(
        reclamoId,
        {
          detalleAccion: 'Reclamo cerrado con resumen de resolución.',
          empleado: responsableId,
          estadoReclamo: estadoCerrado._id,
          area: reclamo.area,
          subarea: reclamo.subarea,
          // si querés, podrías incluir resumen._id en el historial
        },
        session,
      );

      // 4) Devolver reclamo actualizado
      return this.reclamosRepository.findById(reclamoId);
    });
  }

  // ========================= ESTADÍSTICAS POR EMPLEADO =========================
  async obtenerEstadisticasEmpleado(
    empleadoId: string,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    if (!empleadoId) {
      throw new BadRequestException('empleadoId es requerido.');
    }

    const filters: any = {
      asignadoActual: empleadoId,
    };

    let reclamos = await this.reclamosRepository.findAll(filters);

    let desde: Date | undefined;
    let hasta: Date | undefined;

    if (fechaInicio) {
      desde = new Date(fechaInicio);
      desde.setHours(0, 0, 0, 0);
    }
    if (fechaFin) {
      hasta = new Date(fechaFin);
      hasta.setHours(23, 59, 59, 999);
    }

    if (desde || hasta) {
      reclamos = reclamos.filter((r: any) => {
        const fecha =
          r.createdAt || r.fechaCreacion || r.fecha || null;

        if (!fecha) return false;
        const f = new Date(fecha);

        if (desde && f < desde) return false;
        if (hasta && f > hasta) return false;
        return true;
      });
    }

    const total = reclamos.length;

    const porEstadoMap = new Map<string, number>();
    const porMesMap = new Map<string, number>();

    for (const r of reclamos as any[]) {
      const estadoKey = String(r.estadoActual);
      porEstadoMap.set(estadoKey, (porEstadoMap.get(estadoKey) ?? 0) + 1);

      const fecha = r.createdAt || r.fechaCreacion || r.fecha || new Date();
      const d = new Date(fecha);
      const key = `${d.getFullYear()}-${String(
        d.getMonth() + 1,
      ).padStart(2, '0')}`;
      porMesMap.set(key, (porMesMap.get(key) ?? 0) + 1);
    }

    const porEstado = Array.from(porEstadoMap.entries()).map(
      ([key, value]) => ({
        _id: key,
        cantidad: value,
      }),
    );

    const porMes = Array.from(porMesMap.entries())
      .map(([key, value]) => ({
        _id: key,
        cantidad: value,
      }))
      .sort((a, b) => (a._id > b._id ? 1 : -1));

    return { total, porEstado, porMes };
  }

  // ========================= ESTADÍSTICAS POR CLIENTE =========================
  async obtenerEstadisticasCliente(
    clienteId: string,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    if (!clienteId) {
      throw new BadRequestException('clienteId es requerido.');
    }

    const filters: any = {
      clienteId,
    };

    let reclamos = await this.reclamosRepository.findAll(filters);

    let desde: Date | undefined;
    let hasta: Date | undefined;

    if (fechaInicio) {
      desde = new Date(fechaInicio);
      desde.setHours(0, 0, 0, 0);
    }
    if (fechaFin) {
      hasta = new Date(fechaFin);
      hasta.setHours(23, 59, 59, 999);
    }

    if (desde || hasta) {
      reclamos = reclamos.filter((r: any) => {
        const fecha =
          r.createdAt || r.fechaCreacion || r.fecha || null;

        if (!fecha) return false;
        const f = new Date(fecha);

        if (desde && f < desde) return false;
        if (hasta && f > hasta) return false;
        return true;
      });
    }

    const total = reclamos.length;

    const porEstadoMap = new Map<string, number>();
    const porMesMap = new Map<string, number>();

    for (const r of reclamos as any[]) {
      const estadoKey = String(r.estadoActual);
      porEstadoMap.set(estadoKey, (porEstadoMap.get(estadoKey) ?? 0) + 1);

      const fecha = r.createdAt || r.fechaCreacion || r.fecha || new Date();
      const d = new Date(fecha);
      const key = `${d.getFullYear()}-${String(
        d.getMonth() + 1,
      ).padStart(2, '0')}`;
      porMesMap.set(key, (porMesMap.get(key) ?? 0) + 1);
    }

    const porEstado = Array.from(porEstadoMap.entries()).map(
      ([key, value]) => ({
        _id: key,
        cantidad: value,
      }),
    );

    const porMes = Array.from(porMesMap.entries())
      .map(([key, value]) => ({
        _id: key,
        cantidad: value,
      }))
      .sort((a, b) => (a._id > b._id ? 1 : -1));

    return { total, porEstado, porMes };
  }

  // ========================= ESTADÍSTICAS ADMIN =========================
  async obtenerEstadisticasAdmin(fechaInicio?: string, fechaFin?: string) {
    let reclamos = await this.reclamosRepository.findAll({});

    let desde: Date | undefined;
    let hasta: Date | undefined;

    if (fechaInicio) {
      desde = new Date(fechaInicio);
      desde.setHours(0, 0, 0, 0);
    }
    if (fechaFin) {
      hasta = new Date(fechaFin);
      hasta.setHours(23, 59, 59, 999);
    }

    if (desde || hasta) {
      reclamos = reclamos.filter((r: any) => {
        const fecha =
          r.createdAt || r.fechaCreacion || r.fecha || null;

        if (!fecha) return false;
        const f = new Date(fecha);
        if (desde && f < desde) return false;
        if (hasta && f > hasta) return false;
        return true;
      });
    }

    const total = reclamos.length;

    const porEstadoMap = new Map<string, number>();
    const porTipoMap = new Map<string, number>();
    const porAreaMap = new Map<string, number>();
    const porMesMap = new Map<string, number>();

    let totalDiasResolucion = 0;
    let reclamosConResolucion = 0;

    const clientesSet = new Set<string>();
    let abiertos = 0;

    for (const r of reclamos as any[]) {
      const estado = r.estadoActual;
      const estadoNombre =
        estado && typeof estado === 'object'
          ? estado.nombre ?? String(estado._id)
          : String(estado);
      porEstadoMap.set(
        estadoNombre,
        (porEstadoMap.get(estadoNombre) ?? 0) + 1,
      );

      const isCerrado =
        estado && typeof estado === 'object'
          ? estado.nombre === 'Cerrado'
          : false;
      if (!isCerrado) {
        abiertos++;
      }

      const tipo = r.tipoReclamo;
      const tipoNombre =
        tipo && typeof tipo === 'object'
          ? tipo.nombre ?? String(tipo._id)
          : String(tipo);
      porTipoMap.set(
        tipoNombre,
        (porTipoMap.get(tipoNombre) ?? 0) + 1,
      );

      const area = r.area;
      const areaNombre =
        area && typeof area === 'object'
          ? area.nombre ?? String(area._id)
          : String(area);
      porAreaMap.set(
        areaNombre,
        (porAreaMap.get(areaNombre) ?? 0) + 1,
      );

      const fechaBase =
        r.createdAt || r.fechaCreacion || r.fecha || new Date();
      const d = new Date(fechaBase);
      const mesKey = `${d.getFullYear()}-${String(
        d.getMonth() + 1,
      ).padStart(2, '0')}`;
      porMesMap.set(mesKey, (porMesMap.get(mesKey) ?? 0) + 1);

      if (r.clienteId) {
        clientesSet.add(String(r.clienteId));
      } else if (r.cliente) {
        const c = r.cliente;
        const idCliente =
          typeof c === 'object' && c !== null
            ? String(c._id ?? c.id ?? c.clienteId ?? c)
            : String(c);
        clientesSet.add(idCliente);
      }

      const resumen = r.resumenResolucionId;
      let fechaCierreRaw: any = null;

      if (resumen && typeof resumen === 'object') {
        fechaCierreRaw =
          resumen.fechaCierre ||
          resumen.fechaResolucion ||
          resumen.fecha ||
          resumen.createdAt;
      }

      if (fechaBase && fechaCierreRaw) {
        const fechaCreacion = new Date(fechaBase);
        const fechaCierre = new Date(fechaCierreRaw);

        if (
          !Number.isNaN(fechaCreacion.getTime()) &&
          !Number.isNaN(fechaCierre.getTime()) &&
          fechaCierre >= fechaCreacion
        ) {
          const diffMs = fechaCierre.getTime() - fechaCreacion.getTime();
          const diffDias = diffMs / (1000 * 60 * 60 * 24);
          totalDiasResolucion += diffDias;
          reclamosConResolucion++;
        }
      }
    }

    const porEstado = Array.from(porEstadoMap.entries()).map(
      ([key, value]) => ({
        _id: key,
        cantidad: value,
      }),
    );

    const porTipo = Array.from(porTipoMap.entries()).map(
      ([key, value]) => ({
        _id: key,
        cantidad: value,
      }),
    );

    const porArea = Array.from(porAreaMap.entries()).map(
      ([key, value]) => ({
        _id: key,
        cantidad: value,
      }),
    );

    const porMes = Array.from(porMesMap.entries())
      .map(([key, value]) => ({
        _id: key,
        cantidad: value,
      }))
      .sort((a, b) => (a._id > b._id ? 1 : -1));

    const avgResolutionTime =
      reclamosConResolucion > 0
        ? totalDiasResolucion / reclamosConResolucion
        : 0;

    const totalClientes = clientesSet.size;

    return {
      total,
      totalClientes,
      abiertos,
      avgResolutionTime,
      tiempoPromedio: avgResolutionTime,
      porEstado,
      porTipo,
      porArea,
      porMes,
    };
  }
}
