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
import { UpdateReclamoDto } from './dto/update-reclamo.dto/update-reclamo.dto';
import { CrearResumenResolucionDto } from '../resumen-resolucion/dto/create-resumen-resolucion.dto/create-resumen-resolucion.dto';
import { CreateReclamoDto } from './dto/create-reclamo.dto/create-reclamo.dto';
import { Types } from 'mongoose';
import { getAreaIdFromSubarea } from '../common/helpers/area-subarea';

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

    //CREAR RECLAMO
    async createReclamo(clienteId: string, dto: CreateReclamoDto) {
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
        if (!new Types.ObjectId(clienteId).equals(proyecto.clienteId as any)) {
            throw new BadRequestException('El proyecto no pertenece al cliente.');
        }

        const tipoReclamoFound = await this.tipoReclamoService.findOne(tipoReclamo);
        if (!tipoReclamoFound) throw new NotFoundException('Tipo de reclamo inválido.');

        const prioridadFound = await this.prioridadService.findOne(prioridad);
        if (!prioridadFound) throw new NotFoundException('Prioridad inválida.');

        const criticidadFound = await this.criticidadService.findOne(criticidad);
        if (!criticidadFound) throw new NotFoundException('Criticidad inválida.');

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
            // 👉 todavía sin área ni subárea
            area: null,
            subarea: null,
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
            area: null,
            subarea: null,
            empleado: null,
            reclamoId: reclamo._id,
        });

        await this.reclamosRepository.pushHistorial(
            reclamo._id as string,
            historial._id as string,
        );
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
    async update(id: string, dto: UpdateReclamoDto) {
        const reclamo = await this.reclamosRepository.update(id, dto);
        if (!reclamo) {
            throw new NotFoundException('Reclamo no encontrado.');
        }
        return reclamo;
    }

    //CAMBIAR ESTADO
    async cambiarEstado(reclamoId: string, dto: CambiarEstadoReclamoDto) {
        const { nuevoEstadoId, empleadoId  } = dto;

        const reclamo = await this.reclamosRepository.findById(reclamoId);
        if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');

        const nuevoEstado = await this.estadoReclamoService.findById(nuevoEstadoId);
        if (!nuevoEstado) throw new NotFoundException('Estado inválido.');

        const estadoActual = await this.estadoReclamoService.findById(
        reclamo.estadoActual as any,
        );

        if (estadoActual.nombre === 'Cerrado') {
        throw new ConflictException('El reclamo ya está cerrado.');
        }


        if (empleadoId) {
            const empleado = await this.empleadosService.findById(empleadoId);
            if (!empleado) throw new NotFoundException('Empleado no encontrado.');
        }

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

        const estadoActual = await this.estadoReclamoService.findById(
            reclamo.estadoActual as any,
        );
        if (estadoActual.nombre === 'Cerrado') {
            throw new ConflictException('El reclamo ya está cerrado.');
        }

        // Traemos el empleado con su subárea
        const empleado = await this.empleadosService.findById(empleadoId);
        if (!empleado) throw new NotFoundException('Empleado no encontrado.');

        if (!empleado.subarea) {
            throw new BadRequestException(
            'El empleado no tiene subárea asignada. No se puede asignar al reclamo.',
            );
        }

        // empleado.subarea viene populado
        const subareaDoc = empleado.subarea as any; // Subarea
        const areaId = getAreaIdFromSubarea(subareaDoc); // helper que ya tenés

        // Actualizamos reclamo: responsable + área + subárea
        await this.reclamosRepository.update(reclamoId, {
            asignadoActual: empleado._id,
            subarea: subareaDoc._id ?? subareaDoc,
            area: areaId,
        });

        // Historial coherente con lo anterior
        await this.historialReclamoService.createAndAttach(reclamoId, {
            detalleAccion: 'Asignación de empleado responsable.',
            empleado: empleado._id,
            estadoReclamo: reclamo.estadoActual,
            area: areaId,
            subarea: subareaDoc._id ?? subareaDoc,
        });

        return this.reclamosRepository.findById(reclamoId);
    }

    //CERRAR RECLAMO
    async cerrarReclamo(reclamoId: string, dto: CrearResumenResolucionDto) {
        const { descripcion, responsableId } = dto;
        const reclamo = await this.reclamosRepository.findById(reclamoId);
        if (!reclamo) throw new NotFoundException('Reclamo no encontrado.');

        //Traer el estado actual a partir del ID
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

        // Buscar el estado "Cerrado"
        const estadoCerrado = await this.estadoReclamoService.findByNombre('Cerrado');
        if (!estadoCerrado) {
            throw new NotFoundException(
            'Debe existir el estado "Cerrado" en el sistema.',
            );
        }

        // (opcional pero prolijo) validar que el responsable exista
        const empleado = await this.empleadosService.findById(responsableId);
        if (!empleado) {
            throw new NotFoundException('Empleado responsable no encontrado.');
        }

        // 1) Cambiar el estado del reclamo a "Cerrado"
        await this.reclamosRepository.update(reclamoId, {
            estadoActual: estadoCerrado._id,
        });

        // 2) Crear el resumen de resolución (sin validar estado ahí)
        const resumen = await this.resumenResolucionService.crearResumen(
            { descripcion, responsableId },
            reclamoId,
        );

        // 3) Registrar historial del cierre
        await this.historialReclamoService.createAndAttach(reclamoId, {
            detalleAccion: 'Reclamo cerrado con resumen de resolución.',
            empleado: responsableId,
            estadoReclamo: estadoCerrado._id,
            area: reclamo.area,
            subarea: reclamo.subarea,
        });

        // 4) Devolver el reclamo actualizado
        return this.reclamosRepository.findById(reclamoId);
    }


}
