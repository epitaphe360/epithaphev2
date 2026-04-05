// ========================================
// Module Témoignages — Formulaire
// ========================================
import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Star } from 'lucide-react';
import { getApi } from '../../lib/api';

interface Testimonial {
  id?: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  companyName: string;
  companyLogo: string;
  rating: number;
  serviceSlug: string;
  isPublished: boolean;
  isFeatured: boolean;
  date: string;
  order: number;
}

const EMPTY: Testimonial = {
  quote: '', authorName: '', authorTitle: '', companyName: '',
  companyLogo: '', rating: 5, serviceSlug: '',
  isPublished: true, isFeatured: false, date: new Date().toISOString().slice(0, 10), order: 0,
};

export function TestimonialForm({ testimonial, onClose }: { testimonial: Partial<Testimonial> | null; onClose: (s: boolean) => void }) {
  const [form, setForm] = useState<Testimonial>({ ...EMPTY, ...testimonial });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm({ ...EMPTY, ...testimonial }); }, [testimonial]);

  const set = (k: keyof Testimonial, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.quote.trim()) return alert('Citation requise');
    if (!form.authorName.trim()) return alert('Nom de l\'auteur requis');
    setSaving(true);
    try {
      const api = getApi();
      if (form.id) await api.put(`/admin/testimonials/${form.id}`, form);
      else await api.post('/admin/testimonials', form);
      onClose(true);
    } catch (err: any) { alert(err?.response?.data?.error ?? 'Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? 'Modifier le témoignage' : 'Nouveau témoignage'}</h2>
          <button onClick={() => onClose(false)}><X className="w-5 h-5 text-gray-500 hover:text-gray-700" /></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Citation */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Citation <span className="text-[#C8A96E]">*</span></label>
            <textarea value={form.quote} onChange={(e) => set('quote', e.target.value)} rows={4}
              placeholder="Saisissez le témoignage client..."
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm resize-none focus:outline-none focus:border-[#C8A96E]" />
          </div>

          {/* Auteur */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Nom <span className="text-[#C8A96E]">*</span></label>
              <input type="text" value={form.authorName} onChange={(e) => set('authorName', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Titre / Poste</label>
              <input type="text" value={form.authorTitle} onChange={(e) => set('authorTitle', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Entreprise</label>
              <input type="text" value={form.companyName} onChange={(e) => set('companyName', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">URL logo entreprise</label>
              <input type="text" value={form.companyLogo} onChange={(e) => set('companyLogo', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
          </div>

          {/* Note + Service */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Note</label>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button" onClick={() => set('rating', n)}>
                    <Star className={`w-6 h-6 transition-colors ${n <= form.rating ? 'text-[#C8A96E] fill-current' : 'text-slate-600 hover:text-gray-500'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Slug service lié</label>
              <input type="text" placeholder="ex: evenements" value={form.serviceSlug} onChange={(e) => set('serviceSlug', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
          </div>

          {/* Date + Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Date</label>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Ordre</label>
              <input type="number" value={form.order} onChange={(e) => set('order', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="w-4 h-4 accent-[#C8A96E]" />
              <span className="text-sm text-gray-600">Publié</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-[#C8A96E]" />
              <span className="text-sm text-gray-600">Mis en avant</span>
            </label>
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
