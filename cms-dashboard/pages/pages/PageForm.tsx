// ========================================
// CMS Dashboard - Création/Édition de Page
// ========================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from '../../hooks/useRouterParams';
import { ArrowLeft, Save, Eye, Plus, Trash2, GripVertical, FileText, AlertTriangle, Sparkles } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input, Textarea, Select } from '../../components/Input';
import { RichTextEditor } from '../../components/RichTextEditor';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/api';
import { Page, PageSection } from '../../types';
import { PAGE_TEMPLATES, getTemplateById } from '../../types/page-templates';
import ServicePageEditor, { type ServicePageSections } from './ServicePageEditor';

interface PageFormData {
  title: string;
  slug: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  template: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sections: PageSection[];
}

const defaultSection: Partial<PageSection> = {
  type: 'text',
  title: '',
  content: '',
  order: 0,
};

const sectionTypes = [
  { value: 'hero', label: 'Hero Banner' },
  { value: 'text', label: 'Texte' },
  { value: 'image', label: 'Image' },
  { value: 'gallery', label: 'Galerie' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'features', label: 'Fonctionnalités' },
  { value: 'testimonials', label: 'Témoignages' },
  { value: 'contact', label: 'Contact' },
];

export const PageForm: React.FC = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [serviceSections, setServiceSections] = useState<ServicePageSections>({
    heroTitle: '', heroSubtitle: '', pitchTitle: '', pitchBody: '',
    serviceBlocks: [], ctaTitle: '', ctaBody: '',
  });
  
  const [formData, setFormData] = useState<PageFormData>({
    title: '',
    slug: '',
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    template: 'default',
    status: 'DRAFT',
    sections: [],
  });

  useEffect(() => {
    if (isEditing) {
      loadPage();
    }
  }, [id]);

  // Détecte si les sections ont été créées/éditées avec l'éditeur visuel Puck
  // (les sections Puck ont des champs propres comme backgroundImage, ctaHref, subtitle
  // mais PAS de champ 'content' utilisé par l'éditeur legacy)
  const detectPuckSections = (sections: any[]): boolean => {
    if (!sections || sections.length === 0) return false;
    const PUCK_ONLY_FIELDS = ['backgroundImage', 'ctaHref', 'ctaLabel', 'backgroundType',
      'backgroundGradient', 'pretitle', 'bgColor', 'bgImage', 'align', 'emoji'];
    return sections.some((s) =>
      // Format Puck imbriqué (from-template)
      (s.props && typeof s.props === 'object') ||
      // Format Puck aplati (sauvegarde PuckSectionsEditor)
      PUCK_ONLY_FIELDS.some((f) => s[f] !== undefined)
    );
  };
  const isPuckPage = isEditing && detectPuckSections(formData.sections);

  // Liste des slugs dont le contenu est rendu par des composants React (pas en BDD)
  const REACT_RENDERED_SLUGS = new Set<string>([
    'a-propos', 'about', 'architecture-de-marque', 'evenements', 'la-fabrique',
    'nos-poles', 'nos-references', 'blog', 'contact', 'outils', 'ressources', 'services',
  ]);
  const isReactRendered = REACT_RENDERED_SLUGS.has(formData.slug)
    || formData.slug.startsWith('architecture-de-marque/')
    || formData.slug.startsWith('evenements/')
    || formData.slug.startsWith('la-fabrique/')
    || formData.slug.startsWith('nos-poles/');
  const isHome = formData.slug === 'home';

  const loadPage = async () => {
    setLoading(true);
    try {
      const api = getApi();
      const page = await api.pages.getById(id!);
      const tpl = page.template || 'default';
      setFormData({
        title: page.title,
        slug: page.slug,
        featuredImage: page.featuredImage || '',
        metaTitle: page.metaTitle || '',
        metaDescription: page.metaDescription || '',
        template: tpl,
        status: page.status,
        sections: page.sections || [],
      });
      // If SERVICE_PAGE, load sections into dedicated editor state
      if (tpl === 'SERVICE_PAGE' && page.sections && !Array.isArray(page.sections)) {
        setServiceSections(page.sections as unknown as ServicePageSections);
      }
    } catch (error) {
      toast.error('Erreur', 'Impossible de charger la page');
      navigate('/admin/pages');
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

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          ...defaultSection,
          id: `temp-${Date.now()}`,
          order: prev.sections.length,
        } as PageSection,
      ],
    }));
  };

  const updateSection = (index: number, updates: Partial<PageSection>) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, ...updates } : section
      ),
    }));
  };

  const removeSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    setFormData((prev) => {
      const sections = Array.from(prev.sections);
      const [moved] = sections.splice(result.source.index, 1);
      sections.splice(result.destination.index, 0, moved);
      return { ...prev, sections: sections.map((s, i) => ({ ...s, order: i })) };
    });
  };

  const applyTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (!template) return;

    setFormData((prev) => ({
      ...prev,
      title: prev.title || template.name,
      slug: prev.slug || generateSlug(template.name),
      sections: template.sections.map((section, index) => ({
        ...section,
        id: `temp-${Date.now()}-${index}`,
      })) as PageSection[],
    }));

    setShowTemplateSelector(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const api = getApi();
      // For SERVICE_PAGE templates, inject serviceSections as the sections payload
      const payload = formData.template === 'SERVICE_PAGE'
        ? { ...formData, sections: serviceSections as unknown as PageSection[] }
        : formData;
      if (isEditing) {
        await api.pages.update(id!, payload);
        toast.success('Succès', 'Page mise à jour');
      } else {
        await api.pages.create(payload);
        toast.success('Succès', 'Page créée');
      }
      navigate('/admin/pages');
    } catch (error: any) {
      toast.error('Erreur', error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
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
            onClick={() => navigate('/admin/pages')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Modifier la page' : 'Nouvelle page'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && formData.slug && (
            <Button
              variant="secondary"
              onClick={() => window.open(`/${formData.slug}`, '_blank')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir
            </Button>
          )}
          <Button onClick={handleSubmit} loading={saving}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {isHome && (
            <Card>
              <CardContent className="p-4 flex items-start gap-3 bg-pink-50 border border-pink-200 rounded-lg">
                <Sparkles className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-pink-900">Page d'accueil — éditeur dédié</p>
                  <p className="text-sm text-pink-800 mt-1">
                    La page d'accueil utilise un éditeur de sections structuré (Hero, Pôles, Stats, etc.).
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    type="button"
                    className="mt-2"
                    onClick={() => navigate('/admin/pages/home/sections')}
                  >
                    Ouvrir l'éditeur de sections
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {isPuckPage && (
            <Card>
              <CardContent className="p-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900">Contenu géré par des composants Puck</p>
                  <p className="text-sm text-amber-800 mt-1">
                    Cette page utilise le <strong>constructeur visuel</strong>. Les sections et leur contenu
                    sont stockés au format Puck — ils n'apparaissent pas dans les champs "Contenu" ci-dessous.
                    Pour modifier le texte, les images et les blocs de cette page, utilisez l'éditeur visuel.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    type="button"
                    className="mt-2"
                    onClick={() => navigate(`/admin/pages/${formData.slug}/sections`)}
                  >
                    Ouvrir l'éditeur visuel Puck
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {!isHome && !isPuckPage && isReactRendered && (
            <Card>
              <CardContent className="p-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900">Contenu géré par des composants React</p>
                  <p className="text-sm text-amber-800 mt-1">
                    Cette page (<code className="px-1 bg-amber-100 rounded">/{formData.slug}</code>) est affichée par un composant React du site,
                    pas par le CMS. Le contenu visible publiquement est codé dans <code className="px-1 bg-amber-100 rounded">client/src/pages/</code> et
                    n'est pas modifiable depuis ce formulaire. Vous pouvez tout de même modifier ici les méta-données
                    (titre, slug, SEO) et le statut.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-6 space-y-6">
              <Input
                label="Titre"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de la page"
              />

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplateSelector(true)}
                  type="button"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Modèle
                </Button>
                {formData.template !== 'SERVICE_PAGE' && (
                  <Button variant="secondary" size="sm" onClick={addSection} type="button">
                    <Plus className="w-4 h-4 mr-2" />
                    Section
                  </Button>
                )}
              </div>

              <Input
                label="Slug (URL)"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="url-de-la-page"
              />
            </CardContent>
          </Card>

          {/* Sections */}
          {formData.template === 'SERVICE_PAGE' ? (
            <ServicePageEditor
              value={serviceSections}
              onChange={setServiceSections}
            />
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sections</CardTitle>
                <Button variant="secondary" size="sm" onClick={addSection} type="button">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une section
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.sections.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune section. Cliquez sur "Ajouter une section" pour commencer.
                  </div>
                ) : (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="page-sections">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {formData.sections.map((section, index) => (
                    <Draggable key={section.id || String(index)} draggableId={section.id || String(index)} index={index}>
                      {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className={`border rounded-lg p-4 space-y-4 ${snap.isDragging ? 'border-blue-400 shadow-lg bg-blue-50/5' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div {...prov.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          </div>
                          <span className="font-medium">Section {index + 1}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Select
                          label="Type"
                          value={section.type}
                          onChange={(e) => updateSection(index, { type: e.target.value })}
                          options={sectionTypes}
                        />
                        <Input
                          label="Titre"
                          value={section.title || ''}
                          onChange={(e) => updateSection(index, { title: e.target.value })}
                          placeholder="Titre de la section"
                        />
                      </div>

                      <RichTextEditor
                        label="Contenu"
                        value={section.content || ''}
                        onChange={(content) => updateSection(index, { content })}
                        minHeight="150px"
                      />
                    </div>
                      )}
                    </Draggable>
                  ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </CardContent>
            </Card>
          )}

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image principale (Hero / Open Graph)
                </label>
                <Input
                  value={formData.featuredImage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="https://... URL de l'image hero"
                />
                {formData.featuredImage && (
                  <img
                    src={formData.featuredImage}
                    alt="Aperçu"
                    className="mt-2 w-full h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Choisir un modèle</h2>
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PAGE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template.id)}
                    className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="text-xs text-gray-500">
                      {template.sections.length} section{template.sections.length > 1 ? 's' : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button variant="secondary" onClick={() => setShowTemplateSelector(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
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
                label="Template"
                value={formData.template}
                onChange={(e) => setFormData((prev) => ({ ...prev, template: e.target.value }))}
                options={[
                  { value: 'default', label: 'Par défaut' },
                  { value: 'full-width', label: 'Pleine largeur' },
                  { value: 'sidebar', label: 'Avec sidebar' },
                  { value: 'landing', label: 'Landing page' },
                  { value: 'SERVICE_PAGE', label: '🎯 Page de service' },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default PageForm;
