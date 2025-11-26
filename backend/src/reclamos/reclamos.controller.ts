import { Controller, Get, Query } from '@nestjs/common';
import { ReclamosService } from './reclamos.service';

@Controller('reclamos')
export class ReclamosController {
	constructor(private readonly reclamosService: ReclamosService) {}

	// Estadísticas para empleado
	@Get('estadisticas-empleado')
	async getEstadisticasEmpleado(
		@Query('empleadoId') empleadoId: string,
		@Query('fechaInicio') fechaInicio?: string,
		@Query('fechaFin') fechaFin?: string
	) {
		return this.reclamosService.getEstadisticasEmpleado(empleadoId, fechaInicio, fechaFin);
	}

	// Estadísticas para cliente
	@Get('estadisticas-cliente')
	async getEstadisticasCliente(
		@Query('clienteId') clienteId: string,
		@Query('fechaInicio') fechaInicio?: string,
		@Query('fechaFin') fechaFin?: string
	) {
		return this.reclamosService.getEstadisticasCliente(clienteId, fechaInicio, fechaFin);
	}

	// Estadísticas para administrador
	@Get('estadisticas-admin')
	async getEstadisticasAdmin(
		@Query('fechaInicio') fechaInicio?: string,
		@Query('fechaFin') fechaFin?: string
	) {
		return this.reclamosService.getEstadisticasAdmin(fechaInicio, fechaFin);
	}
}
