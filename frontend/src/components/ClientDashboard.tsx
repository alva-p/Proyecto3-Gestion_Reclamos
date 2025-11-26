import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ClientStatsPanel } from './ClientStatsPanel';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return <ClientStatsPanel clienteId={user.id} />;
};
