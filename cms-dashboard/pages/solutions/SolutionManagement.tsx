import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Eye, Grid, List } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { Badge } from '../../components/Badge';
import { RichTextEditor } from '../../components/RichTextEditor';
import { Solution, SEOData } from '../../types/website-types';
import { useApi } from '../../lib/simple-api';

export const SolutionManagement: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const { get, post, put, delete: deleteApi } = useApi();

  useEffect(() => {
    loadSolutions();
    loadCategories();
  }, []);

  const loadSolutions = async () => {
    try {
      const data = await get('/api/admin/solutions');
      setSolutions(data);
    } catch (error) {
      console.error('Erreur chargement solutions:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await get('/api/admin/solutions/categories');
      setCategories(data);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    }
  };

  const openSolutionModal = (solution?: Solution) => {
    setEditingSolution(solution || {
      id: '',
      slug: '',
      label: '',
      category: '',
      description: '',
      heroTitle: '',
      heroSubtitle: '',
      heroImage: '',
      needs: [],
      content: '',
      isActive: true,
      order: solutions.length,
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

  const saveSolution = async (solutionData: Solution) => {
    try {
      if (solutionData.id) {
        await put(`/api/admin/solutions/${solutionData.id}`, solutionData);
      } else {
        await post('/api/admin/solutions', solutionData);
      }
      loadSolutions();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur sauvegarde solution:', error);
    }
  };

  const deleteSolution = async (solutionId: string) => {
    if (!confirm('Supprimer cette solution ?')) return;
    
    try {
      await deleteApi(`/api/admin/solutions/${solutionId}`);
      loadSolutions();
    } catch (error) {
      console.error('Erreur suppression solution:', error);
    }
  };

  const toggleStatus = async (solutionId: string, currentStatus: boolean) => {
    try {
      await put(`/api/admin/solutions/${solutionId}/status`, { isActive: !currentStatus });
      loadSolutions();
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  const columns = [
    {
      key: 'label',
      header: 'Solution',
      render: (solution: Solution) => (
        <div>
          <div className="font-medium">{solution.label}</div>
          <div className="text-sm text-gray-500">{solution.description}</div>
          <Badge variant="info" className="mt-1">{solution.category}</Badge>
        </div>
      )
    },
    {
      key: 'needs',
      header: 'Besoins couverts',
      render: (solution: Solution) => (
        <div className="text-sm">
          {solution.needs.slice(0, 3).map((need, index) => (
            <div key={index} className="truncate">{need}</div>
          ))}
          {solution.needs.length > 3 && (
            <div className="text-gray-500">+{solution.needs.length - 3} autres</div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Statut',
      render: (solution: Solution) => (
        <Badge variant={solution.isActive ? 'success' : 'secondary'}>
          {solution.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      )
    },
    {
      key: 'order',
      header: 'Ordre',
      render: (solution: Solution) => solution.order
    }
  ];

  const actions = [
    {
      label: 'Voir',
      icon: <Eye size={16} />,
      onClick: (solution: Solution) => window.open(`/solutions/${solution.slug}`, '_blank'),
      variant: 'secondary' as const,
      condition: (solution: Solution) => solution.isActive
    },
    {
      label: (solution: Solution) => solution.isActive ? 'Désactiver' : 'Activer',
      icon: <Grid size={16} />,
      onClick: (solution: Solution) => toggleStatus(solution.id, solution.isActive),
      variant: 'secondary' as const
    },
    {
      label: 'Modifier',
      icon: <Pencil size={16} />,
      onClick: (solution: Solution) => openSolutionModal(solution),
      variant: 'primary' as const
    },
    {
      label: 'Supprimer',
      icon: <Trash2 size={16} />,
      onClick: (solution: Solution) => deleteSolution(solution.id),
      variant: 'danger' as const
    }
  ];

  const filteredSolutions = solutions.filter(solution => {
    if (filter === 'all') return true;
    return solution.category === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Solutions</h1>
        <Button onClick={() => openSolutionModal()}>
          <Plus size={16} className="mr-2" />
          Nouvelle solution
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          onClick={() => setFilter('all')}
        >
          Toutes ({solutions.length})
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={filter === category ? 'primary' : 'secondary'}
            onClick={() => setFilter(category)}
          >
            {category} ({solutions.filter(s => s.category === category).length})
          </Button>
        ))}
      </div>

      <Card>
        <Table
          data={filteredSolutions}
          columns={columns}
          actions={actions}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSolution?.id ? 'Modifier la solution' : 'Nouvelle solution'}
        maxWidth="full"
      >
        {editingSolution && (
          <SolutionForm
            solution={editingSolution}
            categories={categories}
            onSave={saveSolution}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

const SolutionForm: React.FC<{
  solution: Solution;
  categories: string[];
  onSave: (solution: Solution) => void;
  onCancel: () => void;
}> = ({ solution, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState(solution);
  const [activeTab, setActiveTab] = useState<'content' | 'hero' | 'seo'>('content');

  const generateSlug = (label: string) => {
    return label
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

  const handleLabelChange = (label: string) => {
    const newSlug = !formData.id ? generateSlug(label) : formData.slug;
    setFormData({
      ...formData,
      label,
      slug: newSlug,
      seo: {
        ...formData.seo,
        title: label || formData.seo.title
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
          className={`px-4 py-2 font-medium ${activeTab === 'hero' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('hero')}
        >
          Section Hero
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
              label="Nom de la solution"
              value={formData.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              required
            />
            <Input
              label="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <Input
              label="Ordre d'affichage"
              type="number"
              value={formData.order.toString()}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            />
          </div>

          <Input
            label="Description courte"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={2}
            required
          />

          <Input
            label="Besoins couverts (un par ligne)"
            value={formData.needs.join('\n')}
            onChange={(e) => setFormData({ 
              ...formData, 
              needs: e.target.value.split('\n').filter(need => need.trim())
            })}
            multiline
            rows={4}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu détaillé
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Décrivez en détail cette solution..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <label htmlFor="isActive">Solution active</label>
          </div>
        </div>
      )}

      {activeTab === 'hero' && (
        <div className="space-y-4">
          <Input
            label="Titre principal"
            value={formData.heroTitle}
            onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
            required
          />

          <Input
            label="Sous-titre"
            value={formData.heroSubtitle}
            onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
            multiline
            rows={2}
          />

          <Input
            label="Image hero (URL)"
            value={formData.heroImage}
            onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
            help="URL de l'image principale qui sera affichée en haut de la page"
          />
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

export default SolutionManagement;