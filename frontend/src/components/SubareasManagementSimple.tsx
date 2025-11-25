import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const API_URL = 'http://localhost:3001';

type Area = {
  _id: string;
  nombre: string;
};

type Subarea = {
  _id: string;
  nombre: string;
  area: string | Area;
};

export const SubareasManagement = () => {
  console.log('SubareasManagement rendering...');
  
  const [areas, setAreas] = useState<Area[]>([]);
  const [subareas, setSubareas] = useState<Subarea[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subareaToDelete, setSubareaToDelete] = useState<Subarea | null>(null);
  const [deleteError, setDeleteError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    area: '',
  });

  useEffect(() => {
    console.log('useEffect triggered');
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      await Promise.all([fetchAreas(), fetchSubareas()]);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Error al cargar los datos. Por favor, recarga la página.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetch(`${API_URL}/areas`);
      if (response.ok) {
        const data = await response.json();
        setAreas(data);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const fetchSubareas = async (areaId?: string) => {
    try {
      const url = areaId 
        ? `${API_URL}/subareas?areaId=${areaId}`
        : `${API_URL}/subareas`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSubareas(data);
      }
    } catch (error) {
      console.error('Error fetching subareas:', error);
    }
  };

  const handleCreateSubarea = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const response = await fetch(`${API_URL}/subareas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsCreateDialogOpen(false);
        setFormData({ nombre: '', area: '' });
        fetchSubareas(selectedArea);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'No se pudo crear la subárea'}`);
      }
    } catch (error) {
      console.error('Error creating subarea:', error);
      alert('Error al crear la subárea');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubarea = async () => {
    if (!subareaToDelete) return;
    
    setActionLoading(true);
    setDeleteError('');

    try {
      const response = await fetch(`${API_URL}/subareas/${subareaToDelete._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setSubareaToDelete(null);
        fetchSubareas(selectedArea);
      } else if (response.status === 409) {
        const error = await response.json();
        setDeleteError(
          `No se puede eliminar esta subárea porque tiene ${error.reclamos?.length || 0} reclamos activos. ` +
          `Debe reasignar los reclamos primero.`
        );
      } else {
        const error = await response.json();
        setDeleteError(error.message || 'No se pudo eliminar la subárea');
      }
    } catch (error) {
      console.error('Error deleting subarea:', error);
      setDeleteError('Error al eliminar la subárea');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAreaFilterChange = (areaId: string) => {
    if (areaId === 'all') {
      setSelectedArea('');
      fetchSubareas();
    } else {
      setSelectedArea(areaId);
      fetchSubareas(areaId);
    }
  };

  const getAreaName = (areaIdOrObj: string | Area): string => {
    if (typeof areaIdOrObj === 'string') {
      const area = areas.find((a) => a._id === areaIdOrObj);
      return area?.nombre || areaIdOrObj;
    }
    return areaIdOrObj.nombre;
  };

  console.log('Render state:', { loading, error, areasCount: areas.length, subareasCount: subareas.length });

  try {
    if (loading) {
      console.log('Rendering loading state');
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      );
    }

    if (error) {
      console.log('Rendering error state:', error);
      return (
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      );
    }

    console.log('Rendering main content');
    return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Subáreas</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Subárea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Subárea</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubarea} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre de la Subárea *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    placeholder="ej: DBAs, Frontend, Backend"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Área *</Label>
                  <Select
                    value={formData.area}
                    onValueChange={(value) => setFormData({ ...formData, area: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area._id} value={area._id}>
                          {area.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={actionLoading}>
                    {actionLoading ? 'Creando...' : 'Crear Subárea'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="filter-area">Filtrar por Área</Label>
            <Select value={selectedArea || undefined} onValueChange={handleAreaFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las áreas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las áreas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area._id} value={area._id}>
                    {area.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Área</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subareas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500">
                    No hay subáreas creadas
                  </TableCell>
                </TableRow>
              ) : (
                subareas.map((subarea) => (
                  <TableRow key={subarea._id}>
                    <TableCell className="font-medium">{subarea.nombre}</TableCell>
                    <TableCell>{getAreaName(subarea.area)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSubareaToDelete(subarea);
                          setIsDeleteDialogOpen(true);
                          setDeleteError('');
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Subárea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {deleteError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            ) : (
              <p>
                ¿Estás seguro de que deseas eliminar la subárea{' '}
                <strong>{subareaToDelete?.nombre}</strong>?
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSubareaToDelete(null);
                  setDeleteError('');
                }}
              >
                Cancelar
              </Button>
              {!deleteError && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSubarea}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Eliminando...' : 'Eliminar'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    );
  } catch (err) {
    console.error('Error rendering SubareasManagement:', err);
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error al renderizar el componente: {String(err)}</AlertDescription>
        </Alert>
      </div>
    );
  }
};
