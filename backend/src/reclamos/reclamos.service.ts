import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReclamosRepository } from './repository/reclamos.repository/reclamos.repository';

@Injectable()
export class ReclamosService {
    constructor(
    private readonly reclamosRepository: ReclamosRepository,
    private readonly proyectosService: ProyectosService,
    private readonly tipoReclamoService: TipoReclamoService,
    private readonly prioridadService: PrioridadService,
    private readonly criticidadService: CriticidadService,
    private readonly areaService: AreaService,
    private readonly subareaService: SubareaService,
    private readonly estadoReclamoService: EstadoReclamoService,
    private readonly historialReclamoService: HistorialReclamoService,
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

    const areaFound = await this.areaService.findById(area);
    if (!areaFound) throw new NotFoundException('Área inválida.');

    let subareaFound = null;
    if (subarea) {
        subareaFound = await this.subareaService.findById(subarea);
        if (!subareaFound) throw new NotFoundException('Subárea inválida.');
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

    await this.reclamosRepository.pushHistorial(reclamo._id, historial._id);

    return this.reclamosRepository.findById(reclamo._id);
    }

}
