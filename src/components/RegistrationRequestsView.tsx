import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { mockRegistrationRequests } from '../data/mockData';
import { Check, X, Eye } from 'lucide-react';
import { RegistrationRequest } from '../types';
import { toast } from 'sonner@2.0.3';

export const RegistrationRequestsView: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const pendingRequests = mockRegistrationRequests.filter(r => r.status === 'pendiente');
  const processedRequests = mockRegistrationRequests.filter(r => r.status !== 'pendiente');

  const handleViewDetail = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleApprove = (request: RegistrationRequest) => {
    toast.success(`Solicitud de ${request.name} aprobada. Se enviará un correo de confirmación.`);
    setIsDetailOpen(false);
  };

  const handleReject = (request: RegistrationRequest) => {
    toast.success(`Solicitud de ${request.name} rechazada. Se enviará un correo de notificación.`);
    setIsDetailOpen(false);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Solicitudes de Registro</h2>
        <p className="text-gray-600">Gestione las solicitudes de acceso de nuevos clientes</p>
      </div>

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
                    <TableRow key={request.id}>
                      <TableCell>{request.name}</TableCell>
                      <TableCell>{request.company}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.phone}</TableCell>
                      <TableCell>
                        {request.createdAt.toLocaleDateString('es-AR')}
                      </TableCell>
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
                    <TableRow key={request.id}>
                      <TableCell>{request.name}</TableCell>
                      <TableCell>{request.company}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.createdAt.toLocaleDateString('es-AR')}
                      </TableCell>
                      <TableCell>
                        {request.processedAt?.toLocaleDateString('es-AR')}
                      </TableCell>
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
                  <p className="text-gray-900">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Empresa</p>
                  <p className="text-gray-900">{selectedRequest.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Correo</p>
                  <p className="text-gray-900">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="text-gray-900">{selectedRequest.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="text-gray-900">{selectedRequest.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha Solicitud</p>
                  <p className="text-gray-900">
                    {selectedRequest.createdAt.toLocaleDateString('es-AR')}
                  </p>
                </div>
              </div>

              {selectedRequest.status === 'pendiente' && (
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
