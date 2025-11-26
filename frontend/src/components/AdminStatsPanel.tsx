import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

interface EstadoData { _id: string; cantidad: number; }
interface TipoData { _id: string; cantidad: number; }
interface AreaData { _id: string; cantidad: number; }
interface MesData { _id: number; cantidad: number; }

interface Stats {
  total: number;
  porEstado: EstadoData[];
  porTipo: TipoData[];
  porArea: AreaData[];
  porMes: MesData[];
  tiempoPromedio: number;
}

interface Props {
  fechaInicio?: string;
  fechaFin?: string;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const AdminStatsPanel: React.FC<Props> = ({ fechaInicio, fechaFin }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchStats = async () => {
      setLoading(true);
      let url = `/backend/reclamos/estadisticas-admin`;
      const params = [];
      if (fechaInicio) params.push(`fechaInicio=${fechaInicio}`);
      if (fechaFin) params.push(`fechaFin=${fechaFin}`);
      if (params.length) url += `?${params.join('&')}`;
      const res = await fetch(url);
      const data = await res.json();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
    interval = setInterval(fetchStats, 10000); // Actualiza cada 10 segundos
    return () => clearInterval(interval);
  }, [fechaInicio, fechaFin]);

  if (loading || !stats) return <div>Cargando estadísticas...</div>;

  // Gráfico torta: reclamos por estado
  const pieEstadoData = {
    labels: stats.porEstado.map(e => e._id),
    datasets: [{
      data: stats.porEstado.map(e => e.cantidad),
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
    }],
  };

  // Gráfico torta: reclamos por tipo
  const pieTipoData = {
    labels: stats.porTipo.map(t => t._id),
    datasets: [{
      data: stats.porTipo.map(t => t.cantidad),
      backgroundColor: ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981', '#6b7280'],
    }],
  };

  // Gráfico barras: reclamos por área
  const barAreaData = {
    labels: stats.porArea.map(a => a._id),
    datasets: [{
      label: 'Reclamos por área',
      data: stats.porArea.map(a => a.cantidad),
      backgroundColor: 'rgba(139, 92, 246, 0.6)',
    }],
  };

  // Gráfico línea: reclamos por mes
  const lineMesData = {
    labels: stats.porMes.map(m => meses[m._id - 1]),
    datasets: [{
      label: 'Reclamos por mes',
      data: stats.porMes.map(m => m.cantidad),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: true,
      tension: 0.4,
    }],
  };

  return (
    <div>
      <h2>Dashboard Estadísticas Generales</h2>
      <p>Total de reclamos: <b>{stats.total}</b></p>
      <p>Tiempo promedio de resolución: <b>{stats.tiempoPromedio.toFixed(1)} días</b></p>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: 20 }}>
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
