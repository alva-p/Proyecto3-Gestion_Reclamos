import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ReclamosService } from './reclamos.service';
import { ReclamosRepository } from './repository/reclamos.repository/reclamos.repository';
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

import { CreateReclamoDto } from './dto/create-reclamo.dto/create-reclamo.dto';
import { CambiarEstadoReclamoDto } from '../estado-reclamo/dto/cambiar-estado-reclamo-dto/cambiar-estado-reclamo-dto';
import { AsignarEmpleadoDto } from './dto/asignar-empleado.dto/asignar-empleado.dto';

describe('ReclamosService', () => {
  let service: ReclamosService;

  // Mocks de dependencias
  const reclamosRepositoryMock = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    pushHistorial: jest.fn(),
    updateEstado: jest.fn(),
    asignarEmpleado: jest.fn(), // ya no se usa, pero lo dejamos por si
    cambiarArea: jest.fn(),     // idem
    countByProyecto: jest.fn(),
  };

  const proyectosServiceMock = {
    findById: jest.fn(),
  };
  const tipoReclamoServiceMock = {
    findOne: jest.fn(),
  };
  const prioridadServiceMock = {
    findOne: jest.fn(),
  };
  const criticidadServiceMock = {
    findOne: jest.fn(),
  };

  const areaServiceMock = {
    findById: jest.fn(),
  };

  const subareasServiceMock = {
    findById: jest.fn(),
  };

  const estadoReclamoServiceMock: any = {
    findById: jest.fn(),
    findByNombre: jest.fn(),
  };

  const historialReclamoServiceMock: any = {
    create: jest.fn(),
    createAndAttach: jest.fn(),
  };

  const resumenResolucionServiceMock: any = {
    crearResumen: jest.fn(),
  };

  const empleadosServiceMock: any = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReclamosService,
        { provide: ReclamosRepository, useValue: reclamosRepositoryMock },
        { provide: ProyectosService, useValue: proyectosServiceMock },
        { provide: TipoReclamoService, useValue: tipoReclamoServiceMock },
        { provide: PrioridadService, useValue: prioridadServiceMock },
        { provide: CriticidadService, useValue: criticidadServiceMock },
        { provide: AreasService, useValue: areaServiceMock },
        { provide: SubareasService, useValue: subareasServiceMock },
        { provide: EstadoReclamoService, useValue: estadoReclamoServiceMock },
        { provide: HistorialReclamoService, useValue: historialReclamoServiceMock },
        { provide: ResumenResolucionService, useValue: resumenResolucionServiceMock },
        { provide: EmpleadosService, useValue: empleadosServiceMock },
      ],
    }).compile();

    service = module.get<ReclamosService>(ReclamosService);
  });

  // Registrar Reclamo OK)
  describe('createReclamo', () => {
    it('debe crear un reclamo correctamente con historial inicial', async () => {
      const clienteId = '507f1f77bcf86cd799439011'; 
      const dto: CreateReclamoDto = {
        titulo: 'Error al generar reporte mensual',
        descripcion:
          'Al intentar generar el reporte mensual de ventas, el sistema lanza un error 500 luego de seleccionar fechas.',
        tipoReclamo: 'tipo1',
        prioridad: 'prio1',
        criticidad: 'crit1',
        proyectoId: 'proy1',
      };
      proyectosServiceMock.findById.mockResolvedValue({
        _id: 'proy1',
        clienteId,
      });

      tipoReclamoServiceMock.findOne.mockResolvedValue({ _id: 'tipo1' });
      prioridadServiceMock.findOne.mockResolvedValue({ _id: 'prio1' });
      criticidadServiceMock.findOne.mockResolvedValue({ _id: 'crit1' });

      estadoReclamoServiceMock.findByNombre.mockResolvedValue({
        _id: 'estadoEnviado',
        nombre: 'Enviado',
      });

      // create inicial
      reclamosRepositoryMock.create.mockResolvedValue({
        _id: 'reclamo1',
        ...dto,
        estadoActual: 'estadoEnviado',
        historialIds: [],
        clienteId,
        area: null,
        subarea: null,
      });

      // historial creado
      historialReclamoServiceMock.create.mockResolvedValue({
        _id: 'hist1',
      });

      reclamosRepositoryMock.pushHistorial.mockResolvedValue(null);

      // reclamo final (con historial populate)
      reclamosRepositoryMock.findById.mockResolvedValue({
        _id: 'reclamo1',
        ...dto,
        estadoActual: { _id: 'estadoEnviado', nombre: 'Enviado' },
        historialIds: ['hist1'],
        clienteId,
        area: null,
        subarea: null,
      });

      const result = await service.createReclamo(clienteId, dto);

      expect(proyectosServiceMock.findById).toHaveBeenCalledWith('proy1');
      expect(tipoReclamoServiceMock.findOne).toHaveBeenCalledWith('tipo1');
      expect(prioridadServiceMock.findOne).toHaveBeenCalledWith('prio1');
      expect(criticidadServiceMock.findOne).toHaveBeenCalledWith('crit1');

      expect(reclamosRepositoryMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          titulo: dto.titulo,
          descripcion: dto.descripcion,
          proyectoId: dto.proyectoId,
          clienteId,
          estadoActual: 'estadoEnviado',
          area: null,
          subarea: null,
        }),
      );

      expect(historialReclamoServiceMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          detalleAccion: 'Reclamo creado.',
          estadoReclamo: 'estadoEnviado',
          area: null,
          subarea: null,
        }),
      );

      expect(reclamosRepositoryMock.pushHistorial).toHaveBeenCalledWith(
        'reclamo1',
        'hist1',
      );

      expect(result).toEqual(
        expect.objectContaining({
          _id: 'reclamo1',
          titulo: dto.titulo,
          historialIds: ['hist1'],
          clienteId,
        }),
      );
    });

    it('debe lanzar NotFoundException si el proyecto no existe', async () => {
      proyectosServiceMock.findById.mockResolvedValue(null);

      const clienteId = '507f1f77bcf86cd799439011';
      const dto: CreateReclamoDto = {
        titulo: 'X',
        descripcion:
          'Descripcion suficientemente larga para pasar la validacion.',
        tipoReclamo: 'tipo1',
        prioridad: 'prio1',
        criticidad: 'crit1',
        proyectoId: 'proy1',
      };

      await expect(service.createReclamo(clienteId, dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  // 2) Cambio de estado de Reclamo como empleado
  describe('cambiarEstado', () => {
    it('debe cambiar el estado del reclamo y registrar historial', async () => {
      const reclamoId = 'reclamo1';

      // 1er findById => reclamo actual
      // 2do findById => reclamo actualizado al final
      reclamosRepositoryMock.findById
        .mockResolvedValueOnce({
          _id: reclamoId,
          estadoActual: 'estadoActualId',
          area: 'area1',
          subarea: 'sub1',
        })
        .mockResolvedValueOnce({
          _id: reclamoId,
          estadoActual: { _id: 'nuevoEstadoId', nombre: 'En proceso' },
        });

      // estado nuevo y estado actual
      estadoReclamoServiceMock.findById
        .mockResolvedValueOnce({
          _id: 'nuevoEstadoId',
          nombre: 'En proceso',
        })
        .mockResolvedValueOnce({
          _id: 'estadoActualId',
          nombre: 'En revisión',
        });

      reclamosRepositoryMock.updateEstado.mockResolvedValue({});
      historialReclamoServiceMock.createAndAttach.mockResolvedValue({});

      const dto: CambiarEstadoReclamoDto = {
        nuevoEstadoId: 'nuevoEstadoId',
        empleadoId: 'empleado1',
      };

      empleadosServiceMock.findById.mockResolvedValue({ _id: 'empleado1' });

      const result: any = await service.cambiarEstado(reclamoId, dto);

      expect(reclamosRepositoryMock.updateEstado).toHaveBeenCalledWith(
        reclamoId,
        'nuevoEstadoId',
      );
      expect(historialReclamoServiceMock.createAndAttach).toHaveBeenCalledWith(
        reclamoId,
        expect.objectContaining({
          detalleAccion: 'Cambio de estado a: En proceso',
          estadoReclamo: 'nuevoEstadoId',
          empleado: 'empleado1',
          area: 'area1',
          subarea: 'sub1',
        }),
      );

      expect(result.estadoActual).toEqual(
        expect.objectContaining({ nombre: 'En proceso' }),
      );
    });

    it('no debe permitir cambiar estado si el reclamo ya está cerrado', async () => {
      const reclamoId = 'reclamo1';

      reclamosRepositoryMock.findById.mockResolvedValue({
        _id: reclamoId,
        estadoActual: 'estadoCerradoId',
        area: 'area1',
        subarea: 'sub1',
      });

      estadoReclamoServiceMock.findById
        .mockResolvedValueOnce({
          _id: 'nuevoEstadoId',
          nombre: 'En proceso',
        })
        .mockResolvedValueOnce({
          _id: 'estadoCerradoId',
          nombre: 'Cerrado',
        });

      const dto: CambiarEstadoReclamoDto = {
        nuevoEstadoId: 'nuevoEstadoId',
        empleadoId: 'empleado1',
      };

      await expect(service.cambiarEstado(reclamoId, dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(reclamosRepositoryMock.updateEstado).not.toHaveBeenCalled();
    });
  });

  // 3) asignarEmpleado
  describe('asignarEmpleado', () => {
    it('debe asignar el reclamo a un empleado válido y actualizar área/subárea', async () => {
      const reclamoId = 'reclamo1';
      const dto: AsignarEmpleadoDto = {
        empleadoId: 'empleado1',
      };

      // 1er findById => reclamo actual
      // 2do findById => reclamo luego de asignar
      reclamosRepositoryMock.findById
        .mockResolvedValueOnce({
          _id: reclamoId,
          estadoActual: 'estadoRevisionId',
          area: null,
          subarea: null,
        })
        .mockResolvedValueOnce({
          _id: reclamoId,
          asignadoActual: { _id: 'empleado1' },
          area: 'area1',
          subarea: 'sub1',
        });

      estadoReclamoServiceMock.findById.mockResolvedValue({
        _id: 'estadoRevisionId',
        nombre: 'En revisión',
      });

      // empleado trae la subárea populada
      empleadosServiceMock.findById.mockResolvedValue({
        _id: 'empleado1',
        subarea: {
          _id: 'sub1',
          area: 'area1',
        },
      });

      reclamosRepositoryMock.update.mockResolvedValue({});
      historialReclamoServiceMock.createAndAttach.mockResolvedValue({});

      const result: any = await service.asignarEmpleado(reclamoId, dto);

      expect(reclamosRepositoryMock.update).toHaveBeenCalledWith(
        reclamoId,
        expect.objectContaining({
          asignadoActual: 'empleado1',
          area: 'area1',
          subarea: 'sub1',
        }),
      );

      expect(historialReclamoServiceMock.createAndAttach).toHaveBeenCalledWith(
        reclamoId,
        expect.objectContaining({
          detalleAccion: 'Asignación de empleado responsable.',
          empleado: 'empleado1',
          area: 'area1',
          subarea: 'sub1',
        }),
      );

      expect(result.asignadoActual).toEqual(
        expect.objectContaining({ _id: 'empleado1' }),
      );
    });
  });

  // CerrarReclamo
  describe('cerrarReclamo', () => {
    it('debe cerrar un reclamo correctamente con resumen de resolución', async () => {
      const reclamoId = 'reclamo1';
      reclamosRepositoryMock.findById
        .mockResolvedValueOnce({
          _id: reclamoId,
          estadoActual: 'estadoRevisionId',
          area: 'area1',
          subarea: 'sub1',
        })
        .mockResolvedValueOnce({
          _id: reclamoId,
          estadoActual: { _id: 'estadoCerradoId', nombre: 'Cerrado' },
          resumenResolucionId: 'resumen1',
        });

      // estado actual
      estadoReclamoServiceMock.findById.mockResolvedValue({
        _id: 'estadoRevisionId',
        nombre: 'En revisión',
      });

      // estado "Cerrado"
      estadoReclamoServiceMock.findByNombre.mockResolvedValue({
        _id: 'estadoCerradoId',
        nombre: 'Cerrado',
      });

      empleadosServiceMock.findById.mockResolvedValue({
        _id: 'empleado1',
      });

      reclamosRepositoryMock.update.mockResolvedValue({});
      resumenResolucionServiceMock.crearResumen.mockResolvedValue({
        _id: 'resumen1',
      });
      historialReclamoServiceMock.createAndAttach.mockResolvedValue({});

      const dto = {
        descripcion:
          'Se detectó un error de configuración en el servidor de reportes y se corrigió correctamente.',
        responsableId: 'empleado1',
      };

      const result: any = await service.cerrarReclamo(reclamoId, dto);

      expect(reclamosRepositoryMock.update).toHaveBeenCalledWith(reclamoId, {
        estadoActual: 'estadoCerradoId',
      });

      expect(resumenResolucionServiceMock.crearResumen).toHaveBeenCalledWith(
        { descripcion: dto.descripcion, responsableId: dto.responsableId },
        reclamoId,
      );

      expect(historialReclamoServiceMock.createAndAttach).toHaveBeenCalledWith(
        reclamoId,
        expect.objectContaining({
          detalleAccion: 'Reclamo cerrado con resumen de resolución.',
          empleado: 'empleado1',
          estadoReclamo: 'estadoCerradoId',
          area: 'area1',
          subarea: 'sub1',
        }),
      );

      expect(result.estadoActual).toEqual(
        expect.objectContaining({ nombre: 'Cerrado' }),
      );
      expect(result.resumenResolucionId).toBe('resumen1');
    });

    it('debe lanzar BadRequestException si el resumen es muy corto', async () => {
      const reclamoId = 'reclamo1';

      reclamosRepositoryMock.findById.mockResolvedValue({
        _id: reclamoId,
        estadoActual: 'estadoRevisionId',
        area: 'area1',
        subarea: 'sub1',
      });

      estadoReclamoServiceMock.findById.mockResolvedValue({
        _id: 'estadoRevisionId',
        nombre: 'En revisión',
      });

      const dto = {
        descripcion: 'Muy corto',
        responsableId: 'empleado1',
      };

      await expect(service.cerrarReclamo(reclamoId, dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );

      expect(reclamosRepositoryMock.update).not.toHaveBeenCalled();
      expect(resumenResolucionServiceMock.crearResumen).not.toHaveBeenCalled();
    });
  });

  // Intentar modificar estado cuando ya está cerrado
  it('No debe permitir cambiar el estado si el reclamo ya está cerrado', async () => {
    const reclamoId = 'reclamoCerradoId';

    reclamosRepositoryMock.findById.mockResolvedValue({
      _id: reclamoId,
      estadoActual: 'estadoCerradoId',
      area: 'area1',
      subarea: 'sub1',
    });

    estadoReclamoServiceMock.findById
      .mockResolvedValueOnce({
        _id: 'nuevoEstadoId',
        nombre: 'En revisión',
      })
      .mockResolvedValueOnce({
        _id: 'estadoCerradoId',
        nombre: 'Cerrado',
      });

    const dto = {
      nuevoEstadoId: 'nuevoEstadoId',
      empleadoId: 'empleado1',
    };

    await expect(service.cambiarEstado(reclamoId, dto)).rejects.toThrow(
      new ConflictException('El reclamo ya está cerrado.'),
    );

    expect(reclamosRepositoryMock.updateEstado).not.toHaveBeenCalled();
    expect(historialReclamoServiceMock.createAndAttach).not.toHaveBeenCalled();
  });
});
