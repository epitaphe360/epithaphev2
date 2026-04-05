// ========================================
// Module Études de Cas — Liste
// ========================================
import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { ListPage, Column, ListPageAction } from '../../components/ListPage';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { getApi } from '../../lib/api';
import { Badge } from '../../components/Badge';
import { CaseStudyForm } from './CaseStudyForm';

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  clientName: string | null;
  status: string;
  isFeatured: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

const STATUS_MAP: Record<string, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  published: { label: 'Publié',   variant: 'success' },
  draft:     { label: 'Brouillon', variant: 'warning' },
  archived:  { label: 'Archivé',  variant: 'default' },
};

export function CaseStudiesList() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<CaseStudy | null>(null);

  const { items, total, loading, error, page, limit, setPage, setSearch, setFilter, refetch } =
    usePaginatedList<CaseStudy>({ endpoint: '/admin/case-studies', limit: 20 });

  const handleDelete = async (item: CaseStudy) => {
    if (!confirm(`Supprimer "${item.title}" ?`)) return;
    try { await getApi().delete(`/admin/case-studies/${item.id}`); refetch(); }
    catch { alert('Erreur lors de la suppression'); }
  };

  const columns: Column<CaseStudy>[] = [
    {
      key: 'title',
      label: 'Titre',
      render: (c) => (
        <div>
          <p className="font-medium text-gray-900">{c.title}</p>
          <p className="text-xs text-gray-500">{c.slug}</p>
        </div>
      ),
    },
    {
      key: 'clientName',
      label: 'Client',
      render: (c) => <span className="text-gray-600">{c.clientName ?? '—'}</span>,
    },
    {
      key: 'status',
      label: 'Statut',
      width: '120px',
      render: (c) => {
        const s = STATUS_MAP[c.status] ?? STATUS_MAP.draft;
        return <Badge variant={s.variant}>{s.label}</Badge>;
      },
    },
    {
      key: 'isFeatured',
      label: 'À la une',
      width: '90px',
      render: (c) => <Badge variant={c.isFeatured ? 'success' : 'default'}>{c.isFeatured ? 'Oui' : 'Non'}</Badge>,
    },
    {
      key: 'publishedAt',
      label: 'Publié le',
      width: '130px',
      render: (c) => <span className="text-gray-500 text-xs">{c.publishedAt ? new Date(c.publishedAt).toLocaleDateString('fr-FR') : '—'}</span>,
    },
  ];

  const actions: ListPageAction<CaseStudy>[] = [
    { label: 'Modifier',  icon: <Edit2 className="w-4 h-4" />,  onClick: (c) => { setEditItem(c); setShowForm(true); } },
    { label: 'Supprimer', icon: <Trash2 className="w-4 h-4" />, onClick: handleDelete, variant: 'danger' },
  ];

  const statusFilter = (
    <select
      onChange={(e) => setFilter('status', e.target.value || undefined)}
      className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]"
    >
      <option value="">Tous les statuts</option>
      <option value="draft">Brouillon</option>
      <option value="published">Publié</option>
      <option value="archived">Archivé</option>
    </select>
  );

  return (
    <>
      <ListPage
        title="Études de Cas"
        subtitle="Présentez vos projets phares avec métriques et résultats"
        columns={columns}
        items={items}
        total={total}
        loading={loading}
        error={error}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onSearch={setSearch}
        onAdd={() => { setEditItem(null); setShowForm(true); }}
        addLabel="Nouvelle Étude"
        actions={actions}
        filters={statusFilter}
        emptyLabel="Aucune étude de cas. Créez votre première."
        onRefresh={refetch}
      />
      {showForm && (
        <CaseStudyForm
          caseStudy={editItem as any}
          onClose={(saved) => { setShowForm(false); setEditItem(null); if (saved) refetch(); }}
        />
      )}
    </>
  );
}
