import { Injectable } from '@nestjs/common';
// import { ReclamosRepository } from './repository/reclamos.repository';

@Injectable()
export class ReclamosService {
	// constructor(private readonly reclamosRepository: ReclamosRepository) {}

	async getEstadisticasEmpleado(empleadoId: string, fechaInicio?: string, fechaFin?: string) {
		// Implementación real: filtrar reclamos por empleado asignado y fechas
		// Suponiendo que tienes acceso a un modelo Reclamo (mongoose)
		const filter: any = { asignadoActual: empleadoId };
		if (fechaInicio) filter.createdAt = { ...filter.createdAt, $gte: new Date(fechaInicio) };
		if (fechaFin) filter.createdAt = { ...filter.createdAt, $lte: new Date(fechaFin) };

		// @ts-ignore: Reclamo es el modelo mongoose
		const reclamos = await (global as any).Reclamo.find(filter);

		// Total de reclamos
		const total = reclamos.length;

		// Reclamos por estado
		const porEstado = reclamos.reduce((acc: any, r: any) => {
			const estado = r.estadoActual;
			const found = acc.find((e: any) => e._id === estado);
			if (found) found.cantidad++;
			else acc.push({ _id: estado, cantidad: 1 });
			return acc;
		}, []);

		// Reclamos por mes
		const porMesMap: Record<string, number> = {};
		reclamos.forEach((r: any) => {
			const date = new Date(r.createdAt);
			const key = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}`;
			porMesMap[key] = (porMesMap[key] || 0) + 1;
		});
		const porMes = Object.entries(porMesMap).map(([mes, cantidad]) => ({ _id: mes, cantidad }));

		return {
			total,
			porEstado,
			porMes,
		};
	}

	async getEstadisticasCliente(clienteId: string, fechaInicio?: string, fechaFin?: string) {
		// Implementación real: filtrar reclamos por cliente y fechas
		const filter: any = { clienteId };
		if (fechaInicio) filter.createdAt = { ...filter.createdAt, $gte: new Date(fechaInicio) };
		if (fechaFin) filter.createdAt = { ...filter.createdAt, $lte: new Date(fechaFin) };

		// @ts-ignore: Reclamo es el modelo mongoose
		const reclamos = await (global as any).Reclamo.find(filter);

		// Total de reclamos
		const total = reclamos.length;

		// Reclamos por estado
		const porEstado = reclamos.reduce((acc: any, r: any) => {
			const estado = r.estadoActual;
			const found = acc.find((e: any) => e._id === estado);
			if (found) found.cantidad++;
			else acc.push({ _id: estado, cantidad: 1 });
			return acc;
		}, []);

		// Reclamos por mes
		const porMesMap: Record<string, number> = {};
		reclamos.forEach((r: any) => {
			const date = new Date(r.createdAt);
			const key = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}`;
			porMesMap[key] = (porMesMap[key] || 0) + 1;
		});
		const porMes = Object.entries(porMesMap).map(([mes, cantidad]) => ({ _id: mes, cantidad }));

		return {
			total,
			porEstado,
			porMes,
		};
	}

	async getEstadisticasAdmin(fechaInicio?: string, fechaFin?: string) {
		// TODO: Implementar consulta real a la base de datos
		// Filtrar por rango de fechas
		return {
			total: 0,
			porEstado: [],
			porMes: [],
			porTipo: [],
			porArea: [],
		};
	}
}
