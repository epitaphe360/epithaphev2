// ========================================
// CMS Dashboard - Création/Édition d'Événement
// ========================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Calendar, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input, Textarea, Select } from '../../components/Input';
import { RichTextEditor } from '../../components/RichTextEditor';
import { FileUpload } from '../../components/FileUpload';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/api';
import { Event, EventFormData } from '../../types';
import { EVENT_TEMPLATES, EventTemplate } from '../../types/templates';

export const EventForm: React.FC = () => {
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
    isOnline: false,
    registrationUrl: '',
    maxAttendees: undefined,
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
        isOnline: event.isOnline || false,
        registrationUrl: event.registrationUrl || '',
        maxAttendees: event.maxAttendees,
        status: event.status,
        metaTitle: event.metaTitle || '',
        metaDescription: event.metaDescription || '',
      });
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
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        template: selectedTemplate,
        templateData,
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
                label="Speakers (un par ligne)"
                placeholder="John Doe - CEO TechCorp&#10;Jane Smith - CTO StartupX"
                value={templateData.speakers || ''}
                onChange={(e) => setTemplateData({ ...templateData, speakers: e.target.value })}
                rows={4}
              />
              <Input
                label="Programme (lien PDF)"
                placeholder="https://example.com/programme.pdf"
                value={templateData.programUrl || ''}
                onChange={(e) => setTemplateData({ ...templateData, programUrl: e.target.value })}
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
              <Select
                label="Niveau requis"
                value={templateData.level || 'beginner'}
                onChange={(e) => setTemplateData({ ...templateData, level: e.target.value })}
                options={[
                  { value: 'beginner', label: 'Débutant' },
                  { value: 'intermediate', label: 'Intermédiaire' },
                  { value: 'advanced', label: 'Avancé' },
                ]}
              />
              <Textarea
                label="Matériel requis"
                placeholder="Liste du matériel nécessaire..."
                value={templateData.requirements || ''}
                onChange={(e) => setTemplateData({ ...templateData, requirements: e.target.value })}
                rows={3}
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
                label="Lien de connexion"
                placeholder="https://zoom.us/j/..."
                value={templateData.meetingUrl || ''}
                onChange={(e) => setTemplateData({ ...templateData, meetingUrl: e.target.value })}
              />
              <Input
                label="Plateforme"
                placeholder="Zoom, Google Meet, Teams..."
                value={templateData.platform || ''}
                onChange={(e) => setTemplateData({ ...templateData, platform: e.target.value })}
              />
              <Input
                label="Lien d'enregistrement (après l'événement)"
                placeholder="https://youtube.com/..."
                value={templateData.recordingUrl || ''}
                onChange={(e) => setTemplateData({ ...templateData, recordingUrl: e.target.value })}
              />
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
                label="Secteurs ciblés"
                placeholder="Tech, Finance, Marketing..."
                value={templateData.targetIndustries || ''}
                onChange={(e) => setTemplateData({ ...templateData, targetIndustries: e.target.value })}
              />
              <Input
                label="Code vestimentaire"
                placeholder="Business casual, Formel..."
                value={templateData.dressCode || ''}
                onChange={(e) => setTemplateData({ ...templateData, dressCode: e.target.value })}
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
                label="Artiste principal"
                placeholder="Nom de l'artiste"
                value={templateData.headliner || ''}
                onChange={(e) => setTemplateData({ ...templateData, headliner: e.target.value })}
              />
              <Textarea
                label="Première partie (optionnel)"
                placeholder="Noms des artistes en première partie..."
                value={templateData.supportActs || ''}
                onChange={(e) => setTemplateData({ ...templateData, supportActs: e.target.value })}
                rows={2}
              />
              <Input
                label="Genre musical"
                placeholder="Rock, Jazz, Pop..."
                value={templateData.genre || ''}
                onChange={(e) => setTemplateData({ ...templateData, genre: e.target.value })}
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
              <Input
                label="Artiste(s) / Exposant(s)"
                placeholder="Noms des artistes"
                value={templateData.artists || ''}
                onChange={(e) => setTemplateData({ ...templateData, artists: e.target.value })}
              />
              <Input
                label="Thème de l'exposition"
                placeholder="Art moderne, Photographie..."
                value={templateData.theme || ''}
                onChange={(e) => setTemplateData({ ...templateData, theme: e.target.value })}
              />
              <Input
                label="Vernissage (date et heure)"
                type="datetime-local"
                value={templateData.vernissageDate || ''}
                onChange={(e) => setTemplateData({ ...templateData, vernissageDate: e.target.value })}
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
              <Textarea
                label="Lineup / Programme"
                placeholder="Liste des activités et artistes..."
                value={templateData.lineup || ''}
                onChange={(e) => setTemplateData({ ...templateData, lineup: e.target.value })}
                rows={5}
              />
              <Input
                label="Nombre de scènes/espaces"
                type="number"
                value={templateData.stages || ''}
                onChange={(e) => setTemplateData({ ...templateData, stages: e.target.value })}
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
              <Input
                label="Type de cérémonie"
                placeholder="Remise de prix, Inauguration..."
                value={templateData.ceremonyType || ''}
                onChange={(e) => setTemplateData({ ...templateData, ceremonyType: e.target.value })}
              />
              <Input
                label="Maître de cérémonie"
                placeholder="Nom du MC"
                value={templateData.host || ''}
                onChange={(e) => setTemplateData({ ...templateData, host: e.target.value })}
              />
              <Textarea
                label="Ordre du jour"
                placeholder="Déroulement de la cérémonie..."
                value={templateData.agenda || ''}
                onChange={(e) => setTemplateData({ ...templateData, agenda: e.target.value })}
                rows={4}
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
              <Input
                label="Type de compétition"
                placeholder="Hackathon, Sport, Quiz..."
                value={templateData.competitionType || ''}
                onChange={(e) => setTemplateData({ ...templateData, competitionType: e.target.value })}
              />
              <Textarea
                label="Règlement (ou lien)"
                placeholder="Règles de la compétition..."
                value={templateData.rules || ''}
                onChange={(e) => setTemplateData({ ...templateData, rules: e.target.value })}
                rows={4}
              />
              <Input
                label="Prix / Récompenses"
                placeholder="1er prix: 10,000 MAD, 2ème..."
                value={templateData.prizes || ''}
                onChange={(e) => setTemplateData({ ...templateData, prizes: e.target.value })}
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
                label="Communauté"
                placeholder="React Developers Morocco..."
                value={templateData.community || ''}
                onChange={(e) => setTemplateData({ ...templateData, community: e.target.value })}
              />
              <Textarea
                label="Talks / Présentations"
                placeholder="Liste des talks avec speakers..."
                value={templateData.talks || ''}
                onChange={(e) => setTemplateData({ ...templateData, talks: e.target.value })}
                rows={4}
              />
              <Input
                label="Sponsor(s) (optionnel)"
                placeholder="Nom des sponsors"
                value={templateData.sponsors || ''}
                onChange={(e) => setTemplateData({ ...templateData, sponsors: e.target.value })}
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
              onClick={() => window.open(`/evenements/${formData.slug}`, '_blank')}
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
          <Card>
            <CardContent className="p-6 space-y-6">
              <Input
                label="Titre"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Nom de l'événement"
                required
              />

              <Input
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="url-de-l-evenement"
              />

              <Textarea
                label="Description courte"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Résumé de l'événement..."
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
                label="Description complète"
                value={formData.content}
                onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
              />
            </CardContent>
          </Card>

          {/* Template-specific fields */}
          {renderTemplateFields()}

          {/* Lieu */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Lieu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Nom du lieu"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Ex: Sofitel Casablanca"
              />

              <Textarea
                label="Adresse complète"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Adresse, ville, code postal..."
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Date & Heure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Début"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />

              <Input
                label="Fin"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Inscriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Capacité max"
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => setFormData((prev) => ({ 
                  ...prev, 
                  capacity: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                placeholder="Illimité"
              />

              <Input
                label="Prix (MAD)"
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  price: e.target.value || undefined
                }))}
                placeholder="Gratuit"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent>
              {formData.featuredImage ? (
                <div className="space-y-4">
                  <img
                    src={formData.featuredImage}
                    alt="Event"
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

export default EventForm;
