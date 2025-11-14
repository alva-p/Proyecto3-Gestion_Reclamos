import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { mockClaims, mockProjects } from '../data/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { statusLabels } from '../utils/translations';

export const ClientDashboard: React.FC = () => {
  const { user } = useAuth();

  const userClaims = useMemo(() => {
    return mockClaims.filter(claim => claim.clientId === user?.id);
  }, [user?.id]);

  const userProjects = useMemo(() => {
    return mockProjects.filter(project => project.clientId === user?.id);
  }, [user?.id]);

  const stats = useMemo(() => {
    const total = userClaims.length;
    const closed = userClaims.filter(c => c.status === 'cerrado').length;
    const inProgress = userClaims.filter(c => 
      ['en_revision', 'asignado', 'en_proceso'].includes(c.status)
    ).length;
    const pending = userClaims.filter(c => c.status === 'enviado').length;

    return { total, closed, inProgress, pending };
  }, [userClaims]);

  const claimsByStatus = useMemo(() => {
    const statusCount: Record<string, number> = {};
    userClaims.forEach(claim => {
      statusCount[claim.status] = (statusCount[claim.status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([status, count]) => ({
      name: statusLabels[status],
      value: count,
    }));
  }, [userClaims]);

  const claimsByMonth = useMemo(() => {
    const monthCount: Record<string, number> = {};
    userClaims.forEach(claim => {
      const month = claim.createdAt.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' });
      monthCount[month] = (monthCount[month] || 0) + 1;
    });

    return Object.entries(monthCount)
      .map(([month, count]) => ({ month, reclamos: count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [userClaims]);

  const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981', '#6b7280'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Dashboard</h2>
        <p className="text-gray-600">Resumen de sus reclamos y proyectos</p>
      </div>

      {/* Stats Cards */}
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
                <p className="text-sm text-gray-600">Cerrados</p>
                <p className="text-gray-900 mt-1">{stats.closed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Proceso</p>
                <p className="text-gray-900 mt-1">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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
                  {claimsByStatus.map((entry, index) => (
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

      {/* Projects Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userProjects.map(project => {
              const projectClaims = userClaims.filter(c => c.projectId === project.id);
              return (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Reclamos</p>
                    <p className="text-gray-900">{projectClaims.length}</p>
                  </div>
                </div>
              );
            })}
            {userProjects.length === 0 && (
              <p className="text-gray-500 text-center py-4">No tiene proyectos registrados</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
