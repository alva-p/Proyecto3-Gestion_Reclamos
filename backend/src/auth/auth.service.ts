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
    private usuariosService: UsuariosService,
    private empleadosService: EmpleadosService,
    private clientesService: ClientesService,
    private rolesService: RolesService,
    private estadoSolicitudService: EstadoSolicitudService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { correo, contraseña } = loginDto;

    // Buscar usuario por correo (incluyendo la contraseña)
    const usuario = await this.usuariosService.findByEmailWithPassword(correo);

    if (!usuario) {
      throw new UnauthorizedException('El correo no existe en el sistema');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo. Contacte al administrador.');
    }

    // Poblar el rol para obtener el nombre
    await usuario.populate('rol');
    const rolNombre =
      typeof usuario.rol === 'object' && usuario.rol !== null
        ? (usuario.rol as any).nombre
        : (usuario.rol as any)?.toString?.();

    // Buscar empleado o cliente asociado al usuario
    let empleadoId: string | undefined;
    let clienteId: string | undefined;

    if (rolNombre === 'EMPLEADO') {
      const empleado = await this.empleadosService.findByUsuarioId((usuario._id as any).toString());
      if (empleado) {
        empleadoId = (empleado._id as any).toString();
      }
    } else if (rolNombre === 'CLIENTE') {
      const cliente = await this.clientesService.findByUsuarioId((usuario._id as any).toString());
      if (cliente) {
        clienteId = (cliente._id as any).toString();
      }
    }

    // Generar token JWT
    const payload = {
      sub: (usuario._id as any).toString(),
      correo: usuario.correo,
      rol: rolNombre,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: rolNombre,
        empleadoId,
        clienteId,
      },
    };
  }

  async registerEmpleado(registerDto: RegisterEmpleadoDto) {
    const { nombre, correo, contraseña, puesto, subareaId } = registerDto;

    // Verificar que el correo no esté registrado
    const existingUser = await this.usuariosService.findByEmail(correo);
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Obtener el rol de EMPLEADO
    const empleadoRol = await this.rolesService.findByName('EMPLEADO');
    if (!empleadoRol) {
      throw new BadRequestException('Rol EMPLEADO no encontrado en el sistema');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear usuario
    const usuario = await this.usuariosService.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol: (empleadoRol._id as any).toString(),
      activo: true,
    });

    // Crear empleado
    const empleado = await this.empleadosService.create({
      usuarioId: (usuario._id as any).toString(),
      puesto,
      subarea: subareaId as any,
    });

    return {
      message: 'Empleado registrado exitosamente',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: 'EMPLEADO',
      },
      empleado: {
        id: empleado._id,
        puesto: empleado.puesto,
      },
    };
  }

  async registerCliente(registerDto: RegisterClienteDto) {
    const { nombre, correo, contraseña, empresa, telefono, direccion } = registerDto;

    // Verificar que el correo no esté registrado
    const existingUser = await this.usuariosService.findByEmail(correo);
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Obtener el rol de CLIENTE
    const clienteRol = await this.rolesService.findByName('CLIENTE');
    if (!clienteRol) {
      throw new BadRequestException('Rol CLIENTE no encontrado en el sistema');
    }

    // Obtener el estado PENDIENTE
    const estadoPendiente = await this.estadoSolicitudService.findByName('PENDIENTE');
    if (!estadoPendiente) {
      throw new BadRequestException('Estado PENDIENTE no encontrado en el sistema');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear usuario (inactivo hasta que sea aprobado)
    const usuario = await this.usuariosService.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol: (clienteRol._id as any).toString(),
      activo: false, // Inactivo hasta aprobación
    });

    // Crear cliente
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
        id: cliente._id,
        empresa: cliente.empresa,
        estadoSolicitud: 'PENDIENTE',
      },
    };
  }

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
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: 'ADMIN',
      },
    };
  }

  async validateUser(userId: string) {
    return this.usuariosService.findById(userId);
  }
}
