// ========================================
// CMS Dashboard - Paramètres Généraux
// ========================================

import React, { useState, useEffect } from 'react';
import { Save, Globe, Image as ImageIcon } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input, Textarea } from '../../components/Input';
import { FileUpload, ImagePreview } from '../../components/FileUpload';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/api';

export const GeneralSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    contactEmail: '',
    contactPhone: '',
    logo: '',
    favicon: '',
    copyrightText: '',
  });

  const toast = useToast();

  const handleUpload = async (field: string, files: File[]) => {
    try {
      const api = getApi();
      const url = await api.media.upload(files[0]);
      setFormData(prev => ({ ...prev, [field]: url }));
      toast.success('Succès', 'Image téléchargée');
    } catch (error) {
      toast.error('Erreur', 'Impossible de télécharger l\'image');
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const api = getApi();
      const response = await api.get('/settings/general');
      // S'assurer que tous les champs ont des valeurs définis (jamais undefined)
      const data = response.data || {};
      setFormData({
        siteName: data.siteName ?? '',
        siteDescription: data.siteDescription ?? '',
        siteUrl: data.siteUrl ?? '',
        contactEmail: data.contactEmail ?? '',
        contactPhone: data.contactPhone ?? '',
        logo: data.logo ?? '',
        favicon: data.favicon ?? '',
        copyrightText: data.copyrightText ?? '',
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      // Garder les valeurs par défaut
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const api = getApi();
      await api.put('/settings/general', formData);
      toast.success('Succès', 'Paramètres enregistrés');
    } catch (error) {
      toast.error('Erreur', 'Impossible d\'enregistrer les paramètres');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres Généraux</h1>
        <p className="text-gray-600">Configuration de base de votre site web</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Identity */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Identité du site
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du site *
              </label>
              <Input
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                placeholder="Mon Site Web"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description du site
              </label>
              <Textarea
                name="siteDescription"
                value={formData.siteDescription}
                onChange={handleChange}
                placeholder="Une brève description de votre site..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL du site *
              </label>
              <Input
                type="url"
                name="siteUrl"
                value={formData.siteUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Informations de contact
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de contact
              </label>
              <Input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone de contact
              </label>
              <Input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>
        </Card>

        {/* Branding */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Image de marque
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo du site
              </label>
              {formData.logo ? (
                <ImagePreview
                  src={formData.logo}
                  onRemove={() => setFormData(prev => ({ ...prev, logo: '' }))}
                />
              ) : (
                <FileUpload
                  onUpload={(files) => handleUpload('logo', files)}
                  accept="image/*"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format recommandé : PNG transparent, 200x60px
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon
              </label>
              {formData.favicon ? (
                <ImagePreview
                  src={formData.favicon}
                  onRemove={() => setFormData(prev => ({ ...prev, favicon: '' }))}
                />
              ) : (
                <FileUpload
                  onUpload={(files) => handleUpload('favicon', files)}
                  accept="image/*"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format recommandé : ICO ou PNG, 32x32px
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texte de copyright
              </label>
              <Input
                name="copyrightText"
                value={formData.copyrightText}
                onChange={handleChange}
                placeholder="© 2024 Mon Entreprise. Tous droits réservés."
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer les paramètres'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
