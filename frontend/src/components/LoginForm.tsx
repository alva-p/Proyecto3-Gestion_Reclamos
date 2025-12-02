import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Building2 } from 'lucide-react';

interface LoginFormProps {
  onRegisterClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar sesión';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-indigo-900 mb-2">Sistema de Gestión de Reclamos</h1>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@empresa.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-center text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={onRegisterClick}
                  className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                >
                  Solicitar acceso
                </button>
              </p>
              
              {import.meta.env.DEV && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Credenciales de prueba:</p>
                  <div className="space-y-1 text-xs">
                    <p><strong>Admin:</strong> admin@sistema.com / Admin123!</p>
                    <p><strong>Cliente:</strong> cliente.demo@sistema.com / Cliente123!</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
