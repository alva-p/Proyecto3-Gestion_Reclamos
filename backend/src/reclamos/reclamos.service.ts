import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ConflictException
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
import { Subarea } from '../subareas/Entidad/subarea.schema';

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
    ) {}

    async createReclamo(dto: any, clienteId: string) {
        const {
            titulo,
            descripcion,
            tipoReclamo,
            prioridad,
            criticidad,
            area,
            subarea,
            proyectoId,
        } = dto;
        /*
        const proyecto = await this.proyectosService.findById(proyectoId);
        if (!proyecto) {
            throw new NotFoundException('El proyecto no existe.');
        }

        if (proyecto.clienteId !== clienteId) {
            throw new BadRequestException('El proyecto no pertenece al cliente.');
        }
        const tipoReclamoFound = await this.tipoReclamoService.findById(tipoReclamo);
        if (!tipoReclamoFound) throw new NotFoundException('Tipo de reclamo inválido.');

        const prioridadFound = await this.prioridadService.findById(prioridad);
        if (!prioridadFound) throw new NotFoundException('Prioridad inválida.');

        const criticidadFound = await this.criticidadService.findById(criticidad);
        if (!criticidadFound) throw new NotFoundException('Criticidad inválida.');
        */
        const areaFound = await this.areaService.findById(area);
        if (!areaFound) throw new NotFoundException('Área inválida.');

        let subareaFound: Subarea | null = null;
        if (subarea) {
            subareaFound = await this.subareaService.findById(subarea);
            if (!subareaFound) {
                throw new NotFoundException('Subárea inválida.');
            }
            // 🔥 Validación obligatoria
            if (subareaFound.area.toString() !== area.toString()) {
                throw new BadRequestException('La subárea no pertenece al área indicada.');
            }
        }


        const estadoInicial = await this.estadoReclamoService.findByNombre('Enviado');
        if (!estadoInicial) {
            throw new NotFoundException('No se encontró el estado inicial "Enviado".');
        }

        const reclamo = await this.reclamosRepository.create({
            titulo,
            descripcion,
            tipoReclamo,
            prioridad,
            criticidad,
            area,
            subarea: subarea ?? null,
            estadoActual: estadoInicial._id,
            asignadoActual: null,
            historialIds: [],
            resumenResolucionId: null,
            proyectoId,
            clienteId,
        });

        const historial = await this.historialReclamoService.create({
            fechaHora: new Date(),
            detalleAccion: 'Reclamo creado.',
            estadoReclamo: estadoInicial._id,
            area,
            subarea: subarea ?? null,
            empleado: null,
            reclamoId: reclamo._id,
        });
        await this.reclamosRepository.pushHistorial(reclamo._id as string, historial._id as string);
        return this.reclamosRepository.findById(reclamo._id as string);
    }
    //LISTAR CON FILTROS
    async findAll(filters: any) {
        const query: any = {};

        if (filters.estado) query.estadoActual = filters.estado;
        if (filters.area) query.area = filters.area;
        if (filters.clienteId) query.clienteId = filters.clienteId;
        if (filters.proyectoId) query.proyectoId = filters.proyectoId;
        if (filters.asignadoActual) query.asignadoActual = filters.asignadoActual;

        return this.reclamosRepository.findAll(query);
    }
    //BUSCAR POR ID
    async findById(id: string) {
        const reclamo = await this.reclamosRepository.findById(id);
        if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');
        return reclamo;
    }
    //ACTUALIZAR DATOS BASE
    async update(id: string, dto: any) {
    const reclamo = await this.reclamosRepository.findById(id);
        if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');

        // No permitir modificar reclamos cerrados
        if (reclamo.estadoActual?.nombre === 'Cerrado' || reclamo.estadoActual?.nombre === 'Cancelado') {
            throw new ConflictException('No se puede modificar un reclamo cerrado o cancelado.');
        }

        // Detectar cambios relevantes
        const cambios: string[] = [];

        if (dto.estadoActual && dto.estadoActual !== reclamo.estadoActual._id as string) {
            cambios.push('Cambio de estado');
        }

        if (dto.area && dto.area !== reclamo.area._id as string) {
            cambios.push('Cambio de área');
        }

        if (dto.subarea && dto.subarea !== reclamo.subarea?._id as string) {
            cambios.push('Cambio de subárea');
        }

        if (dto.asignadoActual && dto.asignadoActual !== reclamo.asignadoActual?._id as string) {
            cambios.push('Cambio de responsable');
        }

        // Actualizar reclamo
        const updated = await this.reclamosRepository.update(id, dto);
        if (!updated) throw new NotFoundException('No se pudo actualizar el reclamo.');
        // Registrar cambios relevantes en historial
        for (const cambio of cambios) {
            await this.historialReclamoService.createAndAttach(id, {
            detalleAccion: cambio,
            estadoReclamo: updated.estadoActual,
            area: updated.area,
            subarea: updated.subarea,
            empleado: updated.asignadoActual ?? null,
            });
        }

        return updated;
    }
    //CAMBIAR ESTADO
    async cambiarEstado(reclamoId: string, dto: CambiarEstadoReclamoDto) {
        const { nuevoEstadoId, empleadoId  } = dto;

        const reclamo = await this.reclamosRepository.findById(reclamoId);
        if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');

        const nuevoEstado = await this.estadoReclamoService.findById(nuevoEstadoId);
        if (!nuevoEstado) throw new NotFoundException('Estado inválido.');

        if (reclamo.estadoActual?.nombre === 'Cerrado') {
            throw new ConflictException('El reclamo ya está cerrado.');
        }
        /*
        if (empleadoId) {
            const empleado = await this.subareaService.findEmpleadoById(empleadoId);
            if (!empleado) throw new NotFoundException('Empleado no encontrado.');
        }
        */
        await this.reclamosRepository.updateEstado(reclamoId, nuevoEstadoId);

        await this.historialReclamoService.createAndAttach(reclamoId, {
            detalleAccion: `Cambio de estado a: ${nuevoEstado.nombre}`,
            estadoReclamo: nuevoEstadoId,
            empleado: empleadoId ?? null,
            area: reclamo.area,
            subarea: reclamo.subarea,
        });

        return this.reclamosRepository.findById(reclamoId);
    }

    //ASIGNAR EMPLEADO
    async asignarEmpleado(reclamoId: string, dto: AsignarEmpleadoDto) {
        const { empleadoId } = dto;

        const reclamo = await this.reclamosRepository.findById(reclamoId);
        if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');

        if (reclamo.estadoActual?.nombre === 'Cerrado') {
            throw new ConflictException('No se puede asignar un empleado a un reclamo cerrado.');
        }
        /*
        const empleado = await this.empleadosService.findById(empleadoId);
        if (!empleado) throw new NotFoundException('Empleado no encontrado.');
        */
        await this.reclamosRepository.asignarEmpleado(reclamoId, empleadoId);

        await this.historialReclamoService.createAndAttach(reclamoId, {
            detalleAccion: 'Asignación de empleado responsable.',
            empleado: empleadoId,
            estadoReclamo: reclamo.estadoActual,
            area: reclamo.area,
            subarea: reclamo.subarea,
        });

        return this.reclamosRepository.findById(reclamoId);
    }
    //CAMBIAR ÁREA
    async cambiarArea(reclamoId: string, dto: any) {
        const { areaId, subareaId, empleadoId } = dto;

        const reclamo = await this.reclamosRepository.findById(reclamoId);
        if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');
        /*
        const area = await this.areaService.findById(areaId);
        if (!area) throw new NotFoundException('Área inválida.');

        let subarea = null;
        if (subareaId) {
            subarea = await this.subareaService.findById(subareaId);
            if (!subarea) throw new NotFoundException('Subárea inválida.');
        }
        */
        await this.reclamosRepository.cambiarArea(reclamoId, areaId, subareaId,);

        await this.historialReclamoService.createAndAttach(reclamoId, {
            detalleAccion: 'Cambio de área/subárea.',
            empleado: empleadoId ?? null,
            area: areaId,
            subarea: subareaId ?? null,
            estadoReclamo: reclamo.estadoActual,
        });

        return this.reclamosRepository.findById(reclamoId);
    }

    //CERRAR RECLAMO
    async cerrarReclamo(reclamoId: string, dto: any) {
    const { descripcion, responsableId, adjuntoId } = dto;

    const reclamo = await this.reclamosRepository.findById(reclamoId);
    if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');

    if (reclamo.estadoActual?.nombre === 'Cerrado') {
        throw new ConflictException('El reclamo ya está cerrado.');
    }

    if (!descripcion || descripcion.length < 20) {
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

    // 1. Crear resumen correctamente usando el service REAL
    const resumen = await this.resumenResolucionService.crearResumen(
        {
        descripcion,
        responsableId,
        },
        reclamoId,
    );

    // 2. Actualizar reclamo con estado y resumen
    await this.reclamosRepository.update(reclamoId, {
        estadoActual: estadoCerrado._id,
        resumenResolucionId: resumen._id,
    });

    // 3. Registrar historial del cierre
    await this.historialReclamoService.createAndAttach(reclamoId, {
        detalleAccion: 'Reclamo cerrado con resumen de resolución.',
        empleado: responsableId,
        estadoReclamo: estadoCerrado._id,
        area: reclamo.area,
        subarea: reclamo.subarea,
    });

    return this.reclamosRepository.findById(reclamoId);
    }

}
