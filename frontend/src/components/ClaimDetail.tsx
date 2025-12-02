import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Calendar, User, Building, Star, Loader2, AlertCircle } from 'lucide-react';
import { statusLabels, priorityLabels, statusColors, priorityColors } from '../utils/translations';
import { 
  reclamosApi, 
  estadosReclamoApi, 
  comentariosInternosApi,
  empleadosApi,
  type ReclamoResponse, 
  type EstadoReclamoResponse,
  type ComentarioInternoResponse,
  type EmpleadoResponse
} from '../services/api';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';

interface ClaimDetailProps {
  claimId: string;
  onBack: () => void;
}

export const ClaimDetail: React.FC<ClaimDetailProps> = ({ claimId, onBack }) => {
  const { user } = useAuth();
  const [claim, setClaim] = useState<ReclamoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [estados, setEstados] = useState<EstadoReclamoResponse[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [comentarios, setComentarios] = useState<ComentarioInternoResponse[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [empleados, setEmpleados] = useState<EmpleadoResponse[]>([]);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState('');
  const [asignando, setAsignando] = useState(false);

  useEffect(() => {
    const loadClaim = async () => {
      try {
        setLoading(true);
        const data = await reclamosApi.getById(claimId);
        setClaim(data);
      } catch (e) {
        console.error(e);
        toast.error('Error cargando reclamo');
      } finally {
        setLoading(false);
      }
    };
    loadClaim();
  }, [claimId]);

  useEffect(() => {
    const loadEstados = async () => {
      try {
        const data = await estadosReclamoApi.getAll();
        setEstados(data);
      } catch (e) {
        console.error('Error cargando estados:', e);
      }
    };
    loadEstados();
  }, []);

  useEffect(() => {
    const loadComentarios = async () => {
      // Solo cargar comentarios si el usuario es empleado o admin
      if (user?.rol !== 'empleado' && user?.rol !== 'admin') {
        return;
      }
      
      try {
        setLoadingComentarios(true);
        const data = await comentariosInternosApi.getByReclamoId(claimId);
        setComentarios(data);
      } catch (e) {
        console.error('Error cargando comentarios:', e);
      } finally {
        setLoadingComentarios(false);
      }
    };
    loadComentarios();
  }, [claimId, user?.rol]);

  useEffect(() => {
    const loadEmpleados = async () => {
      if (user?.rol !== 'admin') {
        return;
      }
      
      try {
        const data = await empleadosApi.getAll();
        setEmpleados(data);
      } catch (e) {
        console.error('Error cargando empleados:', e);
      }
    };
    loadEmpleados();
  }, [user?.rol]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando reclamo...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const project = typeof claim.proyectoId === 'object' ? claim.proyectoId : null;
  const client = typeof (claim as any).clienteId === 'object' ? (claim as any).clienteId : null;
  const assignedUser = claim.empleadoAsignado;
  const estadoNombre = typeof (claim as any).estadoActual === 'object' ? (claim as any).estadoActual?.nombre : '';
  const prioridadNombre = typeof claim.prioridad === 'object' ? claim.prioridad?.nombre : '';
  const criticidadNombre = typeof claim.criticidad === 'object' ? claim.criticidad?.nombre : '';
  const tipoNombre = typeof claim.tipoReclamo === 'object' ? claim.tipoReclamo?.nombre : '';

  const canModifyStatus = user?.rol === 'empleado' || user?.rol === 'admin';
  const canAssign = user?.rol === 'admin';
  const canRate = user?.rol === 'cliente' && estadoNombre === 'Solucionado';
  const isLocked = estadoNombre === 'Cerrado' || estadoNombre === 'Cancelado';

  const selectedEstado = estados.find(e => e._id === newStatus);
  const isCerrandoReclamo = selectedEstado?.nombre === 'Cerrado';

  const handleStatusChange = async () => {
    if (!newStatus) {
      toast.error('Por favor seleccione un estado');
      return;
    }

    if (isCerrandoReclamo && (!statusComment || statusComment.trim().length === 0)) {
      toast.error('Para cerrar el reclamo, debe ingresar un comentario obligatorio');
      return;
    }

    if (isCerrandoReclamo && statusComment.trim().length < 10) {
      toast.error('El comentario debe tener al menos 10 caracteres');
      return;
    }

    try {
      setUpdatingStatus(true);
      const payload: { nuevoEstadoId: string; empleadoId?: string; comentario?: string } = {
        nuevoEstadoId: newStatus,
      };
      
      // Usar empleadoId si el usuario es empleado
      if (user?.empleadoId) {
        payload.empleadoId = user.empleadoId;
      }
      
      if (statusComment.trim()) {
        payload.comentario = statusComment.trim();
      }
      
      await reclamosApi.cambiarEstado(claimId, payload);
      
      // Recargar reclamo actualizado
      const updatedClaim = await reclamosApi.getById(claimId);
      setClaim(updatedClaim);
      
      toast.success(`Estado actualizado correctamente`);
      setNewStatus('');
      setStatusComment('');
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Error al cambiar el estado');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssign = () => {
    if (!assignedEmployee) return;
    // TODO: implementar API call para asignar empleado
    toast.success(`Reclamo asignado correctamente`);
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

  const handleEnviarComentario = async () => {
    if (!nuevoComentario.trim()) {
      toast.error('El comentario no puede estar vacío');
      return;
    }

    if (nuevoComentario.trim().length < 5) {
      toast.error('El comentario debe tener al menos 5 caracteres');
      return;
    }

    try {
      setEnviandoComentario(true);
      const comentario = await comentariosInternosApi.create(claimId, {
        texto: nuevoComentario.trim(),
      });
      
      setComentarios([comentario, ...comentarios]);
      setNuevoComentario('');
      toast.success('Comentario agregado');
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Error al agregar comentario');
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleEliminarComentario = async (comentarioId: string) => {
    if (!confirm('¿Está seguro de eliminar este comentario?')) {
      return;
    }

    try {
      await comentariosInternosApi.delete(claimId, comentarioId);
      setComentarios(comentarios.filter(c => c._id !== comentarioId));
      toast.success('Comentario eliminado');
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Error al eliminar comentario');
    }
  };

  const handleAsignarEmpleado = async () => {
    if (!selectedEmpleadoId) {
      toast.error('Por favor seleccione un empleado');
      return;
    }

    try {
      setAsignando(true);
      await reclamosApi.asignarEmpleado(claimId, selectedEmpleadoId);
      
      // Recargar reclamo actualizado
      const updatedClaim = await reclamosApi.getById(claimId);
      setClaim(updatedClaim);
      
      toast.success('Reclamo asignado correctamente');
      setSelectedEmpleadoId('');
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Error al asignar el reclamo');
    } finally {
      setAsignando(false);
    }
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
              <CardTitle>{claim.numeroReclamo || 'Sin número'}</CardTitle>
              <p className="text-gray-600 mt-1">{claim.titulo}</p>
            </div>
            <Badge className={statusColors[estadoNombre.toLowerCase().replace(' ', '_') as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
              {estadoNombre || 'Sin estado'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Descripción</p>
                <p className="text-gray-900 mt-1">{claim.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="text-gray-900 mt-1">{tipoNombre || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prioridad</p>
                  <Badge className={priorityColors[prioridadNombre.toLowerCase() as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800'}>
                    {prioridadNombre || 'N/A'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Criticidad</p>
                  <Badge className={priorityColors[criticidadNombre.toLowerCase() as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800'}>
                    {criticidadNombre || 'N/A'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Proyecto</p>
                  <p className="text-gray-900 mt-1">{project?.nombre || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="text-gray-900">{client?.empresa || 'N/A'}</p>
                </div>
              </div>

              {assignedUser && (
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Asignado a</p>
                    <p className="text-gray-900">{assignedUser.nombre || 'N/A'}</p>
                    {claim.area && typeof claim.area === 'object' && (
                      <p className="text-sm text-gray-500">{claim.area.nombre}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Fechas</p>
                  <p className="text-sm text-gray-900">
                    Creado: {(claim as any).createdAt ? new Date((claim as any).createdAt).toLocaleDateString('es-AR') : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-900">
                    Actualizado: {(claim as any).updatedAt ? new Date((claim as any).updatedAt).toLocaleDateString('es-AR') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {canModifyStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLocked && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Este reclamo está en estado {estadoNombre} y no permite cambios.
                  </AlertDescription>
                </Alert>
              )}

              {!isLocked && (
                <>
                  <div className="space-y-2">
                    <Label>Nuevo Estado</Label>
                    <Select value={newStatus} onValueChange={setNewStatus} disabled={updatingStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estados.map((estado) => (
                          <SelectItem key={estado._id} value={estado._id}>
                            {estado.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isCerrandoReclamo && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Al cerrar el reclamo, debe ingresar obligatoriamente un comentario de resolución.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label>
                      Comentario {isCerrandoReclamo && <span className="text-red-500">*</span>}
                    </Label>
                    <Textarea
                      value={statusComment}
                      onChange={(e) => setStatusComment(e.target.value)}
                      placeholder={isCerrandoReclamo ? "Comentario de resolución (obligatorio)" : "Comentario opcional sobre el cambio de estado"}
                      rows={4}
                      disabled={updatingStatus}
                    />
                    {isCerrandoReclamo && statusComment.trim().length > 0 && statusComment.trim().length < 10 && (
                      <p className="text-sm text-red-500">Mínimo 10 caracteres</p>
                    )}
                  </div>

                  <Button 
                    onClick={handleStatusChange} 
                    className="w-full"
                    disabled={updatingStatus || !newStatus}
                  >
                    {updatingStatus ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      'Actualizar Estado'
                    )}
                  </Button>
                </>
              )}
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
                <Select 
                  value={selectedEmpleadoId} 
                  onValueChange={setSelectedEmpleadoId}
                  disabled={asignando}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {empleados.map((empleado) => {
                      const subareaInfo = typeof empleado.subarea === 'object' && empleado.subarea
                        ? ` - ${empleado.subarea.nombre}`
                        : '';
                      const nombreEmpleado = empleado.usuarioId?.nombre || 'Sin nombre';
                      return (
                        <SelectItem key={empleado._id} value={empleado._id}>
                          {nombreEmpleado}{subareaInfo}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAsignarEmpleado}
                className="w-full"
                disabled={asignando || !selectedEmpleadoId}
              >
                {asignando ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Asignando...
                  </>
                ) : (
                  'Asignar'
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

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

      {/* Comentarios Internos - Temporalmente ocultos */}
      {false && (user?.rol === 'empleado' || user?.rol === 'admin') && (
        <Card>
          <CardHeader>
            <CardTitle>Comentarios Internos</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Espacio privado para coordinación del equipo. No visible para clientes.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulario para nuevo comentario */}
            <div className="space-y-2">
              <Label>Nuevo Comentario</Label>
              <Textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribir comentario interno..."
                rows={3}
                disabled={enviandoComentario}
              />
              <Button 
                onClick={handleEnviarComentario}
                disabled={enviandoComentario || nuevoComentario.trim().length < 5}
              >
                {enviandoComentario ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Agregar Comentario'
                )}
              </Button>
            </div>

            <Separator />

            {/* Lista de comentarios */}
            <div className="space-y-3">
              {loadingComentarios ? (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                  <p className="text-sm text-gray-600 mt-2">Cargando comentarios...</p>
                </div>
              ) : comentarios.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay comentarios internos aún. Sea el primero en comentar.
                </p>
              ) : (
                comentarios.map((comentario) => {
                  const usuario = typeof comentario.usuarioId === 'object' 
                    ? comentario.usuarioId 
                    : null;
                  const esPropio = user?.id === usuario?._id;
                  
                  return (
                    <div key={comentario._id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-sm">
                            {usuario?.nombre || 'Usuario'}
                          </span>
                          {esPropio && (
                            <Badge variant="outline" className="text-xs">Tú</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {new Date(comentario.createdAt || comentario.fechaCreacion).toLocaleString('es-AR')}
                          </span>
                          {esPropio && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEliminarComentario(comentario._id)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {comentario.texto}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Cambios</CardTitle>
        </CardHeader>
        <CardContent>
          {claim.historialIds && claim.historialIds.length > 0 ? (
            <div className="space-y-4">
              {claim.historialIds
                .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime())
                .map((historial) => {
                  const fecha = new Date(historial.fechaHora);
                  const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  });
                  const horaFormateada = fecha.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  });
                  
                  const nombreEmpleado = historial.empleado?.usuarioId?.nombre || 'Sistema';
                  const estadoNombre = historial.estadoReclamo?.nombre;
                  const estadoKey = estadoNombre?.toLowerCase().replace(' ', '_') || 'enviado';
                  const estadoColor = statusColors[estadoKey] || 'gray';
                  
                  // Mapeo de colores para clases completas de Tailwind
                  const badgeClasses: Record<string, string> = {
                    blue: 'bg-blue-100 text-blue-800',
                    yellow: 'bg-yellow-100 text-yellow-800',
                    purple: 'bg-purple-100 text-purple-800',
                    orange: 'bg-orange-100 text-orange-800',
                    green: 'bg-green-100 text-green-800',
                    gray: 'bg-gray-100 text-gray-800',
                    red: 'bg-red-100 text-red-800',
                  };
                  
                  return (
                    <div key={historial._id} className="flex items-start gap-3 border-l-2 border-blue-500 pl-4 py-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{historial.detalleAccion}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Por: {nombreEmpleado}
                        </p>
                        {estadoNombre && (
                          <Badge className={`mt-2 ${badgeClasses[estadoColor] || badgeClasses.gray}`}>
                            {estadoNombre}
                          </Badge>
                        )}
                        {historial.comentario && (
                          <div className="mt-2 p-2 bg-gray-50 rounded border-l-2 border-gray-300">
                            <p className="text-sm text-gray-700 italic">"{historial.comentario}"</p>
                          </div>
                        )}
                        {historial.area && (
                          <p className="text-sm text-gray-500 mt-1">
                            Área: {historial.area.nombre}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500 whitespace-nowrap">
                        <p>{fechaFormateada} {horaFormateada}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No hay historial de cambios disponible.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
