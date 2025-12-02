import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, Building2 } from 'lucide-react';
import { areasApi, type AreaResponse } from '../services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export const AreasManagement: React.FC = () => {
  const [areas, setAreas] = useState<AreaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Estado del formulario
  const [showForm, setShowForm] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  
  // Estado para confirmación de eliminación
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    area: AreaResponse | null;
  }>({ show: false, area: null });

  // Cargar áreas al montar el componente
  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const data = await areasApi.getAll();
      setAreas(data);
    } catch (error) {
      console.error('Error cargando áreas:', error);
      toast.error('Error al cargar las áreas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAreaName.trim()) {
      toast.error('El nombre del área es requerido');
      return;
    }

    try {
      setSubmitting(true);
      const newArea = await areasApi.create({ nombre: newAreaName.trim() });
      
      setAreas([...areas, newArea]);
      toast.success('Área creada correctamente');
      
      // Resetear formulario
      setNewAreaName('');
      setShowForm(false);
    } catch (error) {
      console.error('Error creando área:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear el área');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (area: AreaResponse) => {
    setDeleteConfirm({ show: true, area });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.area) return;

    try {
      setDeleting(deleteConfirm.area._id);
      await areasApi.delete(deleteConfirm.area._id);
      
      setAreas(areas.filter(a => a._id !== deleteConfirm.area!._id));
      toast.success('Área eliminada correctamente');
      setDeleteConfirm({ show: false, area: null });
    } catch (error) {
      console.error('Error eliminando área:', error);
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el área');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando áreas...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900 mb-1">Gestión de Áreas</h2>
          <p className="text-gray-600">Administre las áreas de la organización</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Área
        </Button>
      </div>

      {/* Formulario de nueva área */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nueva Área</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Área *</Label>
                <Input
                  id="nombre"
                  value={newAreaName}
                  onChange={(e) => setNewAreaName(e.target.value)}
                  placeholder="Ej: Soporte Técnico, Recursos Humanos, etc."
                  required
                  disabled={submitting}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Crear Área'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setNewAreaName('');
                  }}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de áreas */}
      <Card>
        <CardHeader>
          <CardTitle>Áreas Registradas ({areas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {areas.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-gray-900 mb-2">No hay áreas registradas</h3>
              <p className="text-gray-600 mb-4">
                Cree la primera área para comenzar
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Área
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {areas.map((area) => (
                <div
                  key={area._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{area.nombre}</h4>
                      {area.fechaCreacion && (
                        <p className="text-sm text-gray-500">
                          Creada: {new Date(area.fechaCreacion).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(area)}
                    disabled={deleting === area._id}
                  >
                    {deleting === area._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-600" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteConfirm.show} onOpenChange={(open) => !open && setDeleteConfirm({ show: false, area: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar área?</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar el área <strong>{deleteConfirm.area?.nombre}</strong>? 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ show: false, area: null })}
              disabled={deleting !== null}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting !== null}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
