import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { mockClaims, mockProjects, mockUsers, mockClaimHistory } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Calendar, User, Building, Star } from 'lucide-react';
import { statusLabels, priorityLabels, typeLabels, statusColors, priorityColors } from '../utils/translations';
import { ClaimStatus } from '../types';
import { toast } from 'sonner@2.0.3';

interface ClaimDetailProps {
  claimId: string;
  onBack: () => void;
}

export const ClaimDetail: React.FC<ClaimDetailProps> = ({ claimId, onBack }) => {
  const { user } = useAuth();
  const claim = mockClaims.find(c => c.id === claimId);
  const [newStatus, setNewStatus] = useState<ClaimStatus | ''>('');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const claimHistory = useMemo(() => {
    return mockClaimHistory
      .filter(h => h.claimId === claimId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [claimId]);

  if (!claim) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Reclamo no encontrado
          </CardContent>
        </Card>
      </div>
    );
  }

  const project = mockProjects.find(p => p.id === claim.projectId);
  const client = mockUsers.find(u => u.id === claim.clientId);
  const assignedUser = claim.assignedTo ? mockUsers.find(u => u.id === claim.assignedTo) : null;
  const employees = mockUsers.filter(u => u.role === 'empleado');

  const canModifyStatus = user?.role === 'empleado' || user?.role === 'administrador';
  const canAssign = user?.role === 'administrador';
  const canRate = user?.role === 'cliente' && claim.status === 'solucionado' && !claim.rating;
  const isLocked = claim.status === 'cerrado' || claim.status === 'cancelado';

  const handleStatusChange = () => {
    if (!newStatus) return;
    toast.success(`Estado actualizado a: ${statusLabels[newStatus]}`);
    setNewStatus('');
  };

  const handleAssign = () => {
    if (!assignedEmployee) return;
    const employee = employees.find(e => e.id === assignedEmployee);
    toast.success(`Reclamo asignado a: ${employee?.name}`);
    setAssignedEmployee('');
  };

  const handleRating = () => {
    if (rating === 0) {
      toast.error('Por favor seleccione una calificación');
      return;
    }
    toast.success('Calificación enviada. Gracias por su feedback!');
    setRating(0);
    setRatingComment('');
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      {/* Main Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{claim.number}</CardTitle>
              <p className="text-gray-600 mt-1">{claim.title}</p>
            </div>
            <Badge className={statusColors[claim.status]}>
              {statusLabels[claim.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Descripción</p>
                <p className="text-gray-900 mt-1">{claim.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="text-gray-900 mt-1">{typeLabels[claim.type]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prioridad</p>
                  <Badge className={priorityColors[claim.priority]}>
                    {priorityLabels[claim.priority]}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Criticidad</p>
                  <Badge className={priorityColors[claim.criticality]}>
                    {priorityLabels[claim.criticality]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Proyecto</p>
                  <p className="text-gray-900 mt-1">{project?.name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="text-gray-900">{client?.name}</p>
                  <p className="text-sm text-gray-500">{client?.email}</p>
                </div>
              </div>

              {assignedUser && (
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Asignado a</p>
                    <p className="text-gray-900">{assignedUser.name}</p>
                    <p className="text-sm text-gray-500">{claim.assignedArea}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Fechas</p>
                  <p className="text-sm text-gray-900">
                    Creado: {claim.createdAt.toLocaleDateString('es-AR')}
                  </p>
                  <p className="text-sm text-gray-900">
                    Actualizado: {claim.updatedAt.toLocaleDateString('es-AR')}
                  </p>
                </div>
              </div>

              {claim.rating && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Calificación del cliente</p>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= claim.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {claim.ratingComment && (
                    <p className="text-sm text-gray-700 italic">"{claim.ratingComment}"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {!isLocked && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {canModifyStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Cambiar Estado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nuevo Estado</Label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ClaimStatus)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en_revision">En Revisión</SelectItem>
                      <SelectItem value="asignado">Asignado</SelectItem>
                      <SelectItem value="en_proceso">En Proceso</SelectItem>
                      <SelectItem value="solucionado">Solucionado</SelectItem>
                      <SelectItem value="cerrado">Cerrado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleStatusChange} className="w-full">
                  Actualizar Estado
                </Button>
              </CardContent>
            </Card>
          )}

          {canAssign && (
            <Card>
              <CardHeader>
                <CardTitle>Asignar Reclamo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Empleado</Label>
                  <Select value={assignedEmployee} onValueChange={setAssignedEmployee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} - {emp.area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAssign} className="w-full">
                  Asignar
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Rating */}
      {canRate && (
        <Card>
          <CardHeader>
            <CardTitle>Calificar Atención</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Calificación</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Comentario (opcional)</Label>
              <Textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Comparta su experiencia..."
                rows={3}
              />
            </div>
            <Button onClick={handleRating} className="w-full">
              Enviar Calificación
            </Button>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Cambios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claimHistory.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-900">{item.action}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Por: {item.userName}
                        </p>
                        {item.status && (
                          <Badge className={`${statusColors[item.status]} mt-2`}>
                            {statusLabels[item.status]}
                          </Badge>
                        )}
                        {item.assignedTo && (
                          <p className="text-sm text-gray-600 mt-2">
                            Área: {item.assignedArea}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {item.timestamp.toLocaleDateString('es-AR')} {item.timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
