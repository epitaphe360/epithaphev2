// ========================================
// Module Contacts — Liste + Vue + Réponse email
// ========================================
import React, { useState } from 'react';
import { Eye, Trash2, X, Send, CheckCircle2, Loader2 } from 'lucide-react';
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
  const [replyBody, setReplyBody] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replySent, setReplySent] = useState(false);
  const [replyError, setReplyError] = useState('');

  const save = async () => {
    setSaving(true);
    try { await getApi().put(`/admin/contacts/${contact.id}`, { status }); onClose(); }
    catch { alert('Erreur lors de la sauvegarde'); }
    finally { setSaving(false); }
  };

  const sendReply = async () => {
    if (!replyBody.trim()) return;
    setReplySending(true);
    setReplyError('');
    try {
      await getApi().post(`/admin/contacts/${contact.id}/reply`, { replyBody });
      setReplySent(true);
      setStatus('replied');
      setReplyBody('');
    } catch (e: any) {
      setReplyError(e?.response?.data?.error ?? 'Échec de l\'envoi');
    } finally {
      setReplySending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#0B1121] border border-[#1E293B] rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
          <h2 className="text-lg font-bold text-white">Message de {contact.firstName} {contact.lastName}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Infos contact */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#020617] border border-[#1E293B] text-sm">
            <div><p className="text-xs text-slate-500">Email</p><p className="text-white">{contact.email}</p></div>
            <div><p className="text-xs text-slate-500">Téléphone</p><p className="text-white">{contact.phone ?? '—'}</p></div>
            <div><p className="text-xs text-slate-500">Entreprise</p><p className="text-white">{contact.company ?? '—'}</p></div>
            <div><p className="text-xs text-slate-500">Sujet</p><p className="text-white">{contact.subject ?? '—'}</p></div>
            <div className="col-span-2">
              <p className="text-xs text-slate-500">Reçu le</p>
              <p className="text-white">{new Date(contact.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          {/* Message original */}
          {contact.message && (
            <div className="p-4 rounded-xl bg-[#020617] border border-[#1E293B]">
              <p className="text-xs text-slate-500 mb-2">Message reçu</p>
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
            </div>
          )}

          {/* Zone de réponse */}
          <div className="rounded-xl border border-[#334155] overflow-hidden">
            <div className="bg-[#0f172a] px-4 py-2 border-b border-[#334155] flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Répondre à {contact.email}</p>
              {replySent && (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Email envoyé
                </span>
              )}
            </div>
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Rédigez votre réponse ici…"
              rows={5}
              className="w-full px-4 py-3 bg-[#020617] text-slate-200 text-sm resize-none focus:outline-none placeholder-slate-600"
            />
            {replyError && <p className="px-4 pb-2 text-xs text-rose-400">{replyError}</p>}
            <div className="flex justify-end px-4 pb-3">
              <button
                onClick={sendReply}
                disabled={replySending || !replyBody.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E63946] text-white font-semibold text-sm hover:bg-[#c8313d] transition-colors disabled:opacity-50"
              >
                {replySending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {replySending ? 'Envoi…' : 'Envoyer'}
              </button>
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Statut</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0B1121] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-[#E63946]">
              {Object.entries(STATUS_MAP).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-[#1E293B]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[#334155] text-slate-300 hover:text-white text-sm transition-colors">Fermer</button>
          <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-xl bg-[#1E293B] text-white font-semibold hover:bg-[#334155] text-sm transition-colors disabled:opacity-60">
            {saving ? 'Sauvegarde...' : 'Enregistrer le statut'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ContactsList() {
  const [viewContact, setViewContact] = useState<Contact | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const { items, total, loading, error, page, limit, setPage, setSearch, setFilter, refetch } =
    usePaginatedList<Contact>({ endpoint: '/admin/contacts', limit: 20 });

  const toggleSelect = (id: string) =>
    setSelected((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const toggleAll = () =>
    setSelected(selected.size === items.length ? new Set() : new Set(items.map((i) => i.id)));

  const bulkStatus = async (status: string) => {
    setBulkLoading(true);
    try {
      await Promise.all(Array.from(selected).map((id) => getApi().put(`/admin/contacts/${id}`, { status })));
      setSelected(new Set());
      refetch();
    } catch { alert('Erreur action groupée'); }
    finally { setBulkLoading(false); }
  };

  const bulkDelete = async () => {
    if (!confirm(`Supprimer ${selected.size} message(s) ?`)) return;
    setBulkLoading(true);
    try {
      await Promise.all(Array.from(selected).map((id) => getApi().delete(`/admin/contacts/${id}`)));
      setSelected(new Set());
      refetch();
    } catch { alert('Erreur suppression'); }
    finally { setBulkLoading(false); }
  };

  const handleDelete = async (item: Contact) => {
    if (!confirm(`Supprimer le message de "${item.email}" ?`)) return;
    try { await getApi().delete(`/admin/contacts/${item.id}`); refetch(); }
    catch { alert('Erreur lors de la suppression'); }
  };

  const columns: Column<Contact>[] = [
    {
      key: 'select' as any,
      label: '',
      width: '48px',
      render: (c) => (
        <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)}
          className="w-4 h-4 rounded accent-[#E63946]" onClick={(e) => e.stopPropagation()} />
      ),
    },
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
    { label: 'Répondre', icon: <Send className="w-4 h-4" />, onClick: (c) => setViewContact(c) },
    { label: 'Supprimer', icon: <Trash2 className="w-4 h-4" />, onClick: handleDelete, variant: 'danger' },
  ];

  const filters = (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        onChange={(e) => setFilter('status', e.target.value || undefined)}
        className="px-3 py-2.5 bg-[#1E293B] border border-[#334155] rounded-xl text-white text-sm focus:outline-none"
      >
        <option value="">Tous les statuts</option>
        {Object.entries(STATUS_MAP).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
      </select>

      {selected.size > 0 && (
        <div className="flex items-center gap-2 bg-[#1E293B] border border-[#E63946]/30 rounded-xl px-3 py-1.5">
          <span className="text-xs text-slate-400">{selected.size} sélectionné(s)</span>
          <button onClick={() => bulkStatus('read')} disabled={bulkLoading}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Marquer Lu</button>
          <button onClick={() => bulkStatus('archived')} disabled={bulkLoading}
            className="text-xs text-slate-400 hover:text-white transition-colors">Archiver</button>
          <button onClick={bulkDelete} disabled={bulkLoading}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors">Supprimer</button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Select all header */}
      {items.length > 0 && (
        <div className="px-6 pt-4">
          <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
            <input type="checkbox" checked={selected.size === items.length && items.length > 0}
              onChange={toggleAll} className="w-4 h-4 rounded accent-[#E63946]" />
            Tout sélectionner
          </label>
        </div>
      )}
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
        filters={filters}
        emptyLabel="Aucun message de contact pour l'instant."
        onRefresh={refetch}
      />
      {viewContact && <ContactModal contact={viewContact} onClose={() => { setViewContact(null); refetch(); }} />}
    </>
  );
}
