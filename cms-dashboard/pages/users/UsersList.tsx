// ========================================
// CMS Dashboard - Liste des Utilisateurs
// ========================================

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Shield } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { SearchInput, Select } from '../../components/Input';
import { Table, Column } from '../../components/Table';
import { Badge } from '../../components/Badge';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/simple-api';
import { UserForm } from './UserForm';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'USER';
  createdAt: string;
  lastLogin?: string;
}

export const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const toast = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const api = getApi();
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Erreur', 'Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      const api = getApi();
      await api.delete(`/admin/users/${id}`);
      toast.success('Succès', 'Utilisateur supprimé');
      loadUsers();
    } catch (error) {
      toast.error('Erreur', 'Impossible de supprimer l\'utilisateur');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      const api = getApi();
      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, data);
        toast.success('Succès', 'Utilisateur mis à jour');
      } else {
        await api.post('/admin/users', data);
        toast.success('Succès', 'Utilisateur créé');
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      toast.error('Erreur', 'Erreur lors de l\'enregistrement');
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'danger' | 'warning' | 'info' | 'default'> = {
      ADMIN: 'danger',
      EDITOR: 'warning',
      AUTHOR: 'info',
      USER: 'default',
    };
    const labels: Record<string, string> = {
      ADMIN: 'Administrateur',
      EDITOR: 'Éditeur',
      AUTHOR: 'Auteur',
      USER: 'Utilisateur',
    };
    return <Badge variant={variants[role] || 'default'}>{labels[role] || role}</Badge>;
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Utilisateur',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      render: (user) => getRoleBadge(user.role),
    },
    {
      key: 'lastLogin',
      header: 'Dernière connexion',
      render: (user) => (
        <span className="text-sm text-gray-600">
          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Jamais'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '100px',
      render: (user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(user)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(user.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-600">Gérez les utilisateurs et leurs permissions</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur..."
          />
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Tous les rôles' },
              { value: 'ADMIN', label: 'Administrateurs' },
              { value: 'EDITOR', label: 'Éditeurs' },
              { value: 'AUTHOR', label: 'Auteurs' },
              { value: 'USER', label: 'Utilisateurs' },
            ]}
          />
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <Card>
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <div className="p-8 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {search || roleFilter !== 'all' ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur pour le moment'}
            </p>
            <Button onClick={handleAdd}>Créer le premier utilisateur</Button>
          </div>
        </Card>
      ) : (
        <Card>
          <Table columns={columns} data={filteredUsers} />
        </Card>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UsersList;
