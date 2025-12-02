import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, FolderKanban } from 'lucide-react';
import { toast } from 'sonner';
import { proyectosApi, tiposProyectoApi, reclamosApi, clientesApi, type ProyectoResponse, type TipoProyectoResponse, type ClienteResponse } from '../services/api';

export const ProjectsView: React.FC = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipoProyecto: '' as string | '',
    descripcion: '',
    clienteId: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [projects, setProjects] = useState<ProyectoResponse[]>([]);
  const [tiposProyecto, setTiposProyecto] = useState<TipoProyectoResponse[]>([]);
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [claims, setClaims] = useState<any[]>([]);

  // Cargar tipos de proyecto, clientes y lista inicial
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoadingList(true);
        const [tipos, clientesData] = await Promise.all([
          tiposProyectoApi.getAll(),
          clientesApi.getAll(),
        ]);
        setTiposProyecto(tipos);
        setClientes(clientesData);
      } catch (e) {
        console.error(e);
        toast.error('Error cargando datos iniciales');
      } finally {
        setLoadingList(false);
      }
    };
    loadAll();
  }, []);

  const refreshProjects = async () => {
    try {
      setLoadingList(true);
      // Admin ve todos los proyectos sin filtro
      const [proyectosData, reclamosData] = await Promise.all([
        proyectosApi.getAll(),
        reclamosApi.getAll(),
      ]);
      setProjects(proyectosData);
      setClaims(reclamosData);
    } catch (e) {
      console.error(e);
      toast.error('Error cargando datos');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenDialog = (projectId?: string) => {
    if (projectId) {
      const project = projects.find(p => p._id === projectId);
      if (project) {
        const clienteIdValue = typeof (project as any).clienteId === 'object' ? (project as any).clienteId?._id : (project as any).clienteId;
        setFormData({
          nombre: project.nombre,
          tipoProyecto: project.tipoProyecto?._id || '',
          descripcion: project.descripcion || '',
          clienteId: clienteIdValue || '',
        });
        setEditingProject(projectId);
      }
    } else {
      setFormData({ nombre: '', tipoProyecto: '', descripcion: '', clienteId: '' });
      setEditingProject(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setFormData({ nombre: '', tipoProyecto: '', descripcion: '', clienteId: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clienteId) {
      toast.error('Debe seleccionar un cliente');
      return;
    }

    try {
      setLoading(true);
      if (editingProject) {
        // TODO: implementar update cuando se necesite
        toast.success('Guardado (pendiente implementar actualización real)');
      } else {
        await proyectosApi.create({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          tipoProyecto: formData.tipoProyecto || undefined,
          clienteId: formData.clienteId,
        });
        toast.success('Proyecto creado correctamente');
      }
      await refreshProjects();
      handleCloseDialog();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Error al guardar el proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    // TODO: implementar delete real (requiere endpoint y confirmación)
    toast.error('Eliminar proyecto aún no está implementado');
  };

  const getProjectClaimsCount = (projectId: string) => {
    return claims.filter((c: any) => {
      const pid = typeof c.proyectoId === 'object' ? c.proyectoId?._id : c.proyectoId;
      return pid === projectId;
    }).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Gestión de Proyectos</h2>
          <p className="text-gray-600">Administre proyectos y asígnelos a clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Proyecto *</Label>
                <Input
                  id="name"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  placeholder="Ej: Sistema de Ventas"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Select
                  value={formData.clienteId}
                  onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
                  required
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente._id} value={cliente._id}>{cliente.empresa}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Proyecto *</Label>
                <Select
                  value={formData.tipoProyecto}
                  onValueChange={(value) => setFormData({ ...formData, tipoProyecto: value })}
                  required
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposProyecto.map(tp => (
                      <SelectItem key={tp._id} value={tp._id}>{tp.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  placeholder="Describa el proyecto..."
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {editingProject ? (loading ? 'Guardando...' : 'Guardar Cambios') : (loading ? 'Creando...' : 'Crear Proyecto')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loadingList ? (
        <Card>
          <CardContent className="py-8 text-center">Cargando proyectos...</CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FolderKanban className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-900 mb-2">No tiene proyectos registrados</p>
            <p className="text-gray-600 mb-6">
              Cree su primer proyecto para poder asociar reclamos
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Proyecto
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const claimsCount = getProjectClaimsCount(project._id);
            return (
              <Card key={project._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{project.nombre}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {project.tipoProyecto?.nombre || 'Sin tipo'}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FolderKanban className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">{project.descripcion}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Cliente:</span>
                      <span>{typeof (project as any).clienteId === 'object' ? (project as any).clienteId?.empresa : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {claimsCount} reclamos
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(project._id)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(project._id)}
                      disabled={claimsCount > 0}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>

                  {claimsCount > 0 && (
                    <p className="text-xs text-orange-600 font-medium">
                      No se puede eliminar porque tiene reclamos asociados
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
