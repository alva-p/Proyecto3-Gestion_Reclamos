import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, setAuthToken, getAuthToken } from '../services/api';

interface User {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  empleadoId?: string;
  clienteId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (correo: string, contraseña: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si ya hay una sesión al cargar
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Intentar obtener datos del usuario desde el token o hacer una petición al backend
      // Por ahora, simplemente marcamos como autenticado si hay token
      // En una implementación más robusta, validarías el token con el backend
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.sub,
          correo: payload.correo,
          nombre: payload.nombre || payload.correo.split('@')[0],
          rol: payload.rol,
        });
      } catch (error) {
        // Token inválido, limpiar
        localStorage.removeItem('auth_token');
        setAuthToken(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (correo: string, contraseña: string): Promise<void> => {
    try {
      const response = await authApi.login({ correo, contraseña });
      setAuthToken(response.accessToken);
      setUser({
        id: response.usuario.id,
        nombre: response.usuario.nombre,
        correo: response.usuario.correo,
        rol: response.usuario.rol.toLowerCase(), // Normalizar a minúsculas
        empleadoId: response.usuario.empleadoId,
        clienteId: response.usuario.clienteId,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
