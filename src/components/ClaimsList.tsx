import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { mockClaims, mockProjects, mockUsers } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Search, Eye } from 'lucide-react';
import { statusLabels, priorityLabels, typeLabels, statusColors, priorityColors } from '../utils/translations';
import { Claim } from '../types';

interface ClaimsListProps {
  onViewClaim: (claimId: string) => void;
}

export const ClaimsList: React.FC<ClaimsListProps> = ({ onViewClaim }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const claims = useMemo(() => {
    if (user?.role === 'cliente') {
      return mockClaims.filter(claim => claim.clientId === user.id);
    }
    if (user?.role === 'empleado') {
      return mockClaims.filter(claim => claim.assignedTo === user.id);
    }
    return mockClaims;
  }, [user]);

  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
      const matchesSearch = 
        claim.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || claim.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [claims, searchTerm, statusFilter, priorityFilter]);

  const getProjectName = (projectId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    return project?.name || 'N/A';
  };

  const getClientName = (clientId: string) => {
    const client = mockUsers.find(u => u.id === clientId);
    return client?.name || 'N/A';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">
          {user?.role === 'cliente' ? 'Mis Reclamos' : 'Gestión de Reclamos'}
        </h2>
        <p className="text-gray-600">
          {user?.role === 'cliente' 
            ? 'Consulte el estado y avance de sus reclamos'
            : 'Visualice y gestione todos los reclamos del sistema'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por número o título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="en_revision">En Revisión</SelectItem>
                <SelectItem value="asignado">Asignado</SelectItem>
                <SelectItem value="en_proceso">En Proceso</SelectItem>
                <SelectItem value="solucionado">Solucionado</SelectItem>
                <SelectItem value="cerrado">Cerrado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Proyecto</TableHead>
                  {user?.role !== 'cliente' && <TableHead>Cliente</TableHead>}
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Última Actualización</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No se encontraron reclamos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell>{claim.number}</TableCell>
                      <TableCell className="max-w-xs truncate">{claim.title}</TableCell>
                      <TableCell>{getProjectName(claim.projectId)}</TableCell>
                      {user?.role !== 'cliente' && (
                        <TableCell>{getClientName(claim.clientId)}</TableCell>
                      )}
                      <TableCell>
                        <Badge className={statusColors[claim.status]}>
                          {statusLabels[claim.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityColors[claim.priority]}>
                          {priorityLabels[claim.priority]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {claim.updatedAt.toLocaleDateString('es-AR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewClaim(claim.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Mostrando {filteredClaims.length} de {claims.length} reclamos
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
