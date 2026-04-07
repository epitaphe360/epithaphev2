/**
 * Espace Client — ClientPageHeader
 * Breadcrumb + titre + sous-titre cohérents sur toutes les pages du portail client
 */
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ClientPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
}

export function ClientPageHeader({ title, subtitle, breadcrumbs, action }: ClientPageHeaderProps) {
  return (
    <div className="mb-10">
      {/* Breadcrumb */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 mb-3">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />}
              {crumb.href ? (
                <Link href={crumb.href}>
                  <span className="text-sm text-gray-400 hover:text-[#C8A96E] transition-colors cursor-pointer">
                    {crumb.label}
                  </span>
                </Link>
              ) : (
                <span className="text-sm text-gray-600">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1.5 text-sm">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {/* Accent line gold */}
      <div
        className="mt-4 h-px"
        style={{ background: "linear-gradient(90deg, rgba(200,169,110,0.35) 0%, transparent 60%)" }}
      />
    </div>
  );
}
