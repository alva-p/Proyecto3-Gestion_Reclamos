import React, { useEffect, useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { statusLabels, typeLabels } from '../utils/translations';

interface EstadoData { _id: string; cantidad: number; }
interface TipoData { _id: string; cantidad: number; }
interface AreaData { _id: string; cantidad: number; }
interface MesData { _id: number | string; cantidad: number; }

interface Stats {
  total: number;
  totalClientes?: number;
  abiertos?: number;
  avgResolutionTime?: number;
  tiempoPromedio?: number;
  porEstado: EstadoData[];
  porTipo: TipoData[];
  porArea: AreaData[];
  porMes: MesData[];
}

type Scope = 'admin' | 'empleado' | 'cliente';

interface Props {
  scope: Scope;
  fechaInicio?: string;
  fechaFin?: string;
  // opcionalmente podés inyectar el id desde el padre
  empleadoId?: string;
  clienteId?: string;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const AdminStatsPanel: React.FC<Props> = ({
  scope,
  fechaInicio,
  fechaFin,
  empleadoId,
  clienteId,
}) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: number;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        let path = '';
        if (scope === 'admin') path = 'estadisticas-admin';
        if (scope === 'empleado') path = 'estadisticas-empleado';
        if (scope === 'cliente') path = 'estadisticas-cliente';

        let url = `/backend/reclamos/${path}`;
        const params: string[] = [];

        if (fechaInicio) params.push(`fechaInicio=${fechaInicio}`);
        if (fechaFin) params.push(`fechaFin=${fechaFin}`);

        // Resolver empleadoId / clienteId
        if (scope === 'empleado') {
          let resolvedEmpleadoId = empleadoId;

          // Fallback: leer del localStorage (usuario logueado)
          if (!resolvedEmpleadoId) {
            const rawUser = localStorage.getItem('usuario');
            if (rawUser) {
              try {
                const u = JSON.parse(rawUser);
                resolvedEmpleadoId = u.empleadoId;
              } catch {
                // ignore
              }
            }
          }

          if (!resolvedEmpleadoId) {
            setError('No se encontró empleadoId para estadísticas de empleado.');
            setStats(null);
            setLoading(false);
            return;
          }

          params.push(`empleadoId=${resolvedEmpleadoId}`);
        }

        if (scope === 'cliente') {
          let resolvedClienteId = clienteId;

          // Fallback: leer del localStorage (usuario logueado)
          if (!resolvedClienteId) {
            const rawUser = localStorage.getItem('usuario');
            if (rawUser) {
              try {
                const u = JSON.parse(rawUser);
                resolvedClienteId = u.clienteId;
              } catch {
                // ignore
              }
            }
          }

          if (!resolvedClienteId) {
            setError('No se encontró clienteId para estadísticas de cliente.');
            setStats(null);
            setLoading(false);
            return;
          }

          params.push(`clienteId=${resolvedClienteId}`);
        }

        if (params.length) {
          url += `?${params.join('&')}`;
        }

        const res = await fetch(url);
        const raw = await res.text();

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${raw}`);
        }

        const data: Stats = JSON.parse(raw);
        setStats(data);
      } catch (err) {
        console.error('Error cargando estadísticas:', err);
        setError('No se pudieron cargar las estadísticas.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // auto-refresh 10s (si no te gusta, comentá esto)
    interval = window.setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [scope, fechaInicio, fechaFin, empleadoId, clienteId]);

  if (loading && !stats) return <div>Cargando estadísticas...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return <div>No hay estadísticas disponibles.</div>;

  const avgResolution =
    (stats.avgResolutionTime ?? stats.tiempoPromedio ?? 0) as number;

  // =======================
  // DATA PARA CHART.JS
  // =======================

  const pieEstadoData = {
    labels: stats.porEstado.map(e => statusLabels[e._id] || e._id),
    datasets: [
      {
        data: stats.porEstado.map(e => e.cantidad),
        backgroundColor: [
          '#3b82f6',
          '#f59e0b',
          '#8b5cf6',
          '#ef4444',
          '#10b981',
          '#6b7280',
        ],
      },
    ],
  };

  const pieTipoData = {
    labels: stats.porTipo.map(t => typeLabels[t._id] || t._id),
    datasets: [
      {
        data: stats.porTipo.map(t => t.cantidad),
        backgroundColor: [
          '#36A2EB',
          '#FF6384',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const barAreaData = {
    labels: stats.porArea.map(a => a._id),
    datasets: [
      {
        label: 'Reclamos por área',
        data: stats.porArea.map(a => a.cantidad),
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
      },
    ],
  };

  const lineMesData = {
    labels: stats.porMes.map(m => {
      if (typeof m._id === 'number') {
        return meses[m._id - 1] ?? `Mes ${m._id}`;
      }
      return m._id;
    }),
    datasets: [
      {
        label: 'Reclamos por mes',
        data: stats.porMes.map(m => m.cantidad),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const titulo =
    scope === 'admin'
      ? 'Dashboard Estadísticas Generales (Admin)'
      : scope === 'empleado'
      ? 'Estadísticas de Reclamos del Empleado'
      : 'Estadísticas de Reclamos del Cliente';

  return (
    <div>
      <h2>{titulo}</h2>

      <div style={{ marginTop: 8, marginBottom: 16 }}>
        <p>Total de reclamos: <b>{stats.total}</b></p>
        {scope === 'admin' && (
          <>
            <p>Clientes activos: <b>{stats.totalClientes ?? 0}</b></p>
            <p>Reclamos abiertos: <b>{stats.abiertos ?? 0}</b></p>
          </>
        )}
        <p>Tiempo promedio de resolución: <b>{avgResolution.toFixed(1)} días</b></p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: 20,
        }}
      >
        <div style={{ width: 350 }}>
          <Pie data={pieEstadoData} />
          <div style={{ textAlign: 'center', marginTop: 8 }}>Por Estado</div>
        </div>

        <div style={{ width: 350 }}>
          <Pie data={pieTipoData} />
          <div style={{ textAlign: 'center', marginTop: 8 }}>Por Tipo</div>
        </div>

        <div style={{ width: 400 }}>
          <Bar data={barAreaData} />
          <div style={{ textAlign: 'center', marginTop: 8 }}>Por Área</div>
        </div>

        <div style={{ width: 400 }}>
          <Line data={lineMesData} />
          <div style={{ textAlign: 'center', marginTop: 8 }}>Por Mes</div>
        </div>
      </div>
    </div>
  );
};
