

import { Test, TestingModule } from '@nestjs/testing';
import { ProyectosService } from './proyectos.service';
import { ForbiddenException, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { ProyectosRepository } from './repository/proyectos.repository/proyectos.repository';
import { ReclamosRepository } from '../reclamos/repository/reclamos.repository/reclamos.repository';
import { ClientesService } from '../clientes/clientes.service';
import { TipoProyectoService } from '../tipo-proyecto/tipo-proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto/create-proyecto.dto';

describe('ProyectosService', () => {
  let service: ProyectosService;
  let proyectosRepository: Partial<Record<keyof ProyectosRepository, jest.Mock>>;
  let reclamosRepository: Partial<Record<keyof ReclamosRepository, jest.Mock>>;
  let clientesService: Partial<Record<keyof ClientesService, jest.Mock>>;
  let tipoProyectoService: Partial<Record<keyof TipoProyectoService, jest.Mock>>;

  const proyectoData: CreateProyectoDto = {
    nombre: 'Sistema ventas',
    descripcion: 'Desarrollo de plataforma de ventas online',
    tipoProyecto: '6567b8e2f1a2c8a1b2c3d4e5',
    clienteId: '6567b8e2f1a2c8a1b2c3d4e6',
  };

  const proyectoCreado = {
    _id: '6567b8e2f1a2c8a1b2c3d4e7',
    ...proyectoData,
  };

  beforeEach(async () => {
    proyectosRepository = {
      create: jest.fn(),
    };
    reclamosRepository = {};
    clientesService = {
      findById: jest.fn(),
    };
    tipoProyectoService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectosService,
        { provide: ProyectosRepository, useValue: proyectosRepository },
        { provide: ReclamosRepository, useValue: reclamosRepository },
        { provide: ClientesService, useValue: clientesService },
        { provide: TipoProyectoService, useValue: tipoProyectoService },
      ],
    }).compile();

    service = module.get<ProyectosService>(ProyectosService);
  });

  describe('eliminarProyecto', () => {
    it('debería impedir eliminar un proyecto con reclamos asociados', async () => {
      // Datos del proyecto y reclamo
      const proyectoId = '6567b8e2f1a2c8a1b2c3d4e7';
      const proyectoExistente = {
        _id: proyectoId,
        nombre: 'Sistema ventas',
        clienteId: '6567b8e2f1a2c8a1b2c3d4e6',
      };

      // Mock: el proyecto existe
      proyectosRepository.findById = jest.fn().mockResolvedValue(proyectoExistente);
      // Mock: hay reclamos asociados
      reclamosRepository.countByProyecto = jest.fn().mockResolvedValue(2);
      // Mock: delete no debe ser llamado
      proyectosRepository.remove = jest.fn();

      // Ejecuta y espera la excepción
      await expect(service.remove(proyectoId, proyectoExistente.clienteId)).rejects.toThrow(BadRequestException);
      try {
        await service.remove(proyectoId, proyectoExistente.clienteId);
      } catch (error) {
        expect(error.message).toBe('No se puede eliminar el proyecto porque tiene 2 reclamo(s) asociado(s)');
      }
      expect(proyectosRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('debería crear un proyecto correctamente', async () => {
      clientesService.findById!.mockResolvedValue({ _id: proyectoData.clienteId });
      tipoProyectoService.findOne!.mockResolvedValue({ _id: proyectoData.tipoProyecto });
      proyectosRepository.create!.mockResolvedValue(proyectoCreado);

      const resultado = await service.create(proyectoData, proyectoData.clienteId);

      expect(clientesService.findById).toHaveBeenCalledWith(proyectoData.clienteId);
      expect(tipoProyectoService.findOne).toHaveBeenCalledWith(proyectoData.tipoProyecto);
      expect(proyectosRepository.create).toHaveBeenCalledWith(proyectoData);
      expect(resultado).toEqual(proyectoCreado);
    });

    it('debería lanzar ForbiddenException si el clienteId no coincide', async () => {
      await expect(service.create(proyectoData, 'otroClienteId')).rejects.toThrow(ForbiddenException);
      expect(proyectosRepository.create).not.toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si el cliente no existe', async () => {
      clientesService.findById!.mockRejectedValue(new NotFoundException('Cliente no encontrado'));
      await expect(service.create(proyectoData, proyectoData.clienteId)).rejects.toThrow(NotFoundException);
      expect(clientesService.findById).toHaveBeenCalledWith(proyectoData.clienteId);
      expect(proyectosRepository.create).not.toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si el tipoProyecto no existe', async () => {
      clientesService.findById!.mockResolvedValue({ _id: proyectoData.clienteId });
      tipoProyectoService.findOne!.mockRejectedValue(new NotFoundException('TipoProyecto no encontrado'));
      await expect(service.create(proyectoData, proyectoData.clienteId)).rejects.toThrow(NotFoundException);
      expect(tipoProyectoService.findOne).toHaveBeenCalledWith(proyectoData.tipoProyecto);
      expect(proyectosRepository.create).not.toHaveBeenCalled();
    });

    it('debería lanzar un error al intentar registrar un proyecto duplicado', async () => {
      // Mock: Ya existe un proyecto con el mismo nombre para el cliente
      clientesService.findById!.mockResolvedValue({ _id: proyectoData.clienteId });
      tipoProyectoService.findOne!.mockResolvedValue({ _id: proyectoData.tipoProyecto });
      // Simula que existe un proyecto con ese nombre
      proyectosRepository.create!.mockImplementation(() => {
        throw new ConflictException('Error: ya existe un proyecto con ese nombre');
      });

      // Espera la excepción y que el mensaje sea el esperado
      await expect(service.create(proyectoData, proyectoData.clienteId)).rejects.toThrow(ConflictException);
      try {
        await service.create(proyectoData, proyectoData.clienteId);
      } catch (error) {
        expect(error.message).toBe('Error: ya existe un proyecto con ese nombre');
      }
    });
  });
});
