// src/components/ClientStatsPanel.tsx
import React from 'react';
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

interface EstadoData {
  _id: string;
  cantidad: number;
}

interface MesData {
  _id: string; // "YYYY-MM"
  cantidad: number;
}

interface Stats {
  total: number;
  porEstado: EstadoData[];
  porMes: MesData[];
}

interface Props {
  clienteId: string;
}

const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981', '#6b7280'];

export const ClientStatsPanel: React.FC<Props> = ({ clienteId }) => {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = React.useState<string>('');
  const [fechaFin, setFechaFin] = React.useState<string>('');

  React.useEffect(() => {
    if (!clienteId) {
      console.warn('No se recibió clienteId en ClientStatsPanel');
      setStats(null);
      setLoading(false);
      setError('No se pudo determinar el cliente.');
      return;
    }

    let intervalId: any;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = `/backend/reclamos/estadisticas-cliente?clienteId=${clienteId}`;
        if (fechaInicio) url += `&fechaInicio=${fechaInicio}`;
        if (fechaFin) url += `&fechaFin=${fechaFin}`;

        console.log('Llamando a estadísticas cliente:', url);

        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include',
        });

        const raw = await res.text();
        console.log('Respuesta cruda de estadísticas cliente:', raw);

        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}: ${raw}`);
        }

        const data = JSON.parse(raw) as Stats;
        console.log('Datos de estadísticas cliente parseados:', data);

        setStats(data);
      } catch (err: any) {
        console.error('Error al cargar estadísticas del cliente:', err);
        setError('No se pudieron cargar las estadísticas del cliente.');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    // primera carga
    fetchStats();
    // auto-refresh cada 10 segundos
    intervalId = setInterval(fetchStats, 10000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [clienteId, fechaInicio, fechaFin]);

  if (loading && !stats) return <div>Cargando estadísticas...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return <div>No hay estadísticas disponibles para este cliente.</div>;

  const total = stats.total ?? 0;
  const porEstado = stats.porEstado ?? [];
  const porMes = stats.porMes ?? [];

  const claimsByStatus =
    porEstado.map(e => ({
      name: String(e._id),
      value: e.cantidad,
    })) ?? [];

  const claimsByMonth =
    porMes.map(m => ({
      month: m._id, // luego lo formateamos en el eje o en la lista
      reclamos: m.cantidad,
    })) ?? [];

  const formatMesLabel = (id: string) => {
    const [year, month] = id.split('-');
    const idx = parseInt(month, 10) - 1;
    const nombreMes = meses[idx] ?? id;
    return `${nombreMes} ${year}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Panel de Estadísticas del Cliente</h2>
        <p className="text-gray-600">
          Resumen de los reclamos que has realizado en el sistema
        </p>
      </div>

      <p>
        Total de reclamos: <b>{total}</b>
      </p>

      {/* Filtros de fecha */}
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

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie: Reclamos por estado */}
        <div>
          <h3 className="mb-2">Reclamos por estado</h3>
          {claimsByStatus.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay reclamos cargados para este cliente.
            </p>
          ) : (
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
                  {claimsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Barras: Reclamos por mes */}
        <div>
          <h3 className="mb-2">Reclamos por mes</h3>
          {claimsByMonth.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay reclamos en el rango de fechas seleccionado.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={claimsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMesLabel}
                  // si querés rotar labels:
                  // angle={-30}
                  // textAnchor="end"
                />
                <YAxis />
                <Tooltip
                  labelFormatter={label => formatMesLabel(String(label))}
                />
                <Legend />
                <Bar dataKey="reclamos" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Resumen textual (opcional, ayuda a entender los datos) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <h4 className="font-semibold mb-1">Detalle por estado</h4>
          {porEstado.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay reclamos para este cliente.
            </p>
          ) : (
            <ul className="text-sm">
              {porEstado.map(e => (
                <li key={String(e._id)}>
                  <b>{String(e._id)}:</b> {e.cantidad}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h4 className="font-semibold mb-1">Detalle por mes</h4>
          {porMes.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay reclamos en el rango seleccionado.
            </p>
          ) : (
            <ul className="text-sm">
              {porMes.map(m => (
                <li key={m._id}>
                  <b>{formatMesLabel(m._id)}:</b> {m.cantidad}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
