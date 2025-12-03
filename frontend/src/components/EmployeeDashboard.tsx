// EmployeeDashboard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FileText } from 'lucide-react';
import { EmployeeStatsPanel } from './EmployeeStatsPanel';

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

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();

  const [fechaInicio, setFechaInicio] = React.useState('');
  const [fechaFin, setFechaFin] = React.useState('');
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const empleadoId: string | null =
    (user as any)?.empleadoId ||
    JSON.parse(localStorage.getItem('usuario') || '{}')?.empleadoId ||
    null;

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!empleadoId) {
          setStats(null);
          setLoading(false);
          return;
        }

        let url = `/backend/reclamos/estadisticas-empleado?empleadoId=${empleadoId}`;
        if (fechaInicio) url += `&fechaInicio=${fechaInicio}`;
        if (fechaFin) url += `&fechaFin=${fechaFin}`;

        const res = await fetch(url);
        const rawText = await res.text();

        if (!res.ok) throw new Error(rawText);

        const data = JSON.parse(rawText);

        const normalized: Stats = {
          total: data.total ?? 0,
          porEstado: data.porEstado ?? [],
          porMes: data.porMes ?? [],
        };

        setStats(normalized);
      } catch (err: any) {
        console.error('Error cargando estadísticas empleado:', err);
        setError('No se pudieron cargar las estadísticas del empleado.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [empleadoId, fechaInicio, fechaFin]);

  const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981', '#6b7280'];

  if (loading && !stats) return <div>Cargando estadísticas...</div>;
  if (error) return <div>{error}</div>;
  if (!empleadoId) return <div>No se encontró empleado asociado para este usuario.</div>;
  if (!stats) return <div>No hay estadísticas para este empleado.</div>;

  const claimsByStatus =
    stats.porEstado.map((e) => ({
      name: e._id,
      value: e.cantidad,
    })) || [];

  const claimsByMonth =
    stats.porMes.map((m) => ({
      month: m._id,
      reclamos: m.cantidad,
    })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Dashboard del Empleado</h2>
        <p className="text-gray-600">Resumen de reclamos asignados</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Asignados</p>
                <p className="text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: 16, display: 'flex', gap: '1rem' }}>
        <label>
          Desde:
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </label>
        <label>
          Hasta:
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </label>
      </div>

      {/* Recharts (básico) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie por estado */}
        <Card>
          <CardHeader>
            <CardTitle>Reclamos por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={claimsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                >
                  {claimsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar por mes */}
        <Card>
          <CardHeader>
            <CardTitle>Reclamos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={claimsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reclamos" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* PANEL COMPLETO (Chart.js) */}
      <EmployeeStatsPanel
        scope="empleado"
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        empleadoId={empleadoId}
      />
    </div>
  );
};
