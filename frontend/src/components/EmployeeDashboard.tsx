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
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { statusLabels } from '../utils/translations';
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

  // Intentamos obtener el id de cualquier forma (_id o id)
// EL EMPLEADO ID REAL VIENE DEL LOGIN: usuario.empleadoId
const empleadoId =
  (user as any)?.empleadoId ||
  JSON.parse(localStorage.getItem('usuario') || '{}')?.empleadoId ||
  null;


  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Usuario en contexto:', user);
        console.log('empleadoId detectado:', empleadoId);

        if (!empleadoId) {
          console.warn('No hay empleadoId en el usuario autenticado');
          setStats(null);
          setLoading(false);
          return;
        }

        let url = `/backend/reclamos/estadisticas-empleado?empleadoId=${empleadoId}`;
        if (fechaInicio) url += `&fechaInicio=${fechaInicio}`;
        if (fechaFin) url += `&fechaFin=${fechaFin}`;

        console.log('Llamando a:', url);

        const res = await fetch(url);
        const contentType = res.headers.get('content-type') || '';

        console.log('Status respuesta estadísticas empleado:', res.status);
        console.log('Content-Type:', contentType);

        const rawText = await res.text();
        console.log('Respuesta cruda de estadísticas empleado:', rawText);

        if (!res.ok) {
          console.error('Error HTTP en estadísticas empleado:', res.status, rawText);
          throw new Error(`Error HTTP ${res.status}`);
        }

        if (!contentType.includes('application/json')) {
          console.error('La respuesta no es JSON, probablemente HTML o texto plano.');
          throw new Error('La respuesta del backend no es JSON.');
        }

        let data: any;
        try {
          data = JSON.parse(rawText);
        } catch (parseError) {
          console.error('Error parseando JSON de estadísticas empleado:', parseError);
          throw new Error('No se pudo parsear la respuesta JSON del backend.');
        }

        console.log('Datos de estadísticas empleado (parseados):', data);

        // Normalizamos la estructura para adaptarnos a distintos nombres de campos
        const normalized: Stats = {
          total:
            data.total ??
            data.totalReclamos ??
            data.total_reclamos ??
            0,
          porEstado:
            data.porEstado ??
            data.reclamosPorEstado ??
            data.reclamos_por_estado ??
            [],
          porMes:
            data.porMes ??
            data.reclamosPorMes ??
            data.reclamos_por_mes ??
            [],
        };

        console.log('Estadísticas normalizadas para el front:', normalized);

        setStats(normalized);
      } catch (err: any) {
        console.error('Error al cargar estadísticas del empleado:', err);
        setError(err.message || 'No se pudieron cargar las estadísticas del empleado.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [empleadoId, fechaInicio, fechaFin, user]);

  const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981', '#6b7280'];

  if (loading) return <div>Cargando estadísticas...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return <div>No hay estadísticas disponibles para este empleado.</div>;

  // Si no hay datos, mostramos igualmente el dashboard pero indicando vacío
  const claimsByStatus =
    stats.porEstado?.map((e: EstadoData) => ({
      name: e._id,
      value: e.cantidad,
    })) || [];

  const claimsByMonth =
    stats.porMes?.map((m: MesData) => ({
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
        {/* Podés agregar aquí otras tarjetas (Abiertos, Cerrados, etc.) usando stats.porEstado */}
      </div>

      {/* Filtro de fechas (se comparte con el panel) */}
      <div style={{ marginBottom: 16, display: 'flex', gap: '1rem' }}>
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

      {/* Charts con Recharts */}
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
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {claimsByStatus.map(
                    (entry: { name: string; value: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ),
                  )}
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

      {/* Panel de estadísticas con Chart.js */}
      <EmployeeStatsPanel
        stats={stats}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        setFechaInicio={setFechaInicio}
        setFechaFin={setFechaFin}
      />
    </div>
  );
};
