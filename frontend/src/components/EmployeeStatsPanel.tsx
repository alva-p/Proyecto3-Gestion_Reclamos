// EmployeeStatsPanel.tsx
import React, { useEffect, useState } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';

// IMPORTANTE: Chart.js requiere registrar manualmente los elementos
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

import { statusLabels } from '../utils/translations';

interface EstadoData { _id: string; cantidad: number; }
interface MesData { _id: string | number; cantidad: number; }

interface Stats {
  total: number;
  porEstado: EstadoData[];
  porMes: MesData[];
}

interface Props {
  scope?: 'empleado';
  fechaInicio?: string;
  fechaFin?: string;
  empleadoId: string | null;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const EmployeeStatsPanel: React.FC<Props> = ({
  scope,
  fechaInicio,
  fechaFin,
  empleadoId,
}) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!empleadoId) {
          setStats(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        let url = `/backend/reclamos/estadisticas-empleado?empleadoId=${empleadoId}`;
        if (fechaInicio) url += `&fechaInicio=${fechaInicio}`;
        if (fechaFin) url += `&fechaFin=${fechaFin}`;

        const res = await fetch(url);
        const raw = await res.text();

        if (!res.ok) {
          throw new Error(raw);
        }

        const data = JSON.parse(raw);
        setStats({
          total: data.total ?? 0,
          porEstado: data.porEstado ?? [],
          porMes: data.porMes ?? [],
        });
      } catch (err) {
        console.error('Error cargando estadísticas del empleado (panel):', err);
        setError('No se pudieron cargar las estadísticas detalladas.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [empleadoId, fechaInicio, fechaFin]);

  if (!empleadoId) {
    return <div>No se encontró empleado asociado para mostrar estadísticas.</div>;
  }

  if (loading && !stats) return <div>Cargando estadísticas...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return <div>No hay estadísticas disponibles.</div>;

  const pieEstadoData = {
    labels: stats.porEstado.map(e => statusLabels[e._id] || e._id),
    datasets: [{
      data: stats.porEstado.map(e => e.cantidad),
      backgroundColor: [
        '#3b82f6', '#f59e0b', '#8b5cf6',
        '#ef4444', '#10b981', '#6b7280',
      ],
    }],
  };

  const lineMesData = {
    labels: stats.porMes.map(m => {
      if (typeof m._id === 'number') {
        return meses[m._id - 1] ?? `Mes ${m._id}`;
      }
      // Si viene "YYYY-MM", se muestra tal cual o podrías formatearlo
      return m._id;
    }),
    datasets: [{
      label: 'Reclamos por mes',
      data: stats.porMes.map(m => m.cantidad),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.3)',
      fill: true,
      tension: 0.4,
    }],
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Estadísticas Completas</h3>

      <p>Total de reclamos: <b>{stats.total}</b></p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ width: 340 }}>
          <Pie data={pieEstadoData} />
          <div style={{ textAlign: 'center', marginTop: 8 }}>Por Estado</div>
        </div>

        <div style={{ width: 420 }}>
          <Line data={lineMesData} />
          <div style={{ textAlign: 'center', marginTop: 8 }}>Por Mes</div>
        </div>
      </div>
    </div>
  );
};
