import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterEmpleadoDto } from './dto/register-empleado.dto';
import { RegisterClienteDto } from './dto/register-cliente.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            registerEmpleado: jest.fn(),
            registerCliente: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const loginDto: LoginDto = {
        correo: 'test@test.com',
        contraseña: 'password123',
      };

      const mockResponse = {
        accessToken: 'mockToken',
        usuario: { id: '123', correo: 'test@test.com', nombre: 'Test', rol: 'EMPLEADO' },
      };

      service.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('registerEmpleado', () => {
    it('should call authService.registerEmpleado with correct parameters', async () => {
      const registerDto: RegisterEmpleadoDto = {
        nombre: 'Employee Test',
        correo: 'employee@test.com',
        contraseña: 'password123',
        puesto: 'Developer',
      };

      const mockResponse = {
        message: 'Empleado registrado exitosamente',
        usuario: { id: '123', correo: registerDto.correo, nombre: registerDto.nombre, rol: 'EMPLEADO' },
        empleado: { id: 'emp123', puesto: registerDto.puesto },
      };

      service.registerEmpleado.mockResolvedValue(mockResponse);

      const result = await controller.registerEmpleado(registerDto);

      expect(service.registerEmpleado).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('registerCliente', () => {
    it('should call authService.registerCliente with correct parameters', async () => {
      const registerDto: RegisterClienteDto = {
        nombre: 'Client Test',
        correo: 'client@test.com',
        contraseña: 'password123',
        empresa: 'Test Company',
        telefono: '123456789',
        direccion: 'Test Address',
      };

      const mockResponse = {
        message: 'Solicitud de registro enviada',
        cliente: { id: 'cli123', empresa: registerDto.empresa, estadoSolicitud: 'PENDIENTE' },
      };

      service.registerCliente.mockResolvedValue(mockResponse);

      const result = await controller.registerCliente(registerDto);

      expect(service.registerCliente).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockResponse);
    });
  });
});
