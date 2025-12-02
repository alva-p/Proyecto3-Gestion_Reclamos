import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Check, X, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { clientesApi, ClienteResponse } from '../services/api';

export const RegistrationRequestsView: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<ClienteResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<ClienteResponse[]>([]);
  const [processedRequests, setProcessedRequests] = useState<ClienteResponse[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pendientes, todos] = await Promise.all([
        clientesApi.getPendientes(),
        clientesApi.getAll(),
      ]);
      setPendingRequests(pendientes);
      const processed = todos.filter(c => {
        const estado = c.estadoSolicitud?.nombre || (typeof c.estadoSolicitud === 'string' ? c.estadoSolicitud : '');
        return estado && estado !== 'PENDIENTE';
      });
      setProcessedRequests(processed);
    } catch (err: any) {
      toast.error(err.message || 'Error al cargar solicitudes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleViewDetail = (request: ClienteResponse) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleApprove = async (request: ClienteResponse) => {
    try {
      await clientesApi.aprobar(request._id);
      toast.success(`Solicitud de ${getNombre(request)} aprobada.`);
      setIsDetailOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'No se pudo aprobar');
    }
  };

  const handleReject = async (request: ClienteResponse) => {
    try {
      await clientesApi.rechazar(request._id);
      toast.success(`Solicitud de ${getNombre(request)} rechazada.`);
      setIsDetailOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'No se pudo rechazar');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      registrado: 'bg-green-100 text-green-800',
      rechazado: 'bg-red-100 text-red-800',
    };

    const labels = {
      pendiente: 'Pendiente',
      registrado: 'Registrado',
      rechazado: 'Rechazado',
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getEstado = (c: ClienteResponse) => {
    const nombre = c.estadoSolicitud?.nombre || (typeof c.estadoSolicitud === 'string' ? c.estadoSolicitud : '') || '';
    const map: Record<string,string> = { PENDIENTE: 'pendiente', APROBADO: 'registrado', RECHAZADO: 'rechazado' };
    return map[nombre] || 'pendiente';
  };

  const getNombre = (c: ClienteResponse) => {
    return typeof c.usuarioId === 'object' && c.usuarioId?.nombre ? c.usuarioId.nombre : '-';
  };

  const getCorreo = (c: ClienteResponse) => {
    return typeof c.usuarioId === 'object' && c.usuarioId?.correo ? c.usuarioId.correo : '-';
  };

  const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('es-AR') : '-');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Solicitudes de Registro</h2>
        <p className="text-gray-600">Gestione las solicitudes de acceso de nuevos clientes</p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando solicitudes...
        </div>
      )}

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes ({pendingRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No hay solicitudes pendientes
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{getNombre(request)}</TableCell>
                      <TableCell>{request.empresa}</TableCell>
                      <TableCell>{getCorreo(request)}</TableCell>
                      <TableCell>{request.telefono || '-'}</TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(request)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(request)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleReject(request)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Processed Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Procesadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead>Fecha Procesado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No hay solicitudes procesadas
                    </TableCell>
                  </TableRow>
                ) : (
                  processedRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{getNombre(request)}</TableCell>
                      <TableCell>{request.empresa}</TableCell>
                      <TableCell>{getCorreo(request)}</TableCell>
                      <TableCell>{getStatusBadge(getEstado(request))}</TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell>{formatDate(request.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(request)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle de Solicitud</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="text-gray-900">{getNombre(selectedRequest)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Empresa</p>
                  <p className="text-gray-900">{selectedRequest.empresa}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Correo</p>
                  <p className="text-gray-900">{getCorreo(selectedRequest)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="text-gray-900">{selectedRequest.telefono || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="text-gray-900">{selectedRequest.direccion || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  {getStatusBadge(getEstado(selectedRequest))}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha Solicitud</p>
                  <p className="text-gray-900">{formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>

              {getEstado(selectedRequest) === 'pendiente' && (
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => handleApprove(selectedRequest)}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Aprobar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleReject(selectedRequest)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rechazar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
