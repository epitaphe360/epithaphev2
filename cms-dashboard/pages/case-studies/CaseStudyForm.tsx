// ========================================
// Module Études de Cas — Formulaire
// ========================================
import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { getApi } from '../../lib/api';
import { toast } from '../../lib/toast';

interface KPI { label: string; value: string; }
interface CaseStudy {
  id?: string;
  title: string;
  slug: string;
  clientName: string;
  problem: string;
  solution: string;
  results: string;
  kpis: KPI[];
  gallery: string[];
  relatedServiceSlugs: string[];
  featuredImage: string;
  status: string;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
}

const EMPTY: CaseStudy = {
  title: '', slug: '', clientName: '', problem: '', solution: '', results: '',
  kpis: [], gallery: [], relatedServiceSlugs: [], featuredImage: '',
  status: 'draft', isFeatured: false, metaTitle: '', metaDescription: '',
};

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function CaseStudyForm({ caseStudy, onClose }: { caseStudy: Partial<CaseStudy> | null; onClose: (s: boolean) => void }) {
  const [form, setForm] = useState<CaseStudy>({ ...EMPTY, ...caseStudy, kpis: caseStudy?.kpis ?? [], gallery: caseStudy?.gallery ?? [], relatedServiceSlugs: caseStudy?.relatedServiceSlugs ?? [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm({ ...EMPTY, ...caseStudy, kpis: caseStudy?.kpis ?? [], gallery: caseStudy?.gallery ?? [], relatedServiceSlugs: caseStudy?.relatedServiceSlugs ?? [] }); }, [caseStudy]);

  const set = (k: keyof CaseStudy, v: any) => setForm((f) => {
    const u = { ...f, [k]: v };
    if (k === 'title' && !caseStudy?.id) u.slug = slugify(v);
    return u;
  });

  const addKPI = () => set('kpis', [...form.kpis, { label: '', value: '' }]);
  const removeKPI = (i: number) => set('kpis', form.kpis.filter((_, idx) => idx !== i));
  const setKPI = (i: number, k: keyof KPI, v: string) => set('kpis', form.kpis.map((x, idx) => idx === i ? { ...x, [k]: v } : x));

  const addGalleryUrl = () => set('gallery', [...form.gallery, '']);
  const removeGallery = (i: number) => set('gallery', form.gallery.filter((_, idx) => idx !== i));
  const setGallery = (i: number, v: string) => set('gallery', form.gallery.map((x, idx) => idx === i ? v : x));

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error('Titre requis');
    setSaving(true);
    try {
      const api = getApi();
      if (form.id) await api.put(`/admin/case-studies/${form.id}`, form);
      else await api.post('/admin/case-studies', form);
      onClose(true);
    } catch (err: any) { toast.error(err?.response?.data?.error ?? 'Erreur'); }
    finally { setSaving(false); }
  };

  const textarea = (label: string, key: keyof CaseStudy, rows = 3) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
      <textarea value={(form[key] as string) ?? ''} onChange={(e) => set(key, e.target.value)} rows={rows}
        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm resize-none focus:outline-none focus:border-[#C8A96E]" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? 'Modifier l\'étude' : 'Nouvelle étude de cas'}</h2>
          <button onClick={() => onClose(false)}><X className="w-5 h-5 text-gray-500 hover:text-gray-700" /></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Identité */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Titre <span className="text-[#C8A96E]">*</span></label>
              <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => set('slug', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Client</label>
            <input type="text" value={form.clientName} onChange={(e) => set('clientName', e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Image principale (URL)</label>
            <input type="text" value={form.featuredImage} onChange={(e) => set('featuredImage', e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
          </div>

          {/* Contenu */}
          {textarea('Problématique', 'problem', 3)}
          {textarea('Solution apportée', 'solution', 3)}
          {textarea('Résultats & impact', 'results', 3)}

          {/* KPIs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-600">KPIs & Métriques</label>
              <button type="button" onClick={addKPI} className="text-xs flex items-center gap-1 text-[#C8A96E] hover:text-[#DFC28F]">
                <Plus className="w-3 h-3" /> Ajouter
              </button>
            </div>
            {form.kpis.map((kpi, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input placeholder="Libellé (ex: Gain de temps)" value={kpi.label} onChange={(e) => setKPI(i, 'label', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
                <input placeholder="Valeur (ex: +40%)" value={kpi.value} onChange={(e) => setKPI(i, 'value', e.target.value)}
                  className="w-32 px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
                <button type="button" onClick={() => removeKPI(i)} className="p-2 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          {/* Gallery */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-600">Galerie d'images (URLs)</label>
              <button type="button" onClick={addGalleryUrl} className="text-xs flex items-center gap-1 text-[#C8A96E] hover:text-[#DFC28F]">
                <Plus className="w-3 h-3" /> Ajouter URL
              </button>
            </div>
            {form.gallery.map((url, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input placeholder="https://..." value={url} onChange={(e) => setGallery(i, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
                <button type="button" onClick={() => removeGallery(i)} className="p-2 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          {/* Status + Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Statut</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
            <div className="flex items-center mt-7">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-[#C8A96E]" />
                <span className="text-sm text-gray-600">À la une</span>
              </label>
            </div>
          </div>

          {/* SEO */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">SEO</p>
            <div className="space-y-3">
              <input placeholder="Meta titre" type="text" value={form.metaTitle} onChange={(e) => set('metaTitle', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
              <textarea placeholder="Meta description" value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} rows={2}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm resize-none focus:outline-none focus:border-[#C8A96E]" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button onClick={() => onClose(false)} className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:text-gray-700 text-sm transition-colors">Annuler</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A96E] text-black font-semibold hover:bg-[#DFC28F] text-sm transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}
