// ========================================
// Module Références Clients — Liste
// ========================================
import React, { useState } from 'react';
import { Edit2, Trash2, Star, Globe } from 'lucide-react';
import { ListPage, Column, ListPageAction } from '../../components/ListPage';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { getApi } from '../../lib/api';
import { Badge } from '../../components/Badge';
import { ReferenceForm } from './ReferenceForm';
import { toast } from '../../lib/toast';

interface ClientReference {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  sectors: string[] | null;
  description: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  updatedAt: string;
}

const SECTOR_COLORS: Record<string, string> = {
  'Industrie':    '#2D6A9F',
  'Santé':        '#2D9F6A',
  'Luxe & Retail':'#9F2D5A',
  'Tech & Digital':'#5A2D9F',
  'Finance':      '#9F7A2D',
  'Énergie':      '#2D9F9F',
  'Agroalimentaire':'#5A9F2D',
};

export function ReferencesList() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ClientReference | null>(null);

  const { items, total, loading, error, page, limit, setPage, setSearch, setFilter, refetch } =
    usePaginatedList<ClientReference>({ endpoint: '/admin/references', limit: 20 });

  const handleDelete = async (item: ClientReference) => {
    if (!confirm(`Supprimer "${item.name}" ?`)) return;
    try { await getApi().delete(`/admin/references/${item.id}`); refetch(); }
    catch { toast.error('Erreur lors de la suppression'); }
  };

  const columns: Column<ClientReference>[] = [
    {
      key: 'name',
      label: 'Client',
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.logo ? (
            <img src={r.logo} alt={r.name} className="w-8 h-8 object-contain rounded bg-white/5 p-1" />
          ) : (
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
              {r.name.charAt(0)}
            </div>
          )}
          <span className="font-medium text-gray-900">{r.name}</span>
        </div>
      ),
    },
    {
      key: 'sectors',
      label: 'Secteurs',
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {(r.sectors ?? []).slice(0, 3).map((s) => (
            <span
              key={s}
              style={{ borderColor: SECTOR_COLORS[s] + '40', color: SECTOR_COLORS[s] ?? '#C8A96E' }}
              className="text-xs px-2 py-0.5 rounded-full border bg-transparent"
            >
              {s}
            </span>
          ))}
          {(r.sectors?.length ?? 0) > 3 && (
            <span className="text-xs text-gray-500">+{r.sectors!.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: 'isFeatured',
      label: 'Vedette',
      width: '90px',
      render: (r) => r.isFeatured ? <Star className="w-4 h-4 text-[#C8A96E] fill-current" /> : <span className="text-slate-600">—</span>,
    },
    {
      key: 'isPublished',
      label: 'Statut',
      width: '110px',
      render: (r) => <Badge variant={r.isPublished ? 'success' : 'default'}>{r.isPublished ? 'Publié' : 'Non publié'}</Badge>,
    },
    {
      key: 'updatedAt',
      label: 'Modifié',
      width: '130px',
      render: (r) => <span className="text-gray-500 text-xs">{new Date(r.updatedAt).toLocaleDateString('fr-FR')}</span>,
    },
  ];

  const actions: ListPageAction<ClientReference>[] = [
    { label: 'Modifier',   icon: <Edit2 className="w-4 h-4" />,  onClick: (r) => { setEditItem(r); setShowForm(true); } },
    { label: 'Supprimer',  icon: <Trash2 className="w-4 h-4" />, onClick: handleDelete, variant: 'danger' },
  ];

  const sectorFilter = (
    <select
      onChange={(e) => setFilter('sector', e.target.value || undefined)}
      className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]"
    >
      <option value="">Tous les secteurs</option>
      {Object.keys(SECTOR_COLORS).map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );

  return (
    <>
      <ListPage
        title="Références Clients"
        subtitle="Gérez vos clients et leurs logos pour les pages de services"
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
        addLabel="Nouvelle Référence"
        actions={actions}
        filters={sectorFilter}
        emptyLabel="Aucune référence client. Ajoutez vos premiers clients."
        onRefresh={refetch}
      />
      {showForm && (
        <ReferenceForm
          reference={editItem as any}
          onClose={(saved) => { setShowForm(false); setEditItem(null); if (saved) refetch(); }}
        />
      )}
    </>
  );
}
