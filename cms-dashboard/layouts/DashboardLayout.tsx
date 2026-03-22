// ========================================
// CMS Dashboard — Layout Premium
// Skill: UI/UX Pro Max → OLED Dark + Fira Sans
// Palette: #020617 bg · #0F172A sidebar · #EC4899 magenta brand
// Typography: Fira Sans (precision data) + Cormorant Garamond (headings)
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
  Briefcase,
  Building2,
  BookOpen,
  MessageSquare,
  Target,
  Mail,
  Phone,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface DashboardLayoutProps {
  config?: Partial<DashboardConfig>;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ config, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const [location, setLocation] = useLocation();

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
    { name: 'Dashboard',     href: '/admin',                    icon: LayoutDashboard, group: 'main' },
    { name: 'Articles',      href: '/admin/articles',           icon: FileText,        group: 'content' },
    { name: 'Événements',    href: '/admin/events',             icon: Calendar,        group: 'content' },
    { name: 'Pages',         href: '/admin/pages',              icon: FileEdit,        group: 'content' },
    { name: 'Services',      href: '/admin/services',           icon: Briefcase,       group: 'content' },
    { name: 'Références',    href: '/admin/references',         icon: Building2,       group: 'content' },
    { name: 'Études de cas', href: '/admin/case-studies',       icon: BookOpen,        group: 'content' },
    { name: 'Témoignages',   href: '/admin/testimonials',       icon: MessageSquare,   group: 'content' },
    { name: 'Équipe',        href: '/admin/team',               icon: Users,           group: 'content' },
    { name: 'Leads',         href: '/admin/leads',              icon: Target,          group: 'crm' },
    { name: 'Newsletter',    href: '/admin/newsletter',         icon: Mail,            group: 'crm' },
    { name: 'Contacts',      href: '/admin/contacts',           icon: Phone,           group: 'crm' },
    { name: 'Catégories',    href: '/admin/categories',         icon: FolderTree,      group: 'settings' },
    { name: 'Médias',        href: '/admin/media',              icon: Image,           group: 'settings' },
    { name: 'Utilisateurs',  href: '/admin/users',              icon: User,            group: 'settings' },
    { name: 'Paramètres',    href: '/admin/settings/general',   icon: Settings,        group: 'settings' },
  ];

  const groups = [
    { id: 'main',     label: null },
    { id: 'content',  label: 'Contenu' },
    { id: 'crm',      label: 'CRM' },
    { id: 'settings', label: 'Configuration' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location === '/admin';
    return location.startsWith(path);
  };

  return (
    <DashboardConfigProvider config={mergedConfig}>
      <ToastProvider>
        {/* Skill: Fira Sans for dashboard precision typography */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap');
          [data-admin-page="true"] { font-family: 'Fira Sans', system-ui, sans-serif !important; }
          [data-admin-page="true"] code, [data-admin-page="true"] .font-mono { font-family: 'Fira Code', monospace !important; }
        `}</style>

        <div className="min-h-screen" style={{ background: '#020617' }}>
          {/* Mobile sidebar backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
              style={{ background: 'rgba(0,0,0,0.75)' }}
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <aside
            className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{
              background: 'linear-gradient(180deg, #0D0F1E 0%, #0A0C19 100%)',
              borderRight: '1px solid rgba(236,72,153,0.12)',
              boxShadow: '4px 0 32px rgba(0,0,0,0.6), 1px 0 0 rgba(236,72,153,0.08)',
            }}
          >
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-6" style={{ borderBottom: '1px solid rgba(236,72,153,0.1)' }}>
              <a
                href="/admin"
                onClick={(e) => { e.preventDefault(); setLocation('/admin'); }}
                className="flex items-center gap-2.5 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm transition-shadow group-hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #EC4899, #be185d)',
                    boxShadow: '0 0 16px rgba(236,72,153,0.4)',
                  }}
                >
                  E
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-white font-bold text-base tracking-tight">Epitaphe</span>
                  <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: 'rgba(236,72,153,0.75)' }}>360 CMS</span>
                </div>
              </a>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {groups.map(({ id, label }) => {
                const items = navigation.filter(n => n.group === id);
                return (
                  <div key={id} className={label ? 'mt-5' : ''}>
                    {label && (
                      <p
                        className="px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase mb-1"
                        style={{ color: 'rgba(255,255,255,0.25)' }}
                      >
                        {label}
                      </p>
                    )}
                    {items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={(e) => { e.preventDefault(); setLocation(item.href); setSidebarOpen(false); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden"
                          style={active ? {
                            background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(190,24,93,0.15))',
                            borderLeft: '2px solid #EC4899',
                            color: '#FFFFFF',
                            boxShadow: 'inset 0 0 20px rgba(236,72,153,0.08)',
                          } : {
                            color: 'rgba(255,255,255,0.45)',
                            borderLeft: '2px solid transparent',
                          }}
                          onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}}
                          onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}}
                        >
                          <Icon
                            className="w-[17px] h-[17px] flex-shrink-0 transition-colors"
                            style={{ color: active ? '#EC4899' : 'currentColor' }}
                          />
                          <span className="text-sm font-medium truncate flex-1">{item.name}</span>
                          {active && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#EC4899' }} />}
                        </a>
                      );
                    })}
                  </div>
                );
              })}
            </nav>

            {/* User footer */}
            <div className="p-3" style={{ borderTop: '1px solid rgba(236,72,153,0.1)' }}>
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(236,72,153,0.12)',
                    border: '1px solid rgba(236,72,153,0.25)',
                  }}
                >
                  <User className="w-4 h-4" style={{ color: '#EC4899' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F87171'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────────── */}
          <div className="lg:pl-64">
            {/* Top header */}
            <header
              className="h-16 sticky top-0 z-30"
              style={{
                background: 'rgba(2,6,23,0.88)',
                borderBottom: '1px solid rgba(236,72,153,0.1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center justify-between h-full px-6">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden transition-colors"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 ml-auto">
                  {/* Live indicator */}
                  <div className="hidden sm:flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: '#22C55E', boxShadow: '0 0 6px #22C55E' }}
                    />
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Production</span>
                  </div>

                  <div
                    className="h-5 w-px"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  />

                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: '#EC4899' }} />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Bienvenue, <span className="font-semibold text-white">{user?.name}</span>
                    </span>
                  </div>
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
