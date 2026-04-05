// ========================================
// Module Équipe — Formulaire
// ========================================
import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { getApi } from '../../lib/api';

interface SocialLink { platform: string; url: string; }
interface TeamMember {
  id?: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
  email: string;
  department: string;
  socialLinks: SocialLink[];
  isPublished: boolean;
  order: number;
}

const EMPTY: TeamMember = {
  name: '', position: '', bio: '', photo: '', email: '',
  department: '', socialLinks: [], isPublished: true, order: 0,
};
const DEPTS = ['Direction', 'Création', 'Production', 'Commercial', 'QHSE'];
const PLATFORMS = ['LinkedIn', 'Twitter', 'Instagram', 'GitHub', 'Behance', 'Dribbble'];

export function TeamForm({ member, onClose }: { member: Partial<TeamMember> | null; onClose: (s: boolean) => void }) {
  const [form, setForm] = useState<TeamMember>({ ...EMPTY, ...member, socialLinks: member?.socialLinks ?? [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm({ ...EMPTY, ...member, socialLinks: member?.socialLinks ?? [] }); }, [member]);

  const set = (k: keyof TeamMember, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const addSocial = () => set('socialLinks', [...form.socialLinks, { platform: 'LinkedIn', url: '' }]);
  const removeSocial = (i: number) => set('socialLinks', form.socialLinks.filter((_, idx) => idx !== i));
  const setSocial = (i: number, k: keyof SocialLink, v: string) =>
    set('socialLinks', form.socialLinks.map((x, idx) => idx === i ? { ...x, [k]: v } : x));

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Nom requis');
    setSaving(true);
    try {
      const api = getApi();
      if (form.id) await api.put(`/admin/team/${form.id}`, form);
      else await api.post('/admin/team', form);
      onClose(true);
    } catch (err: any) { alert(err?.response?.data?.error ?? 'Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{form.id ? 'Modifier le membre' : 'Nouveau membre'}</h2>
          <button onClick={() => onClose(false)}><X className="w-5 h-5 text-gray-500 hover:text-gray-700" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Nom <span className="text-[#C8A96E]">*</span></label>
              <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Poste / Titre</label>
              <input type="text" value={form.position} onChange={(e) => set('position', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Département</label>
              <select value={form.department} onChange={(e) => set('department', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]">
                <option value="">— Aucun —</option>
                {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">URL Photo</label>
            <input type="text" value={form.photo} onChange={(e) => set('photo', e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Biographie</label>
            <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} rows={3}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm resize-none focus:outline-none focus:border-[#C8A96E]" />
          </div>

          {/* Social links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-600">Réseaux sociaux</label>
              <button type="button" onClick={addSocial} className="text-xs flex items-center gap-1 text-[#C8A96E] hover:text-[#DFC28F]">
                <Plus className="w-3 h-3" /> Ajouter
              </button>
            </div>
            {form.socialLinks.map((sl, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <select value={sl.platform} onChange={(e) => setSocial(i, 'platform', e.target.value)}
                  className="w-32 px-2 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]">
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <input placeholder="https://..." value={sl.url} onChange={(e) => setSocial(i, 'url', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
                <button type="button" onClick={() => removeSocial(i)} className="p-2 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="w-4 h-4 accent-[#C8A96E]" />
              <span className="text-sm text-gray-600">Visible sur le site</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Ordre</label>
              <input type="number" value={form.order} onChange={(e) => set('order', parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
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
