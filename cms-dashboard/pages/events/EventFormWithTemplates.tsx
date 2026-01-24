// ========================================
// CMS Dashboard - Création/Édition d'Événement avec Templates
// ========================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from '../../../hooks/useRouterParams';
import { ArrowLeft, Save, Eye, Calendar, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input, Textarea, Select } from '../../components/Input';
import { RichTextEditor } from '../../components/RichTextEditor';
import { FileUpload } from '../../components/FileUpload';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/simple-api';
import { Event, EventFormData } from '../../types';
import { EVENT_TEMPLATES, EventTemplate } from '../../types/templates';

export const EventFormWithTemplates: React.FC = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate>('CONFERENCE');
  const [templateData, setTemplateData] = useState<any>({});
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    featuredImage: '',
    startDate: '',
    endDate: '',
    location: '',
    address: '',
    capacity: undefined,
    price: undefined,
    status: 'DRAFT',
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    if (isEditing) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    setLoading(true);
    try {
      const api = getApi();
      const event = await api.events.getById(id!);
      setFormData({
        title: event.title,
        slug: event.slug,
        description: event.description || '',
        content: event.content || '',
        featuredImage: event.featuredImage || '',
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
        location: event.location || '',
        address: event.address || '',
        capacity: event.capacity,
        price: event.price,
        status: event.status,
        metaTitle: event.metaTitle || '',
        metaDescription: event.metaDescription || '',
      });
      if (event.template) {
        setSelectedTemplate(event.template);
      }
      if (event.templateData) {
        setTemplateData(event.templateData);
      }
    } catch (error) {
      toast.error('Erreur', 'Impossible de charger l\'événement');
      navigate('/admin/events');
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
      const data = {
        ...formData,
        template: selectedTemplate,
        templateData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };

      if (isEditing) {
        await api.events.update(id!, data);
        toast.success('Succès', 'Événement mis à jour');
      } else {
        await api.events.create(data);
        toast.success('Succès', 'Événement créé');
      }
      navigate('/admin/events');
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
      case 'CONFERENCE':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Conférence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Liste des speakers"
                placeholder="Jean Dupont - CEO, Marie Martin - CTO..."
                value={templateData.speakers || ''}
                onChange={(e) => setTemplateData({ ...templateData, speakers: e.target.value })}
                rows={3}
              />
              <Textarea
                label="Agenda"
                placeholder="09:00 - Keynote, 10:30 - Workshop..."
                value={templateData.agenda || ''}
                onChange={(e) => setTemplateData({ ...templateData, agenda: e.target.value })}
                rows={4}
              />
              <Input
                label="Tracks/Thématiques"
                placeholder="AI, Web3, Cloud (séparés par virgules)"
                value={templateData.tracks || ''}
                onChange={(e) => setTemplateData({ ...templateData, tracks: e.target.value })}
              />
            </CardContent>
          </Card>
        );

      case 'WORKSHOP':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Atelier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Formateur"
                placeholder="Nom du formateur"
                value={templateData.instructor || ''}
                onChange={(e) => setTemplateData({ ...templateData, instructor: e.target.value })}
              />
              <Textarea
                label="Bio du formateur"
                placeholder="Présentation du formateur..."
                value={templateData.instructorBio || ''}
                onChange={(e) => setTemplateData({ ...templateData, instructorBio: e.target.value })}
                rows={3}
              />
              <Textarea
                label="Matériel requis"
                placeholder="Ordinateur, logiciels, etc. (un par ligne)"
                value={templateData.materials || ''}
                onChange={(e) => setTemplateData({ ...templateData, materials: e.target.value })}
                rows={2}
              />
              <Input
                label="Nombre max de participants"
                type="number"
                value={templateData.maxParticipants || ''}
                onChange={(e) => setTemplateData({ ...templateData, maxParticipants: parseInt(e.target.value) })}
              />
            </CardContent>
          </Card>
        );

      case 'WEBINAR':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Webinaire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Plateforme"
                placeholder="Zoom, Google Meet, Teams..."
                value={templateData.platform || ''}
                onChange={(e) => setTemplateData({ ...templateData, platform: e.target.value })}
              />
              <Input
                label="Lien de la réunion"
                placeholder="https://zoom.us/j/..."
                value={templateData.meetingLink || ''}
                onChange={(e) => setTemplateData({ ...templateData, meetingLink: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="replayAvailable"
                  checked={templateData.replayAvailable || false}
                  onChange={(e) => setTemplateData({ ...templateData, replayAvailable: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="replayAvailable" className="text-sm text-gray-700">
                  Replay disponible après l'événement
                </label>
              </div>
              {templateData.replayAvailable && (
                <Input
                  label="Lien du replay"
                  placeholder="https://..."
                  value={templateData.replayLink || ''}
                  onChange={(e) => setTemplateData({ ...templateData, replayLink: e.target.value })}
                />
              )}
            </CardContent>
          </Card>
        );

      case 'NETWORKING':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Networking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Format"
                placeholder="Speed networking, cocktail, etc."
                value={templateData.format || ''}
                onChange={(e) => setTemplateData({ ...templateData, format: e.target.value })}
              />
              <Input
                label="Public cible"
                placeholder="Entrepreneurs, développeurs, etc."
                value={templateData.targetAudience || ''}
                onChange={(e) => setTemplateData({ ...templateData, targetAudience: e.target.value })}
              />
              <Input
                label="Secteurs d'activité"
                placeholder="Tech, Finance, Marketing (séparés par virgules)"
                value={templateData.industries || ''}
                onChange={(e) => setTemplateData({ ...templateData, industries: e.target.value })}
              />
            </CardContent>
          </Card>
        );

      case 'CONCERT':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Concert</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Salle / Venue"
                placeholder="Nom de la salle"
                value={templateData.venue || ''}
                onChange={(e) => setTemplateData({ ...templateData, venue: e.target.value })}
              />
              <Textarea
                label="Line-up"
                placeholder="Liste des artistes et horaires..."
                value={templateData.lineup || ''}
                onChange={(e) => setTemplateData({ ...templateData, lineup: e.target.value })}
                rows={4}
              />
            </CardContent>
          </Card>
        );

      case 'EXHIBITION':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Exposition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Artistes"
                placeholder="Liste des artistes (un par ligne)"
                value={templateData.artists || ''}
                onChange={(e) => setTemplateData({ ...templateData, artists: e.target.value })}
                rows={3}
              />
              <Input
                label="Curateur (optionnel)"
                placeholder="Nom du curateur"
                value={templateData.curator || ''}
                onChange={(e) => setTemplateData({ ...templateData, curator: e.target.value })}
              />
            </CardContent>
          </Card>
        );

      case 'FESTIVAL':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Festival</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Nombre de jours"
                type="number"
                value={templateData.days || ''}
                onChange={(e) => setTemplateData({ ...templateData, days: parseInt(e.target.value) })}
              />
              <Textarea
                label="Programme"
                placeholder="Jour 1: ...\nJour 2: ..."
                value={templateData.program || ''}
                onChange={(e) => setTemplateData({ ...templateData, program: e.target.value })}
                rows={4}
              />
              <Input
                label="Partenaires"
                placeholder="Partenaire 1, Partenaire 2..."
                value={templateData.partners || ''}
                onChange={(e) => setTemplateData({ ...templateData, partners: e.target.value })}
              />
            </CardContent>
          </Card>
        );

      case 'CEREMONY':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Cérémonie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Protocole"
                placeholder="Déroulement de la cérémonie..."
                value={templateData.protocol || ''}
                onChange={(e) => setTemplateData({ ...templateData, protocol: e.target.value })}
                rows={3}
              />
              <Input
                label="Dress code"
                placeholder="Formel, Business, Casual..."
                value={templateData.dressCode || ''}
                onChange={(e) => setTemplateData({ ...templateData, dressCode: e.target.value })}
              />
              <Input
                label="Invité d'honneur (optionnel)"
                placeholder="Nom de l'invité d'honneur"
                value={templateData.guestOfHonor || ''}
                onChange={(e) => setTemplateData({ ...templateData, guestOfHonor: e.target.value })}
              />
            </CardContent>
          </Card>
        );

      case 'COMPETITION':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Compétition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label="Règlement"
                placeholder="Règles de la compétition..."
                value={templateData.rules || ''}
                onChange={(e) => setTemplateData({ ...templateData, rules: e.target.value })}
                rows={4}
              />
              <Textarea
                label="Prix"
                placeholder="1er: ..., 2ème: ..., 3ème: ..."
                value={templateData.prizes || ''}
                onChange={(e) => setTemplateData({ ...templateData, prizes: e.target.value })}
                rows={3}
              />
              <Input
                label="Date limite d'inscription"
                type="date"
                value={templateData.registrationDeadline || ''}
                onChange={(e) => setTemplateData({ ...templateData, registrationDeadline: e.target.value })}
              />
            </CardContent>
          </Card>
        );

      case 'MEETUP':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Options Meetup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Thème"
                placeholder="Thème du meetup"
                value={templateData.theme || ''}
                onChange={(e) => setTemplateData({ ...templateData, theme: e.target.value })}
              />
              <Input
                label="Sponsors"
                placeholder="Sponsor 1, Sponsor 2... (séparés par virgules)"
                value={templateData.sponsors || ''}
                onChange={(e) => setTemplateData({ ...templateData, sponsors: e.target.value })}
              />
              <Input
                label="Taille cible"
                type="number"
                placeholder="Nombre de participants attendus"
                value={templateData.targetSize || ''}
                onChange={(e) => setTemplateData({ ...templateData, targetSize: parseInt(e.target.value) })}
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
            onClick={() => navigate('/admin/events')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Modifier l\'événement' : 'Nouvel événement'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && formData.slug && (
            <Button
              variant="secondary"
              onClick={() => window.open(`/events/${formData.slug}`, '_blank')}
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
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Titre"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Titre de l'événement"
                required
              />

              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="url-de-l-evenement"
              />

              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Courte description de l'événement..."
                rows={3}
              />

              <Select
                label="Type d'événement"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as EventTemplate)}
                options={EVENT_TEMPLATES.map((t) => ({
                  value: t.value,
                  label: `${t.label} - ${t.description}`,
                }))}
              />

              <RichTextEditor
                label="Contenu détaillé"
                value={formData.content}
                onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
              />
            </CardContent>
          </Card>

          {/* Template-specific fields */}
          {renderTemplateFields()}

          {/* Date et lieu */}
          <Card>
            <CardHeader>
              <CardTitle><Calendar className="w-5 h-5 inline mr-2" />Date et lieu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date de début"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  required
                />
                <Input
                  label="Date de fin"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>

              <Input
                label="Lieu"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Nom du lieu"
                icon={<MapPin className="w-4 h-4" />}
              />

              <Textarea
                label="Adresse complète"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Adresse complète..."
                rows={2}
              />
            </CardContent>
          </Card>

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
          {/* Publication */}
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
                  { value: 'CANCELLED', label: 'Annulé' },
                ]}
              />
            </CardContent>
          </Card>

          {/* Capacité et tarif */}
          <Card>
            <CardHeader>
              <CardTitle><Users className="w-5 h-5 inline mr-2" />Capacité et tarif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Capacité (optionnel)"
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value ? parseInt(e.target.value) : undefined }))}
                placeholder="Nombre de places"
              />

              <Input
                label="Prix (MAD)"
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value ? parseFloat(e.target.value) : undefined }))}
                placeholder="0 pour gratuit"
              />
            </CardContent>
          </Card>

          {/* Image à la une */}
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

export default EventFormWithTemplates;
