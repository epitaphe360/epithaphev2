// ========================================
// Admin — Audit Logs (historique des actions)
// ========================================
import React, { useState } from 'react';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { ClipboardList, User, Clock, Tag } from 'lucide-react';

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

export function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');

  const { data, total, loading } = usePaginatedList<AuditLog>(
    '/api/admin/audit-logs',
    {
      ...(actionFilter !== 'all' ? { action: actionFilter } : {}),
      ...(search ? { search } : {}),
    }
  );

  const filtered = entityFilter !== 'all'
    ? data.filter((log) => log.entityType === entityFilter)
    : data;

  const entityTypes = Array.from(new Set(data.map((l) => l.entityType))).sort();

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#E63946]/10 rounded-xl">
          <ClipboardList className="w-6 h-6 text-[#E63946]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
          <p className="text-slate-400 text-sm">{total} action{total !== 1 ? 's' : ''} enregistrée{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <Input
          className="max-w-xs"
          placeholder="Rechercher par ID, entité..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 bg-[#0B1121] border border-[#1E293B] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]/40"
        >
          <option value="all">Toutes les actions</option>
          <option value="CREATE">Créations</option>
          <option value="UPDATE">Modifications</option>
          <option value="DELETE">Suppressions</option>
        </select>
        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="px-3 py-2 bg-[#0B1121] border border-[#1E293B] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]/40"
        >
          <option value="all">Tous les types</option>
          {entityTypes.map((t) => (
            <option key={t} value={t}>{ENTITY_LABELS[t] ?? t}</option>
          ))}
        </select>
      </div>

      {/* Liste des logs */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Aucun log trouvé</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="bg-[#0B1121] border border-[#1E293B] rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              {/* Badge action */}
              <Badge variant={ACTION_COLORS[log.action] ?? 'default'} className="shrink-0 w-28 justify-center">
                {ACTION_LABELS[log.action] ?? log.action}
              </Badge>

              {/* Entité */}
              <div className="flex items-center gap-2 text-sm text-slate-300 min-w-0">
                <Tag className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-medium">{ENTITY_LABELS[log.entityType] ?? log.entityType}</span>
                <span className="text-slate-500 font-mono text-xs truncate">#{log.entityId.slice(0, 8)}</span>
              </div>

              {/* Utilisateur */}
              {log.userId && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <User className="w-4 h-4 shrink-0" />
                  <span className="font-mono text-xs">{log.userId.slice(0, 8)}</span>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-slate-500 ml-auto shrink-0">
                <Clock className="w-4 h-4" />
                <span>{fmtDate(log.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AuditLogsPage;
