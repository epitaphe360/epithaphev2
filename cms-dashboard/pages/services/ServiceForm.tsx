// ========================================
// Module Services — Formulaire Création/Édition
// ========================================
import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { getApi } from '../../lib/api';
import { toast } from '../../lib/toast';

interface Service {
  id?: string;
  title: string;
  slug: string;
  hub: string;
  accroche: string;
  body: string;
  heroImage: string;
  status: string;
  featured: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
}

const EMPTY: Service = {
  title: '', slug: '', hub: 'evenements', accroche: '', body: '',
  heroImage: '', status: 'DRAFT', featured: false, order: 0,
  metaTitle: '', metaDescription: '',
};

const HUB_OPTIONS = [
  { value: 'evenements',             label: 'Événements Stratégiques' },
  { value: 'architecture-de-marque', label: 'Architecture de Marque' },
  { value: 'la-fabrique',            label: 'La Fabrique' },
  { value: 'qhse',                   label: 'QHSE' },
];

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

interface ServiceFormProps {
  service: Partial<Service> | null;
  onClose: (saved: boolean) => void;
}

export function ServiceForm({ service, onClose }: ServiceFormProps) {
  const [form, setForm] = useState<Service>({ ...EMPTY, ...service });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm({ ...EMPTY, ...service });
  }, [service]);

  const handleChange = (key: keyof Service, value: any) => {
    setForm((f) => {
      const updated = { ...f, [key]: value };
      if (key === 'title' && !service?.id) {
        updated.slug = slugify(value);
        if (!updated.metaTitle) updated.metaTitle = value;
      }
      return updated;
    });
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim())    e.title = 'Titre requis';
    if (!form.slug.trim())     e.slug  = 'Slug requis';
    if (!form.hub.trim())      e.hub   = 'Hub requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const api = getApi();
      if (form.id) {
        await api.put(`/admin/services/${form.id}`, form);
      } else {
        await api.post('/admin/services', form);
      }
      onClose(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof Service, type = 'text', required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1.5">
        {label} {required && <span className="text-[#C8A96E]">*</span>}
      </label>
      <input
        type={type}
        value={(form[key] as string) ?? ''}
        onChange={(e) => handleChange(key, e.target.value)}
        className={`w-full px-3 py-2.5 bg-white border rounded-xl text-gray-900 placeholder-slate-500 focus:outline-none focus:border-[#C8A96E] transition-colors text-sm ${
          errors[key] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            {form.id ? 'Modifier le service' : 'Nouveau service'}
          </h2>
          <button onClick={() => onClose(false)} className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Hub selector */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Hub <span className="text-[#C8A96E]">*</span>
            </label>
            <select
              value={form.hub}
              onChange={(e) => handleChange('hub', e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#C8A96E] transition-colors text-sm"
            >
              {HUB_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {field('Titre', 'title', 'text', true)}
          {field('Slug URL', 'slug', 'text', true)}

          {/* Accroche */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Accroche stratégique</label>
            <textarea
              value={form.accroche ?? ''}
              onChange={(e) => handleChange('accroche', e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-slate-500 focus:outline-none focus:border-[#C8A96E] transition-colors text-sm resize-none"
              placeholder="Message clé du service (max. 180 caractères)"
            />
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Contenu détaillé</label>
            <textarea
              value={form.body ?? ''}
              onChange={(e) => handleChange('body', e.target.value)}
              rows={6}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-slate-500 focus:outline-none focus:border-[#C8A96E] transition-colors text-sm resize-none font-mono"
              placeholder="Contenu HTML/Markdown..."
            />
          </div>

          {field('Image Hero (URL)', 'heroImage')}

          {/* Status + Featured + Order */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Statut</label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#C8A96E] transition-colors text-sm"
              >
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
                <option value="ARCHIVED">Archivé</option>
              </select>
            </div>
            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="w-4 h-4 accent-[#C8A96E]"
                />
                <span className="text-sm text-gray-600">Mis en avant</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Ordre</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-[#C8A96E] transition-colors text-sm"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">SEO</p>
            <div className="space-y-4">
              {field('Meta Title', 'metaTitle')}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Meta Description</label>
                <textarea
                  value={form.metaDescription ?? ''}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-slate-500 focus:outline-none focus:border-[#C8A96E] transition-colors text-sm resize-none"
                  placeholder="Description pour les moteurs de recherche (max. 160 car.)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => onClose(false)}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:text-gray-700 hover:border-slate-400 transition-colors text-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A96E] text-black font-semibold hover:bg-[#DFC28F] transition-colors text-sm disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}
