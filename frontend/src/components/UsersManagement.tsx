import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usuariosApi, UsuarioResponse, clientesApi, ClienteResponse, subareasApi, SubareaResponse, areasApi, AreaResponse } from '../services/api';
import { Alert, AlertDescription } from './ui/alert';

export const UsersManagement: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  const [subareas, setSubareas] = useState<SubareaResponse[]>([]);
  const [areas, setAreas] = useState<AreaResponse[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    rol: '' as 'EMPLEADO' | 'ADMIN' | '',
    subareaId: '',
    puesto: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usuariosData, clientesData, subareasData, areasData] = await Promise.all([
        usuariosApi.getAll(),
        clientesApi.getAll(),
        subareasApi.getAll(),
        areasApi.getAll(),
      ]);
      setUsuarios(usuariosData);
      setClientes(clientesData);
      setSubareas(subareasData);
      setAreas(areasData);
    } catch (error: any) {
      toast.error('Error al cargar datos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      nombre: '',
      correo: '',
      contraseña: '',
      rol: '',
      subareaId: '',
      puesto: '',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      nombre: '',
      correo: '',
      contraseña: '',
      rol: '',
      subareaId: '',
      puesto: '',
    });
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'La contraseña debe contener al menos un carácter especial (!@#$%^&*)';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Validar contraseña
      const passwordError = validatePassword(formData.contraseña);
      if (passwordError) {
        toast.error(passwordError);
        setIsSaving(false);
        return;
      }

      // Verificar que el email no exista
      const emailExists = usuarios.some(u => u.correo === formData.correo);
      if (emailExists) {
        toast.error('El correo electrónico ya está registrado');
        setIsSaving(false);
        return;
      }

      if (formData.rol === 'EMPLEADO') {
        // Validar que tenga subárea seleccionada
        if (!formData.subareaId) {
          toast.error('Debe seleccionar una subárea para el empleado');
          setIsSaving(false);
          return;
        }

        await usuariosApi.createEmpleado({
          nombre: formData.nombre,
          correo: formData.correo,
          contraseña: formData.contraseña,
          subareaId: formData.subareaId,
          puesto: formData.puesto || 'Empleado',
        });
        toast.success('Empleado registrado correctamente');
      } else if (formData.rol === 'ADMIN') {
        await usuariosApi.createAdmin({
          nombre: formData.nombre,
          correo: formData.correo,
          contraseña: formData.contraseña,
        });
        toast.success('Administrador registrado correctamente');
      }

      handleCloseDialog();
      loadData(); // Recargar lista
    } catch (error: any) {
      toast.error('Error al crear usuario: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleBadge = (rolName: string) => {
    const normalized = rolName.toLowerCase();
    const colors: Record<string, string> = {
      cliente: 'bg-blue-100 text-blue-800',
      empleado: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800',
    };

    const labels: Record<string, string> = {
      cliente: 'Cliente',
      empleado: 'Empleado',
      admin: 'Administrador',
    };

    return (
      <Badge className={colors[normalized] || 'bg-gray-100 text-gray-800'}>
        {labels[normalized] || rolName}
      </Badge>
    );
  };

  const getRoleName = (rol: UsuarioResponse['rol']): string => {
    if (typeof rol === 'string') return rol;
    return rol.nombre;
  };

  const internalUsers = usuarios.filter(u => {
    const rolName = getRoleName(u.rol).toLowerCase();
    return rolName === 'empleado' || rolName === 'admin';
  });

  const clientUsers = clientes;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Gestión de Usuarios</h2>
          <p className="text-gray-600">Administre usuarios del sistema (Empleados y Administradores)</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={handleOpenDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Solo puede registrar Empleados o Administradores. Los clientes se registran mediante solicitudes.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  placeholder="Juan Pérez"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico *</Label>
                <Input
                  id="correo"
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  required
                  placeholder="correo@empresa.com"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contraseña">Contraseña *</Label>
                <Input
                  id="contraseña"
                  type="password"
                  value={formData.contraseña}
                  onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                  required
                  placeholder="Mínimo 8 caracteres"
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500">
                  Debe contener: 8+ caracteres, mayúscula, minúscula, número y carácter especial (!@#$%^&*)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rol">Rol *</Label>
                <Select
                  value={formData.rol}
                  onValueChange={(value: 'EMPLEADO' | 'ADMIN') => 
                    setFormData({ ...formData, rol: value, subareaId: value === 'ADMIN' ? '' : formData.subareaId })
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLEADO">Empleado</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.rol === 'EMPLEADO' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subareaId">Subárea * (solo una)</Label>
                    <Select
                      value={formData.subareaId}
                      onValueChange={(value: string) => setFormData({ ...formData, subareaId: value })}
                      disabled={isSaving}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar subárea" />
                      </SelectTrigger>
                      <SelectContent>
                        {subareas.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-gray-500">
                            No hay subáreas disponibles
                          </div>
                        ) : (
                          subareas.map(sub => {
                            const areaName = typeof sub.area === 'object' ? sub.area.nombre : 
                              areas.find(a => a._id === sub.area)?.nombre || 'Sin área';
                            return (
                              <SelectItem key={sub._id} value={sub._id}>
                                {areaName} - {sub.nombre}
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      El empleado debe pertenecer a una única subárea
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="puesto">Puesto (Opcional)</Label>
                    <Input
                      id="puesto"
                      value={formData.puesto}
                      onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                      placeholder="Ej: Desarrollador Senior"
                      disabled={isSaving}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Crear Usuario'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Internal Users */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Internos ({internalUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {internalUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No hay usuarios internos registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  internalUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.nombre}</TableCell>
                      <TableCell>{user.correo}</TableCell>
                      <TableCell>{getRoleBadge(getRoleName(user.rol))}</TableCell>
                      <TableCell>
                        <Badge className={user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {user.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-AR') : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Client Users */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes Registrados ({clientUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No hay clientes registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  clientUsers.map((cliente) => (
                    <TableRow key={cliente._id}>
                      <TableCell className="font-medium">{cliente.empresa}</TableCell>
                      <TableCell>
                        {typeof cliente.usuarioId === 'object' && cliente.usuarioId?.correo
                          ? cliente.usuarioId.correo
                          : '-'}
                      </TableCell>
                      <TableCell>{cliente.telefono || '-'}</TableCell>
                      <TableCell>{cliente.direccion || '-'}</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
