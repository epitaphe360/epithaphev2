// ========================================
// CMS Dashboard — PageHeader Component
// Titre Playfair + breadcrumb + action bouton aligné droite
// ========================================

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  action,
  className = '',
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Breadcrumb */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 mb-3">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#CBD5E1' }} />}
              {crumb.href || crumb.onClick ? (
                <a
                  href={crumb.href || '#'}
                  onClick={crumb.onClick ? (e) => { e.preventDefault(); crumb.onClick!(); } : undefined}
                  className="text-xs font-medium transition-colors"
                  style={{ color: '#94A3B8' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#EC4899'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94A3B8'}
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-xs font-medium" style={{ color: '#64748B' }}>{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1
            className="text-2xl md:text-3xl text-gray-900 leading-tight truncate"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0 flex items-center gap-2">{action}</div>
        )}
      </div>

      {/* Accent line */}
      <div
        className="mt-4 h-px"
        style={{ background: 'linear-gradient(90deg, rgba(236,72,153,0.2) 0%, transparent 60%)' }}
      />
    </div>
  );
};
