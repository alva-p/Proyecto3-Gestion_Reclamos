import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ClientStatsPanel } from './ClientStatsPanel';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();

  // Fallback: si el contexto viene vacío, intentamos desde localStorage
  const storedUser = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('usuario');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const effectiveUser = user || storedUser;

  if (!effectiveUser) {
    return <div>No hay usuario autenticado.</div>;
  }

  // Intentamos distintas formas de obtener el id de cliente:
  const clienteId =
    (effectiveUser as any)?.clienteId ??
    (effectiveUser as any)?._id ??
    (effectiveUser as any)?.id ??
    null;

  console.log('Cliente ID usado en stats:', clienteId, 'user:', effectiveUser);

  if (!clienteId) {
    console.warn(
      'No se encontró clienteId en el usuario autenticado:',
      effectiveUser,
    );
    return (
      <div>
        No se pudo determinar el cliente asociado al usuario logueado. Verificar
        la estructura del objeto de usuario.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Dashboard del Cliente</h2>
        <p className="text-gray-600">
          Vista general de los reclamos que has realizado
        </p>
      </div>

      <ClientStatsPanel clienteId={String(clienteId)} />
    </div>
  );
};
