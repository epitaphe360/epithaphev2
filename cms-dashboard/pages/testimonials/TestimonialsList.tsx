// ========================================
// Module Témoignages — Liste
// ========================================
import React, { useState } from 'react';
import { Edit2, Trash2, Star } from 'lucide-react';
import { ListPage, Column, ListPageAction } from '../../components/ListPage';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { getApi } from '../../lib/api';
import { Badge } from '../../components/Badge';
import { TestimonialForm } from './TestimonialForm';

interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string | null;
  companyName: string | null;
  rating: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  updatedAt: string;
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < n ? 'text-[#C8A96E] fill-current' : 'text-slate-700'}`} />
      ))}
    </span>
  );
}

export function TestimonialsList() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);

  const { items, total, loading, error, page, limit, setPage, setSearch, setFilter, refetch } =
    usePaginatedList<Testimonial>({ endpoint: '/admin/testimonials', limit: 20 });

  const handleDelete = async (item: Testimonial) => {
    if (!confirm(`Supprimer le témoignage de "${item.authorName}" ?`)) return;
    try { await getApi().delete(`/admin/testimonials/${item.id}`); refetch(); }
    catch { alert('Erreur lors de la suppression'); }
  };

  const columns: Column<Testimonial>[] = [
    {
      key: 'authorName',
      label: 'Auteur',
      render: (t) => (
        <div>
          <p className="font-medium text-gray-900">{t.authorName}</p>
          <p className="text-xs text-gray-500">{[t.authorTitle, t.companyName].filter(Boolean).join(' • ')}</p>
        </div>
      ),
    },
    {
      key: 'quote',
      label: 'Citation',
      render: (t) => <span className="text-gray-500 text-sm italic line-clamp-2">"{t.quote.slice(0, 100)}{t.quote.length > 100 ? '…' : ''}"</span>,
    },
    {
      key: 'rating',
      label: 'Note',
      width: '110px',
      render: (t) => t.rating ? <Stars n={t.rating} /> : <span className="text-slate-600">—</span>,
    },
    {
      key: 'isPublished',
      label: 'Statut',
      width: '120px',
      render: (t) => (
        <div className="flex flex-col gap-1">
          <Badge variant={t.isPublished ? 'success' : 'default'}>{t.isPublished ? 'Publié' : 'Masqué'}</Badge>
          {t.isFeatured && <Badge variant="warning">Vedette</Badge>}
        </div>
      ),
    },
  ];

  const actions: ListPageAction<Testimonial>[] = [
    { label: 'Modifier',  icon: <Edit2 className="w-4 h-4" />,  onClick: (t) => { setEditItem(t); setShowForm(true); } },
    { label: 'Supprimer', icon: <Trash2 className="w-4 h-4" />, onClick: handleDelete, variant: 'danger' },
  ];

  const publishedFilter = (
    <select
      onChange={(e) => setFilter('isPublished', e.target.value === '' ? undefined : e.target.value === 'true')}
      className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]"
    >
      <option value="">Tous</option>
      <option value="true">Publiés</option>
      <option value="false">Masqués</option>
    </select>
  );

  return (
    <>
      <ListPage
        title="Témoignages"
        subtitle="Avis clients et retours d'expérience affichés sur le site"
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
        addLabel="Nouveau Témoignage"
        actions={actions}
        filters={publishedFilter}
        emptyLabel="Aucun témoignage. Ajoutez vos premiers avis clients."
        onRefresh={refetch}
      />
      {showForm && (
        <TestimonialForm
          testimonial={editItem as any}
          onClose={(saved) => { setShowForm(false); setEditItem(null); if (saved) refetch(); }}
        />
      )}
    </>
  );
}
