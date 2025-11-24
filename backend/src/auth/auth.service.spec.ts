import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { EmpleadosService } from '../empleados/empleados.service';
import { ClientesService } from '../clientes/clientes.service';
import { RolesService } from '../roles/roles.service';
import { EstadoSolicitudService } from '../estado-solicitud/estado-solicitud.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usuariosService: jest.Mocked<UsuariosService>;
  let empleadosService: jest.Mocked<EmpleadosService>;
  let clientesService: jest.Mocked<ClientesService>;
  let rolesService: jest.Mocked<RolesService>;
  let estadoSolicitudService: jest.Mocked<EstadoSolicitudService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUsuario = {
    _id: 'userId123',
    nombre: 'Test User',
    correo: 'test@test.com',
    contraseña: 'hashedPassword',
    activo: true,
    rol: {
      _id: 'roleId',
      nombre: 'EMPLEADO',
    },
    populate: jest.fn().mockResolvedValue(this),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuariosService,
          useValue: {
            findByEmailWithPassword: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: EmpleadosService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ClientesService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            findByName: jest.fn(),
          },
        },
        {
          provide: EstadoSolicitudService,
          useValue: {
            findByName: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usuariosService = module.get(UsuariosService);
    empleadosService = module.get(EmpleadosService);
    clientesService = module.get(ClientesService);
    rolesService = module.get(RolesService);
    estadoSolicitudService = module.get(EstadoSolicitudService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto = {
      correo: 'test@test.com',
      contraseña: 'password123',
    };

    it('should return access token on successful login', async () => {
      const usuario = { ...mockUsuario };
      usuariosService.findByEmailWithPassword.mockResolvedValue(usuario as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('mockAccessToken');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken', 'mockAccessToken');
      expect(result.usuario).toHaveProperty('correo', loginDto.correo);
      expect(usuariosService.findByEmailWithPassword).toHaveBeenCalledWith(loginDto.correo);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usuariosService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      usuariosService.findByEmailWithPassword.mockResolvedValue(mockUsuario as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      const inactiveUser = { ...mockUsuario, activo: false };
      usuariosService.findByEmailWithPassword.mockResolvedValue(inactiveUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('registerEmpleado', () => {
    const registerDto = {
      nombre: 'New Employee',
      correo: 'employee@test.com',
      contraseña: 'password123',
      puesto: 'Developer',
      subareaId: 'subareaId',
    };

    it('should register a new employee successfully', async () => {
      usuariosService.findByEmail.mockResolvedValue(null);
      rolesService.findByName.mockResolvedValue({ _id: 'roleId', nombre: 'EMPLEADO' } as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      usuariosService.create.mockResolvedValue({ _id: 'userId', ...registerDto } as any);
      empleadosService.create.mockResolvedValue({ _id: 'empleadoId', puesto: registerDto.puesto } as any);

      const result = await service.registerEmpleado(registerDto);

      expect(result).toHaveProperty('message');
      expect(result.usuario).toHaveProperty('correo', registerDto.correo);
      expect(empleadosService.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      usuariosService.findByEmail.mockResolvedValue(mockUsuario as any);

      await expect(service.registerEmpleado(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('registerCliente', () => {
    const registerDto = {
      nombre: 'New Client',
      correo: 'client@test.com',
      contraseña: 'password123',
      empresa: 'Test Company',
      telefono: '123456789',
      direccion: 'Test Address',
    };

    it('should register a new client with pending status', async () => {
      usuariosService.findByEmail.mockResolvedValue(null);
      rolesService.findByName.mockResolvedValue({ _id: 'roleId', nombre: 'CLIENTE' } as any);
      estadoSolicitudService.findByName.mockResolvedValue({ _id: 'estadoId', nombre: 'PENDIENTE' } as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      usuariosService.create.mockResolvedValue({ _id: 'userId', ...registerDto, activo: false } as any);
      clientesService.create.mockResolvedValue({ _id: 'clienteId', empresa: registerDto.empresa } as any);

      const result = await service.registerCliente(registerDto);

      expect(result).toHaveProperty('message');
      expect(result.cliente).toHaveProperty('empresa', registerDto.empresa);
      expect(result.cliente).toHaveProperty('estadoSolicitud', 'PENDIENTE');
    });

    it('should throw ConflictException if email already exists', async () => {
      usuariosService.findByEmail.mockResolvedValue(mockUsuario as any);

      await expect(service.registerCliente(registerDto)).rejects.toThrow(ConflictException);
    });
  });
});
