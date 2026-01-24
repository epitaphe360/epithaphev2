// ========================================
// CMS Dashboard - Layout Principal
// ========================================

import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ToastProvider } from '../components/Toast';
import { useAuthStore } from '../store/authStore';
import { DashboardConfigProvider, defaultConfig, DashboardConfig } from '../config';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Image,
  FileEdit,
  LogOut,
  Menu,
  X,
  User,
  FolderTree,
  Users,
  Settings,
} from 'lucide-react';

interface DashboardLayoutProps {
  config?: Partial<DashboardConfig>;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ config, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const [location, setLocation] = useLocation();

  // ✅ Add data-admin-page attribute for CSS rules
  useEffect(() => {
    document.body.setAttribute('data-admin-page', 'true');
    return () => document.body.removeAttribute('data-admin-page');
  }, []);

  const handleLogout = () => {
    logout();
    setLocation('/admin/login');
  };

  if (!user) {
    setLocation('/admin/login');
    return null;
  }

  const mergedConfig = { ...defaultConfig, ...config };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Articles', href: '/admin/articles', icon: FileText },
    { name: 'Événements', href: '/admin/events', icon: Calendar },
    { name: 'Pages', href: '/admin/pages', icon: FileEdit },
    { name: 'Catégories', href: '/admin/categories', icon: FolderTree },
    { name: 'Médias', href: '/admin/media', icon: Image },
    { name: 'Utilisateurs', href: '/admin/users', icon: Users },
    { name: 'Paramètres', href: '/admin/settings/general', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location === '/admin';
    }
    return location.startsWith(path);
  };

  return (
    <DashboardConfigProvider config={mergedConfig}>
      <ToastProvider>
        <div className="min-h-screen bg-[#020617]">
          {/* Mobile sidebar backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-75 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
              fixed top-0 left-0 z-50 h-full w-64 bg-[#0B1121] border-r border-[#1E293B]
              transform transition-transform duration-300 ease-in-out lg:translate-x-0
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-[#1E293B]">
                <a href="/admin" onClick={(e) => { e.preventDefault(); setLocation('/admin'); }} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#E63946] to-[#F08080] rounded-lg flex items-center justify-center shadow-lg shadow-[#E63946]/30">
                    <span className="text-white font-bold text-xl">E</span>
                  </div>
                  <span className="font-bold text-xl text-white">Epitaphe</span>
                </a>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setLocation(item.href);
                        setSidebarOpen(false);
                      }}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${active
                          ? 'bg-[#E63946] text-white font-medium shadow-lg shadow-[#E63946]/20'
                          : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </a>
                  );
                })}
              </nav>

              {/* User info */}
              <div className="p-4 border-t border-[#1E293B]">
                <div className="flex items-center space-x-3 px-4 py-3">
                  <div className="w-10 h-10 bg-[#1E293B] rounded-full flex items-center justify-center border border-[#334155]">
                    <User className="w-5 h-5 text-[#E63946]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-[#1E293B] hover:text-white rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:pl-64">
            {/* Top header */}
            <header className="h-16 bg-[#0B1121] border-b border-[#1E293B] sticky top-0 z-30 backdrop-blur-xl bg-opacity-95">
              <div className="flex items-center justify-between h-full px-6">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-slate-400 hover:text-white transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>

                <div className="flex items-center space-x-4 ml-auto">
                  <span className="text-sm text-slate-400">
                    Bienvenue, <span className="font-medium text-white">{user?.name}</span>
                  </span>
                </div>
              </div>
            </header>

            {/* Page content */}
            <main className="min-h-screen">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </DashboardConfigProvider>
  );
};

export default DashboardLayout;
