import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { mockProjects, mockClaims } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, FolderKanban } from 'lucide-react';
import { projectTypeLabels } from '../utils/translations';
import { ProjectType } from '../types';
import { toast } from 'sonner@2.0.3';

export const ProjectsView: React.FC = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '' as ProjectType | '',
    description: '',
  });

  const userProjects = useMemo(() => {
    return mockProjects.filter(p => p.clientId === user?.id);
  }, [user?.id]);

  const handleOpenDialog = (projectId?: string) => {
    if (projectId) {
      const project = mockProjects.find(p => p.id === projectId);
      if (project) {
        setFormData({
          name: project.name,
          type: project.type,
          description: project.description,
        });
        setEditingProject(projectId);
      }
    } else {
      setFormData({ name: '', type: '', description: '' });
      setEditingProject(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setFormData({ name: '', type: '', description: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      toast.success('Proyecto actualizado correctamente');
    } else {
      toast.success('Proyecto creado correctamente');
    }
    
    handleCloseDialog();
  };

  const handleDelete = (projectId: string) => {
    const projectClaims = mockClaims.filter(c => c.projectId === projectId);
    
    if (projectClaims.length > 0) {
      toast.error('No se puede eliminar el proyecto porque tiene reclamos asociados');
      return;
    }
    
    toast.success('Proyecto eliminado correctamente');
  };

  const getProjectClaimsCount = (projectId: string) => {
    return mockClaims.filter(c => c.projectId === projectId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Mis Proyectos</h2>
          <p className="text-gray-600">Gestione sus proyectos y asocie reclamos</p>
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ej: Sistema de Ventas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Proyecto *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as ProjectType })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="consultoria">Consultoría</SelectItem>
                    <SelectItem value="soporte">Soporte</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Describa el proyecto..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProject ? 'Guardar Cambios' : 'Crear Proyecto'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {userProjects.length === 0 ? (
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
          {userProjects.map((project) => {
            const claimsCount = getProjectClaimsCount(project.id);
            return (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {projectTypeLabels[project.type]}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FolderKanban className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">{project.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {claimsCount} reclamos
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(project.id)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(project.id)}
                      disabled={claimsCount > 0}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>

                  {claimsCount > 0 && (
                    <p className="text-xs text-gray-500">
                      * No se puede eliminar porque tiene reclamos asociados
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
