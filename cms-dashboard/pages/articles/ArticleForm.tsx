// ========================================
// CMS Dashboard - Création/Édition d'Article
// ========================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from '../../hooks/useRouterParams';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input, Textarea, Select } from '../../components/Input';
import { RichTextEditor } from '../../components/RichTextEditor';
import { FileUpload, ImagePreview } from '../../components/FileUpload';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/api';
import { Article, ArticleFormData } from '../../types';
import { ARTICLE_TEMPLATES, ArticleTemplate } from '../../types/templates';

export const ArticleForm: React.FC = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ArticleTemplate>('STANDARD');
  const [templateData, setTemplateData] = useState<any>({});
  
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    status: 'DRAFT',
    categoryId: '',
    tags: [],
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadArticle();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const api = getApi();
      const response = await api.get('/categories');
      // S'assurer que c'est un array
      setCategories(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      setCategories([]);
    }
  };

  const loadArticle = async () => {
    setLoading(true);
    try {
      const api = getApi();
      const article = await api.articles.getById(id!);
      setFormData({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || '',
        content: article.content,
        featuredImage: article.featuredImage || '',
        status: article.status,
        categoryId: article.categoryId || '',
        tags: article.tags || [],
        metaTitle: article.metaTitle || '',
        metaDescription: article.metaDescription || '',
      });
    } catch (error) {
      toast.error('Erreur', 'Impossible de charger l\'article');
      navigate('/admin/articles');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const api = getApi();
      const dataToSave = {
        ...formData,
        template: selectedTemplate,
        templateData,
      };
      
      if (isEditing) {
        await api.articles.update(id!, dataToSave);
        toast.success('Succès', 'Article mis à jour');
      } else {
        await api.articles.create(dataToSave);
        toast.success('Succès', 'Article créé');
      }
      navigate('/admin/articles');
    } catch (error: any) {
      toast.error('Erreur', error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (files: File[]) => {
    try {
      const api = getApi();
      const response = await api.media.upload(files[0]);
      setFormData((prev) => ({ ...prev, featuredImage: response.url }));
      toast.success('Succès', 'Image uploadée');
    } catch (error) {
      toast.error('Erreur', 'Impossible d\'uploader l\'image');
    }
  };

  const renderTemplateFields = () => {
    switch (selectedTemplate) {
      case 'GALLERY':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Galerie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Ajoutez plusieurs images dans le contenu principal avec l'éditeur
              </p>
            </CardContent>
          </Card>
        );

      case 'VIDEO':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Vidéo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="URL de la vidéo"
                placeholder="https://youtube.com/watch?v=..."
                value={templateData.videoUrl || ''}
                onChange={(e) => setTemplateData({ ...templateData, videoUrl: e.target.value })}
              />
              <Textarea
                label="Code d'intégration (optionnel)"
                placeholder="<iframe src=...></iframe>"
                value={templateData.embedCode || ''}
                onChange={(e) => setTemplateData({ ...templateData, embedCode: e.target.value })}
                rows={3}
              />
            </CardContent>
          </Card>
        );

      case 'QUOTE':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Citation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Citation"
                placeholder="Le texte de la citation..."
                value={templateData.quote || ''}
                onChange={(e) => setTemplateData({ ...templateData, quote: e.target.value })}
                rows={3}
              />
              <Input
                label="Auteur"
                placeholder="Nom de l'auteur"
                value={templateData.author || ''}
                onChange={(e) => setTemplateData({ ...templateData, author: e.target.value })}
              />
              <Input
                label="Titre/Fonction (optionnel)"
                placeholder="PDG, Écrivain, etc."
                value={templateData.authorTitle || ''}
                onChange={(e) => setTemplateData({ ...templateData, authorTitle: e.target.value })}
              />
            </CardContent>
          </Card>
        );

      case 'LINK':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Partage de Lien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="URL du lien"
                placeholder="https://example.com"
                value={templateData.linkUrl || ''}
                onChange={(e) => setTemplateData({ ...templateData, linkUrl: e.target.value })}
              />
              <Input
                label="Titre du lien"
                placeholder="Titre accrocheur"
                value={templateData.linkTitle || ''}
                onChange={(e) => setTemplateData({ ...templateData, linkTitle: e.target.value })}
              />
            </CardContent>
          </Card>
        );

      case 'INTERVIEW':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Interview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Nom de l'interviewé"
                placeholder="Jean Dupont"
                value={templateData.interviewee || ''}
                onChange={(e) => setTemplateData({ ...templateData, interviewee: e.target.value })}
              />
              <Input
                label="Titre/Fonction"
                placeholder="CEO de XYZ Corp"
                value={templateData.intervieweeTitle || ''}
                onChange={(e) => setTemplateData({ ...templateData, intervieweeTitle: e.target.value })}
              />
              <p className="text-sm text-gray-600">
                Ajoutez les questions et réponses dans le contenu principal
              </p>
            </CardContent>
          </Card>
        );

      case 'REVIEW':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Critique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Note"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="8.5"
                  value={templateData.rating || ''}
                  onChange={(e) => setTemplateData({ ...templateData, rating: parseFloat(e.target.value) })}
                />
                <Input
                  label="Note maximale"
                  type="number"
                  value="10"
                  disabled
                />
              </div>
              <Textarea
                label="Verdict final"
                placeholder="Résumé de la critique..."
                value={templateData.verdict || ''}
                onChange={(e) => setTemplateData({ ...templateData, verdict: e.target.value })}
                rows={3}
              />
            </CardContent>
          </Card>
        );

      case 'TUTORIAL':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Tutoriel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Niveau de difficulté"
                value={templateData.difficulty || 'beginner'}
                onChange={(e) => setTemplateData({ ...templateData, difficulty: e.target.value })}
                options={[
                  { value: 'beginner', label: 'Débutant' },
                  { value: 'intermediate', label: 'Intermédiaire' },
                  { value: 'advanced', label: 'Avancé' },
                ]}
              />
              <Input
                label="Durée estimée"
                placeholder="30 minutes"
                value={templateData.duration || ''}
                onChange={(e) => setTemplateData({ ...templateData, duration: e.target.value })}
              />
            </CardContent>
          </Card>
        );

      case 'CASE_STUDY':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Étude de Cas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Client"
                placeholder="Nom du client"
                value={templateData.client || ''}
                onChange={(e) => setTemplateData({ ...templateData, client: e.target.value })}
              />
              <Input
                label="Secteur"
                placeholder="E-commerce, Tech, etc."
                value={templateData.industry || ''}
                onChange={(e) => setTemplateData({ ...templateData, industry: e.target.value })}
              />
              <Textarea
                label="Problématique"
                placeholder="Quel était le problème ?"
                value={templateData.problem || ''}
                onChange={(e) => setTemplateData({ ...templateData, problem: e.target.value })}
                rows={3}
              />
              <Textarea
                label="Solution"
                placeholder="Comment avez-vous résolu le problème ?"
                value={templateData.solution || ''}
                onChange={(e) => setTemplateData({ ...templateData, solution: e.target.value })}
                rows={3}
              />
            </CardContent>
          </Card>
        );

      case 'NEWS':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Actualité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Source"
                placeholder="Nom de la source"
                value={templateData.source || ''}
                onChange={(e) => setTemplateData({ ...templateData, source: e.target.value })}
              />
              <Input
                label="Date de l'événement"
                type="date"
                value={templateData.eventDate || ''}
                onChange={(e) => setTemplateData({ ...templateData, eventDate: e.target.value })}
              />
              <Input
                label="Lieu (optionnel)"
                placeholder="Paris, France"
                value={templateData.location || ''}
                onChange={(e) => setTemplateData({ ...templateData, location: e.target.value })}
              />
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/articles')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Modifier l\'article' : 'Nouvel article'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && formData.slug && (
            <Button
              variant="secondary"
              onClick={() => window.open(`/blog/${formData.slug}`, '_blank')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir
            </Button>
          )}
          <Button onClick={handleSubmit} loading={saving}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Mettre à jour' : 'Publier'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <Input
                label="Titre"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Titre de l'article"
                required
              />

              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="url-de-l-article"
              />

              <Textarea
                label="Extrait"
                value={formData.excerpt}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Résumé court de l'article..."
                rows={3}
              />

              <Select
                label="Type d'article"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as ArticleTemplate)}
                options={ARTICLE_TEMPLATES.map((t) => ({
                  value: t.value,
                  label: `${t.label} - ${t.description}`,
                }))}
              />

              <RichTextEditor
                label="Contenu"
                value={formData.content}
                onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
              />
            </CardContent>
          </Card>

          {/* Template-specific fields */}
          {renderTemplateFields()}

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Meta Title"
                value={formData.metaTitle}
                onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                placeholder="Titre pour les moteurs de recherche"
              />

              <Textarea
                label="Meta Description"
                value={formData.metaDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                placeholder="Description pour les moteurs de recherche..."
                rows={2}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Statut"
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                options={[
                  { value: 'DRAFT', label: 'Brouillon' },
                  { value: 'PUBLISHED', label: 'Publié' },
                  { value: 'ARCHIVED', label: 'Archivé' },
                ]}
              />

              <Select
                label="Catégorie"
                value={formData.categoryId}
                onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                options={[
                  { value: '', label: 'Sélectionner...' },
                  ...(Array.isArray(categories) ? categories.map((cat) => ({ value: cat.id, label: cat.name })) : []),
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image à la une</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.featuredImage ? (
                <div className="space-y-4">
                  <img
                    src={formData.featuredImage}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setFormData((prev) => ({ ...prev, featuredImage: '' }))}
                  >
                    Supprimer l'image
                  </Button>
                </div>
              ) : (
                <FileUpload
                  onUpload={handleImageUpload}
                  accept="image/*"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
