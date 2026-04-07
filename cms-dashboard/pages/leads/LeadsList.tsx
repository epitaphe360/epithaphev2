// ========================================
// Module Leads / Briefs — Liste + Détail
// ========================================
import React, { useState } from 'react';
import { Eye, Trash2, X, CheckSquare } from 'lucide-react';
import { ListPage, Column, ListPageAction } from '../../components/ListPage';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { getApi } from '../../lib/api';
import { Badge } from '../../components/Badge';
import { toast } from '../../lib/toast';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  phone: string | null;
  projectType: string | null;
  hubInterest: string | null;
  budget: string | null;
  description: string | null;
  status: string;
  priority: string | null;
  internalNotes: string | null;
  assignedTo: string | null;
  createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; variant: 'success' | 'warning' | 'default' | 'danger' }> = {
  new:        { label: 'Nouveau',     variant: 'warning' },
  contacted:  { label: 'Contacté',   variant: 'default' },
  in_progress:{ label: 'En cours',   variant: 'default' },
  quoted:     { label: 'Devisé',     variant: 'default' },
  won:        { label: 'Gagné',      variant: 'success' },
  lost:       { label: 'Perdu',      variant: 'danger' },
};

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  low:    { label: 'Basse',   color: '#64748B' },
  medium: { label: 'Moyenne', color: '#C8A96E' },
  high:   { label: 'Haute',   color: '#EF4444' },
};

function LeadDetailModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.internalNotes ?? '');
  const [assignedTo, setAssignedTo] = useState(lead.assignedTo ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try { await getApi().put(`/admin/leads/${lead.id}`, { status, internalNotes: notes, assignedTo }); onClose(); }
    catch { toast.error('Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Lead — {lead.firstName} {lead.lastName}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500 hover:text-gray-700" /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Info principale */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <InfoRow label="Email"     value={lead.email} />
            <InfoRow label="Téléphone" value={lead.phone ?? '—'} />
            <InfoRow label="Entreprise" value={lead.company ?? '—'} />
            <InfoRow label="Type projet" value={lead.projectType ?? '—'} />
            <InfoRow label="Hub intérêt" value={lead.hubInterest ?? '—'} />
            <InfoRow label="Budget" value={lead.budget ?? '—'} />
            <InfoRow label="Reçu le" value={new Date(lead.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} />
          </div>

          {lead.description && (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Description du projet</p>
              <p className="text-gray-600 text-sm leading-relaxed">{lead.description}</p>
            </div>
          )}

          {/* Gestion */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Statut</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]">
              {Object.entries(STATUS_MAP).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Assigné à</label>
            <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Nom du commercial..."
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Notes internes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm resize-none focus:outline-none focus:border-[#C8A96E]" />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:text-gray-700 text-sm transition-colors">Fermer</button>
          <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-xl bg-[#C8A96E] text-black font-semibold hover:bg-[#DFC28F] text-sm transition-colors disabled:opacity-60">
            {saving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
}

export function LeadsList() {
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const { items, total, loading, error, page, limit, setPage, setSearch, setFilter, refetch } =
    usePaginatedList<Lead>({ endpoint: '/admin/leads', limit: 20 });

  const toggleSelect = (id: string) =>
    setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const toggleAll = () =>
    setSelected(selected.size === items.length ? new Set() : new Set(items.map((i) => i.id)));

  const bulkStatus = async (status: string) => {
    setBulkLoading(true);
    try {
      await Promise.all(Array.from(selected).map((id) => getApi().put(`/admin/leads/${id}`, { status })));
      setSelected(new Set()); refetch();
    } catch { toast.error('Erreur action groupée'); }
    finally { setBulkLoading(false); }
  };

  const bulkDelete = async () => {
    if (!confirm(`Supprimer ${selected.size} lead(s) ?`)) return;
    setBulkLoading(true);
    try {
      await Promise.all(Array.from(selected).map((id) => getApi().delete(`/admin/leads/${id}`)));
      setSelected(new Set()); refetch();
    } catch { toast.error('Erreur suppression'); }
    finally { setBulkLoading(false); }
  };

  const handleDelete = async (item: Lead) => {
    if (!confirm(`Supprimer le lead de "${item.firstName} ${item.lastName}" ?`)) return;
    try { await getApi().delete(`/admin/leads/${item.id}`); refetch(); }
    catch { toast.error('Erreur lors de la suppression'); }
  };

  const columns: Column<Lead>[] = [
    {
      key: 'select' as any,
      label: '',
      width: '48px',
      render: (l) => (
        <input type="checkbox" checked={selected.has(l.id)} onChange={() => toggleSelect(l.id)}
          className="w-4 h-4 rounded accent-[#EC4899]" onClick={(e) => e.stopPropagation()} />
      ),
    },
    {
      key: 'firstName',
      label: 'Contact',
      render: (l) => (
        <div>
          <p className="font-medium text-gray-900">{l.firstName} {l.lastName}</p>
          <p className="text-xs text-gray-500">{l.email}</p>
        </div>
      ),
    },
    {
      key: 'company',
      label: 'Entreprise',
      render: (l) => <span className="text-gray-600">{l.company ?? '—'}</span>,
    },
    {
      key: 'projectType',
      label: 'Type',
      width: '140px',
      render: (l) => <span className="text-gray-500 text-sm">{l.projectType ?? l.hubInterest ?? '—'}</span>,
    },
    {
      key: 'budget',
      label: 'Budget',
      width: '100px',
      render: (l) => <span className="text-gray-500 text-sm">{l.budget ?? '—'}</span>,
    },
    {
      key: 'status',
      label: 'Statut',
      width: '120px',
      render: (l) => {
        const s = STATUS_MAP[l.status] ?? STATUS_MAP.new;
        return <Badge variant={s.variant}>{s.label}</Badge>;
      },
    },
    {
      key: 'createdAt',
      label: 'Reçu le',
      width: '120px',
      render: (l) => <span className="text-gray-500 text-xs">{new Date(l.createdAt).toLocaleDateString('fr-FR')}</span>,
    },
  ];

  const actions: ListPageAction<Lead>[] = [
    { label: 'Voir',      icon: <Eye className="w-4 h-4" />,    onClick: (l) => setViewLead(l) },
    { label: 'Supprimer', icon: <Trash2 className="w-4 h-4" />, onClick: handleDelete, variant: 'danger' },
  ];

  const statusFilter = (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        onChange={(e) => setFilter('status', e.target.value || undefined)}
        className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none"
      >
        <option value="">Tous les statuts</option>
        {Object.entries(STATUS_MAP).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
      </select>

      {selected.size > 0 && (
        <div className="flex items-center gap-2 bg-gray-100 border border-[#EC4899]/30 rounded-xl px-3 py-1.5">
          <span className="text-xs text-gray-500">{selected.size} sélectionné(s)</span>
          <button onClick={() => bulkStatus('contacted')} disabled={bulkLoading}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Contacté</button>
          <button onClick={() => bulkStatus('won')} disabled={bulkLoading}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Gagné</button>
          <button onClick={() => bulkStatus('lost')} disabled={bulkLoading}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors">Perdu</button>
          <button onClick={bulkDelete} disabled={bulkLoading}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors">Supprimer</button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {items.length > 0 && (
        <div className="px-6 pt-4">
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
            <input type="checkbox" checked={selected.size === items.length && items.length > 0}
              onChange={toggleAll} className="w-4 h-4 rounded accent-[#EC4899]" />
            Tout sélectionner
          </label>
        </div>
      )}
      <ListPage
        title="Leads & Briefs"
        subtitle="Demandes de projet reçues via le formulaire de contact"
        columns={columns}
        items={items}
        total={total}
        loading={loading}
        error={error}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onSearch={setSearch}
        actions={actions}
        filters={statusFilter}
        emptyLabel="Aucun lead reçu pour l'instant."
        onRefresh={refetch}
      />
      {viewLead && <LeadDetailModal lead={viewLead} onClose={() => { setViewLead(null); refetch(); }} />}
    </>
  );
}
