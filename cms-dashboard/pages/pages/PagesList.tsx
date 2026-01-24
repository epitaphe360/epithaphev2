// ========================================
// CMS Dashboard - Liste des Pages
// ========================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from '../../hooks/useRouterParams';
import { Link } from 'wouter';
import { Plus, Edit, Trash2, Eye, GripVertical, Paintbrush } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { SearchInput } from '../../components/Input';
import { Table, Column, Pagination } from '../../components/Table';
import { StatusBadge, Badge } from '../../components/Badge';
import { ConfirmDialog } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/api';
import { useSimplePagination, useDebounce } from '../../hooks/useApi';
import { Page } from '../../types';

export const PagesList: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const debouncedSearch = useDebounce(search, 300);
  const { page, setPage, limit, totalPages } = useSimplePagination(total);

  useEffect(() => {
    loadPages();
  }, [page, debouncedSearch]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const api = getApi();
      const response = await api.pages.getAll({
        page,
        limit,
        search: debouncedSearch || undefined,
      });
      setPages(response.data);
      setTotal(response.total);
    } catch (error) {
      toast.error('Erreur', 'Impossible de charger les pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const api = getApi();
      await api.pages.delete(deleteId);
      toast.success('Succès', 'Page supprimée');
      loadPages();
    } catch (error) {
      toast.error('Erreur', 'Impossible de supprimer la page');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column<Page>[] = [
    {
      key: 'title',
      header: 'Titre',
      render: (pageItem) => (
        <div className="flex items-center gap-3">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
          <div>
            <p className="font-medium text-gray-900">{pageItem.title}</p>
            <p className="text-sm text-gray-500">/{pageItem.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'template',
      header: 'Type',
      render: (pageItem) => {
        const template = pageItem.template || 'DEFAULT';
        const getTemplateColor = () => {
          if (template === 'GRAPES_JS') return 'purple';
          if (['HOME', 'REFERENCES', 'BLOG_LIST', 'SOLUTIONS', 'CONTACT'].includes(template)) return 'blue';
          return 'gray';
        };

        return (
          <Badge variant={getTemplateColor() as any}>
            {template === 'GRAPES_JS' ? 'Visual Editor' : template.replace(/_/g, ' ')}
          </Badge>
        );
      },
    },
    {
      key: 'status',
      header: 'Statut',
      render: (pageItem) => <StatusBadge status={pageItem.status} />,
    },
    {
      key: 'updatedAt',
      header: 'Modifié',
      render: (pageItem) => new Date(pageItem.updatedAt).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      header: '',
      width: '120px',
      render: (pageItem) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/${pageItem.slug}`, '_blank');
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            title="Voir"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/visual-editor/edit/${pageItem.id}`);
            }}
            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
            title="Éditeur visuel GrapesJS"
          >
            <Paintbrush className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/pages/${pageItem.id}/edit`);
            }}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(pageItem.id);
            }}
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
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-600">Gérez les pages de votre site</p>
        </div>
        <Link to="/admin/pages/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle page
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une page..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          data={pages}
          loading={loading}
          emptyMessage="Aucune page trouvée"
          onRowClick={(pageItem) => navigate(`/admin/pages/${pageItem.id}/edit`)}
        />
        {total > limit && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        )}
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer la page"
        message="Êtes-vous sûr de vouloir supprimer cette page ? Cette action est irréversible."
        confirmText="Supprimer"
        loading={deleting}
      />
    </div>
  );
};

export default PagesList;
