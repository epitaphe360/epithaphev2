// ========================================
// Admin — Audit Logs (historique des actions)
// ========================================
import React, { useState } from 'react';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { ClipboardList, User, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

interface AuditLog {
  id: string;
  userId: string | null;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: string;
  entityId: string;
  changes: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

const ACTION_COLORS: Record<string, 'success' | 'warning' | 'danger'> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'danger',
};

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
};

const ENTITY_LABELS: Record<string, string> = {
  article: 'Article',
  event: 'Événement',
  page: 'Page',
  service: 'Service',
  reference: 'Référence',
  case_study: 'Étude de cas',
  testimonial: 'Témoignage',
  team_member: 'Membre équipe',
  category: 'Catégorie',
  user: 'Utilisateur',
  media: 'Média',
  navigation: 'Navigation',
  settings: 'Paramètres',
};

function fmtDate(d: string) {
  return new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const PAGE_SIZE = 50;

export function AuditLogsPage() {
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  const {
    items, total, loading, page, setPage, setSearch, setFilter,
  } = usePaginatedList<AuditLog>({
    endpoint: '/admin/audit-logs',
    limit: PAGE_SIZE,
    defaultParams: {},
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handleActionChange(value: string) {
    setActionFilter(value);
    setFilter('action', value === 'all' ? undefined : value);
    setPage(0);
  }

  function handleEntityChange(value: string) {
    setEntityFilter(value);
    setFilter('entityType', value === 'all' ? undefined : value);
    setPage(0);
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#E63946]/10 rounded-xl">
          <ClipboardList className="w-6 h-6 text-[#E63946]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-500 text-sm">{total} action{total !== 1 ? 's' : ''} enregistrée{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <Input
          className="max-w-xs"
          placeholder="Rechercher par ID, entité..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={actionFilter}
          onChange={(e) => handleActionChange(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]/40"
        >
          <option value="all">Toutes les actions</option>
          <option value="CREATE">Créations</option>
          <option value="UPDATE">Modifications</option>
          <option value="DELETE">Suppressions</option>
        </select>
        <select
          value={entityFilter}
          onChange={(e) => handleEntityChange(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]/40"
        >
          <option value="all">Tous les types</option>
          {Object.entries(ENTITY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Liste des logs */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Aucun log trouvé</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((log) => (
            <div
              key={log.id}
              className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <Badge variant={ACTION_COLORS[log.action] ?? 'default'} className="shrink-0 w-28 justify-center">
                {ACTION_LABELS[log.action] ?? log.action}
              </Badge>

              <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                <Tag className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="font-medium">{ENTITY_LABELS[log.entityType] ?? log.entityType}</span>
                <span className="text-gray-500 font-mono text-xs truncate">#{String(log.entityId).slice(0, 8)}</span>
              </div>

              {log.userId && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4 shrink-0" />
                  <span className="font-mono text-xs">{String(log.userId).slice(0, 8)}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto shrink-0">
                <Clock className="w-4 h-4" />
                <span>{fmtDate(log.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default AuditLogsPage;
