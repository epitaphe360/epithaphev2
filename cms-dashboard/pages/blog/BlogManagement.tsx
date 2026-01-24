import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Eye, Calendar, Tag } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { Badge } from '../../components/Badge';
import { RichTextEditor } from '../../components/RichTextEditor';
import { BlogPost, SEOData } from '../../types/website-types';
import { useApi } from '../../hooks/useApi';

export const BlogManagement: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const { get, post, put, delete: deleteApi } = useApi();

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    try {
      const data = await get(`/api/admin/posts?status=${filter}`);
      setPosts(data);
    } catch (error) {
      console.error('Erreur chargement articles:', error);
    }
  };

  const openPostModal = (post?: BlogPost) => {
    setEditingPost(post || {
      id: '',
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      tags: [],
      category: '',
      author: '',
      publishedAt: new Date(),
      status: 'draft',
      seo: {
        title: '',
        description: '',
        keywords: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    setIsModalOpen(true);
  };

  const savePost = async (postData: BlogPost) => {
    try {
      if (postData.id) {
        await put(`/api/admin/posts/${postData.id}`, postData);
      } else {
        await post('/api/admin/posts', postData);
      }
      loadPosts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur sauvegarde article:', error);
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    
    try {
      await deleteApi(`/api/admin/posts/${postId}`);
      loadPosts();
    } catch (error) {
      console.error('Erreur suppression article:', error);
    }
  };

  const toggleStatus = async (postId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await put(`/api/admin/posts/${postId}/status`, { status: newStatus });
      loadPosts();
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Article',
      render: (post: BlogPost) => (
        <div>
          <div className="font-medium">{post.title}</div>
          <div className="text-sm text-gray-500 mt-1">{post.excerpt}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="info">{post.category}</Badge>
            {post.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'author',
      header: 'Auteur',
      render: (post: BlogPost) => post.author
    },
    {
      key: 'status',
      header: 'Statut',
      render: (post: BlogPost) => (
        <Badge variant={post.status === 'published' ? 'success' : 'warning'}>
          {post.status === 'published' ? 'Publié' : 'Brouillon'}
        </Badge>
      )
    },
    {
      key: 'publishedAt',
      header: 'Date',
      render: (post: BlogPost) => (
        <div className="text-sm">
          {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
        </div>
      )
    }
  ];

  const actions = [
    {
      label: 'Voir',
      icon: <Eye size={16} />,
      onClick: (post: BlogPost) => window.open(`/blog/${post.slug}`, '_blank'),
      variant: 'secondary' as const,
      condition: (post: BlogPost) => post.status === 'published'
    },
    {
      label: (post: BlogPost) => post.status === 'published' ? 'Dépublier' : 'Publier',
      icon: <Calendar size={16} />,
      onClick: (post: BlogPost) => toggleStatus(post.id, post.status),
      variant: 'secondary' as const
    },
    {
      label: 'Modifier',
      icon: <Pencil size={16} />,
      onClick: (post: BlogPost) => openPostModal(post),
      variant: 'primary' as const
    },
    {
      label: 'Supprimer',
      icon: <Trash2 size={16} />,
      onClick: (post: BlogPost) => deletePost(post.id),
      variant: 'danger' as const
    }
  ];

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Articles</h1>
        <Button onClick={() => openPostModal()}>
          <Plus size={16} className="mr-2" />
          Nouvel article
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
        >
          Tous ({posts.length})
        </Button>
        <Button
          variant={filter === 'published' ? 'primary' : 'secondary'}
          onClick={() => setFilter('published')}
        >
          Publiés ({posts.filter(p => p.status === 'published').length})
        </Button>
        <Button
          variant={filter === 'draft' ? 'primary' : 'secondary'}
          onClick={() => setFilter('draft')}
        >
          Brouillons ({posts.filter(p => p.status === 'draft').length})
        </Button>
      </div>

      <Card>
        <Table
          data={filteredPosts}
          columns={columns}
          actions={actions}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost?.id ? 'Modifier l\'article' : 'Nouvel article'}
        maxWidth="full"
      >
        {editingPost && (
          <BlogPostForm
            post={editingPost}
            onSave={savePost}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

const BlogPostForm: React.FC<{
  post: BlogPost;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}> = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState(post);
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
              label="Titre"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>

          <Input
            label="Extrait"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            multiline
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Catégorie"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <Input
              label="Tags (séparés par des virgules)"
              value={formData.tags.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              })}
            />
          </div>

          <Input
            label="Image à la une (URL)"
            value={formData.featuredImage || ''}
            onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Rédigez votre article..."
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
            help="Idéalement entre 50-60 caractères"
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
            help="Idéalement entre 150-160 caractères"
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
          />

          <Input
            label="Image Open Graph (URL)"
            value={formData.seo.ogImage || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              seo: { ...formData.seo, ogImage: e.target.value }
            })}
          />

          <Input
            label="URL Canonique"
            value={formData.seo.canonicalUrl || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              seo: { ...formData.seo, canonicalUrl: e.target.value }
            })}
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

export default BlogManagement;