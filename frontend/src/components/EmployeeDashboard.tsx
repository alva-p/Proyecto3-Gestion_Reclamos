import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { mockClaims } from '../data/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { statusLabels } from '../utils/translations';
import { EmployeeStatsPanel } from './EmployeeStatsPanel';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();

  const [fechaInicio, setFechaInicio] = React.useState('');
  const [fechaFin, setFechaFin] = React.useState('');
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    let url = `/backend/reclamos/estadisticas-empleado?empleadoId=${user.id}`;
    if (fechaInicio) url += `&fechaInicio=${fechaInicio}`;
    if (fechaFin) url += `&fechaFin=${fechaFin}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, [user?.id, fechaInicio, fechaFin]);

  const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981', '#6b7280'];

  if (loading || !stats) return <div>Cargando estadísticas...</div>;

  // Pie Chart para reclamos por estado
  const claimsByStatus = stats.porEstado?.map((e: any) => ({
    name: e._id,
    value: e.cantidad,
  })) || [];

  // Bar Chart para reclamos por mes
  const claimsByMonth = stats.porMes?.map((m: any) => ({
    month: m._id,
    reclamos: m.cantidad,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Dashboard del Empleado</h2>
        <p className="text-gray-600">Resumen de reclamos asignados a usted</p>
      </div>

      {/* Stats Cards */}
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
        {/* ...resto de las tarjetas... */}
      </div>

      {/* Filtro de fechas */}
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
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {claimsByStatus.map((entry: { name: string; value: number }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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

      {/* Panel de estadísticas del empleado */}
      {user?.id && <EmployeeStatsPanel empleadoId={user.id} />}
    </div>
  );
};
