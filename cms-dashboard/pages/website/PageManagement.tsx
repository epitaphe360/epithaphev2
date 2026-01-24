import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Eye, Globe } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { Badge } from '../../components/Badge';
import { RichTextEditor } from '../../components/RichTextEditor';
import { PageContent, SEOData } from '../../types/website-types';

export const PageManagement: React.FC = () => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const response = await fetch('/api/admin/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Erreur chargement pages:', error);
    }
  };

  const openPageModal = (page?: PageContent) => {
    setEditingPage(page || {
      id: '',
      slug: '',
      title: '',
      content: '',
      status: 'draft',
      author: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      seo: {
        title: '',
        description: '',
        keywords: []
      }
    });
    setIsModalOpen(true);
  };

  const savePage = async (pageData: PageContent) => {
    try {
      const method = pageData.id ? 'PUT' : 'POST';
      const url = pageData.id 
        ? `/api/admin/pages/${pageData.id}` 
        : '/api/admin/pages';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });
      
      if (response.ok) {
        loadPages();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Erreur sauvegarde page:', error);
    }
  };

  const deletePage = async (pageId: string) => {
    if (!confirm('Supprimer cette page ?')) return;
    
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        loadPages();
      }
    } catch (error) {
      console.error('Erreur suppression page:', error);
    }
  };

  const toggleStatus = async (pageId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      const response = await fetch(`/api/admin/pages/${pageId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        loadPages();
      }
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Page',
      render: (page: PageContent) => (
        <div>
          <div className="font-medium">{page.title}</div>
          <div className="text-sm text-gray-500">/{page.slug}</div>
        </div>
      )
    },
    {
      key: 'author',
      header: 'Auteur',
      render: (page: PageContent) => page.author
    },
    {
      key: 'status',
      header: 'Statut',
      render: (page: PageContent) => (
        <Badge variant={page.status === 'published' ? 'success' : 'warning'}>
          {page.status === 'published' ? 'Publié' : 'Brouillon'}
        </Badge>
      )
    },
    {
      key: 'updatedAt',
      header: 'Dernière modification',
      render: (page: PageContent) => (
        <div className="text-sm">
          {new Date(page.updatedAt).toLocaleDateString('fr-FR')}
        </div>
      )
    }
  ];

  const actions = [
    {
      label: 'Voir',
      icon: <Eye size={16} />,
      onClick: (page: PageContent) => window.open(`/${page.slug}`, '_blank'),
      variant: 'secondary' as const,
      condition: (page: PageContent) => page.status === 'published'
    },
    {
      label: (page: PageContent) => page.status === 'published' ? 'Dépublier' : 'Publier',
      icon: <Globe size={16} />,
      onClick: (page: PageContent) => toggleStatus(page.id, page.status),
      variant: 'secondary' as const
    },
    {
      label: 'Modifier',
      icon: <Pencil size={16} />,
      onClick: (page: PageContent) => openPageModal(page),
      variant: 'primary' as const
    },
    {
      label: 'Supprimer',
      icon: <Trash2 size={16} />,
      onClick: (page: PageContent) => deletePage(page.id),
      variant: 'danger' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Pages</h1>
        <Button onClick={() => openPageModal()}>
          <Plus size={16} className="mr-2" />
          Nouvelle page
        </Button>
      </div>

      <Card>
        <Table
          data={pages}
          columns={columns}
          actions={actions}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPage?.id ? 'Modifier la page' : 'Nouvelle page'}
        maxWidth="full"
      >
        {editingPage && (
          <PageForm
            page={editingPage}
            onSave={savePage}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

const PageForm: React.FC<{
  page: PageContent;
  onSave: (page: PageContent) => void;
  onCancel: () => void;
}> = ({ page, onSave, onCancel }) => {
  const [formData, setFormData] = useState(page);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[éèêë]/g, 'e')
      .replace(/[àâä]/g, 'a')
      .replace(/[ïî]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/[ûüù]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (title: string) => {
    const newSlug = !formData.id ? generateSlug(title) : formData.slug;
    setFormData({
      ...formData,
      title,
      slug: newSlug,
      seo: {
        ...formData.seo,
        title: title || formData.seo.title
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          type="button"
          className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('content')}
        >
          Contenu
        </button>
        <button
          type="button"
          className={`px-4 py-2 font-medium ${activeTab === 'seo' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('seo')}
        >
          SEO
        </button>
      </div>

      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Titre de la page"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
            <Input
              label="Slug (URL)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              help="L'URL de la page: example.com/[slug]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu de la page
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Rédigez le contenu de votre page..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
            <Input
              label="Auteur"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>
        </div>
      )}

      {activeTab === 'seo' && (
        <div className="space-y-4">
          <Input
            label="Titre SEO"
            value={formData.seo.title}
            onChange={(e) => setFormData({ 
              ...formData, 
              seo: { ...formData.seo, title: e.target.value }
            })}
            help="Titre qui apparaîtra dans les résultats de recherche (50-60 caractères)"
          />

          <Input
            label="Description SEO"
            value={formData.seo.description}
            onChange={(e) => setFormData({ 
              ...formData, 
              seo: { ...formData.seo, description: e.target.value }
            })}
            multiline
            rows={3}
            help="Description qui apparaîtra dans les résultats de recherche (150-160 caractères)"
          />

          <Input
            label="Mots-clés (séparés par des virgules)"
            value={formData.seo.keywords.join(', ')}
            onChange={(e) => setFormData({ 
              ...formData, 
              seo: { 
                ...formData.seo, 
                keywords: e.target.value.split(',').map(kw => kw.trim()).filter(Boolean)
              }
            })}
            help="Mots-clés principaux pour cette page"
          />

          <Input
            label="Image Open Graph (URL)"
            value={formData.seo.ogImage || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              seo: { ...formData.seo, ogImage: e.target.value }
            })}
            help="Image qui apparaîtra lors du partage sur les réseaux sociaux"
          />

          <Input
            label="URL Canonique"
            value={formData.seo.canonicalUrl || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              seo: { ...formData.seo, canonicalUrl: e.target.value }
            })}
            help="URL principale pour éviter le contenu dupliqué"
          />
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default PageManagement;