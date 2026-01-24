// ========================================
// CMS Dashboard - UI Components: Sidebar Moderne
// ========================================

import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Files,
  Image,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  User,
  ChevronLeft,
  Home,
  BarChart3,
  MessageCircle,
  Users,
  Bell,
  Zap,
  Paintbrush,
} from 'lucide-react';
import { useDashboardConfig } from '../config';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  children?: Array<{ to: string; label: string }>;
  isCollapsed: boolean;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, badge, children, isCollapsed, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const hasChildren = children && children.length > 0;
  const currentIsActive = isActive || location === to || (hasChildren && children.some(child => location === child.to));

  if (hasChildren) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
            currentIsActive 
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={`transition-all duration-200 ${currentIsActive ? 'text-blue-400' : 'group-hover:text-white'}`}>
              {icon}
            </span>
            {!isCollapsed && (
              <span className="font-medium text-sm tracking-wide">{label}</span>
            )}
          </div>
          {!isCollapsed && (
            <span className="transition-transform duration-200 opacity-50 group-hover:opacity-100">
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
        </button>
        
        {isOpen && !isCollapsed && (
          <div className="ml-4 mt-2 mb-2 space-y-1 pl-3 border-l border-white/10">
            {children.map((child) => (
              <Link
                key={child.to}
                href={child.to}
                className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  location === child.to
                    ? 'text-blue-400 font-medium bg-blue-500/10'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={to}
      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group mb-1 ${
        currentIsActive 
          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
      title={isCollapsed ? label : ''}
    >
      <div className="flex items-center gap-3">
        <span className={`transition-all duration-200 ${currentIsActive ? 'text-blue-400' : 'group-hover:text-white'}`}>
          {icon}
        </span>
        {!isCollapsed && (
          <span className="font-medium text-sm tracking-wide">{label}</span>
        )}
      </div>
      {!isCollapsed && badge !== undefined && badge > 0 && (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/20">
          {badge}
        </span>
      )}
      {isCollapsed && badge !== undefined && badge > 0 && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></span>
      )}
    </Link>
  );
};

interface SidebarProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [location] = useLocation();
  const config = useDashboardConfig();

  const iconMap: Record<string, React.ReactNode> = {
    dashboard: <LayoutDashboard className="w-5 h-5" />,
    articles: <FileText className="w-5 h-5" />,
    events: <Calendar className="w-5 h-5" />,
    pages: <Files className="w-5 h-5" />,
    plasmic: <Paintbrush className="w-5 h-5" />,
    media: <Image className="w-5 h-5" />,
    settings: <Settings className="w-5 h-5" />,
    analytics: <BarChart3 className="w-5 h-5" />,
    comments: <MessageCircle className="w-5 h-5" />,
    users: <Users className="w-5 h-5" />,
    notifications: <Bell className="w-5 h-5" />,
  };

  // Navigation enrichie
  const navigationItems = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { 
      href: '/admin/content', 
      label: 'Contenu', 
      icon: 'articles',
      badge: 5,
      children: [
        { to: '/admin/articles', label: 'Articles' },
        { to: '/admin/pages', label: 'Pages' },
        { to: '/admin/events', label: 'Événements' },
      ]
    },
    { href: '/admin/visual-editor', label: 'Éditeur Visuel', icon: 'plasmic' },
    { href: '/admin/media', label: 'Médias', icon: 'media', badge: 12 },
    { href: '/admin/comments', label: 'Commentaires', icon: 'comments', badge: 3 },
    { href: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
    { href: '/admin/users', label: 'Utilisateurs', icon: 'users' },
    { href: '/admin/settings', label: 'Paramètres', icon: 'settings' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-[#0B1121] rounded-lg border border-[#1E293B] shadow-lg text-white hover:text-blue-400 transition-colors"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          flex flex-col flex-shrink-0
          bg-[#0B1121]
          border-r border-[#1E293B]
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          shadow-2xl shadow-blue-900/5
        `}
      >
        {/* Header Section */}
        <div className={`flex items-center justify-between h-20 p-6 border-b border-[#1E293B] ${isCollapsed ? 'px-4 justify-center' : ''}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-white font-bold text-lg tracking-tight truncate">{config.branding.name}</h1>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Premium Panel</p>
              </div>
            </div>
          )}
          {isCollapsed && (
             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
               <Zap className="w-6 h-6 text-white" />
             </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex p-1.5 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-white absolute right-[-12px] top-8 bg-[#0B1121] border border-[#1E293B] z-50`}
            title={isCollapsed ? 'Étendre le menu' : 'Réduire le menu'}
          >
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent ${isCollapsed ? 'px-3 py-6' : 'px-4 py-6'}`}>
          <div className="space-y-2">
            {!isCollapsed && (
              <div className="px-3 mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Menu Principal</p>
              </div>
            )}
            
            {navigationItems.map((item, index) => (
              <NavItem
                key={`nav-${item.href}-${index}`}
                to={item.href}
                icon={iconMap[item.icon] || <Files className="w-5 h-5" />}
                label={item.label}
                badge={item.badge}
                children={item.children}
                isCollapsed={isCollapsed}
                isActive={location === item.href}
              />
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className={`p-4 border-t border-[#1E293B] bg-[#020617]/50 ${isCollapsed ? 'px-2' : 'px-6'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-[#1E293B]/30 rounded-xl border border-[#1E293B]/50 hover:bg-[#1E293B]/50 transition-colors cursor-pointer group">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-[#0B1121]">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0B1121]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate group-hover:text-blue-400 transition-colors">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">Admin</p>
              </div>
            </div>
          )}
          
          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-2 p-2.5 text-rose-400 hover:text-white hover:bg-rose-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-rose-500/20 ${
              isCollapsed ? 'px-2' : ''
            }`}
            title={isCollapsed ? 'Déconnexion' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium text-sm">Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
