// test/reclamos.int-spec.ts
import { INestApplication } from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

import { AppModule } from '../app.module';

import { ReclamosService } from './reclamos.service';
import { TipoReclamoService } from '../tipo-reclamo/tipo-reclamo.service';
import { PrioridadService } from '../prioridad/prioridad.service';
import { CriticidadService } from '../criticidad/criticidad.service';
import { ProyectosService } from '../proyectos/proyectos.service';
import { AreasService } from '../areas/areas.service';
import { SubareasService } from '../subareas/subareas.service';
import { EmpleadosService } from '../empleados/empleados.service';
import { EstadoReclamoService } from '../estado-reclamo/estado-reclamo.service';
import { AuthService } from '../auth/auth.service';

import { CreateReclamoDto } from './dto/create-reclamo.dto/create-reclamo.dto';
import { AsignarEmpleadoDto } from './dto/asignar-empleado.dto/asignar-empleado.dto';
import { CambiarEstadoReclamoDto } from '../estado-reclamo/dto/cambiar-estado-reclamo-dto/cambiar-estado-reclamo-dto';

describe('ReclamosService - Integración', () => {
  let app: INestApplication;
  let connection: Connection;

  let reclamosService: ReclamosService;
  let tipoReclamoService: TipoReclamoService;
  let prioridadService: PrioridadService;
  let criticidadService: CriticidadService;
  let proyectosService: ProyectosService;
  let areasService: AreasService;
  let subareasService: SubareasService;
  let empleadosService: EmpleadosService;
  let estadoReclamoService: EstadoReclamoService;
  let authService: AuthService;

  // IDs compartidos entre tests
  let clienteId: string;
  let proyectoId: string;
  let tipoReclamoId: string;
  let prioridadId: string;
  let criticidadId: string;
  let areaId: string;
  let subareaId: string;
  let empleadoId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = app.get<Connection>(getConnectionToken());

    reclamosService = app.get(ReclamosService);
    tipoReclamoService = app.get(TipoReclamoService);
    prioridadService = app.get(PrioridadService);
    criticidadService = app.get(CriticidadService);
    proyectosService = app.get(ProyectosService);
    areasService = app.get(AreasService);
    subareasService = app.get(SubareasService);
    empleadosService = app.get(EmpleadosService);
    estadoReclamoService = app.get(EstadoReclamoService);
    authService = app.get(AuthService);

    const suffix = Date.now();

    const area = await areasService.create({
      nombre: `Soporte Técnico INT-${suffix}`,
      descripcion: 'Área encargada del soporte técnico (tests integración)',
    } as any);
    areaId = (area._id as any).toString();

    const subarea = await subareasService.create({
      nombre: `Mesa de Ayuda INT-${suffix}`,
      descripcion: 'Subárea de mesa de ayuda (tests integración)',
      area: areaId,
      esInterna: true,
    } as any);
    subareaId = (subarea._id as any).toString();

    // 2) Empleado (usuario + empleado) usando AuthService, con mail único
    const empleadoRegistro = await authService.registerEmpleado({
      nombre: `Empleado Test INT-${suffix}`,
      correo: `empleado-int-${suffix}@test.com`,
      contraseña: 'Empleado123!',
      puesto: 'Soporte Nivel 1',
      subareaId: subareaId,
    });
    empleadoId = (empleadoRegistro.empleado.id as any).toString();

    // 3) Cliente (usuario + cliente) usando AuthService, con mail único
    const clienteRegistro = await authService.registerCliente({
      nombre: `Cliente Test INT-${suffix}`,
      correo: `cliente-int-${suffix}@test.com`,
      contraseña: 'Cliente123!',
      empresa: `Empresa Test SA INT-${suffix}`,
      telefono: '123456789',
      direccion: 'Calle Falsa 123',
    });
    clienteId = (clienteRegistro.cliente.id as any).toString();

    // 4) Tipo de reclamo / prioridad / criticidad con nombres únicos
    const tipo = await tipoReclamoService.create({
      nombre: `Bug INT-${suffix}`,
      descripcion: 'Errores en el sistema (tests integración)',
    } as any);
    tipoReclamoId = (tipo._id as any).toString();

    const prio = await prioridadService.create({
      nombre: `Alta INT-${suffix}`,
      descripcion: 'Prioridad alta (tests integración)',
    } as any);
    prioridadId = (prio._id as any).toString();

    const crit = await criticidadService.create({
      nombre: `Alta Criticidad INT-${suffix}`,
      descripcion: 'Criticidad alta (tests integración)',
    } as any);
    criticidadId = (crit._id as any).toString();

    // 5) Proyecto asociado al cliente
    const proyecto = await proyectosService.create({
      nombre: `Proyecto Integración INT-${suffix}`,
      descripcion: 'Proyecto de prueba para tests de integración de reclamos',
      clienteId: clienteId,
      // tipoProyecto opcional
    } as any);
    proyectoId = (proyecto._id as any).toString();
  });


  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  // 1) createReclamo
  describe('createReclamo (integración)', () => {
    it('debe crear un reclamo correctamente con historial inicial', async () => {
      const dto: CreateReclamoDto = {
        titulo: 'Error al generar reporte mensual',
        descripcion:
          'Al intentar generar el reporte mensual de ventas, el sistema lanza un error 500 luego de seleccionar fechas.',
        tipoReclamo: tipoReclamoId,
        prioridad: prioridadId,
        criticidad: criticidadId,
        proyectoId: proyectoId,
      };

      const reclamo: any = await reclamosService.createReclamo(clienteId, dto);

      expect(reclamo).toBeDefined();
      expect(reclamo._id).toBeDefined();
      expect(reclamo.titulo).toBe(dto.titulo);
      expect(reclamo.descripcion).toBe(dto.descripcion);
      expect(reclamo.proyectoId.toString()).toBe(proyectoId);
      expect(reclamo.clienteId.toString()).toBe(clienteId);

      // Estado inicial "Enviado"
      expect(reclamo.estadoActual).toBeDefined();
      // Puede venir populado o como ObjectId, así que chequeamos por nombre si existe
      if (reclamo.estadoActual.nombre) {
        expect(reclamo.estadoActual.nombre).toBe('Enviado');
      }

      // Área y subárea deben ser null al crear
      expect(reclamo.area).toBeNull();
      expect(reclamo.subarea).toBeNull();

      // Debe existir historial inicial
      expect(reclamo.historialIds).toBeDefined();
      expect(Array.isArray(reclamo.historialIds)).toBe(true);
      expect(reclamo.historialIds.length).toBeGreaterThanOrEqual(1);
    });

    it('debe lanzar NotFoundException si el proyecto no existe', async () => {
      const dto: CreateReclamoDto = {
        titulo: 'Reclamo con proyecto inexistente',
        descripcion:
          'Descripción suficientemente larga para pasar las validaciones del DTO.',
        tipoReclamo: tipoReclamoId,
        prioridad: prioridadId,
        criticidad: criticidadId,
        proyectoId: '666666666666666666666666', // id que no existe
      };

      await expect(
        reclamosService.createReclamo(clienteId, dto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  // 2) asignarEmpleado
  describe('asignarEmpleado (integración)', () => {
    it('debe asignar el reclamo a un empleado válido y setear área/subárea', async () => {
      // Crear reclamo base
      const dtoReclamo: CreateReclamoDto = {
        titulo: 'Reclamo para asignación de empleado',
        descripcion:
          'Descripción larga para testear la asignación de un empleado responsable.',
        tipoReclamo: tipoReclamoId,
        prioridad: prioridadId,
        criticidad: criticidadId,
        proyectoId: proyectoId,
      };

      const reclamoCreado: any = await reclamosService.createReclamo(
        clienteId,
        dtoReclamo,
      );

      const reclamoId = reclamoCreado._id.toString();

      const dtoAsignar: AsignarEmpleadoDto = {
        empleadoId: empleadoId,
      };

      const reclamoAsignado: any = await reclamosService.asignarEmpleado(
        reclamoId,
        dtoAsignar,
      );

      // Debe tener asignadoActual
      expect(reclamoAsignado.asignadoActual).toBeDefined();
      expect(reclamoAsignado.asignadoActual._id.toString()).toBe(empleadoId);

      // Debe actualizar área y subárea con la del empleado
      expect(reclamoAsignado.area).toBeDefined();
      expect(reclamoAsignado.subarea).toBeDefined();

      if (reclamoAsignado.area._id) {
        expect(reclamoAsignado.area._id.toString()).toBe(areaId);
      } else {
        expect(reclamoAsignado.area.toString()).toBe(areaId);
      }

      if (reclamoAsignado.subarea._id) {
        expect(reclamoAsignado.subarea._id.toString()).toBe(subareaId);
      } else {
        expect(reclamoAsignado.subarea.toString()).toBe(subareaId);
      }
    });
  });

  // 3) cerrarReclamo 
  describe('cerrarReclamo (integración)', () => {
    it('debe cerrar un reclamo correctamente con resumen de resolución', async () => {
      // Crear reclamo
      const dtoReclamo: CreateReclamoDto = {
        titulo: 'Reclamo para cierre',
        descripcion:
          'Descripción larga para testear el cierre de un reclamo con resumen.',
        tipoReclamo: tipoReclamoId,
        prioridad: prioridadId,
        criticidad: criticidadId,
        proyectoId: proyectoId,
      };

      const reclamoCreado: any = await reclamosService.createReclamo(
        clienteId,
        dtoReclamo,
      );

      const reclamoId = reclamoCreado._id.toString();

      const dtoCierre = {
        descripcion:
          'Se encontró la causa del error en la configuración del servidor y se aplicó el fix correspondiente. Se validó que el reporte se genere correctamente.',
        responsableId: empleadoId,
      };

      const reclamoCerrado: any = await reclamosService.cerrarReclamo(
        reclamoId,
        dtoCierre as any,
      );

      // Estado debe ser "Cerrado"
      expect(reclamoCerrado.estadoActual).toBeDefined();
      if (reclamoCerrado.estadoActual.nombre) {
        expect(reclamoCerrado.estadoActual.nombre).toBe('Cerrado');
      }

      // Debe tener un resumen de resolución asociado
      expect(reclamoCerrado.resumenResolucionId).toBeDefined();
    });

    it('debe lanzar BadRequestException si el resumen es muy corto', async () => {
      const dtoReclamo: CreateReclamoDto = {
        titulo: 'Reclamo para cierre inválido',
        descripcion:
          'Descripción larga para testear el cierre de un reclamo con resumen corto.',
        tipoReclamo: tipoReclamoId,
        prioridad: prioridadId,
        criticidad: criticidadId,
        proyectoId: proyectoId,
      };

      const reclamoCreado: any = await reclamosService.createReclamo(
        clienteId,
        dtoReclamo,
      );

      const reclamoId = reclamoCreado._id.toString();

      const dtoCierreInvalido = {
        descripcion: 'Muy corto',
        responsableId: empleadoId,
      };

      await expect(
        reclamosService.cerrarReclamo(reclamoId, dtoCierreInvalido as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  // 4) cambiarEstado (OK y no permite si está cerrado)
  describe('cambiarEstado (integración)', () => {
    it('debe cambiar el estado del reclamo y registrar historial', async () => {
      const dtoReclamo: CreateReclamoDto = {
        titulo: 'Reclamo para cambio de estado',
        descripcion:
          'Descripción larga para probar el cambio de estado de un reclamo.',
        tipoReclamo: tipoReclamoId,
        prioridad: prioridadId,
        criticidad: criticidadId,
        proyectoId: proyectoId,
      };

      const reclamoCreado: any = await reclamosService.createReclamo(
        clienteId,
        dtoReclamo,
      );
      const reclamoId = reclamoCreado._id.toString();

      // Estado al que queremos cambiar (por ejemplo, "En proceso")
      const nuevoEstado: any = await estadoReclamoService.findByNombre('En proceso');

      const dtoCambio: CambiarEstadoReclamoDto = {
        nuevoEstadoId: (nuevoEstado._id as any).toString(),
        empleadoId: empleadoId,
      };

      const reclamoActualizado: any = await reclamosService.cambiarEstado(
        reclamoId,
        dtoCambio,
      );

      // Estado actual debe ser "En proceso"
      expect(reclamoActualizado.estadoActual).toBeDefined();
      if (reclamoActualizado.estadoActual.nombre) {
        expect(reclamoActualizado.estadoActual.nombre).toBe('En proceso');
      }

      // Verificamos que al menos tenga 2 movimientos de historial (creación + cambio)
      expect(reclamoActualizado.historialIds).toBeDefined();
      expect(reclamoActualizado.historialIds.length).toBeGreaterThanOrEqual(2);
    });

    it('no debe permitir cambiar el estado si el reclamo ya está cerrado', async () => {
      const dtoReclamo: CreateReclamoDto = {
        titulo: 'Reclamo ya cerrado',
        descripcion:
          'Descripción para testear que no se pueda cambiar el estado de un reclamo cerrado.',
        tipoReclamo: tipoReclamoId,
        prioridad: prioridadId,
        criticidad: criticidadId,
        proyectoId: proyectoId,
      };

      const reclamoCreado: any = await reclamosService.createReclamo(
        clienteId,
        dtoReclamo,
      );
      const reclamoId = reclamoCreado._id.toString();

      // Primero lo cerramos
      await reclamosService.cerrarReclamo(reclamoId, {
        descripcion:
          'Resumen suficientemente largo para cerrar el reclamo correctamente.',
        responsableId: empleadoId,
      } as any);

      // Intentamos cambiarlo a "En revisión"
      const estadoEnRevision: any = await estadoReclamoService.findByNombre(
        'En revisión',
      );

      const dtoCambio: CambiarEstadoReclamoDto = {
        nuevoEstadoId: (estadoEnRevision._id as any).toString(),
        empleadoId: empleadoId,
      };

      await expect(
        reclamosService.cambiarEstado(reclamoId, dtoCambio),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });
});
