import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockProjects } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { ClipboardList, CheckCircle2 } from 'lucide-react';
import { ClaimType, ClaimPriority } from '../types';
import { toast } from 'sonner@2.0.3';

export const NewClaimForm: React.FC = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as ClaimType | '',
    priority: '' as ClaimPriority | '',
    criticality: '' as ClaimPriority | '',
    projectId: '',
  });

  const userProjects = useMemo(() => {
    return mockProjects.filter(p => p.clientId === user?.id);
  }, [user?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectId) {
      toast.error('Debe seleccionar un proyecto');
      return;
    }

    console.log('Nuevo reclamo:', formData);
    toast.success('Reclamo creado correctamente');
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      title: '',
      description: '',
      type: '',
      priority: '',
      criticality: '',
      projectId: '',
    });
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h2 className="text-green-900 mb-3">¡Reclamo Creado Exitosamente!</h2>
              <p className="text-gray-600 mb-6">
                Su reclamo ha sido registrado y notificado al equipo correspondiente. 
                Recibirá actualizaciones por correo electrónico.
              </p>
              <div className="space-y-3">
                <Button onClick={handleReset} className="w-full">
                  Crear Otro Reclamo
                </Button>
                <Button variant="outline" onClick={handleReset} className="w-full">
                  Ver Mis Reclamos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userProjects.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <ClipboardList className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h2 className="text-gray-900 mb-2">No tiene proyectos registrados</h2>
            <p className="text-gray-600 mb-6">
              Debe crear al menos un proyecto antes de registrar un reclamo
            </p>
            <Button>Ir a Proyectos</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Nuevo Reclamo</h2>
        <p className="text-gray-600">Complete el formulario para registrar un nuevo reclamo</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Reclamo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project">Proyecto Asociado *</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {userProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título del Reclamo *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Resuma el problema en pocas palabras"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción Detallada *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Describa el problema en detalle..."
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Reclamo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as ClaimType })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="mejora">Mejora</SelectItem>
                    <SelectItem value="consulta">Consulta</SelectItem>
                    <SelectItem value="incidente">Incidente</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as ClaimPriority })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="critica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="criticality">Nivel de Criticidad *</Label>
                <Select
                  value={formData.criticality}
                  onValueChange={(value) => setFormData({ ...formData, criticality: value as ClaimPriority })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="critica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                <ClipboardList className="w-4 h-4 mr-2" />
                Registrar Reclamo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
