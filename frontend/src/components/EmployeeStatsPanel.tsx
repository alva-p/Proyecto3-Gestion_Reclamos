import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

interface EstadoData {
  _id: string;
  cantidad: number;
}

interface MesData {
  _id: string;
  cantidad: number;
}

interface Stats {
  total: number;
  porEstado: EstadoData[];
  porMes: MesData[];
}

interface Props {
  empleadoId: string;
}

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const EmployeeStatsPanel: React.FC<Props> = ({ empleadoId }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchStats = async () => {
      setLoading(true);
      let url = `/backend/reclamos/estadisticas-empleado?empleadoId=${empleadoId}`;
      if (fechaInicio) url += `&fechaInicio=${fechaInicio}`;
      if (fechaFin) url += `&fechaFin=${fechaFin}`;
      const res = await fetch(url);
      const data = await res.json();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
    interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [empleadoId, fechaInicio, fechaFin]);

  if (loading || !stats) return <div>Cargando estadísticas...</div>;

  // Bar Chart para reclamos por mes
  const barData = {
    labels: stats.porMes.map(m => {
      const [year, month] = m._id.split('-');
      return `${meses[parseInt(month, 10) - 1]} ${year}`;
    }),
    datasets: [{
      label: 'Reclamos por mes',
      data: stats.porMes.map(m => m.cantidad),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }],
  };

  // Pie Chart para reclamos por estado
  const pieData = {
    labels: stats.porEstado.map(e => e._id),
    datasets: [{
      data: stats.porEstado.map(e => e.cantidad),
      backgroundColor: [
        '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ],
    }],
  };

  return (
    <div>
      <h2>Panel de Estadísticas</h2>
      <p>Total de reclamos: <b>{stats.total}</b></p>
      <div style={{ marginBottom: 16, display: 'flex', gap: '1rem' }}>
        <label>
          Desde:
          <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
        </label>
        <label>
          Hasta:
          <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
        </label>
      </div>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ width: 400 }}>
          <Bar data={barData} />
        </div>
        <div style={{ width: 400 }}>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};
