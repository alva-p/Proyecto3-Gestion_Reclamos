// src/components/ClientDashboard.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ClientStatsPanel } from './ClientStatsPanel';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>No hay usuario autenticado.</div>;
  }

  // Intentamos distintas formas de obtener el id de cliente:
  const clienteId =
    (user as any)?.clienteId ??
    (user as any)?._id ??
    (user as any)?.id;

  console.log('Cliente ID usado en stats:', clienteId, 'user:', user);

  if (!clienteId) {
    console.warn('No se encontró clienteId en el usuario autenticado:', user);
    return (
      <div>
        No se pudo determinar el cliente asociado al usuario logueado. Verificar
        estructura del objeto de usuario.
      </div>
    );
  }

  return <ClientStatsPanel clienteId={String(clienteId)} />;
};
