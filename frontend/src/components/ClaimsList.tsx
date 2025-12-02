import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useAuth } from '../contexts/AuthContext';
import { Search, Eye, Loader2 } from 'lucide-react';
import { statusLabels, priorityLabels, statusColors, priorityColors } from '../utils/translations';
import { reclamosApi, type ReclamoResponse } from '../services/api';
import { toast } from 'sonner';

interface ClaimsListProps {
  onViewClaim: (claimId: string) => void;
}

export const ClaimsList: React.FC<ClaimsListProps> = ({ onViewClaim }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [claims, setClaims] = useState<ReclamoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const clienteId = import.meta.env.VITE_CLIENTE_ID;

  useEffect(() => {
    const loadClaims = async () => {
      try {
        setLoading(true);
        const filters: Record<string, string> = {};
        
        if (user?.rol === 'cliente' && user?.clienteId) {
          filters.clienteId = user.clienteId;
        }
        // Si es empleado, filtrar por reclamos asignados
        if (user?.rol === 'empleado' && user?.empleadoId) {
          filters.asignadoActual = user.empleadoId;
        }
        
        const data = await reclamosApi.getAll(filters);
        setClaims(data);
      } catch (e) {
        console.error(e);
        toast.error('Error cargando reclamos');
      } finally {
        setLoading(false);
      }
    };
    loadClaims();
  }, [user]);

  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
      const matchesSearch = 
        claim.numeroReclamo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const estadoNombre = typeof (claim as any).estadoActual === 'object' ? (claim as any).estadoActual?.nombre : '';
      const matchesStatus = statusFilter === 'all' || estadoNombre.toLowerCase() === statusFilter.toLowerCase().replace('_', ' ');
      
      const prioridadNombre = typeof claim.prioridad === 'object' ? claim.prioridad?.nombre : '';
      const matchesPriority = priorityFilter === 'all' || prioridadNombre.toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [claims, searchTerm, statusFilter, priorityFilter]);

  const getProjectName = (proyecto: any) => {
    if (!proyecto) return 'N/A';
    return typeof proyecto === 'object' ? proyecto.nombre : 'N/A';
  };

  const getClientName = (clienteId: any) => {
    if (!clienteId) return 'N/A';
    return typeof clienteId === 'object' ? (clienteId.empresa || clienteId.nombre || 'N/A') : 'N/A';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">
          {user?.rol === 'cliente' ? 'Mis Reclamos' : 'Gestión de Reclamos'}
        </h2>
        <p className="text-gray-600">
          {user?.rol === 'cliente' 
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
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Cargando reclamos...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Proyecto</TableHead>
                    {user?.rol !== 'cliente' && <TableHead>Cliente</TableHead>}
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
                    filteredClaims.map((claim) => {
                      const estadoNombre = typeof (claim as any).estadoActual === 'object' ? (claim as any).estadoActual?.nombre : '';
                      const prioridadNombre = typeof claim.prioridad === 'object' ? claim.prioridad?.nombre : '';
                      const estadoKey = estadoNombre.toLowerCase().replace(' ', '_') as keyof typeof statusColors;
                      const prioridadKey = prioridadNombre.toLowerCase() as keyof typeof priorityColors;
                      
                      return (
                        <TableRow key={claim._id}>
                          <TableCell>{claim.numeroReclamo || 'N/A'}</TableCell>
                          <TableCell className="max-w-xs truncate">{claim.titulo}</TableCell>
                          <TableCell>{getProjectName(claim.proyectoId)}</TableCell>
                          {user?.rol !== 'cliente' && (
                            <TableCell>{getClientName((claim as any).clienteId)}</TableCell>
                          )}
                          <TableCell>
                            <Badge className={statusColors[estadoKey] || 'bg-gray-100 text-gray-800'}>
                              {statusLabels[estadoKey] || estadoNombre}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={priorityColors[prioridadKey] || 'bg-gray-100 text-gray-800'}>
                              {priorityLabels[prioridadKey] || prioridadNombre}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {(claim as any).updatedAt ? new Date((claim as any).updatedAt).toLocaleDateString('es-AR') : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewClaim(claim._id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            Mostrando {filteredClaims.length} de {claims.length} reclamos
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
