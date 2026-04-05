// ========================================
// Admin — Gestion des comptes clients (Espace Client)
// ========================================
import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { useToast } from '../../components/Toast';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { Table } from '../../components/Table';
import { post, put, del } from '../../lib/api';
import {
  Users, Plus, Pencil, Trash2, FolderKanban, CheckCircle, XCircle,
} from 'lucide-react';

interface ClientAccount {
  id: number;
  email: string;
  name: string;
  company: string | null;
  phone: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

const EMPTY_FORM = { email: '', name: '', company: '', phone: '', password: '' };

export function ClientAccountsPage() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ClientAccount | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const { data, total, loading, refresh } = usePaginatedList<ClientAccount>(
    '/api/admin/client-accounts',
    { search }
  );

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(account: ClientAccount) {
    setEditing(account);
    setForm({ email: account.email, name: account.name, company: account.company ?? '', phone: account.phone ?? '', password: '' });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.email || !form.name) {
      addToast('Email et nom sont requis', 'error');
      return;
    }
    if (!editing && !form.password) {
      addToast('Mot de passe requis pour un nouveau compte', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await put(`/api/admin/client-accounts/${editing.id}`, form);
        addToast('Compte mis à jour', 'success');
      } else {
        await post('/api/admin/client-accounts', form);
        addToast('Compte créé', 'success');
      }
      setShowModal(false);
      refresh();
    } catch (e: any) {
      addToast(e.message || 'Erreur', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce compte client ?')) return;
    setDeleting(id);
    try {
      await del(`/api/admin/client-accounts/${id}`);
      addToast('Compte supprimé', 'success');
      refresh();
    } catch {
      addToast('Erreur suppression', 'error');
    } finally {
      setDeleting(null);
    }
  }

  const columns = [
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'company', label: 'Entreprise', render: (v: string | null) => v || '—' },
    { key: 'isActive', label: 'Statut', render: (v: boolean) =>
      v
        ? <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1 inline" />Actif</Badge>
        : <Badge variant="danger"><XCircle className="w-3 h-3 mr-1 inline" />Inactif</Badge>
    },
    { key: 'lastLoginAt', label: 'Dernière connexion', render: (v: string | null) =>
      v ? new Date(v).toLocaleDateString('fr-FR') : 'Jamais'
    },
    { key: 'createdAt', label: 'Créé le', render: (v: string) => new Date(v).toLocaleDateString('fr-FR') },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E63946]/10 rounded-xl">
            <FolderKanban className="w-6 h-6 text-[#E63946]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comptes Clients</h1>
            <p className="text-gray-500 text-sm">{total} compte{total !== 1 ? 's' : ''} au total</p>
          </div>
        </div>
        <Button onClick={openCreate} variant="primary">
          <Plus className="w-4 h-4 mr-2" />Nouveau compte
        </Button>
      </div>

      {/* Recherche */}
      <Input
        placeholder="Rechercher par nom, email ou entreprise..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Tableau */}
      <Table
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="Aucun compte client trouvé"
        actions={(row) => (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => openEdit(row)} title="Modifier">
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(row.id)} loading={deleting === row.id} title="Supprimer">
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        )}
      />

      {/* Modal Créer / Modifier */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Modifier le compte client' : 'Nouveau compte client'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              {editing ? 'Enregistrer' : 'Créer'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nom *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jean Dupont" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email *</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jean@exemple.com" disabled={!!editing} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Entreprise</label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Corp" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Téléphone</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+33 6 00 00 00 00" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {editing ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
            </label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 12 car., maj., min., chiffre, spécial"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ClientAccountsPage;
