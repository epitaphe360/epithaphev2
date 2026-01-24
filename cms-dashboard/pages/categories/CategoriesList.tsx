// ========================================
// CMS Dashboard - Liste des Catégories
// ========================================

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { SearchInput } from '../../components/Input';
import { Table, Column } from '../../components/Table';
import { Badge } from '../../components/Badge';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/simple-api';
import { CategoryForm } from './CategoryForm';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'article' | 'event';
  count: number;
  createdAt: string;
}

export const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const toast = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const api = getApi();
      const response = await api.get('/admin/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Erreur', 'Impossible de charger les catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      const api = getApi();
      await api.delete(`/admin/categories/${id}`);
      toast.success('Succès', 'Catégorie supprimée');
      loadCategories();
    } catch (error) {
      toast.error('Erreur', 'Impossible de supprimer la catégorie');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      const api = getApi();
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, data);
        toast.success('Succès', 'Catégorie mise à jour');
      } else {
        await api.post('/admin/categories', data);
        toast.success('Succès', 'Catégorie créée');
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (error) {
      toast.error('Erreur', 'Erreur lors de l\'enregistrement');
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Nom',
      render: (cat) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{cat.name}</p>
            <p className="text-sm text-gray-500">/{cat.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (cat) => (
        <p className="text-sm text-gray-600 truncate max-w-xs">
          {cat.description || '-'}
        </p>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (cat) => (
        <Badge variant={cat.type === 'article' ? 'primary' : 'info'}>
          {cat.type === 'article' ? 'Article' : 'Événement'}
        </Badge>
      ),
    },
    {
      key: 'count',
      header: 'Éléments',
      render: (cat) => (
        <span className="text-sm text-gray-600">{cat.count}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '100px',
      render: (cat) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(cat)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(cat.id)}
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
          <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
          <p className="text-gray-600">Gérez les catégories d'articles et d'événements</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une catégorie..."
        />
      </Card>

      {/* Table */}
      {loading ? (
        <Card>
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        </Card>
      ) : filteredCategories.length === 0 ? (
        <Card>
          <div className="p-8 text-center">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {search ? 'Aucune catégorie trouvée' : 'Aucune catégorie pour le moment'}
            </p>
            <Button onClick={handleAdd}>Créer votre première catégorie</Button>
          </div>
        </Card>
      ) : (
        <Card>
          <Table columns={columns} data={filteredCategories} />
        </Card>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CategoriesList;
