// src/components/EmployeeStatsPanel.tsx
import React from 'react';

interface EstadoData {
  _id: string;
  cantidad: number;
}

interface MesData {
  _id: string;   // esperado "YYYY-MM"
  cantidad: number;
}

interface Stats {
  total: number;
  porEstado: EstadoData[];
  porMes: MesData[];
}

interface Props {
  stats: Stats;
  fechaInicio: string;
  fechaFin: string;
  setFechaInicio: (v: string) => void;
  setFechaFin: (v: string) => void;
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

export const EmployeeStatsPanel: React.FC<Props> = ({
  stats,
  fechaInicio,
  fechaFin,
  setFechaInicio,
  setFechaFin,
}) => {
  const total = stats?.total ?? 0;
  const porEstado = stats?.porEstado ?? [];
  const porMes = stats?.porMes ?? [];

  const formatMes = (id: string) => {
    // id esperado: "YYYY-MM"
    const [year, month] = id.split('-');
    const idx = parseInt(month, 10) - 1;
    const nombreMes = meses[idx] ?? id;
    return `${nombreMes} ${year}`;
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Panel de Estadísticas del Empleado</h2>
      <p>
        Total de reclamos asignados: <b>{total}</b>
      </p>

      {/* Filtros de fecha (reutilizando los del dashboard) */}
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

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: 16,
        }}
      >
        {/* Resumen por estado */}
        <div style={{ minWidth: 280 }}>
          <h3>Detalle por estado</h3>
          {porEstado.length === 0 ? (
            <p style={{ color: '#666' }}>No hay reclamos para este empleado.</p>
          ) : (
            <ul>
              {porEstado.map(e => (
                <li key={String(e._id)}>
                  <b>{String(e._id)}:</b> {e.cantidad}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Resumen por mes */}
        <div style={{ minWidth: 280 }}>
          <h3>Detalle por mes</h3>
          {porMes.length === 0 ? (
            <p style={{ color: '#666' }}>No hay reclamos en el rango de fechas seleccionado.</p>
          ) : (
            <ul>
              {porMes.map(m => (
                <li key={m._id}>
                  <b>{formatMes(m._id)}:</b> {m.cantidad}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
