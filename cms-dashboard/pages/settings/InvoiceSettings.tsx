// ========================================
// CMS Dashboard - Paramètres de facturation
// ========================================

import React, { useState, useEffect } from 'react';
import { Save, FileText, Building2 } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useToast } from '../../components/Toast';

interface InvoiceConfig {
  companyName:    string;
  companyAddress: string;
  companyCity:    string;
  companyEmail:   string;
  companyPhone:   string;
  rc:             string;  // Registre du Commerce
  ice:            string;  // Identifiant Commun de l'Entreprise
  if_number:      string;  // Identifiant Fiscal
  tva_rate:       string;  // Taux TVA (défaut: 20)
  payment_terms:  string;  // Conditions de paiement
}

const DEFAULTS: InvoiceConfig = {
  companyName:    'Epitaphe 360',
  companyAddress: '',
  companyCity:    'Casablanca, Maroc',
  companyEmail:   'contact@epitaphe360.com',
  companyPhone:   '',
  rc:             '',
  ice:            '',
  if_number:      '',
  tva_rate:       '20',
  payment_terms:  'Paiement immédiat',
};

export const InvoiceSettings: React.FC = () => {
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm]         = useState<InvoiceConfig>(DEFAULTS);
  const toast = useToast();

  const token   = localStorage.getItem('cms_token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings/invoice', { headers });
      if (res.ok) {
        const { data } = await res.json();
        const d = data as Record<string, string>;
        setForm({
          companyName:    d.companyName    ?? DEFAULTS.companyName,
          companyAddress: d.companyAddress ?? DEFAULTS.companyAddress,
          companyCity:    d.companyCity    ?? DEFAULTS.companyCity,
          companyEmail:   d.companyEmail   ?? DEFAULTS.companyEmail,
          companyPhone:   d.companyPhone   ?? DEFAULTS.companyPhone,
          rc:             d.rc             ?? DEFAULTS.rc,
          ice:            d.ice            ?? DEFAULTS.ice,
          if_number:      d.if_number      ?? DEFAULTS.if_number,
          tva_rate:       d.tva_rate       ?? DEFAULTS.tva_rate,
          payment_terms:  d.payment_terms  ?? DEFAULTS.payment_terms,
        });
      }
    } catch (err) {
      console.error('Erreur chargement paramètres facture', err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (field: keyof InvoiceConfig, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ group: 'invoice', data: form }),
      });
      if (res.ok) {
        toast.success('Sauvegardé', 'Paramètres de facturation mis à jour');
      } else {
        toast.error('Erreur', 'Impossible de sauvegarder');
      }
    } catch (err) {
      toast.error('Erreur', 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres de facturation</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ces informations apparaissent sur toutes les factures PDF générées automatiquement.
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {loading ? 'Sauvegarde…' : 'Sauvegarder'}
        </Button>
      </div>

      {/* Bloc identité société */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <Building2 className="h-5 w-5" />
            <h2 className="font-semibold text-gray-800">Identité de la société</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la société *
              </label>
              <Input
                value={form.companyName}
                onChange={e => handleChange('companyName', e.target.value)}
                placeholder="Epitaphe 360 SARL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de contact *
              </label>
              <Input
                type="email"
                value={form.companyEmail}
                onChange={e => handleChange('companyEmail', e.target.value)}
                placeholder="contact@epitaphe360.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <Input
                value={form.companyAddress}
                onChange={e => handleChange('companyAddress', e.target.value)}
                placeholder="Rue Bussang, Maarif"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <Input
                value={form.companyCity}
                onChange={e => handleChange('companyCity', e.target.value)}
                placeholder="Casablanca, Maroc"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <Input
                value={form.companyPhone}
                onChange={e => handleChange('companyPhone', e.target.value)}
                placeholder="+212 5XX XX XX XX"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloc registres légaux */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <FileText className="h-5 w-5" />
            <h2 className="font-semibold text-gray-800">Registres légaux (obligatoires Maroc)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RC — Registre du Commerce *
              </label>
              <Input
                value={form.rc}
                onChange={e => handleChange('rc', e.target.value)}
                placeholder="123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ICE — Identifiant Commun Entreprise *
              </label>
              <Input
                value={form.ice}
                onChange={e => handleChange('ice', e.target.value)}
                placeholder="001234567890123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IF — Identifiant Fiscal *
              </label>
              <Input
                value={form.if_number}
                onChange={e => handleChange('if_number', e.target.value)}
                placeholder="12345678"
              />
            </div>
          </div>
          <p className="text-xs text-amber-600 mt-3 bg-amber-50 p-2 rounded">
            ⚠️ Ces numéros sont requis par la DGI Maroc pour la conformité fiscale. Renseignez-les avant d'émettre des factures officielles.
          </p>
        </CardContent>
      </Card>

      {/* Bloc conditions factures */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="font-semibold text-gray-800 mb-4">Conditions de facturation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux TVA (%)
              </label>
              <Input
                type="number"
                value={form.tva_rate}
                onChange={e => handleChange('tva_rate', e.target.value)}
                placeholder="20"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conditions de paiement
              </label>
              <Input
                value={form.payment_terms}
                onChange={e => handleChange('payment_terms', e.target.value)}
                placeholder="Paiement immédiat"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSettings;
