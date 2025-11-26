import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ClientesRepository } from './repository/clientes.repository';
import { Cliente } from './Entidad/cliente.schema';
import { UsuariosService } from '../usuarios/usuarios.service';
import { EstadoSolicitudService } from '../estado-solicitud/estado-solicitud.service';

@Injectable()
export class ClientesService {
  constructor(
    private readonly clientesRepository: ClientesRepository,
    private readonly usuariosService: UsuariosService,
    private readonly estadoSolicitudService: EstadoSolicitudService,
  ) {}

  async create(data: Partial<Cliente>): Promise<Cliente> {
    return this.clientesRepository.create(data);
  }

  async findAll(): Promise<Cliente[]> {
    return this.clientesRepository.findAll();
  }

  async findById(id: string): Promise<Cliente> {
    const cliente = await this.clientesRepository.findById(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async findByUsuarioId(usuarioId: string): Promise<Cliente | null> {
    return this.clientesRepository.findByUsuarioId(usuarioId);
  }

  async findByEstadoSolicitud(estadoId: string): Promise<Cliente[]> {
    return this.clientesRepository.findByEstadoSolicitud(estadoId);
  }

  async findPendingSolicitudes(): Promise<Cliente[]> {
    return this.clientesRepository.findPendingSolicitudes();
  }

  async update(id: string, data: Partial<Cliente>): Promise<Cliente> {
    const cliente = await this.clientesRepository.update(id, data);
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async delete(id: string): Promise<Cliente> {
    const cliente = await this.clientesRepository.delete(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async aprobarSolicitud(clienteId: string): Promise<{ cliente: Cliente; message: string }> {
    const cliente = await this.findById(clienteId);
    
    // Verificar que la solicitud esté pendiente
    const estadoActual = cliente.estadoSolicitud as any;
    if (estadoActual.nombre !== 'PENDIENTE') {
      throw new BadRequestException('Solo se pueden aprobar solicitudes pendientes');
    }

    // Obtener estado APROBADO
    const estadoAprobado = await this.estadoSolicitudService.findByName('APROBADO');
    if (!estadoAprobado) {
      throw new BadRequestException('Estado APROBADO no encontrado en el sistema');
    }

    // Actualizar estado del cliente
    const clienteActualizado = await this.update(clienteId, {
      estadoSolicitud: estadoAprobado._id as any,
    });

    // Activar usuario asociado
    await this.usuariosService.activateUser(cliente.usuarioId.toString());

    return {
      cliente: clienteActualizado,
      message: 'Solicitud aprobada exitosamente',
    };
  }

  async rechazarSolicitud(clienteId: string): Promise<{ cliente: Cliente; message: string }> {
    const cliente = await this.findById(clienteId);
    
    // Verificar que la solicitud esté pendiente
    const estadoActual = cliente.estadoSolicitud as any;
    if (estadoActual.nombre !== 'PENDIENTE') {
      throw new BadRequestException('Solo se pueden rechazar solicitudes pendientes');
    }

    // Obtener estado RECHAZADO
    const estadoRechazado = await this.estadoSolicitudService.findByName('RECHAZADO');
    if (!estadoRechazado) {
      throw new BadRequestException('Estado RECHAZADO no encontrado en el sistema');
    }

    // Actualizar estado del cliente
    const clienteActualizado = await this.update(clienteId, {
      estadoSolicitud: estadoRechazado._id as any,
    });

    return {
      cliente: clienteActualizado,
      message: 'Solicitud rechazada',
    };
  }
}

