// ========================================
// CMS Dashboard — Éditeur de sections (toutes pages)
// Pilote pages.sections (JSONB) pour n'importe quel slug.
// Route: /admin/pages/:pageSlug/sections  (ou /admin/pages/home/sections)
// ========================================

import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import {
  ArrowLeft, Save, Eye, Plus, Trash2, ChevronUp, ChevronDown,
  EyeOff, Eye as EyeOn,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input, Textarea, Select } from '../../components/Input';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/api';
import {
  HOME_SECTION_TYPES,
  type HomeSection,
} from '../../../shared/home-sections';

// ─── Page principale ─────────────────────────────────────────────────────────
export default function HomeSectionsEditor() {
  const [, navigate] = useLocation();
  const params = useParams<{ pageSlug?: string; parentSlug?: string; childSlug?: string; grandChildSlug?: string }>();
  // Supporte slugs simples (/home/sections, /:pageSlug/sections)
  // ET slugs imbriqués (/:parentSlug/:childSlug[/:grandChildSlug]/sections)
  const targetSlug =
    [params.parentSlug, params.childSlug, params.grandChildSlug]
      .filter(Boolean)
      .join('/') || params.pageSlug || 'home';
  const toast = useToast();
  const [pageId, setPageId] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { load(); }, [targetSlug]);

  async function load() {
    setLoading(true);
    try {
      const api = getApi();
      const list = await api.pages.getAll({ search: targetSlug, limit: 100 });
      const items: any[] = Array.isArray(list) ? list : (list?.data ?? list?.pages ?? []);
      const page = items.find((p) => p.slug === targetSlug);
      if (!page) {
        toast.error('Page introuvable', `Aucune page avec slug "${targetSlug}"`);
        return;
      }
      setPageId(page.id);
      setPageTitle(page.title ?? targetSlug);
      const raw = page.sections;
      const arr: HomeSection[] = Array.isArray(raw) ? raw : [];
      setSections(arr.sort((a, b) => a.order - b.order));
    } catch (e) {
      toast.error('Erreur', 'Chargement impossible');
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!pageId) return;
    setSaving(true);
    try {
      const api = getApi();
      const normalized = sections.map((s, i) => ({ ...s, order: (i + 1) * 10 }));
      await api.pages.update(pageId, { sections: normalized });
      setSections(normalized);
      toast.success('Sauvegardé', 'Sections mises à jour');
    } catch (e) {
      toast.error('Erreur', 'Sauvegarde impossible');
    } finally {
      setSaving(false);
    }
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...sections];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setSections(next);
  }

  function remove(idx: number) {
    if (!confirm('Supprimer cette section ?')) return;
    setSections(sections.filter((_, i) => i !== idx));
  }

  function toggleEnabled(idx: number) {
    const next = [...sections];
    next[idx] = { ...next[idx], enabled: next[idx].enabled === false ? true : false };
    setSections(next);
  }

  function update(idx: number, patch: Partial<HomeSection>) {
    const next = [...sections];
    next[idx] = { ...next[idx], ...patch } as HomeSection;
    setSections(next);
  }

  function add(type: HomeSection['type']) {
    const newSec = createDefaultSection(type, sections.length);
    setSections([...sections, newSec]);
    setExpanded(newSec.id);
  }

  if (loading) return <div className="p-8 text-gray-500">Chargement…</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/pages')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {targetSlug === 'home' ? 'Éditeur Page d\'Accueil' : `Éditeur — ${pageTitle}`}
          </h1>
          <p className="text-sm text-gray-500">{sections.length} section(s) · slug: <code className="text-pink-600">{targetSlug}</code></p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={() => window.open(`/${targetSlug === 'home' ? '' : targetSlug}`, '_blank')}>
          <Eye size={16} className="mr-1" /> Voir le site
        </Button>
          <Button onClick={save} loading={saving}>
            <Save size={16} className="mr-1" /> Sauvegarder
          </Button>
        </div>
      </div>

      {/* Liste des sections */}
      <div className="space-y-3 mb-6">
        {sections.map((s, idx) => (
          <SectionRow
            key={s.id}
            section={s}
            idx={idx}
            isFirst={idx === 0}
            isLast={idx === sections.length - 1}
            expanded={expanded === s.id}
            onToggle={() => setExpanded(expanded === s.id ? null : s.id)}
            onMove={(dir) => move(idx, dir)}
            onRemove={() => remove(idx)}
            onToggleEnabled={() => toggleEnabled(idx)}
            onChange={(patch) => update(idx, patch)}
          />
        ))}
      </div>

      {/* Ajouter une section */}
      <Card>
        <CardHeader><CardTitle>Ajouter une section</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {HOME_SECTION_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => add(t.value)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-left border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition"
              >
                <Plus size={14} className="text-pink-500" />
                {t.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Ligne de section ────────────────────────────────────────────────────────
function SectionRow({
  section, idx, isFirst, isLast, expanded,
  onToggle, onMove, onRemove, onToggleEnabled, onChange,
}: {
  section: HomeSection; idx: number; isFirst: boolean; isLast: boolean; expanded: boolean;
  onToggle: () => void; onMove: (dir: -1 | 1) => void; onRemove: () => void;
  onToggleEnabled: () => void; onChange: (p: Partial<HomeSection>) => void;
}) {
  const meta = HOME_SECTION_TYPES.find((t) => t.value === section.type);
  const disabled = section.enabled === false;

  return (
    <Card>
      <div className={`flex items-center gap-3 p-4 ${disabled ? 'opacity-50' : ''}`}>
        <span className="text-xs font-bold text-gray-400 w-8">#{idx + 1}</span>
        <div className="flex-1">
          <div className="font-semibold text-gray-900 text-sm">{meta?.label ?? section.type}</div>
          <div className="text-xs text-gray-500">{getSectionPreview(section)}</div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onMove(-1)} disabled={isFirst}
            className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-30">
            <ChevronUp size={16} />
          </button>
          <button onClick={() => onMove(1)} disabled={isLast}
            className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-30">
            <ChevronDown size={16} />
          </button>
          <button onClick={onToggleEnabled} title={disabled ? 'Activer' : 'Masquer'}
            className="p-2 text-gray-400 hover:text-gray-700">
            {disabled ? <EyeOff size={16} /> : <EyeOn size={16} />}
          </button>
          <button onClick={onRemove} className="p-2 text-red-400 hover:text-red-600">
            <Trash2 size={16} />
          </button>
          <button onClick={onToggle}
            className="px-3 py-1 text-xs font-semibold bg-pink-100 text-pink-700 rounded hover:bg-pink-200">
            {expanded ? 'Fermer' : 'Éditer'}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <SectionEditor section={section} onChange={onChange} />
        </div>
      )}
    </Card>
  );
}

// ─── Aperçu textuel ──────────────────────────────────────────────────────────
function getSectionPreview(s: HomeSection): string {
  switch (s.type) {
    case 'hero':             return `${s.titleLine1} ${s.titleLine2}`;
    case 'intro':            return s.title;
    case 'stats':            return `${s.items?.length ?? 0} stat(s)`;
    case 'clients':          return `${s.title} — ${s.logos?.length ?? 0} logo(s)`;
    case 'avantages':        return `${s.title} — ${s.items?.length ?? 0} item(s)`;
    case 'poles':            return `${s.title} — ${s.items?.length ?? 0} pôle(s)`;
    case 'commpulse':        return s.title;
    case 'fabrique':         return s.title;
    case 'articles':         return `${s.title} — ${s.limit} article(s)`;
    case 'cta':              return s.title;
    case 'richtext':         return 'Bloc HTML libre';
    case 'service-hero':     return s.title;
    case 'service-blocks':   return `${s.items?.length ?? 0} bloc(s)`;
    case 'hub-cards':        return `${s.title} — ${s.items?.length ?? 0} carte(s)`;
    case 'pitch':            return s.title;
    case 'references-strip': return `${s.items?.length ?? 0} référence(s)`;
    case 'testimonial':      return `${s.author}${s.company ? ` — ${s.company}` : ''}`;
    case 'contact-form':     return s.heroTitle;
    case 'image-text':       return s.title;
    case 'team':             return `${s.title} — ${s.members?.length ?? 0} membre(s)`;
    case 'faq':              return `${s.title} — ${s.items?.length ?? 0} question(s)`;
    case 'tools-grid':       return `${s.title} — ${s.items?.length ?? 0} outil(s)`;
    case 'resources-grid':   return `${s.title} — ${s.items?.length ?? 0} ressource(s)`;
  }
}

// ─── Éditeur dynamique selon type ────────────────────────────────────────────
function SectionEditor({ section, onChange }: {
  section: HomeSection; onChange: (p: Partial<HomeSection>) => void;
}) {
  switch (section.type) {
    case 'hero':             return <HeroEditor s={section} onChange={onChange} />;
    case 'intro':            return <IntroEditor s={section} onChange={onChange} />;
    case 'stats':            return <p className="text-sm text-gray-500">Cette section utilise les statistiques globales définies dans <strong>Paramètres → Statistiques</strong>.</p>;
    case 'clients':          return <ClientsEditor s={section} onChange={onChange} />;
    case 'avantages':        return <ItemsEditor s={section} onChange={onChange} fields={['title','desc']} listKey="items" headerFields={['title','subtitle']} />;
    case 'poles':            return <ItemsEditor s={section} onChange={onChange} fields={['num','title','desc','href']} listKey="items" headerFields={['title','subtitle']} />;
    case 'commpulse':        return <CommPulseEditor s={section} onChange={onChange} />;
    case 'fabrique':         return <FabriqueEditor s={section} onChange={onChange} />;
    case 'articles':         return <ArticlesEditor s={section} onChange={onChange} />;
    case 'cta':              return <CtaEditor s={section} onChange={onChange} />;
    case 'richtext':         return <RichTextEditor s={section} onChange={onChange} />;
    case 'service-hero':     return <ServiceHeroEditor s={section} onChange={onChange} />;
    case 'service-blocks':   return <ServiceBlocksEditor s={section} onChange={onChange} />;
    case 'hub-cards':        return <HubCardsEditor s={section} onChange={onChange} />;
    case 'pitch':            return <PitchEditor s={section} onChange={onChange} />;
    case 'references-strip': return <ReferencesStripEditor s={section} onChange={onChange} />;
    case 'testimonial':      return <TestimonialEditor s={section} onChange={onChange} />;
    case 'contact-form':     return <ContactFormSectionEditor s={section} onChange={onChange} />;
    case 'image-text':       return <ImageTextEditor s={section} onChange={onChange} />;
    case 'team':             return <TeamEditor s={section} onChange={onChange} />;
    case 'faq':              return <FaqEditor s={section} onChange={onChange} />;
    case 'tools-grid':       return <ToolsGridEditor s={section} onChange={onChange} />;
    case 'resources-grid':   return <ResourcesGridEditor s={section} onChange={onChange} />;
  }
}

// ─── Éditeurs spécifiques ────────────────────────────────────────────────────
function HeroEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Image de fond (URL)" value={s.backgroundImage} onChange={e => onChange({ backgroundImage: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Titre ligne 1" value={s.titleLine1} onChange={e => onChange({ titleLine1: e.target.value })} />
        <Input label="Titre ligne 2" value={s.titleLine2} onChange={e => onChange({ titleLine2: e.target.value })} />
      </div>
      <Input label="Sous-titre" value={s.subtitle} onChange={e => onChange({ subtitle: e.target.value })} />
      <CtaPair label="Bouton principal" value={s.primaryCta} onChange={(v) => onChange({ primaryCta: v })} />
      <CtaPair label="Bouton secondaire (optionnel)" value={s.secondaryCta ?? { label: '', href: '' }} onChange={(v) => onChange({ secondaryCta: v.label || v.href ? v : undefined })} />
    </div>
  );
}

function IntroEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Eyebrow (petit texte)" value={s.eyebrow} onChange={e => onChange({ eyebrow: e.target.value })} />
      <Input label="Titre" value={s.title} onChange={e => onChange({ title: e.target.value })} />
      <Textarea label="Corps (HTML)" rows={5} value={s.bodyHtml} onChange={e => onChange({ bodyHtml: e.target.value })} />
      <Input label="Image (URL)" value={s.image} onChange={e => onChange({ image: e.target.value })} />
      <StringListEditor label="Liste à puces" value={s.bullets} onChange={(v) => onChange({ bullets: v })} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Label CTA" value={s.ctaLabel ?? ''} onChange={e => onChange({ ctaLabel: e.target.value })} />
        <Input label="URL CTA" value={s.ctaHref ?? ''} onChange={e => onChange({ ctaHref: e.target.value })} />
      </div>
    </div>
  );
}

function ClientsEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre" value={s.title} onChange={e => onChange({ title: e.target.value })} />
      <Input label="Sous-titre" value={s.subtitle ?? ''} onChange={e => onChange({ subtitle: e.target.value })} />
      <ObjectListEditor
        label="Logos"
        value={s.logos}
        onChange={(v) => onChange({ logos: v })}
        fields={['name', 'logo']}
        emptyItem={{ name: '', logo: '' }}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Label CTA" value={s.ctaLabel ?? ''} onChange={e => onChange({ ctaLabel: e.target.value })} />
        <Input label="URL CTA" value={s.ctaHref ?? ''} onChange={e => onChange({ ctaHref: e.target.value })} />
      </div>
    </div>
  );
}

function ItemsEditor({ s, onChange, fields, listKey, headerFields }: {
  s: any; onChange: (p: any) => void; fields: string[]; listKey: string; headerFields: string[];
}) {
  const empty = Object.fromEntries(fields.map(f => [f, '']));
  return (
    <div className="space-y-3">
      {headerFields.map((f) => (
        <Input key={f} label={f === 'title' ? 'Titre' : 'Sous-titre'} value={s[f] ?? ''} onChange={e => onChange({ [f]: e.target.value })} />
      ))}
      <ObjectListEditor label="Items" value={s[listKey]} onChange={(v) => onChange({ [listKey]: v })} fields={fields} emptyItem={empty} />
    </div>
  );
}

function CommPulseEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Badge (optionnel)" value={s.badge ?? ''} onChange={e => onChange({ badge: e.target.value })} />
      <Input label="Titre" value={s.title} onChange={e => onChange({ title: e.target.value })} />
      <Textarea label="Corps" rows={3} value={s.body} onChange={e => onChange({ body: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Label CTA" value={s.ctaLabel} onChange={e => onChange({ ctaLabel: e.target.value })} />
        <Input label="URL CTA" value={s.ctaHref} onChange={e => onChange({ ctaHref: e.target.value })} />
      </div>
    </div>
  );
}

function FabriqueEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Eyebrow" value={s.eyebrow} onChange={e => onChange({ eyebrow: e.target.value })} />
      <Input label="Titre" value={s.title} onChange={e => onChange({ title: e.target.value })} />
      <Textarea label="Corps" rows={3} value={s.body} onChange={e => onChange({ body: e.target.value })} />
      <ObjectListEditor label="Services" value={s.services} onChange={(v) => onChange({ services: v })} fields={['title','href']} emptyItem={{ title: '', href: '' }} />
      <StringListEditor label="Images (URLs, max 4)" value={s.images} onChange={(v) => onChange({ images: v.slice(0, 4) })} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Label CTA" value={s.ctaLabel ?? ''} onChange={e => onChange({ ctaLabel: e.target.value })} />
        <Input label="URL CTA" value={s.ctaHref ?? ''} onChange={e => onChange({ ctaHref: e.target.value })} />
      </div>
    </div>
  );
}

function ArticlesEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre" value={s.title} onChange={e => onChange({ title: e.target.value })} />
      <Input label="Sous-titre" value={s.subtitle ?? ''} onChange={e => onChange({ subtitle: e.target.value })} />
      <Input type="number" min={1} max={12} label="Nombre d'articles" value={String(s.limit)} onChange={e => onChange({ limit: Number(e.target.value) || 3 })} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Label CTA" value={s.ctaLabel ?? ''} onChange={e => onChange({ ctaLabel: e.target.value })} />
        <Input label="URL CTA" value={s.ctaHref ?? ''} onChange={e => onChange({ ctaHref: e.target.value })} />
      </div>
    </div>
  );
}

function CtaEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre" value={s.title} onChange={e => onChange({ title: e.target.value })} />
      <Textarea label="Corps" rows={3} value={s.body} onChange={e => onChange({ body: e.target.value })} />
      <CtaPair label="Bouton principal" value={s.primaryCta} onChange={(v) => onChange({ primaryCta: v })} />
      <CtaPair label="Bouton secondaire (optionnel)" value={s.secondaryCta ?? { label: '', href: '' }} onChange={(v) => onChange({ secondaryCta: v.label || v.href ? v : undefined })} />
      <Select label="Style de fond" value={s.background ?? 'primary'} onChange={(e) => onChange({ background: e.target.value })}>
        <option value="primary">Rose (primaire)</option>
        <option value="dark">Sombre</option>
        <option value="light">Clair</option>
      </Select>
    </div>
  );
}

function RichTextEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Textarea label="HTML libre" rows={8} value={s.html} onChange={e => onChange({ html: e.target.value })} />
      <Select label="Largeur max" value={s.maxWidth ?? 'lg'} onChange={(e) => onChange({ maxWidth: e.target.value })}>
        <option value="sm">Petit (max-w-2xl)</option>
        <option value="md">Moyen (max-w-3xl)</option>
        <option value="lg">Grand (max-w-4xl)</option>
        <option value="xl">Très grand (max-w-7xl)</option>
        <option value="full">Pleine largeur</option>
      </Select>
    </div>
  );
}

// ─── Helpers UI ──────────────────────────────────────────────────────────────
function CtaPair({ label, value, onChange }: { label: string; value: { label: string; href: string }; onChange: (v: { label: string; href: string }) => void }) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-600 mb-1">{label}</div>
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Texte" value={value.label} onChange={e => onChange({ ...value, label: e.target.value })} />
        <Input placeholder="URL" value={value.href} onChange={e => onChange({ ...value, href: e.target.value })} />
      </div>
    </div>
  );
}

function StringListEditor({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-600 mb-1">{label}</div>
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input value={item} onChange={(e) => {
              const next = [...value]; next[i] = e.target.value; onChange(next);
            }} />
            <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="px-3 text-red-500 hover:bg-red-50 rounded">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button onClick={() => onChange([...value, ''])} className="text-xs text-pink-600 font-semibold hover:underline">
          + Ajouter
        </button>
      </div>
    </div>
  );
}

function ObjectListEditor({ label, value, onChange, fields, emptyItem }: {
  label: string; value: any[]; onChange: (v: any[]) => void; fields: string[]; emptyItem: any;
}) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-600 mb-1">{label} ({value?.length ?? 0})</div>
      <div className="space-y-3">
        {(value ?? []).map((item, i) => (
          <div key={i} className="flex gap-2 items-start p-2 bg-white rounded border border-gray-200">
            <div className="flex-1 grid grid-cols-2 gap-2">
              {fields.map((f) => (
                <Input key={f} placeholder={f} value={item[f] ?? ''} onChange={(e) => {
                  const next = [...value]; next[i] = { ...next[i], [f]: e.target.value }; onChange(next);
                }} />
              ))}
            </div>
            <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button onClick={() => onChange([...(value ?? []), { ...emptyItem }])} className="text-xs text-pink-600 font-semibold hover:underline">
          + Ajouter
        </button>
      </div>
    </div>
  );
}

// ─── Factory section par défaut ──────────────────────────────────────────────
function createDefaultSection(type: HomeSection['type'], idx: number): HomeSection {
  const base = { id: `${type}-${Date.now()}`, order: (idx + 1) * 10 };
  switch (type) {
    case 'hero':             return { ...base, type, backgroundImage: '/uploads/hero/home-header.jpg', titleLine1: 'Titre', titleLine2: 'Accrocheur', subtitle: 'Sous-titre', primaryCta: { label: 'Commencer', href: '/contact' } };
    case 'intro':            return { ...base, type, eyebrow: 'EYEBROW', title: 'Titre', bodyHtml: '<p>Texte…</p>', bullets: [], image: '/uploads/hero/agence-com.jpg' };
    case 'stats':            return { ...base, type, items: [] };
    case 'clients':          return { ...base, type, title: 'Ils nous font confiance', logos: [] };
    case 'avantages':        return { ...base, type, title: 'Nos avantages', items: [] };
    case 'poles':            return { ...base, type, title: 'Nos pôles', items: [] };
    case 'commpulse':        return { ...base, type, title: 'Évaluez votre comm', body: '…', ctaLabel: 'Lancer', ctaHref: '/outils/commpulse' };
    case 'fabrique':         return { ...base, type, eyebrow: 'La Fabrique', title: 'Titre', body: '…', services: [], images: [] };
    case 'articles':         return { ...base, type, title: 'Nos articles', limit: 3 };
    case 'cta':              return { ...base, type, title: 'CTA', body: '…', primaryCta: { label: 'Action', href: '/contact' }, background: 'primary' };
    case 'richtext':         return { ...base, type, html: '<p>Contenu HTML…</p>', maxWidth: 'lg' };
    case 'service-hero':     return { ...base, type, tag: 'Service', backgroundImage: '', title: 'Titre du service', subtitle: 'Sous-titre', primaryCta: { label: 'Nous contacter', href: '/contact' } };
    case 'service-blocks':   return { ...base, type, title: 'Nos services', subtitle: '', items: [] };
    case 'hub-cards':        return { ...base, type, title: 'Nos solutions', subtitle: '', items: [] };
    case 'pitch':            return { ...base, type, title: 'Notre approche', body: '…', stats: [] };
    case 'references-strip': return { ...base, type, title: 'Ils nous font confiance', items: [] };
    case 'testimonial':      return { ...base, type, quote: 'Témoignage client…', author: 'Prénom Nom', company: 'Entreprise', role: 'Directeur' };
    case 'contact-form':     return { ...base, type, heroTitle: 'Contactez-nous', heroSubtitle: 'Nous répondons sous 24h', heroImage: '', address: '', phone: '', email: '', hours: 'Lun–Ven 9h–18h' };
    case 'image-text':       return { ...base, type, title: 'Titre', body: '…', image: '', imagePosition: 'left' };
    case 'team':             return { ...base, type, title: 'Notre équipe', subtitle: '', members: [] };
    case 'faq':              return { ...base, type, title: 'FAQ', subtitle: '', items: [] };
    case 'tools-grid':       return { ...base, type, title: 'Nos outils', subtitle: '', items: [] };
    case 'resources-grid':   return { ...base, type, title: 'Ressources', subtitle: '', items: [] };
  }
}

// ─── Éditeurs pour les 12 nouveaux types ─────────────────────────────────────

function ServiceHeroEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Tag / Catégorie (optionnel)" value={s.tag ?? ''} onChange={e => onChange({ tag: e.target.value })} />
      <Input label="Image de fond (URL)" value={s.backgroundImage ?? ''} onChange={e => onChange({ backgroundImage: e.target.value })} />
      <Input label="Titre" value={s.title} onChange={e => onChange({ title: e.target.value })} />
      <Textarea label="Sous-titre" rows={2} value={s.subtitle ?? ''} onChange={e => onChange({ subtitle: e.target.value })} />
      <CtaPair label="Bouton principal" value={s.primaryCta ?? { label: '', href: '' }} onChange={(v) => onChange({ primaryCta: v })} />
      <CtaPair label="Bouton secondaire (optionnel)" value={s.secondaryCta ?? { label: '', href: '' }} onChange={(v) => onChange({ secondaryCta: v.label || v.href ? v : undefined })} />
    </div>
  );
}

function ServiceBlocksEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre de la section" value={s.title ?? ''} onChange={e => onChange({ title: e.target.value })} />
      <Input label="Sous-titre" value={s.subtitle ?? ''} onChange={e => onChange({ subtitle: e.target.value })} />
      <ObjectListEditor
        label="Blocs de service"
        value={s.items ?? []}
        onChange={(v) => onChange({ items: v })}
        fields={['icon', 'title', 'description']}
        emptyItem={{ icon: '✓', title: '', description: '' }}
      />
    </div>
  );
}

function HubCardsEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre" value={s.title ?? ''} onChange={e => onChange({ title: e.target.value })} />
      <Input label="Sous-titre" value={s.subtitle ?? ''} onChange={e => onChange({ subtitle: e.target.value })} />
      <ObjectListEditor
        label="Cartes"
        value={s.items ?? []}
        onChange={(v) => onChange({ items: v })}
        fields={['title', 'description', 'href', 'image']}
        emptyItem={{ title: '', description: '', href: '', image: '' }}
      />
    </div>
  );
}

function PitchEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre" value={s.title} onChange={e => onChange({ title: e.target.value })} />
      <Textarea label="Corps" rows={4} value={s.body ?? ''} onChange={e => onChange({ body: e.target.value })} />
      <ObjectListEditor
        label="Statistiques (optionnel)"
        value={s.stats ?? []}
        onChange={(v) => onChange({ stats: v })}
        fields={['value', 'label']}
        emptyItem={{ value: '', label: '' }}
      />
    </div>
  );
}

function ReferencesStripEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre" value={s.title ?? ''} onChange={e => onChange({ title: e.target.value })} />
      <ObjectListEditor
        label="Références (nom + logo optionnel)"
        value={s.items ?? []}
        onChange={(v) => onChange({ items: v })}
        fields={['name', 'logo']}
        emptyItem={{ name: '', logo: '' }}
      />
    </div>
  );
}

function TestimonialEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Textarea label="Citation" rows={4} value={s.quote} onChange={e => onChange({ quote: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Auteur" value={s.author} onChange={e => onChange({ author: e.target.value })} />
        <Input label="Rôle" value={s.role ?? ''} onChange={e => onChange({ role: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Entreprise" value={s.company ?? ''} onChange={e => onChange({ company: e.target.value })} />
        <Input label="Photo (URL)" value={s.photo ?? ''} onChange={e => onChange({ photo: e.target.value })} />
      </div>
    </div>
  );
}

function ContactFormSectionEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre Hero" value={s.heroTitle ?? ''} onChange={e => onChange({ heroTitle: e.target.value })} />
      <Input label="Sous-titre Hero" value={s.heroSubtitle ?? ''} onChange={e => onChange({ heroSubtitle: e.target.value })} />
      <Input label="Image Hero (URL)" value={s.heroImage ?? ''} onChange={e => onChange({ heroImage: e.target.value })} />
      <Input label="Adresse" value={s.address ?? ''} onChange={e => onChange({ address: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Téléphone" value={s.phone ?? ''} onChange={e => onChange({ phone: e.target.value })} />
        <Input label="Email" value={s.email ?? ''} onChange={e => onChange({ email: e.target.value })} />
      </div>
      <Input label="Horaires" value={s.hours ?? ''} onChange={e => onChange({ hours: e.target.value })} />
    </div>
  );
}

function ImageTextEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre" value={s.title} onChange={e => onChange({ title: e.target.value })} />
      <Textarea label="Corps" rows={4} value={s.body ?? ''} onChange={e => onChange({ body: e.target.value })} />
      <Input label="Image (URL)" value={s.image ?? ''} onChange={e => onChange({ image: e.target.value })} />
      <Select label="Position de l'image" value={s.imagePosition ?? 'left'} onChange={(e) => onChange({ imagePosition: e.target.value })}>
        <option value="left">Gauche</option>
        <option value="right">Droite</option>
      </Select>
      <StringListEditor label="Points clés (optionnel)" value={s.bullets ?? []} onChange={(v) => onChange({ bullets: v })} />
      <CtaPair label="Bouton (optionnel)" value={s.cta ?? { label: '', href: '' }} onChange={(v) => onChange({ cta: v.label || v.href ? v : undefined })} />
    </div>
  );
}

function TeamEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre" value={s.title ?? ''} onChange={e => onChange({ title: e.target.value })} />
      <Input label="Sous-titre" value={s.subtitle ?? ''} onChange={e => onChange({ subtitle: e.target.value })} />
      <ObjectListEditor
        label="Membres"
        value={s.members ?? []}
        onChange={(v) => onChange({ members: v })}
        fields={['name', 'role', 'photo', 'bio']}
        emptyItem={{ name: '', role: '', photo: '', bio: '' }}
      />
    </div>
  );
}

function FaqEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre" value={s.title ?? ''} onChange={e => onChange({ title: e.target.value })} />
      <Input label="Sous-titre" value={s.subtitle ?? ''} onChange={e => onChange({ subtitle: e.target.value })} />
      <ObjectListEditor
        label="Questions/Réponses"
        value={s.items ?? []}
        onChange={(v) => onChange({ items: v })}
        fields={['question', 'answer']}
        emptyItem={{ question: '', answer: '' }}
      />
    </div>
  );
}

function ToolsGridEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre" value={s.title ?? ''} onChange={e => onChange({ title: e.target.value })} />
      <Input label="Sous-titre" value={s.subtitle ?? ''} onChange={e => onChange({ subtitle: e.target.value })} />
      <ObjectListEditor
        label="Outils"
        value={s.items ?? []}
        onChange={(v) => onChange({ items: v })}
        fields={['title', 'description', 'href', 'color']}
        emptyItem={{ title: '', description: '', href: '', color: 'pink' }}
      />
    </div>
  );
}

function ResourcesGridEditor({ s, onChange }: { s: any; onChange: (p: any) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Titre" value={s.title ?? ''} onChange={e => onChange({ title: e.target.value })} />
      <Input label="Sous-titre" value={s.subtitle ?? ''} onChange={e => onChange({ subtitle: e.target.value })} />
      <ObjectListEditor
        label="Ressources"
        value={s.items ?? []}
        onChange={(v) => onChange({ items: v })}
        fields={['title', 'description', 'category', 'href', 'image']}
        emptyItem={{ title: '', description: '', category: '', href: '', image: '' }}
      />
    </div>
  );
}

