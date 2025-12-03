import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../contexts/AuthContext';
import { ClipboardList, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  reclamosApi, 
  areasApi, 
  tiposReclamoApi, 
  prioridadesApi, 
  criticidadesApi,
  proyectosApi,
  type AreaResponse,
  type TipoReclamoResponse,
  type PrioridadResponse,
  type CriticidadResponse,
  type ProyectoResponse
} from '../services/api';

export const NewClaimForm: React.FC = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // Estados para los datos de los selectores
  const [proyectos, setProyectos] = useState<ProyectoResponse[]>([]);
  const [areas, setAreas] = useState<AreaResponse[]>([]);
  const [tiposReclamo, setTiposReclamo] = useState<TipoReclamoResponse[]>([]);
  const [prioridades, setPrioridades] = useState<PrioridadResponse[]>([]);
  const [criticidades, setCriticidades] = useState<CriticidadResponse[]>([]);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipoReclamo: '',
    prioridad: '',
    criticidad: '',
    area: '',
    proyectoId: '',
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingData(true);
        const [proyectosData, areasData, tiposData, prioridadesData, criticidadesData] = await Promise.all([
          proyectosApi.getAll(),
          areasApi.getAll(),
          tiposReclamoApi.getAll(),
          prioridadesApi.getAll(),
          criticidadesApi.getAll(),
        ]);

        setProyectos(proyectosData);
        setAreas(areasData);
        setTiposReclamo(tiposData);
        setPrioridades(prioridadesData);
        setCriticidades(criticidadesData);
      } catch (error) {
        console.error('Error cargando datos:', error);
        toast.error('Error al cargar los datos del formulario');
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.proyectoId) {
      toast.error('Debe seleccionar un proyecto');
      return;
    }

    try {
      setLoading(true);
      
      // En algunos backends 'area' no se permite en la creación inicial
      await reclamosApi.create({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        tipoReclamo: formData.tipoReclamo,
        prioridad: formData.prioridad,
        criticidad: formData.criticidad,
        // area: formData.area, // si el backend lo habilita, reactivar
        proyectoId: formData.proyectoId,
      });

      toast.success('¡Reclamo creado correctamente!');
      setSubmitted(true);
    } catch (error) {
      console.error('Error creando reclamo:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear el reclamo');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      titulo: '',
      descripcion: '',
      tipoReclamo: '',
      prioridad: '',
      criticidad: '',
      area: '',
      proyectoId: '',
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

  if (loadingData) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando datos del formulario...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (proyectos.length === 0) {
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
                value={formData.proyectoId}
                onValueChange={(value) => setFormData({ ...formData, proyectoId: value })}
                required
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {proyectos.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título del Reclamo *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
                disabled={loading}
                placeholder="Resuma el problema en pocas palabras"
                minLength={3}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción Detallada *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
                disabled={loading}
                placeholder="Describa el problema en detalle (mínimo 20 caracteres)..."
                rows={5}
                minLength={20}
                maxLength={2000}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área *</Label>
              <Select
                value={formData.area}
                onValueChange={(value) => setFormData({ ...formData, area: value })}
                required
                disabled={loading}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Reclamo *</Label>
                <Select
                  value={formData.tipoReclamo}
                  onValueChange={(value) => setFormData({ ...formData, tipoReclamo: value })}
                  required
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposReclamo.map((tipo) => (
                      <SelectItem key={tipo._id} value={tipo._id}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad *</Label>
                <Select
                  value={formData.prioridad}
                  onValueChange={(value) => setFormData({ ...formData, prioridad: value })}
                  required
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {prioridades.map((prioridad) => (
                      <SelectItem key={prioridad._id} value={prioridad._id}>
                        {prioridad.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="criticality">Nivel de Criticidad *</Label>
                <Select
                  value={formData.criticidad}
                  onValueChange={(value) => setFormData({ ...formData, criticidad: value })}
                  required
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {criticidades.map((criticidad) => (
                      <SelectItem key={criticidad._id} value={criticidad._id}>
                        {criticidad.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando reclamo...
                  </>
                ) : (
                  <>
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Registrar Reclamo
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
