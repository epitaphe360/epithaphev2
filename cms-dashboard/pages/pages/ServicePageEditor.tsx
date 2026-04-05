/**
 * ServicePageEditor — Éditeur visuel pour les pages de type SERVICE_PAGE
 * Permet aux admins de modifier tout le contenu de ces pages depuis le tableau de bord.
 */
import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Input, Textarea } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';

// ─── Types ────────────────────────────────────────────────────────
interface PitchStat { value: string; label: string; }
interface ServiceBlock { icon: string; title: string; description: string; features: string[]; }
interface Reference { name: string; logoUrl?: string; }
interface Testimonial { author: string; company?: string; content: string; rating?: number; }
interface FabriqueCta { title: string; body: string; }
interface HeroCta { label: string; href: string; }

export interface ServicePageSections {
  heroTitle: string;
  heroSubtitle: string;
  heroTag?: string;
  heroImage?: string;
  heroCta?: HeroCta;
  pitchTitle: string;
  pitchBody: string;
  pitchStats?: PitchStat[];
  serviceBlocks: ServiceBlock[];
  fabriqueCta?: FabriqueCta;
  references?: Reference[];
  testimonials?: Testimonial[];
  ctaTitle: string;
  ctaBody: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface Props {
  value: ServicePageSections;
  onChange: (v: ServicePageSections) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────
const ICON_OPTIONS = [
  'Mic','Users','Monitor','Music','Star','UtensilsCrossed','Camera',
  'Map','Truck','Radio','BarChart2','Store','Eye','TrendingUp',
  'Briefcase','Target','Megaphone','ShieldCheck','AlertTriangle','FileText',
  'Smartphone','Printer','Layers','Image','Zap','Hammer','Package',
  'Sofa','Wrench','Signpost','Lightbulb','LayoutGrid','Ruler',
  'Settings','Globe','Mail','Phone','Building','Award','Clock',
];

function fieldClass() {
  return 'block w-full px-3 py-2 border border-[#334155] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
}

// ─── Sub-components ───────────────────────────────────────────────

function CollapsibleSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-semibold text-white text-sm uppercase tracking-wide">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {open && <CardContent className="pt-0 pb-4 px-4 space-y-4">{children}</CardContent>}
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────────
export const ServicePageEditor: React.FC<Props> = ({ value, onChange }) => {
  const set = <K extends keyof ServicePageSections>(key: K, v: ServicePageSections[K]) =>
    onChange({ ...value, [key]: v });

  // ── pitchStats ──
  const addStat = () => set('pitchStats', [...(value.pitchStats ?? []), { value: '', label: '' }]);
  const removeStat = (i: number) => set('pitchStats', (value.pitchStats ?? []).filter((_, j) => j !== i));
  const updateStat = (i: number, k: keyof PitchStat, v: string) =>
    set('pitchStats', (value.pitchStats ?? []).map((s, j) => j === i ? { ...s, [k]: v } : s));

  // ── serviceBlocks ──
  const addBlock = () => set('serviceBlocks', [...(value.serviceBlocks ?? []), { icon: 'Star', title: '', description: '', features: [''] }]);
  const removeBlock = (i: number) => set('serviceBlocks', (value.serviceBlocks ?? []).filter((_, j) => j !== i));
  const updateBlock = (i: number, upd: Partial<ServiceBlock>) =>
    set('serviceBlocks', (value.serviceBlocks ?? []).map((b, j) => j === i ? { ...b, ...upd } : b));
  const addFeature = (i: number) => updateBlock(i, { features: [...(value.serviceBlocks[i]?.features ?? []), ''] });
  const updateFeature = (i: number, fi: number, v: string) =>
    updateBlock(i, { features: (value.serviceBlocks[i]?.features ?? []).map((f, fj) => fj === fi ? v : f) });
  const removeFeature = (i: number, fi: number) =>
    updateBlock(i, { features: (value.serviceBlocks[i]?.features ?? []).filter((_, fj) => fj !== fi) });

  // ── references ──
  const addRef = () => set('references', [...(value.references ?? []), { name: '' }]);
  const removeRef = (i: number) => set('references', (value.references ?? []).filter((_, j) => j !== i));
  const updateRef = (i: number, v: string) =>
    set('references', (value.references ?? []).map((r, j) => j === i ? { ...r, name: v } : r));

  // ── testimonials ──
  const addTestimonial = () => set('testimonials', [...(value.testimonials ?? []), { author: '', company: '', content: '', rating: 5 }]);
  const removeTestimonial = (i: number) => set('testimonials', (value.testimonials ?? []).filter((_, j) => j !== i));
  const updateTestimonial = (i: number, upd: Partial<Testimonial>) =>
    set('testimonials', (value.testimonials ?? []).map((t, j) => j === i ? { ...t, ...upd } : t));

  return (
    <div className="space-y-4">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <CollapsibleSection title="🎯 Hero (bandeau principal)">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">Titre principal *</label>
            <input className={fieldClass()} value={value.heroTitle} onChange={e => set('heroTitle', e.target.value)} placeholder="Ex: Conventions & Kickoffs" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">Sous-titre *</label>
            <textarea className={fieldClass()} rows={2} value={value.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)} placeholder="Description courte..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tag (badge hero)</label>
            <input className={fieldClass()} value={value.heroTag ?? ''} onChange={e => set('heroTag', e.target.value)} placeholder="Ex: Événements Internes" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Image (URL)</label>
            <input className={fieldClass()} value={value.heroImage ?? ''} onChange={e => set('heroImage', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bouton CTA — Label</label>
            <input className={fieldClass()} value={value.heroCta?.label ?? ''} onChange={e => set('heroCta', { label: e.target.value, href: value.heroCta?.href ?? '/contact/brief' })} placeholder="Ex: Obtenir une offre" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bouton CTA — Lien</label>
            <input className={fieldClass()} value={value.heroCta?.href ?? '/contact/brief'} onChange={e => set('heroCta', { label: value.heroCta?.label ?? 'Contact', href: e.target.value })} placeholder="/contact/brief" />
          </div>
        </div>
      </CollapsibleSection>

      {/* ── PITCH ────────────────────────────────────────────── */}
      <CollapsibleSection title="📢 Pitch (accroche argumentaire)">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Titre de l'accroche *</label>
          <input className={fieldClass()} value={value.pitchTitle} onChange={e => set('pitchTitle', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Corps du texte *</label>
          <textarea className={fieldClass()} rows={3} value={value.pitchBody} onChange={e => set('pitchBody', e.target.value)} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-300">Statistiques (chiffres clés)</label>
            <button type="button" onClick={addStat} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {(value.pitchStats ?? []).map((stat, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input className={`${fieldClass()} w-24`} placeholder="Valeur" value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} />
                <input className={`${fieldClass()} flex-1`} placeholder="Label" value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} />
                <button type="button" onClick={() => removeStat(i)} className="text-red-400 hover:text-red-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* ── SERVICE BLOCKS ───────────────────────────────────── */}
      <CollapsibleSection title="🔧 Blocs de services">
        <div className="space-y-6">
          {(value.serviceBlocks ?? []).map((block, i) => (
            <div key={i} className="border border-[#1E293B] rounded-lg p-4 space-y-3 bg-[#020617]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase">Bloc {i + 1}</span>
                <button type="button" onClick={() => removeBlock(i)} className="text-red-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Icône</label>
                  <select className={fieldClass()} value={block.icon} onChange={e => updateBlock(i, { icon: e.target.value })}>
                    {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Titre *</label>
                  <input className={fieldClass()} value={block.title} onChange={e => updateBlock(i, { title: e.target.value })} placeholder="Titre du service" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Description *</label>
                  <textarea className={fieldClass()} rows={2} value={block.description} onChange={e => updateBlock(i, { description: e.target.value })} placeholder="Description..." />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">Points clés (features)</label>
                  <button type="button" onClick={() => addFeature(i)} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Ajouter
                  </button>
                </div>
                <div className="space-y-1">
                  {(block.features ?? []).map((feat, fi) => (
                    <div key={fi} className="flex gap-2">
                      <input className={`${fieldClass()} flex-1`} value={feat} onChange={e => updateFeature(i, fi, e.target.value)} placeholder="Ex: Montage express" />
                      <button type="button" onClick={() => removeFeature(i, fi)} className="text-red-400 hover:text-red-400 p-1">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addBlock} className="w-full py-2 border-2 border-dashed border-[#334155] rounded-lg text-sm text-slate-500 hover:border-blue-400 hover:text-blue-400 flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter un bloc service
        </button>
      </CollapsibleSection>

      {/* ── FABRIQUE CTA ─────────────────────────────────────── */}
      <CollapsibleSection title="🏭 Avantage La Fabrique" defaultOpen={false}>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Titre</label>
          <input className={fieldClass()} value={value.fabriqueCta?.title ?? ''} onChange={e => set('fabriqueCta', { ...value.fabriqueCta, title: e.target.value, body: value.fabriqueCta?.body ?? '' })} placeholder="Des décors produits dans notre fabrique" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Texte</label>
          <textarea className={fieldClass()} rows={2} value={value.fabriqueCta?.body ?? ''} onChange={e => set('fabriqueCta', { ...value.fabriqueCta, title: value.fabriqueCta?.title ?? '', body: e.target.value })} placeholder="Description de la fabrique..." />
        </div>
      </CollapsibleSection>

      {/* ── RÉFÉRENCES ───────────────────────────────────────── */}
      <CollapsibleSection title="🏢 Références clients" defaultOpen={false}>
        <div className="space-y-2">
          {(value.references ?? []).map((ref, i) => (
            <div key={i} className="flex gap-2">
              <input className={`${fieldClass()} flex-1`} value={ref.name} onChange={e => updateRef(i, e.target.value)} placeholder="Nom du client" />
              <button type="button" onClick={() => removeRef(i)} className="text-red-400 hover:text-red-400 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addRef} className="w-full py-2 border-2 border-dashed border-[#334155] rounded-lg text-sm text-slate-500 hover:border-blue-400 hover:text-blue-400 flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter une référence
        </button>
      </CollapsibleSection>

      {/* ── TÉMOIGNAGES ──────────────────────────────────────── */}
      <CollapsibleSection title="💬 Témoignages" defaultOpen={false}>
        <div className="space-y-4">
          {(value.testimonials ?? []).map((t, i) => (
            <div key={i} className="border border-[#1E293B] rounded-lg p-4 space-y-3 bg-[#020617]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Témoignage {i + 1}</span>
                <button type="button" onClick={() => removeTestimonial(i)} className="text-red-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Auteur</label>
                  <input className={fieldClass()} value={t.author} onChange={e => updateTestimonial(i, { author: e.target.value })} placeholder="Directeur Marketing" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Entreprise</label>
                  <input className={fieldClass()} value={t.company ?? ''} onChange={e => updateTestimonial(i, { company: e.target.value })} placeholder="Groupe OCP" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Citation</label>
                  <textarea className={fieldClass()} rows={3} value={t.content} onChange={e => updateTestimonial(i, { content: e.target.value })} placeholder="Le témoignage..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Note (1–5)</label>
                  <input type="number" min={1} max={5} className={fieldClass()} value={t.rating ?? 5} onChange={e => updateTestimonial(i, { rating: Number(e.target.value) })} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addTestimonial} className="w-full py-2 border-2 border-dashed border-[#334155] rounded-lg text-sm text-slate-500 hover:border-blue-400 hover:text-blue-400 flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter un témoignage
        </button>
      </CollapsibleSection>

      {/* ── CTA FINAL ────────────────────────────────────────── */}
      <CollapsibleSection title="🚀 Call-to-action final">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Titre CTA *</label>
          <input className={fieldClass()} value={value.ctaTitle} onChange={e => set('ctaTitle', e.target.value)} placeholder="Votre prochaine convention mérite le meilleur" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Texte CTA *</label>
          <textarea className={fieldClass()} rows={2} value={value.ctaBody} onChange={e => set('ctaBody', e.target.value)} placeholder="Parlez-nous de votre projet..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Label du bouton</label>
            <input className={fieldClass()} value={value.ctaLabel ?? ''} onChange={e => set('ctaLabel', e.target.value)} placeholder="Déposer mon brief" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">URL du bouton</label>
            <input className={fieldClass()} value={value.ctaHref ?? '/contact/brief'} onChange={e => set('ctaHref', e.target.value)} placeholder="/contact/brief" />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default ServicePageEditor;
