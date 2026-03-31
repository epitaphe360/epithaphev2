import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Layout, Navigation, Link as LinkIcon } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input, Textarea } from '../../components/Input';
import { FileUpload, ImagePreview } from '../../components/FileUpload';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/api';

export const AppearanceSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  // States for each group
  const [siteIdentity, setSiteIdentity] = useState({
    logo_url: '',
    logo_white_url: ''
  });
  
  const [navConfig, setNavConfig] = useState({
    nav_items: ''
  });
  
  const [footerConfig, setFooterConfig] = useState({
    footer_links_services: '',
    footer_links_company: ''
  });

  const [solutionsConfig, setSolutionsConfig] = useState({
    solutionCategories: '',
    metiersData: ''
  });

  const toast = useToast();

  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    try {
      const api = getApi();
      const [identityRes, navRes, footerRes, solutionsRes] = await Promise.all([
        api.get('/admin/settings/site_identity'),
        api.get('/admin/settings/nav_config'),
        api.get('/admin/settings/footer'),
        api.get('/admin/settings/solutions_data')
      ]);

      const identityData = identityRes.data?.data || {};
      const navData = navRes.data?.data || {};
      const footerData = footerRes.data?.data || {};
      const solutionsData = solutionsRes.data?.data || {};

      setSiteIdentity({
        logo_url: identityData.logo_url || '',
        logo_white_url: identityData.logo_white_url || ''
      });

      setNavConfig({
        nav_items: navData.nav_items 
          ? JSON.stringify(navData.nav_items, null, 2) 
          : '[\n  \n]'
      });

      setFooterConfig({
        footer_links_services: footerData.footer_links_services 
          ? JSON.stringify(footerData.footer_links_services, null, 2) 
          : '[\n  \n]',
        footer_links_company: footerData.footer_links_company 
          ? JSON.stringify(footerData.footer_links_company, null, 2) 
          : '[\n  \n]'
      });

      setSolutionsConfig({
        solutionCategories: solutionsData.solutionCategories 
          ? JSON.stringify(solutionsData.solutionCategories, null, 2) 
          : '',
        metiersData: solutionsData.metiersData 
          ? JSON.stringify(solutionsData.metiersData, null, 2) 
          : ''
      });

    } catch (error) {
      console.error('Error loading appearance settings:', error);
      toast.error('Erreur', 'Impossible de charger les paramètres d\'apparence');
    }
  };

  const handleUpload = async (field: keyof typeof siteIdentity, files: File[]) => {
    try {
      const api = getApi();
      const url = await api.media.upload(files[0]);
      setSiteIdentity(prev => ({ ...prev, [field]: url }));
      toast.success('Succès', 'Image téléchargée avec succès');
    } catch (error) {
      toast.error('Erreur', 'Impossible de télécharger l\'image');
    }
  };

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSiteIdentity(prev => ({ ...prev, [name]: value }));
  };

  const handleNavChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNavConfig({ nav_items: e.target.value });
  };

  const handleFooterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFooterConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSolutionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSolutionsConfig(prev => ({ ...prev, [name]: value }));
  };

  const validateJsonString = (str: string, fieldName: string) => {
    try {
      const parsed = JSON.parse(str);
      if (!Array.isArray(parsed)) {
         throw new Error('Doit être un tableau JSON');
      }
      return parsed;
    } catch (error: any) {
      throw new Error(`JSON invalide pour ${fieldName}: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate JSON fields before sending
      const parsedNavItems = validateJsonString(navConfig.nav_items, 'Menu de navigation');
      const parsedFooterServices = validateJsonString(footerConfig.footer_links_services, 'Liens Footer (Services)');
      const parsedFooterCompany = validateJsonString(footerConfig.footer_links_company, 'Liens Footer (Entreprise)');
      
      let parsedSolutionsCategories: any[] | null = null;
      let parsedMetiersData: any[] | null = null;
      if (solutionsConfig.solutionCategories) {
        parsedSolutionsCategories = validateJsonString(solutionsConfig.solutionCategories, 'Catégories de Solutions');
      }
      if (solutionsConfig.metiersData) {
        parsedMetiersData = validateJsonString(solutionsConfig.metiersData, 'Données Métiers');
      }

      const api = getApi();
      
      const promises = [
        api.put('/admin/settings', { 
          group: 'site_identity', 
          data: siteIdentity 
        }),
        api.put('/admin/settings', { 
          group: 'nav_config', 
          data: { nav_items: parsedNavItems } 
        }),
        api.put('/admin/settings', { 
          group: 'footer', 
          data: { 
            footer_links_services: parsedFooterServices,
            footer_links_company: parsedFooterCompany
          } 
        })
      ];

      if (parsedSolutionsCategories || parsedMetiersData) {
        promises.push(
          api.put('/admin/settings', {
            group: 'solutions_data',
            data: {
              ...(parsedSolutionsCategories ? { solutionCategories: parsedSolutionsCategories } : {}),
              ...(parsedMetiersData ? { metiersData: parsedMetiersData } : {})
            }
          })
        );
      }

      await Promise.all(promises);

      toast.success('Succès', 'Paramètres enregistrés avec succès');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Erreur de validation ou de sauvegarde', error.message || 'Impossible d\'enregistrer les paramètres');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Apparence</h1>
        <p className="text-slate-400">Gérez l\'identité visuelle, la navigation et le pied de page du site</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Site Identity */}
        <Card>
          <div className="p-6 border-b border-[#1E293B]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Identité du Site
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Logo principal (URL ou upload)
              </label>
              <div className="flex gap-4 mb-2">
                <Input
                  name="logo_url"
                  value={siteIdentity.logo_url}
                  onChange={handleIdentityChange}
                  placeholder="https://example.com/logo.png"
                  className="flex-1"
                />
              </div>
              {siteIdentity.logo_url ? (
                <div className="mt-2 text-slate-400 text-sm mb-4">Aperçu direct:</div>
              ) : null}
              {siteIdentity.logo_url ? (
                <ImagePreview
                  src={siteIdentity.logo_url}
                  onRemove={() => setSiteIdentity(prev => ({ ...prev, logo_url: '' }))}
                />
              ) : (
                <FileUpload
                  onUpload={(files) => handleUpload('logo_url', files)}
                  accept="image/*"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Logo blanc / sombre (URL ou upload)
              </label>
              <div className="flex gap-4 mb-2">
                <Input
                  name="logo_white_url"
                  value={siteIdentity.logo_white_url}
                  onChange={handleIdentityChange}
                  placeholder="https://example.com/logo-white.png"
                  className="flex-1"
                />
              </div>
              {siteIdentity.logo_white_url ? (
                <div className="mt-2 text-slate-400 text-sm mb-4">Aperçu direct:</div>
              ) : null}
              {siteIdentity.logo_white_url ? (
                <div className="bg-slate-800 p-2 rounded inline-block">
                  <ImagePreview
                    src={siteIdentity.logo_white_url}
                    onRemove={() => setSiteIdentity(prev => ({ ...prev, logo_white_url: '' }))}
                  />
                </div>
              ) : (
                <FileUpload
                  onUpload={(files) => handleUpload('logo_white_url', files)}
                  accept="image/*"
                />
              )}
            </div>
          </div>
        </Card>

        {/* Navigation Config */}
        <Card>
          <div className="p-6 border-b border-[#1E293B]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Navigation Principale (JSON)
            </h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Éléments du Menu (Tableau JSON)
            </label>
            <Textarea
              className="font-mono text-sm"
              rows={12}
              value={navConfig.nav_items}
              onChange={handleNavChange}
              placeholder={'[\n  {\n    "label": "Accueil",\n    "href": "/"\n  }\n]'}
            />
            <p className="text-xs text-slate-500 mt-2">
              Format attendu : Un tableau d'objets avec propriétés (ex: label, href, subItems). Le code s'assurera qu'il s'agit bien d'un JSON valide.
            </p>
          </div>
        </Card>

        {/* Footer Config */}
        <Card>
          <div className="p-6 border-b border-[#1E293B]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Pied de page (Liens JSON)
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Liens "Nos Services" (Tableau JSON)
              </label>
              <Textarea
                className="font-mono text-sm"
                rows={8}
                name="footer_links_services"
                value={footerConfig.footer_links_services}
                onChange={handleFooterChange}
                placeholder={'[\n  {\n    "label": "Devis Objets 3D",\n    "href": "/services/objets3d"\n  }\n]'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Liens "Notre Entreprise" (Tableau JSON)
              </label>
              <Textarea
                className="font-mono text-sm"
                rows={8}
                name="footer_links_company"
                value={footerConfig.footer_links_company}
                onChange={handleFooterChange}
                placeholder={'[\n  {\n    "label": "À propos",\n    "href": "/about"\n  }\n]'}
              />
            </div>
          </div>
        </Card>

        {/* Solutions Config */}
        <Card>
          <div className="p-6 border-b border-[#1E293B]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layout className="w-5 h-5" />
              Données des Solutions (JSON)
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Catégories de Solutions (Tableau JSON)
              </label>
              <Textarea
                className="font-mono text-sm leading-relaxed"
                rows={12}
                name="solutionCategories"
                value={solutionsConfig.solutionCategories}
                onChange={handleSolutionsChange}
                placeholder={'[\n  {\n    "slug": "evenementiel",\n    "label": "Événementiel",\n    "items": [...]\n  }\n]'}
              />
              <p className="text-xs text-slate-500 mt-2">
                Définition de l'attribut <b>solutionCategories</b>. Laisser vide pour utiliser les données codées en dur (fallback).
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Données Métiers (Tableau JSON)
              </label>
              <Textarea
                className="font-mono text-sm leading-relaxed"
                rows={12}
                name="metiersData"
                value={solutionsConfig.metiersData}
                onChange={handleSolutionsChange}
                placeholder={'[\n  {\n    "slug": "evenementiel",\n    "label": "Événementiel",\n    "items": [...]\n  }\n]'}
              />
              <p className="text-xs text-slate-500 mt-2">
                Définition de l'attribut <b>metiersData</b>. Laisser vide pour utiliser les données codées en dur (fallback).
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end sticky bottom-6">
          <Button type="submit" disabled={loading} className="shadow-lg">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer les paramètres'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppearanceSettings;