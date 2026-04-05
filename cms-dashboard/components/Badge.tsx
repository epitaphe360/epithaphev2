// ========================================
// CMS Dashboard - UI Components: Badge
// ========================================

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantStyles = {
  default: 'bg-slate-800 text-slate-300',
  primary: 'bg-[#EC4899]/15 text-[#EC4899]',
  secondary: 'bg-slate-700 text-slate-200',
  success: 'bg-green-900/40 text-green-400',
  warning: 'bg-yellow-900/40 text-yellow-400',
  danger: 'bg-red-900/40 text-red-400',
  info: 'bg-blue-900/40 text-blue-400',
};

const dotColors = {
  default: 'bg-slate-500',
  primary: 'bg-[#EC4899]',
  secondary: 'bg-slate-400',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-sm px-3 py-1',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

// Status Badge avec mapping automatique
interface StatusBadgeProps {
  status: string;
  statusMap?: Record<string, { label: string; variant: BadgeProps['variant'] }>;
}

const defaultStatusMap: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
  DRAFT: { label: 'Brouillon', variant: 'default' },
  PUBLISHED: { label: 'Publié', variant: 'success' },
  ARCHIVED: { label: 'Archivé', variant: 'warning' },
  CANCELLED: { label: 'Annulé', variant: 'danger' },
  PENDING: { label: 'En attente', variant: 'info' },
  ACTIVE: { label: 'Actif', variant: 'success' },
  INACTIVE: { label: 'Inactif', variant: 'danger' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  statusMap = defaultStatusMap,
}) => {
  const config = statusMap[status] || { label: status, variant: 'default' as const };
  
  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
};

// Count Badge (pour les notifications)
interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: 'primary' | 'danger';
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  variant = 'danger',
}) => {
  if (count === 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={`
        inline-flex items-center justify-center min-w-5 h-5 text-xs font-bold text-white rounded-full px-1.5
        ${variant === 'danger' ? 'bg-red-500' : 'bg-[#EC4899]'}
      `}
    >
      {displayCount}
    </span>
  );
};

export default Badge;
