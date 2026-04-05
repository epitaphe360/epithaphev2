// ========================================
// Module Newsletter — Liste
// ========================================
import React, { useState } from 'react';
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { ListPage, Column, ListPageAction } from '../../components/ListPage';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { getApi } from '../../lib/api';
import { Badge } from '../../components/Badge';

interface Subscriber {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: string;
  source: string | null;
  createdAt: string;
}

const STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'default'> = {
  active:        'success',
  unsubscribed:  'default',
  bounced:       'warning',
};

export function NewsletterList() {
  const { items, total, loading, error, page, limit, setPage, setSearch, setFilter, refetch } =
    usePaginatedList<Subscriber>({ endpoint: '/admin/newsletter', limit: 30 });

  const handleDelete = async (item: Subscriber) => {
    if (!confirm(`Supprimer "${item.email}" de la liste ?`)) return;
    try { await getApi().delete(`/admin/newsletter/${item.id}`); refetch(); }
    catch { alert('Erreur lors de la suppression'); }
  };

  const toggleStatus = async (item: Subscriber) => {
    const next = item.status === 'active' ? 'unsubscribed' : 'active';
    try { await getApi().put(`/admin/newsletter/${item.id}`, { status: next }); refetch(); }
    catch { alert('Erreur'); }
  };

  const columns: Column<Subscriber>[] = [
    {
      key: 'email',
      label: 'Email',
      render: (s) => (
        <div>
          <p className="text-white">{s.email}</p>
          {(s.firstName || s.lastName) && (
            <p className="text-xs text-slate-500">{[s.firstName, s.lastName].filter(Boolean).join(' ')}</p>
          )}
        </div>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      width: '130px',
      render: (s) => <span className="text-slate-400 text-sm">{s.source ?? '—'}</span>,
    },
    {
      key: 'status',
      label: 'Statut',
      width: '140px',
      render: (s) => <Badge variant={STATUS_VARIANTS[s.status] ?? 'default'}>
        {s.status === 'active' ? 'Actif' : s.status === 'unsubscribed' ? 'Désinscrit' : 'Rebond'}
      </Badge>,
    },
    {
      key: 'createdAt',
      label: 'Inscrit le',
      width: '130px',
      render: (s) => <span className="text-slate-400 text-xs">{new Date(s.createdAt).toLocaleDateString('fr-FR')}</span>,
    },
  ];

  const actions: ListPageAction<Subscriber>[] = [
    {
      label: 'Toggle',
      icon: (item: Subscriber) => item.status === 'active'
        ? <ToggleRight className="w-4 h-4 text-green-400" />
        : <ToggleLeft className="w-4 h-4 text-slate-400" />,
      onClick: toggleStatus,
    },
    { label: 'Supprimer', icon: <Trash2 className="w-4 h-4" />, onClick: handleDelete, variant: 'danger' },
  ];

  const statusFilter = (
    <select
      onChange={(e) => setFilter('status', e.target.value || undefined)}
      className="px-3 py-2.5 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-[#EC4899]"
    >
      <option value="">Tous les statuts</option>
      <option value="active">Actifs</option>
      <option value="unsubscribed">Désinscrits</option>
      <option value="bounced">Rebond</option>
    </select>
  );

  return (
    <ListPage
      title="Newsletter"
      subtitle="Abonnés à la newsletter Epitaphe360"
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
      emptyLabel="Aucun abonné pour l'instant."
      onRefresh={refetch}
    />
  );
}

