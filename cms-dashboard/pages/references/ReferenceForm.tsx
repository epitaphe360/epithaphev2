// ========================================
// Module Références Clients — Formulaire
// ========================================
import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { getApi } from '../../lib/api';

const ALL_SECTORS = ['Industrie', 'Santé', 'Luxe & Retail', 'Tech & Digital', 'Finance', 'Énergie', 'Agroalimentaire'];

interface Ref {
  id?: string;
  name: string;
  slug: string;
  logo: string;
  sectors: string[];
  description: string;
  projectDescription: string;
  caseStudyUrl: string;
  website: string;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
}

const EMPTY: Ref = {
  name: '', slug: '', logo: '', sectors: [], description: '',
  projectDescription: '', caseStudyUrl: '', website: '',
  isFeatured: false, isPublished: true, order: 0,
};

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function ReferenceForm({ reference, onClose }: { reference: Partial<Ref> | null; onClose: (s: boolean) => void }) {
  const [form, setForm] = useState<Ref>({ ...EMPTY, ...reference });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm({ ...EMPTY, ...reference }); }, [reference]);

  const set = (k: keyof Ref, v: any) => setForm((f) => {
    const u = { ...f, [k]: v };
    if (k === 'name' && !reference?.id) u.slug = slugify(v);
    return u;
  });

  const toggleSector = (s: string) =>
    set('sectors', form.sectors.includes(s) ? form.sectors.filter((x) => x !== s) : [...form.sectors, s]);

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Nom requis');
    if (!form.slug.trim()) return alert('Slug requis');
    setSaving(true);
    try {
      const api = getApi();
      if (form.id) await api.put(`/admin/references/${form.id}`, form);
      else await api.post('/admin/references', form);
      onClose(true);
    } catch (err: any) {
      alert(err?.response?.data?.error ?? 'Erreur');
    } finally { setSaving(false); }
  };

  const inp = (label: string, key: keyof Ref, req = false) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}{req && <span className="text-[#C8A96E] ml-1">*</span>}</label>
      <input
        type="text" value={(form[key] as string) ?? ''}
        onChange={(e) => set(key, e.target.value)}
        className="w-full px-3 py-2.5 bg-[#0B1121] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-[#C8A96E] transition-colors"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#0B1121] border border-[#1E293B] rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
          <h2 className="text-lg font-bold text-white">{form.id ? 'Modifier la référence' : 'Nouvelle référence'}</h2>
          <button onClick={() => onClose(false)}><X className="w-5 h-5 text-slate-400 hover:text-white" /></button>
        </div>
        <div className="p-6 space-y-5">
          {inp('Nom du client', 'name', true)}
          {inp('Slug URL', 'slug', true)}
          {inp('URL du logo', 'logo')}
          {inp('Site web', 'website')}

          {/* Sectors */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Secteurs d'activité</label>
            <div className="flex flex-wrap gap-2">
              {ALL_SECTORS.map((s) => (
                <button
                  key={s} type="button"
                  onClick={() => toggleSector(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    form.sectors.includes(s)
                      ? 'bg-[#C8A96E]/20 border-[#C8A96E] text-[#C8A96E]'
                      : 'border-[#334155] text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description courte</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 bg-[#0B1121] border border-[#334155] rounded-xl text-white text-sm resize-none focus:outline-none focus:border-[#C8A96E]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description du projet</label>
            <textarea
              value={form.projectDescription}
              onChange={(e) => set('projectDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 bg-[#0B1121] border border-[#334155] rounded-xl text-white text-sm resize-none focus:outline-none focus:border-[#C8A96E]"
            />
          </div>
          {inp('URL étude de cas', 'caseStudyUrl')}

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-[#C8A96E]" />
                <span className="text-sm text-slate-300">Mise en avant</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer ml-4">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="w-4 h-4 accent-[#C8A96E]" />
                <span className="text-sm text-slate-300">Publié</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Ordre</label>
              <input type="number" value={form.order} onChange={(e) => set('order', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-[#0B1121] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-[#1E293B]">
          <button onClick={() => onClose(false)} className="px-5 py-2.5 rounded-xl border border-[#334155] text-slate-300 hover:text-white text-sm transition-colors">Annuler</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A96E] text-black font-semibold hover:bg-[#DFC28F] text-sm transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}
