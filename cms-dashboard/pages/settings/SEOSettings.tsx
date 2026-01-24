// ========================================
// CMS Dashboard - Paramètres SEO
// ========================================

import React, { useState, useEffect } from 'react';
import { Save, Search } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input, Textarea } from '../../components/Input';
import { FileUpload, ImagePreview } from '../../components/FileUpload';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/api';

export const SEOSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImage: '',
    googleAnalyticsId: '',
    googleSearchConsoleId: '',
    robotsTxt: '',
    sitemapEnabled: true,
  });

  const toast = useToast();

  const handleUpload = async (files: File[]) => {
    try {
      const api = getApi();
      const url = await api.media.upload(files[0]);
      setFormData(prev => ({ ...prev, ogImage: url }));
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
      const response = await api.get('/settings/seo');
      setFormData(response.data);
    } catch (error) {
      console.error('Error loading SEO settings:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const api = getApi();
      await api.put('/settings/seo', formData);
      toast.success('Succès', 'Paramètres SEO enregistrés');
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
        <h1 className="text-2xl font-bold text-gray-900">Paramètres SEO</h1>
        <p className="text-gray-600">Optimisez votre site pour les moteurs de recherche</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meta Tags */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Balises Meta par défaut
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre Meta
              </label>
              <Input
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="Mon Site - Slogan accrocheur"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.metaTitle.length}/60 caractères (recommandé)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description Meta
              </label>
              <Textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="Une description claire et attractive de votre site..."
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.metaDescription.length}/160 caractères (recommandé)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mots-clés Meta
              </label>
              <Input
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleChange}
                placeholder="mot-clé1, mot-clé2, mot-clé3"
              />
              <p className="text-xs text-gray-500 mt-1">
                Séparez les mots-clés par des virgules
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Open Graph
              </label>
              {formData.ogImage ? (
                <ImagePreview
                  src={formData.ogImage}
                  onRemove={() => setFormData(prev => ({ ...prev, ogImage: '' }))}
                />
              ) : (
                <FileUpload
                  onUpload={handleUpload}
                  accept="image/*"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format recommandé : JPG/PNG, 1200x630px
              </p>
            </div>
          </div>
        </Card>

        {/* Analytics */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Outils d'analyse
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <Input
                name="googleAnalyticsId"
                value={formData.googleAnalyticsId}
                onChange={handleChange}
                placeholder="G-XXXXXXXXXX ou UA-XXXXXXXXX-X"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Search Console ID
              </label>
              <Input
                name="googleSearchConsoleId"
                value={formData.googleSearchConsoleId}
                onChange={handleChange}
                placeholder="Code de vérification Search Console"
              />
            </div>
          </div>
        </Card>

        {/* Advanced */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Paramètres avancés
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu robots.txt
              </label>
              <Textarea
                name="robotsTxt"
                value={formData.robotsTxt}
                onChange={handleChange}
                placeholder="User-agent: *&#10;Disallow: /admin/"
                rows={6}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="sitemapEnabled"
                name="sitemapEnabled"
                checked={formData.sitemapEnabled}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="sitemapEnabled" className="ml-2 text-sm text-gray-700">
                Activer la génération automatique du sitemap
              </label>
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

export default SEOSettings;
