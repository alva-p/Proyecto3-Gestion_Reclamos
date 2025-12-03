import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Pie, Bar, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { FileText, Users, TrendingUp, Clock } from 'lucide-react';
import { statusLabels, typeLabels } from '../utils/translations';

export const AdminDashboard: React.FC = () => {
  const [fechaInicio, setFechaInicio] = React.useState('');
  const [fechaFin, setFechaFin] = React.useState('');
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: string[] = [];
        if (fechaInicio) params.push(`fechaInicio=${fechaInicio}`);
        if (fechaFin) params.push(`fechaFin=${fechaFin}`);
        const query = params.length ? `?${params.join('&')}` : '';

        const url = `/backend/reclamos/estadisticas-admin${query}`;
        console.log('Llamando a estadísticas admin:', url);

        const token = localStorage.getItem('access_token');

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const raw = await res.text();
        console.log('Respuesta cruda estadísticas admin:', raw);

        if (res.status === 401) {
          setError('No autorizado. Iniciá sesión nuevamente como administrador.');
          setStats(null);
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${raw}`);
        }

        const data = JSON.parse(raw);
        console.log('Datos parseados estadísticas admin:', data);
        setStats(data);
      } catch (err) {
        console.error('Error al cargar estadísticas admin:', err);
        setError('No se pudieron cargar las estadísticas de administrador.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [fechaInicio, fechaFin]);

  const COLORS = [
    '#3b82f6',
    '#f59e0b',
    '#8b5cf6',
    '#ef4444',
    '#10b981',
    '#6b7280',
    '#ec4899',
  ];

  if (loading && !stats) return <div>Cargando estadísticas...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return <div>No hay estadísticas disponibles.</div>;

  const claimsByStatus =
    stats.porEstado?.map((e: any) => ({
      name: statusLabels[e._id] || e._id,
      value: e.cantidad,
    })) || [];

  const claimsByType =
    stats.porTipo?.map((t: any) => ({
      name: typeLabels[t._id] || t._id,
      value: t.cantidad,
    })) || [];

  const claimsByArea =
    stats.porArea?.map((a: any) => ({
      area: a._id,
      reclamos: a.cantidad,
    })) || [];

  const claimsByMonth =
    stats.porMes?.map((m: any) => ({
      month: m._id, // puede ser 1–12 o "2025-02"
      reclamos: m.cantidad,
    })) || [];

  const avgResolution =
    (stats.avgResolutionTime ?? stats.tiempoPromedio ?? 0) as number;

  // =======================
  // DATA PARA CHART.JS
  // =======================

  const pieStatusData = {
    labels: claimsByStatus.map((c: any) => c.name),
    datasets: [
      {
        data: claimsByStatus.map((c: any) => c.value),
        backgroundColor: COLORS,
      },
    ],
  };

  const pieTypeData = {
    labels: claimsByType.map((t: any) => t.name),
    datasets: [
      {
        data: claimsByType.map((t: any) => t.value),
        backgroundColor: COLORS,
      },
    ],
  };

  const barAreaData = {
    labels: claimsByArea.map((a: any) => a.area),
    datasets: [
      {
        label: 'Reclamos por área',
        data: claimsByArea.map((a: any) => a.reclamos),
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
      },
    ],
  };

  const lineMonthData = {
    labels: claimsByMonth.map((m: any) => m.month),
    datasets: [
      {
        label: 'Reclamos por mes',
        data: claimsByMonth.map((m: any) => m.reclamos),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Dashboard del Administrador</h2>
          <p className="text-gray-600">Vista general del sistema de reclamos</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label>
            Desde:
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
            />
          </label>
          <label>
            Hasta:
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Reclamos</p>
                <p className="text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes Activos</p>
                <p className="text-gray-900 mt-1">
                  {stats.totalClientes ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reclamos Abiertos</p>
                <p className="text-gray-900 mt-1">
                  {stats.abiertos ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Tiempo Prom. Resolución
                </p>
                <p className="text-gray-900 mt-1">
                  {avgResolution.toFixed(1)} días
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reclamos por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <Pie data={pieStatusData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reclamos por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <Pie data={pieTypeData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts fila 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reclamos por Área</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <Bar data={barAreaData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reclamos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <Line data={lineMonthData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
