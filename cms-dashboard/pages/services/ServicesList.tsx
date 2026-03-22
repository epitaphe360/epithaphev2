// ========================================
// Module Services — Liste & Formulaire
// ========================================
import React, { useState } from 'react';
import { Edit2, Trash2, Eye, Globe } from 'lucide-react';
import { useNavigate } from '../../hooks/useRouterParams';
import { ListPage, Column, ListPageAction } from '../../components/ListPage';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { getApi } from '../../lib/api';
import { Badge } from '../../components/Badge';
import { ServiceForm } from './ServiceForm';

interface Service {
  id: string;
  title: string;
  slug: string;
  hub: string;
  accroche: string | null;
  status: string;
  featured: boolean;
  order: number;
  updatedAt: string;
}

const HUB_LABELS: Record<string, string> = {
  'evenements':          'Événements',
  'architecture-de-marque': 'Architecture de Marque',
  'la-fabrique':         'La Fabrique',
  'qhse':                'QHSE',
};

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: 'success',
  DRAFT:     'default',
  ARCHIVED:  'warning',
};

export function ServicesList() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Service | null>(null);

  const { items, total, loading, error, page, limit, setPage, setSearch, setFilter, refetch } =
    usePaginatedList<Service>({ endpoint: '/admin/services', limit: 20 });

  const handleDelete = async (item: Service) => {
    if (!confirm(`Supprimer le service "${item.title}" ?`)) return;
    try {
      await getApi().delete(`/admin/services/${item.id}`);
      refetch();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const handleEdit = (item: Service) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleFormClose = (saved: boolean) => {
    setShowForm(false);
    setEditItem(null);
    if (saved) refetch();
  };

  const columns: Column<Service>[] = [
    {
      key: 'title',
      label: 'Titre',
      render: (s) => (
        <div>
          <p className="font-medium text-white">{s.title}</p>
          <p className="text-slate-500 text-xs mt-0.5">/services/{s.slug}</p>
        </div>
      ),
    },
    {
      key: 'hub',
      label: 'Hub',
      width: '180px',
      render: (s) => (
        <span className="text-xs px-2 py-1 rounded-full bg-[#C8A96E]/10 text-[#C8A96E] border border-[#C8A96E]/20">
          {HUB_LABELS[s.hub] ?? s.hub}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      width: '110px',
      render: (s) => (
        <Badge variant={STATUS_COLORS[s.status] as any ?? 'default'}>
          {s.status === 'PUBLISHED' ? 'Publié' : s.status === 'DRAFT' ? 'Brouillon' : 'Archivé'}
        </Badge>
      ),
    },
    {
      key: 'featured',
      label: 'Mis en avant',
      width: '110px',
      render: (s) => s.featured ? <Badge variant="success">Oui</Badge> : <span className="text-slate-500">—</span>,
    },
    {
      key: 'updatedAt',
      label: 'Modifié le',
      width: '140px',
      render: (s) => (
        <span className="text-slate-400 text-xs">
          {new Date(s.updatedAt).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
  ];

  const actions: ListPageAction<Service>[] = [
    { label: 'Modifier', icon: <Edit2 className="w-4 h-4" />, onClick: handleEdit },
    { label: 'Supprimer', icon: <Trash2 className="w-4 h-4" />, onClick: handleDelete, variant: 'danger' },
  ];

  const hubFilter = (
    <select
      onChange={(e) => setFilter('hub', e.target.value || undefined)}
      className="px-3 py-2.5 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-[#C8A96E]"
    >
      <option value="">Tous les hubs</option>
      {Object.entries(HUB_LABELS).map(([k, v]) => (
        <option key={k} value={k}>{v}</option>
      ))}
    </select>
  );

  const statusFilter = (
    <select
      onChange={(e) => setFilter('status', e.target.value || undefined)}
      className="px-3 py-2.5 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-[#C8A96E]"
    >
      <option value="">Tous les statuts</option>
      <option value="PUBLISHED">Publié</option>
      <option value="DRAFT">Brouillon</option>
      <option value="ARCHIVED">Archivé</option>
    </select>
  );

  return (
    <>
      <ListPage
        title="Services"
        subtitle="Gérez les pages de services par hub métier"
        columns={columns}
        items={items}
        total={total}
        loading={loading}
        error={error}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onSearch={setSearch}
        onAdd={handleAdd}
        addLabel="Nouveau Service"
        actions={actions}
        filters={<>{hubFilter}{statusFilter}</>}
        emptyLabel="Aucun service trouvé. Créez votre premier service."
        onRefresh={refetch}
      />
      {showForm && (
        <ServiceForm
          service={editItem as any}
          onClose={handleFormClose}
        />
      )}
    </>
  );
}
