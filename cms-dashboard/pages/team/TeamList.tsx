// ========================================
// Module Équipe — Liste
// ========================================
import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { ListPage, Column, ListPageAction } from '../../components/ListPage';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { getApi } from '../../lib/api';
import { Badge } from '../../components/Badge';
import { TeamForm } from './TeamForm';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string | null;
  photo: string | null;
  email: string | null;
  isPublished: boolean;
  order: number;
  updatedAt: string;
}

const DEPT_COLORS: Record<string, string> = {
  Direction: '#C8A96E', Création: '#9B59B6', Production: '#2980B9',
  Commercial: '#27AE60', QHSE: '#E74C3C',
};

export function TeamList() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<TeamMember | null>(null);

  const { items, total, loading, error, page, limit, setPage, setSearch, setFilter, refetch } =
    usePaginatedList<TeamMember>({ endpoint: '/admin/team', limit: 20 });

  const handleDelete = async (item: TeamMember) => {
    if (!confirm(`Supprimer "${item.name}" ?`)) return;
    try { await getApi().delete(`/admin/team/${item.id}`); refetch(); }
    catch { alert('Erreur lors de la suppression'); }
  };

  const columns: Column<TeamMember>[] = [
    {
      key: 'name',
      label: 'Membre',
      render: (m) => (
        <div className="flex items-center gap-3">
          {m.photo ? (
            <img src={m.photo} alt={m.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1E293B]" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#1E293B] flex items-center justify-center text-slate-300 text-sm font-bold">
              {m.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium text-white">{m.name}</p>
            <p className="text-xs text-slate-500">{m.email ?? ''}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'position',
      label: 'Poste',
      render: (m) => <span className="text-slate-300">{m.position}</span>,
    },
    {
      key: 'department',
      label: 'Département',
      width: '140px',
      render: (m) => m.department ? (
        <span style={{ color: DEPT_COLORS[m.department] ?? '#C8A96E' }} className="text-sm font-medium">
          {m.department}
        </span>
      ) : <span className="text-slate-600">—</span>,
    },
    {
      key: 'isPublished',
      label: 'Statut',
      width: '110px',
      render: (m) => <Badge variant={m.isPublished ? 'success' : 'default'}>{m.isPublished ? 'Visible' : 'Masqué'}</Badge>,
    },
  ];

  const actions: ListPageAction<TeamMember>[] = [
    { label: 'Modifier',  icon: <Edit2 className="w-4 h-4" />,  onClick: (m) => { setEditItem(m); setShowForm(true); } },
    { label: 'Supprimer', icon: <Trash2 className="w-4 h-4" />, onClick: handleDelete, variant: 'danger' },
  ];

  const deptFilter = (
    <select
      onChange={(e) => setFilter('department', e.target.value || undefined)}
      className="px-3 py-2.5 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-[#C8A96E]"
    >
      <option value="">Tous les dépts.</option>
      {Object.keys(DEPT_COLORS).map((d) => <option key={d} value={d}>{d}</option>)}
    </select>
  );

  return (
    <>
      <ListPage
        title="Équipe"
        subtitle={"Gérez les membres visibles pages \"À propos\" et \"Nos métiers\""}
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
        addLabel="Nouveau Membre"
        actions={actions}
        filters={deptFilter}
        emptyLabel="Aucun membre d'équipe. Ajoutez votre premier collaborateur."
        onRefresh={refetch}
      />
      {showForm && (
        <TeamForm
          member={editItem as any}
          onClose={(saved) => { setShowForm(false); setEditItem(null); if (saved) refetch(); }}
        />
      )}
    </>
  );
}
