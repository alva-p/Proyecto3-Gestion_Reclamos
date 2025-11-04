import React, { ReactNode } from 'react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building2, 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  FolderKanban,
  Users,
  UserCircle,
  ClipboardList,
  User
} from 'lucide-react';
import { roleLabels } from '../utils/translations';
import { Separator } from './ui/separator';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    if (!user) return [];

    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    let roleItems = [];

    if (user.role === 'cliente') {
      roleItems = [
        { id: 'my-claims', label: 'Mis Reclamos', icon: FileText },
        { id: 'projects', label: 'Proyectos', icon: FolderKanban },
        { id: 'new-claim', label: 'Nuevo Reclamo', icon: ClipboardList },
      ];
    }

    if (user.role === 'empleado') {
      roleItems = [
        { id: 'all-claims', label: 'Reclamos', icon: FileText },
      ];
    }

    if (user.role === 'administrador') {
      roleItems = [
        { id: 'all-claims', label: 'Reclamos', icon: FileText },
        { id: 'requests', label: 'Solicitudes', icon: UserCircle },
        { id: 'users', label: 'Usuarios', icon: Users },
      ];
    }

    const profileItem = [
      { id: 'profile', label: 'Mi Perfil', icon: User },
    ];

    return [...baseItems, ...roleItems, ...profileItem];
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Gestión de Reclamos</h1>
                {user && (
                  <p className="text-sm text-gray-600">
                    {user.name} · {roleLabels[user.role]}
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            {menuItems.slice(0, -1).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <Separator className="my-4" />
            
            {/* Profile Item */}
            {menuItems.slice(-1).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
