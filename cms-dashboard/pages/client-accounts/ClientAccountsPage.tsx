// ========================================
// Admin — Gestion des comptes clients (Espace Client)
// ========================================
import React, { useState } from 'react';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { useToast } from '../../components/Toast';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';
import { Table } from '../../components/Table';
import { getApi } from '../../lib/api';
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
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ClientAccount | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const { items: data, total, loading, refetch, setSearch: setListSearch } =
    usePaginatedList<ClientAccount>({ endpoint: '/admin/client-accounts', limit: 20 });

  function handleSearch(value: string) {
    setSearch(value);
    setListSearch(value);
  }

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
      toast.error('Email et nom sont requis');
      return;
    }
    if (!editing && !form.password) {
      toast.error('Mot de passe requis pour un nouveau compte');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await getApi().put(`/admin/client-accounts/${editing.id}`, form);
        toast.success('Compte mis à jour');
      } else {
        await getApi().post('/admin/client-accounts', form);
        toast.success('Compte créé');
      }
      setShowModal(false);
      refetch();
    } catch (e: any) {
      toast.error(e.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce compte client ?')) return;
    setDeleting(id);
    try {
      await getApi().delete(`/admin/client-accounts/${id}`);
      toast.success('Compte supprimé');
      refetch();
    } catch {
      toast.error('Erreur suppression');
    } finally {
      setDeleting(null);
    }
  }

  const columns = [
    { key: 'name', header: 'Nom' },
    { key: 'email', header: 'Email' },
    { key: 'company', header: 'Entreprise', render: (row: ClientAccount) => row.company || '—' },
    { key: 'isActive', header: 'Statut', render: (row: ClientAccount) =>
      row.isActive
        ? <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1 inline" />Actif</Badge>
        : <Badge variant="danger"><XCircle className="w-3 h-3 mr-1 inline" />Inactif</Badge>
    },
    { key: 'lastLoginAt', header: 'Dernière connexion', render: (row: ClientAccount) =>
      row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleDateString('fr-FR') : 'Jamais'
    },
    { key: 'createdAt', header: 'Créé le', render: (row: ClientAccount) => new Date(row.createdAt).toLocaleDateString('fr-FR') },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#EC4899]/10 rounded-xl">
            <FolderKanban className="w-6 h-6 text-[#EC4899]" />
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
        onChange={(e) => handleSearch(e.target.value)}
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
        isOpen={showModal}
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
