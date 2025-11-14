import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { mockClaims, mockUsers } from '../data/mockData';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Users, TrendingUp, Clock } from 'lucide-react';
import { statusLabels, typeLabels } from '../utils/translations';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('all');

  const filteredClaims = useMemo(() => {
    if (dateRange === 'all') return mockClaims;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (dateRange) {
      case '7days':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      default:
        return mockClaims;
    }
    
    return mockClaims.filter(claim => claim.createdAt >= cutoffDate);
  }, [dateRange]);

  const stats = useMemo(() => {
    const totalClaims = filteredClaims.length;
    const totalClients = mockUsers.filter(u => u.role === 'cliente').length;
    const openClaims = filteredClaims.filter(c => 
      !['cerrado', 'cancelado'].includes(c.status)
    ).length;

    // Calcular tiempo promedio de resolución (días)
    const closedClaims = filteredClaims.filter(c => c.status === 'cerrado');
    const avgResolutionTime = closedClaims.length > 0
      ? closedClaims.reduce((acc, claim) => {
          const diff = claim.updatedAt.getTime() - claim.createdAt.getTime();
          return acc + diff / (1000 * 60 * 60 * 24);
        }, 0) / closedClaims.length
      : 0;

    return { totalClaims, totalClients, openClaims, avgResolutionTime };
  }, [filteredClaims]);

  const claimsByStatus = useMemo(() => {
    const statusCount: Record<string, number> = {};
    filteredClaims.forEach(claim => {
      statusCount[claim.status] = (statusCount[claim.status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([status, count]) => ({
      name: statusLabels[status],
      value: count,
    }));
  }, [filteredClaims]);

  const claimsByType = useMemo(() => {
    const typeCount: Record<string, number> = {};
    filteredClaims.forEach(claim => {
      typeCount[claim.type] = (typeCount[claim.type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([type, count]) => ({
      name: typeLabels[type],
      value: count,
    }));
  }, [filteredClaims]);

  const claimsByArea = useMemo(() => {
    const areaCount: Record<string, number> = {};
    filteredClaims.forEach(claim => {
      const area = claim.assignedArea || 'Sin asignar';
      areaCount[area] = (areaCount[area] || 0) + 1;
    });

    return Object.entries(areaCount).map(([area, count]) => ({
      area,
      reclamos: count,
    }));
  }, [filteredClaims]);

  const claimsByMonth = useMemo(() => {
    const monthCount: Record<string, number> = {};
    filteredClaims.forEach(claim => {
      const month = claim.createdAt.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' });
      monthCount[month] = (monthCount[month] || 0) + 1;
    });

    return Object.entries(monthCount)
      .map(([month, count]) => ({ month, reclamos: count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [filteredClaims]);

  const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981', '#6b7280', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Dashboard del Administrador</h2>
          <p className="text-gray-600">Vista general del sistema de reclamos</p>
        </div>
        <div className="w-48">
          <Label>Rango de Fechas</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo el tiempo</SelectItem>
              <SelectItem value="7days">Últimos 7 días</SelectItem>
              <SelectItem value="30days">Últimos 30 días</SelectItem>
              <SelectItem value="90days">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Reclamos</p>
                <p className="text-gray-900 mt-1">{stats.totalClaims}</p>
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
                <p className="text-gray-900 mt-1">{stats.totalClients}</p>
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
                <p className="text-gray-900 mt-1">{stats.openClaims}</p>
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
                <p className="text-sm text-gray-600">Tiempo Prom. Resolución</p>
                <p className="text-gray-900 mt-1">{stats.avgResolutionTime.toFixed(1)} días</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
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
            <CardTitle>Reclamos por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={claimsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {claimsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reclamos por Área</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={claimsByArea}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reclamos" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reclamos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={claimsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reclamos" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
