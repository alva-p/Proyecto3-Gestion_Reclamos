import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Building, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { roleLabels } from '../utils/translations';
import { toast } from 'sonner@2.0.3';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    company: user?.company || '',
  });

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Perfil actualizado correctamente');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      phone: user.phone || '',
      address: user.address || '',
      company: user.company || '',
    });
    setIsEditing(false);
  };

  const getRoleBadge = () => {
    const colors = {
      cliente: 'bg-blue-100 text-blue-800',
      empleado: 'bg-green-100 text-green-800',
      administrador: 'bg-purple-100 text-purple-800',
    };

    return (
      <Badge className={colors[user.role]}>
        {roleLabels[user.role]}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-gray-900 mb-1">Mi Perfil</h2>
        <p className="text-gray-600">Información de su cuenta</p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-2">{getRoleBadge()}</div>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                Editar Perfil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {user.role === 'cliente' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Guardar Cambios
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Correo Electrónico</p>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Rol</p>
                    <p className="text-gray-900">{roleLabels[user.role]}</p>
                  </div>
                </div>

                {user.role !== 'cliente' && user.area && (
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Área</p>
                      <p className="text-gray-900">{user.area}</p>
                    </div>
                  </div>
                )}

                {user.role === 'cliente' && (
                  <>
                    {user.company && (
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Empresa</p>
                          <p className="text-gray-900">{user.company}</p>
                        </div>
                      </div>
                    )}

                    {user.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Teléfono</p>
                          <p className="text-gray-900">{user.phone}</p>
                        </div>
                      </div>
                    )}

                    {user.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Dirección</p>
                          <p className="text-gray-900">{user.address}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Registro</p>
                    <p className="text-gray-900">
                      {user.createdAt.toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Contraseña</p>
              <p className="text-gray-900 mb-3">••••••••</p>
              <Button variant="outline" size="sm">
                Cambiar Contraseña
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
