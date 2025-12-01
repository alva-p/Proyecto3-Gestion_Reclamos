// test/proyectos.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AppModule } from '../src/app.module';
import { ProyectosService } from '../src/proyectos/proyectos.service';
import { Proyecto } from '../src/proyectos/Entidad/proyectos.schema';
import { TipoProyecto } from '../src/tipo-proyecto/Entidad/tipo-proyecto.schema';
import { Cliente } from '../src/clientes/Entidad/cliente.schema';
import { Reclamo } from '../src/reclamos/Entidad/reclamo.schema';

describe('Proyectos – Integración', () => {
  let app: INestApplication;
  let service: ProyectosService;

  let proyectoModel: Model<Proyecto>;
  let clienteModel: Model<Cliente>;
  let tipoProyectoModel: Model<TipoProyecto>;
  let reclamoModel: Model<Reclamo>;

  let clienteCarlos: any;
  const tipoProyectoId = '6567b8e2f1a2c8a1b2c3d4e5';

  const proyectoData = {
    nombre: 'Sistema ventas',
    tipoProyecto: tipoProyectoId,
    descripcion: 'Desarrollo de plataforma de ventas online',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    service = moduleFixture.get<ProyectosService>(ProyectosService);
    proyectoModel = moduleFixture.get<Model<Proyecto>>(
      getModelToken(Proyecto.name),
    );
    clienteModel = moduleFixture.get<Model<Cliente>>(
      getModelToken(Cliente.name),
    );
    tipoProyectoModel = moduleFixture.get<Model<TipoProyecto>>(
      getModelToken(TipoProyecto.name),
    );
    reclamoModel = moduleFixture.get<Model<Reclamo>>(
      getModelToken(Reclamo.name),
    );

    // Limpiar colecciones antes de empezar
    await proyectoModel.deleteMany({});
    await clienteModel.deleteMany({});
    await tipoProyectoModel.deleteMany({});
    await reclamoModel.deleteMany({});

    // Tipo de proyecto base
    await tipoProyectoModel.create({
      _id: tipoProyectoId,
      nombre: 'software',
      descripcion: 'Tipo para pruebas',
    });

    // Cliente base
    clienteCarlos = await clienteModel.create({
      empresa: 'carlos Cliente',
      telefono: '123456789',
      direccion: 'Calle Ficticia 123',
      usuarioId: '6567b8e2f1a2c8a1b2c3d4e9',
    });
  }, 30000);

  afterAll(async () => {
    await app.close();
  });
  describe('CP01 / CP02 – Registrar Proyecto y duplicado', () => {
    beforeEach(async () => {
      await proyectoModel.deleteMany({});
      await reclamoModel.deleteMany({});
    });

    it('debería registrar un proyecto para un cliente (camino exitoso)', async () => {
      // 1. Verificar que no exista previamente
      const proyectoExistente = await proyectoModel.findOne({
        nombre: proyectoData.nombre,
      });
      expect(proyectoExistente).toBeNull();

      // 2. Crear proyecto como ADMIN (no pasamos clienteIdFromToken)
      const data = {
        ...proyectoData,
        clienteId: clienteCarlos._id.toString(),
      };
      const creado = await service.create(data);

      // 3. Validaciones
      expect(creado).toBeDefined();
      expect(creado.nombre).toBe(proyectoData.nombre);
      expect(creado.descripcion).toBe(proyectoData.descripcion);
      expect(creado.tipoProyecto.toString()).toBe(tipoProyectoId);
      expect(creado.clienteId.toString()).toBe(clienteCarlos._id.toString());

      // 4. Validar en BD
      const enBd = await proyectoModel.findOne({
        nombre: proyectoData.nombre,
      });
      expect(enBd).toBeDefined();
      expect(enBd!.nombre).toBe(proyectoData.nombre);
    });

    it('debería lanzar error al intentar registrar un proyecto duplicado', async () => {
      // 1. Crear proyecto inicial
      const data = {
        ...proyectoData,
        clienteId: clienteCarlos._id.toString(),
      };

      const creado = await service.create(data);
      expect(creado).toBeDefined();

      // 2. Intentar crear duplicado (mismo nombre + mismo clienteId)
      await expect(service.create(data)).rejects.toThrow(ConflictException);

      // 3. Validar que solo hay un proyecto con ese nombre
      const proyectos = await proyectoModel.find({
        nombre: proyectoData.nombre,
      });
      expect(proyectos.length).toBe(1);
    });
  });

  // =========================================================
  // CP07: Eliminar proyecto con reclamo asociado
  // =========================================================
  describe('CP07 – Eliminar proyecto con reclamo asociado', () => {
    beforeEach(async () => {
      await proyectoModel.deleteMany({});
      await reclamoModel.deleteMany({});
    });

    it('debería impedir eliminar un proyecto con reclamos asociados', async () => {
      // 1. Crear proyecto
      const proyecto = await proyectoModel.create({
        nombre: 'Sistema ventas',
        tipoProyecto: tipoProyectoId,
        descripcion: 'Desarrollo de plataforma de ventas online',
        clienteId: clienteCarlos._id.toString(),
      });
      const proyectoId = (proyecto as any)._id.toString();

      // 2. Crear reclamo asociado
      await reclamoModel.create({
        titulo: 'Reclamo test',
        descripcion: 'Reclamo asociado al proyecto',
        proyectoId: proyectoId,
        clienteId: clienteCarlos._id.toString(),
      });

      // 3. Intentar eliminar → debe lanzar BadRequestException
      await expect(service.remove(proyectoId)).rejects.toThrow(
        BadRequestException,
      );

      // 4. Verificar que el proyecto sigue existiendo
      const proyectoEnBd = await proyectoModel.findById(proyectoId);
      expect(proyectoEnBd).toBeDefined();
      expect(proyectoEnBd!.nombre).toBe('Sistema ventas');

      // 5. Verificar que el reclamo sigue existiendo
      const reclamoEnBd = await reclamoModel.findOne({ proyectoId });
      expect(reclamoEnBd).toBeDefined();
      expect(reclamoEnBd!.proyectoId).toBe(proyectoId);

      // 6. (Opcional) Verificar mensaje de error
      try {
        await service.remove(proyectoId);
      } catch (err: any) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toContain('reclamo'); // menos frágil que regex con (s)
      }
    });
  });
});
