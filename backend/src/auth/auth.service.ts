import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { EmpleadosService } from '../empleados/empleados.service';
import { ClientesService } from '../clientes/clientes.service';
import { RolesService } from '../roles/roles.service';
import { EstadoSolicitudService } from '../estado-solicitud/estado-solicitud.service';
import { LoginDto } from './dto/login.dto';
import { RegisterEmpleadoDto } from './dto/register-empleado.dto';
import { RegisterClienteDto } from './dto/register-cliente.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly empleadosService: EmpleadosService,
    private readonly clientesService: ClientesService,
    private readonly rolesService: RolesService,
    private readonly estadoSolicitudService: EstadoSolicitudService,
    private readonly jwtService: JwtService,
  ) {}

  // ================== LOGIN ==================
  async login(loginDto: LoginDto) {
    const { correo, contraseña } = loginDto;

    // 1) Buscar usuario por correo (incluyendo contraseña)
    const usuario = await this.usuariosService.findByEmailWithPassword(correo);

    if (!usuario) {
      throw new UnauthorizedException('El correo no existe en el sistema');
    }

    // 2) Verificar contraseña
    const isPasswordValid = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // 3) Verificar si el usuario está activo
    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo. Contacte al administrador.');
    }

    // 4) Poblar rol para obtener el nombre
    await usuario.populate('rol');
    const rolNombre =
      typeof usuario.rol === 'object' && usuario.rol !== null
        ? (usuario.rol as any).nombre
        : (usuario.rol as any)?.toString?.();

    // 5) Buscar empleado o cliente asociado al usuario
    let empleadoId: string | undefined;
    let clienteId: string | undefined;

    const usuarioIdStr = (usuario._id as any).toString();

    if (rolNombre === 'EMPLEADO') {
      const empleado = await this.empleadosService.findByUsuarioId(usuarioIdStr);
      if (empleado) {
        empleadoId = (empleado._id as any).toString();
      }
    }

    if (rolNombre === 'CLIENTE') {
      const cliente = await this.clientesService.findByUsuarioId(usuarioIdStr);
      if (cliente) {
        clienteId = (cliente._id as any).toString();
      }
    }

    // 6) Generar token JWT
    const payload = {
      sub: usuarioIdStr,
      correo: usuario.correo,
      rol: rolNombre,
    };

    const accessToken = this.jwtService.sign(payload);

    // 7) Respuesta al front
    return {
      accessToken,
      usuario: {
        id: usuarioIdStr,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: rolNombre,
        empleadoId, // solo viene si es EMPLEADO
        clienteId,  // solo viene si es CLIENTE
      },
    };
  }

  // ================== REGISTER EMPLEADO ==================
  async registerEmpleado(registerDto: RegisterEmpleadoDto) {
    const { nombre, correo, contraseña, puesto, subareaId } = registerDto;

    const existingUser = await this.usuariosService.findByEmail(correo);
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const empleadoRol = await this.rolesService.findByName('EMPLEADO');
    if (!empleadoRol) {
      throw new BadRequestException('Rol EMPLEADO no encontrado en el sistema');
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const usuario = await this.usuariosService.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol: (empleadoRol._id as any).toString(),
      activo: true,
    });

    const empleado = await this.empleadosService.create({
      usuarioId: (usuario._id as any).toString(),
      puesto,
      subarea: subareaId as any,
    });

    return {
      message: 'Empleado registrado exitosamente',
      usuario: {
        id: (usuario._id as any).toString(),
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: 'EMPLEADO',
      },
      empleado: {
        id: (empleado._id as any).toString(),
        puesto: empleado.puesto,
      },
    };
  }

  // ================== REGISTER CLIENTE ==================
  async registerCliente(registerDto: RegisterClienteDto) {
    const { nombre, correo, contraseña, empresa, telefono, direccion } = registerDto;

    const existingUser = await this.usuariosService.findByEmail(correo);
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const clienteRol = await this.rolesService.findByName('CLIENTE');
    if (!clienteRol) {
      throw new BadRequestException('Rol CLIENTE no encontrado en el sistema');
    }

    const estadoPendiente = await this.estadoSolicitudService.findByName('PENDIENTE');
    if (!estadoPendiente) {
      throw new BadRequestException('Estado PENDIENTE no encontrado en el sistema');
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const usuario = await this.usuariosService.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol: (clienteRol._id as any).toString(),
      activo: false, // inactivo hasta aprobación
    });

    const cliente = await this.clientesService.create({
      usuarioId: (usuario._id as any).toString(),
      empresa,
      telefono,
      direccion,
      estadoSolicitud: (estadoPendiente._id as any).toString(),
    });

    return {
      message: 'Solicitud de registro enviada. Espere la aprobación del administrador.',
      cliente: {
        id: (cliente._id as any).toString(),
        empresa: cliente.empresa,
        estadoSolicitud: 'PENDIENTE',
      },
    };
  }

  // ================== REGISTER ADMIN ==================
  async registerAdmin(registerDto: { nombre: string; correo: string; contraseña: string }) {
    const { nombre, correo, contraseña } = registerDto;

    const existingUser = await this.usuariosService.findByEmail(correo);
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const adminRol = await this.rolesService.findByName('ADMIN');
    if (!adminRol) {
      throw new BadRequestException('Rol ADMIN no encontrado en el sistema');
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const usuario = await this.usuariosService.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol: (adminRol._id as any).toString(),
      activo: true,
    });

    return {
      message: 'Administrador registrado exitosamente',
      usuario: {
        id: (usuario._id as any).toString(),
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: 'ADMIN',
      },
    };
  }

  // ================== VALIDATE USER (para guards, etc.) ==================
  async validateUser(userId: string) {
    return this.usuariosService.findById(userId);
  }
}
