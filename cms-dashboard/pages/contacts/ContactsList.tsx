// ========================================
// Module Contacts — Liste + Vue message
// ========================================
import React, { useState } from 'react';
import { Eye, Trash2, X } from 'lucide-react';
import { ListPage, Column, ListPageAction } from '../../components/ListPage';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { getApi } from '../../lib/api';
import { Badge } from '../../components/Badge';

interface Contact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  subject: string | null;
  status: string;
  createdAt: string;
}

const STATUS_MAP: Record<string, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  new:      { label: 'Nouveau',  variant: 'warning' },
  read:     { label: 'Lu',       variant: 'default' },
  replied:  { label: 'Répondu', variant: 'success' },
  archived: { label: 'Archivé', variant: 'default' },
};

function ContactModal({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const [status, setStatus] = useState(contact.status);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try { await getApi().put(`/admin/contacts/${contact.id}`, { status }); onClose(); }
    catch { alert('Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0B1121] border border-[#1E293B] rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
          <h2 className="text-lg font-bold text-white">Message de {contact.firstName} {contact.lastName}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#020617] border border-[#1E293B] text-sm">
            <div><p className="text-xs text-slate-500">Email</p><p className="text-white">{contact.email}</p></div>
            <div><p className="text-xs text-slate-500">Téléphone</p><p className="text-white">{contact.phone ?? '—'}</p></div>
            <div><p className="text-xs text-slate-500">Entreprise</p><p className="text-white">{contact.company ?? '—'}</p></div>
            <div><p className="text-xs text-slate-500">Sujet</p><p className="text-white">{contact.subject ?? '—'}</p></div>
            <div className="col-span-2"><p className="text-xs text-slate-500">Reçu le</p><p className="text-white">{new Date(contact.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p></div>
          </div>
          {contact.message && (
            <div className="p-4 rounded-xl bg-[#020617] border border-[#1E293B]">
              <p className="text-xs text-slate-500 mb-2">Message</p>
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Statut</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0B1121] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-[#C8A96E]">
              {Object.entries(STATUS_MAP).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-[#1E293B]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[#334155] text-slate-300 hover:text-white text-sm transition-colors">Fermer</button>
          <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-xl bg-[#C8A96E] text-black font-semibold hover:bg-[#DFC28F] text-sm transition-colors disabled:opacity-60">
            {saving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContactsList() {
  const [viewContact, setViewContact] = useState<Contact | null>(null);

  const { items, total, loading, error, page, limit, setPage, setSearch, setFilter, refetch } =
    usePaginatedList<Contact>({ endpoint: '/admin/contacts', limit: 20 });

  const handleDelete = async (item: Contact) => {
    if (!confirm(`Supprimer le message de "${item.email}" ?`)) return;
    try { await getApi().delete(`/admin/contacts/${item.id}`); refetch(); }
    catch { alert('Erreur lors de la suppression'); }
  };

  const columns: Column<Contact>[] = [
    {
      key: 'firstName',
      label: 'Contact',
      render: (c) => (
        <div>
          <p className="font-medium text-white">{[c.firstName, c.lastName].filter(Boolean).join(' ') || '—'}</p>
          <p className="text-xs text-slate-500">{c.email}</p>
        </div>
      ),
    },
    {
      key: 'company',
      label: 'Entreprise',
      width: '160px',
      render: (c) => <span className="text-slate-400">{c.company ?? '—'}</span>,
    },
    {
      key: 'message',
      label: 'Message',
      render: (c) => <span className="text-slate-400 text-sm">{(c.message ?? '').slice(0, 80)}{(c.message?.length ?? 0) > 80 ? '…' : ''}</span>,
    },
    {
      key: 'status',
      label: 'Statut',
      width: '120px',
      render: (c) => {
        const s = STATUS_MAP[c.status] ?? STATUS_MAP.new;
        return <Badge variant={s.variant}>{s.label}</Badge>;
      },
    },
    {
      key: 'createdAt',
      label: 'Reçu le',
      width: '120px',
      render: (c) => <span className="text-slate-400 text-xs">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</span>,
    },
  ];

  const actions: ListPageAction<Contact>[] = [
    { label: 'Voir',      icon: <Eye className="w-4 h-4" />,    onClick: (c) => setViewContact(c) },
    { label: 'Supprimer', icon: <Trash2 className="w-4 h-4" />, onClick: handleDelete, variant: 'danger' },
  ];

  const statusFilter = (
    <select
      onChange={(e) => setFilter('status', e.target.value || undefined)}
      className="px-3 py-2.5 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-[#C8A96E]"
    >
      <option value="">Tous les statuts</option>
      {Object.entries(STATUS_MAP).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
    </select>
  );

  return (
    <>
      <ListPage
        title="Messages de Contact"
        subtitle="Formulaires de contact reçus depuis le site"
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
        emptyLabel="Aucun message de contact pour l'instant."
        onRefresh={refetch}
      />
      {viewContact && <ContactModal contact={viewContact} onClose={() => { setViewContact(null); refetch(); }} />}
    </>
  );
}
