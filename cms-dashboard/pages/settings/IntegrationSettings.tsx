// ========================================
// CMS Dashboard - Paramètres d'Intégration
// ========================================

import React, { useState, useEffect } from 'react';
import { Save, Mail, Share2, Code } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input, Textarea } from '../../components/Input';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/simple-api';

export const IntegrationSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // SMTP
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smtpFromEmail: '',
    smtpFromName: '',
    // Social Media
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    // External Services
    disqusShortname: '',
    mailchimpApiKey: '',
    stripePublicKey: '',
    customScripts: '',
  });

  const toast = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const api = getApi();
      const response = await api.get('/settings/integrations');
      setFormData(response.data);
    } catch (error) {
      console.error('Error loading integration settings:', error);
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
      await api.put('/settings/integrations', formData);
      toast.success('Succès', 'Paramètres d\'intégration enregistrés');
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
        <h1 className="text-2xl font-bold text-gray-900">Paramètres d'Intégration</h1>
        <p className="text-gray-600">Connectez votre site aux services externes</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SMTP Settings */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Configuration SMTP
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Pour l'envoi d'emails (formulaires de contact, notifications, etc.)
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hôte SMTP
                </label>
                <Input
                  name="smtpHost"
                  value={formData.smtpHost}
                  onChange={handleChange}
                  placeholder="smtp.example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port
                </label>
                <Input
                  name="smtpPort"
                  value={formData.smtpPort}
                  onChange={handleChange}
                  placeholder="587"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <Input
                  name="smtpUser"
                  value={formData.smtpUser}
                  onChange={handleChange}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <Input
                  type="password"
                  name="smtpPassword"
                  value={formData.smtpPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email d'expédition
                </label>
                <Input
                  type="email"
                  name="smtpFromEmail"
                  value={formData.smtpFromEmail}
                  onChange={handleChange}
                  placeholder="noreply@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'expédition
                </label>
                <Input
                  name="smtpFromName"
                  value={formData.smtpFromName}
                  onChange={handleChange}
                  placeholder="Mon Site"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Social Media */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Réseaux sociaux
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <Input
                type="url"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="https://facebook.com/monentreprise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter (X)
              </label>
              <Input
                type="url"
                name="twitterUrl"
                value={formData.twitterUrl}
                onChange={handleChange}
                placeholder="https://twitter.com/monentreprise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <Input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/monentreprise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <Input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/monentreprise"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube
              </label>
              <Input
                type="url"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/@monentreprise"
              />
            </div>
          </div>
        </Card>

        {/* External Services */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Services externes
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disqus Shortname (Commentaires)
              </label>
              <Input
                name="disqusShortname"
                value={formData.disqusShortname}
                onChange={handleChange}
                placeholder="mon-site"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mailchimp API Key (Newsletter)
              </label>
              <Input
                name="mailchimpApiKey"
                value={formData.mailchimpApiKey}
                onChange={handleChange}
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stripe Public Key (Paiements)
              </label>
              <Input
                name="stripePublicKey"
                value={formData.stripePublicKey}
                onChange={handleChange}
                placeholder="pk_live_..."
              />
            </div>
          </div>
        </Card>

        {/* Custom Scripts */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Scripts personnalisés
            </h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scripts HTML personnalisés (Head)
            </label>
            <Textarea
              name="customScripts"
              value={formData.customScripts}
              onChange={handleChange}
              placeholder="<script>...</script>"
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ces scripts seront ajoutés dans le &lt;head&gt; de chaque page
            </p>
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

export default IntegrationSettings;
