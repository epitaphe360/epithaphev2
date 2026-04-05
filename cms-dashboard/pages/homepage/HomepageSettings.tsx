/**
 * HomepageSettings — Gestion du contenu de la page d'accueil (home-v5)
 * Hero, stats, services, clients, portfolio, section "À propos"
 * Utilise la table settings (group="homepage", key="homepage_config")
 */
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Home, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input, Textarea } from '../../components/Input';
import { useToast } from '../../components/Toast';

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatItem  { val: number; suf: string; label: string }
interface ServiceItem { img: string; title: string; href: string }
interface PortfolioItem { client: string; type: string; thumb: string }

interface HomepageConfig {
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    image: string;
    cta1Label: string;
    cta1Href: string;
    cta2Label: string;
  };
  about: {
    h2: string;
    h2Highlight: string;
    description: string;
    bullets: string[];
    img1: string;
    img2: string;
    ctaLabel: string;
    ctaHref: string;
  };
  stats: StatItem[];
  services: ServiceItem[];
  clients: string[];
  portfolio: PortfolioItem[];
}

const DEFAULT: HomepageConfig = {
  hero: {
    title: 'Inspirez. Connectez.',
    titleHighlight: 'Marquez durablement.',
    subtitle: "Agence de communication 360° basée à Casablanca. Nous gérons vos projets de l'idée créative à la fabrication et l'exécution sur le terrain.",
    image: 'https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg',
    cta1Label: 'Démarrer un projet',
    cta1Href: '/contact/brief',
    cta2Label: 'Nos métiers',
  },
  about: {
    h2: 'Créativité & pragmatisme.',
    h2Highlight: "L'agence des défis complexes.",
    description: "Depuis 20 ans, Epitaphe 360 accompagne les grandes entreprises, multinationales et PME. Nous comprenons vos contraintes de directeurs marketing ou communication : délais serrés, attentes élevées, besoin constant d'innovation.",
    bullets: [
      'Une maîtrise totale de A à Z (conception & exécution)',
      "Un atelier de fabrication interne (menuiserie, impression, signalétique)",
      'Respect strict des délais et des budgets',
      'Un seul interlocuteur pour tout votre projet',
    ],
    img1: 'https://epitaphe.ma/wp-content/uploads/2018/10/LIFE.jpg',
    img2: 'https://epitaphe.ma/wp-content/uploads/2018/10/dell-rea.jpg',
    ctaLabel: "Découvrir l'agence",
    ctaHref: '/nos-references',
  },
  stats: [
    { val: 20, suf: '+', label: "Années d'expérience" },
    { val: 200, suf: '+', label: 'Projets réalisés' },
    { val: 50, suf: '+', label: 'Clients actifs' },
    { val: 100, suf: '%', label: 'Autonomie de production' },
  ],
  services: [
    { img: 'https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg', title: 'Événementiel Corporate', href: '/evenements' },
    { img: 'https://epitaphe.ma/wp-content/uploads/2018/10/LIFE.jpg', title: 'Architecture & Stands', href: '/la-fabrique/menuiserie' },
    { img: 'https://epitaphe.ma/wp-content/uploads/2018/10/REARapport.jpg', title: 'Signalétique & Wayfinding', href: '/la-fabrique/signaletique' },
    { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', title: 'Impression Grand Format', href: '/la-fabrique/impression' },
  ],
  clients: ['Qatar Airways','HPS','Schneider Electric','Vinci Energies','Dell','SNEP','Ajial','Wafa Assurance','LafargeHolcim','OCP Group'],
  portfolio: [
    { client: 'Qatar Airways', type: 'Dîner de Gala', thumb: 'https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg' },
    { client: 'Schneider Electric', type: 'Convention Life Is On', thumb: 'https://epitaphe.ma/wp-content/uploads/2018/10/LIFE.jpg' },
    { client: 'Dell', type: 'Stand & Exposition', thumb: 'https://epitaphe.ma/wp-content/uploads/2018/10/dell-rea.jpg' },
    { client: 'Ajial', type: 'Scénographie', thumb: 'https://epitaphe.ma/wp-content/uploads/2018/10/Ajial2-1.jpg' },
  ],
};

// ─── Section card helper ───────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <CardContent className="p-5 space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export const HomepageSettings: React.FC = () => {
  const [cfg, setCfg] = useState<HomepageConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/settings/homepage', {
        headers: { Authorization: `Bearer ${localStorage.getItem('cms_token')}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.homepage_config) {
          setCfg({ ...DEFAULT, ...json.data.homepage_config });
        }
      }
    } catch { /* use defaults */ } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('cms_token')}`,
        },
        body: JSON.stringify({ group: 'homepage', data: { homepage_config: cfg } }),
      });
      toast.success('Sauvegardé', 'Page d\'accueil mise à jour');
    } catch {
      toast.error('Erreur', 'Impossible de sauvegarder');
    } finally {
      setSaving(false);
    }
  };

  const set = (path: string, value: any) => {
    setCfg(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let cursor: any = next;
      for (let i = 0; i < parts.length - 1; i++) cursor = cursor[parts[i]];
      cursor[parts[parts.length - 1]] = value;
      return next;
    });
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement…</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-400" />
            Page d'accueil
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tout le contenu visible sur <code className="text-blue-300">/</code> — modifiable sans toucher au code
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => { setCfg(DEFAULT); toast.info('Réinitialisé', 'Valeurs par défaut restaurées'); }}>
            <RotateCcw className="w-4 h-4 mr-2" /> Réinitialiser
          </Button>
          <Button onClick={save} disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <Section title="Section Hero (Bannière principale)">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Titre (ligne 1)">
            <Input value={cfg.hero.title} onChange={e => set('hero.title', e.target.value)} />
          </Field>
          <Field label="Titre rouge (ligne 2)">
            <Input value={cfg.hero.titleHighlight} onChange={e => set('hero.titleHighlight', e.target.value)} />
          </Field>
        </div>
        <Field label="Sous-titre">
          <Textarea value={cfg.hero.subtitle} onChange={e => set('hero.subtitle', e.target.value)} rows={2} />
        </Field>
        <Field label="Image de fond (URL)">
          <Input value={cfg.hero.image} onChange={e => set('hero.image', e.target.value)} placeholder="https://..." />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Bouton 1 — Label">
            <Input value={cfg.hero.cta1Label} onChange={e => set('hero.cta1Label', e.target.value)} />
          </Field>
          <Field label="Bouton 1 — Lien">
            <Input value={cfg.hero.cta1Href} onChange={e => set('hero.cta1Href', e.target.value)} />
          </Field>
          <Field label="Bouton 2 — Label">
            <Input value={cfg.hero.cta2Label} onChange={e => set('hero.cta2Label', e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <Section title="Compteurs de crédibilité (bande chiffres)">
        <div className="grid grid-cols-2 gap-4">
          {cfg.stats.map((s, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <p className="text-xs text-gray-500 font-medium">Stat #{i + 1}</p>
              <div className="grid grid-cols-3 gap-2">
                <Field label="Valeur (chiffre)">
                  <Input type="number" value={s.val} onChange={e => {
                    const stats = [...cfg.stats];
                    stats[i] = { ...stats[i], val: parseInt(e.target.value) || 0 };
                    setCfg(p => ({ ...p, stats }));
                  }} />
                </Field>
                <Field label="Suffixe (+, %, …)">
                  <Input value={s.suf} onChange={e => {
                    const stats = [...cfg.stats];
                    stats[i] = { ...stats[i], suf: e.target.value };
                    setCfg(p => ({ ...p, stats }));
                  }} maxLength={5} />
                </Field>
                <Field label="Label">
                  <Input value={s.label} onChange={e => {
                    const stats = [...cfg.stats];
                    stats[i] = { ...stats[i], label: e.target.value };
                    setCfg(p => ({ ...p, stats }));
                  }} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── À PROPOS ─────────────────────────────────────────────────── */}
      <Section title="Section À propos">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Titre (ligne 1)">
            <Input value={cfg.about.h2} onChange={e => set('about.h2', e.target.value)} />
          </Field>
          <Field label="Titre rouge (ligne 2)">
            <Input value={cfg.about.h2Highlight} onChange={e => set('about.h2Highlight', e.target.value)} />
          </Field>
        </div>
        <Field label="Description">
          <Textarea value={cfg.about.description} onChange={e => set('about.description', e.target.value)} rows={3} />
        </Field>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Points forts (bullets)</label>
          <div className="space-y-2">
            {cfg.about.bullets.map((b, i) => (
              <div key={i} className="flex gap-2">
                <Input value={b} onChange={e => {
                  const bullets = [...cfg.about.bullets];
                  bullets[i] = e.target.value;
                  set('about.bullets', bullets);
                }} />
                <button onClick={() => set('about.bullets', cfg.about.bullets.filter((_, j) => j !== i))}
                  className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => set('about.bullets', [...cfg.about.bullets, ''])}
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
              <Plus className="w-4 h-4" /> Ajouter un point
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Image 1 (URL)">
            <Input value={cfg.about.img1} onChange={e => set('about.img1', e.target.value)} />
          </Field>
          <Field label="Image 2 (URL)">
            <Input value={cfg.about.img2} onChange={e => set('about.img2', e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Lien CTA — Label">
            <Input value={cfg.about.ctaLabel} onChange={e => set('about.ctaLabel', e.target.value)} />
          </Field>
          <Field label="Lien CTA — URL">
            <Input value={cfg.about.ctaHref} onChange={e => set('about.ctaHref', e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* ── SERVICES GRID ────────────────────────────────────────────── */}
      <Section title="Grille Expertises (4 cartes)">
        <div className="space-y-3">
          {cfg.services.map((s, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 grid grid-cols-3 gap-3 items-end">
              <Field label="Image (URL)">
                <Input value={s.img} onChange={e => {
                  const sv = [...cfg.services]; sv[i] = { ...sv[i], img: e.target.value };
                  setCfg(p => ({ ...p, services: sv }));
                }} />
              </Field>
              <Field label="Titre de la carte">
                <Input value={s.title} onChange={e => {
                  const sv = [...cfg.services]; sv[i] = { ...sv[i], title: e.target.value };
                  setCfg(p => ({ ...p, services: sv }));
                }} />
              </Field>
              <Field label="Lien href">
                <Input value={s.href} onChange={e => {
                  const sv = [...cfg.services]; sv[i] = { ...sv[i], href: e.target.value };
                  setCfg(p => ({ ...p, services: sv }));
                }} />
              </Field>
            </div>
          ))}
          <button onClick={() => setCfg(p => ({ ...p, services: [...p.services, { img: '', title: '', href: '/' }] }))}
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
            <Plus className="w-4 h-4" /> Ajouter une carte
          </button>
        </div>
      </Section>

      {/* ── CLIENTS ──────────────────────────────────────────────────── */}
      <Section title="Barre clients (logos texto)">
        <div className="flex flex-wrap gap-2">
          {cfg.clients.map((c, i) => (
            <div key={i} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
              <input value={c} onChange={e => {
                const cl = [...cfg.clients]; cl[i] = e.target.value;
                setCfg(p => ({ ...p, clients: cl }));
              }} className="bg-transparent text-gray-900 text-sm w-32 outline-none" />
              <button onClick={() => setCfg(p => ({ ...p, clients: p.clients.filter((_, j) => j !== i) }))}
                className="text-gray-500 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
          <button onClick={() => setCfg(p => ({ ...p, clients: [...p.clients, 'Nouveau client'] }))}
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 px-2 py-1">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </Section>

      {/* ── PORTFOLIO ────────────────────────────────────────────────── */}
      <Section title="Portfolio (4 projets en avant)">
        <div className="space-y-3">
          {cfg.portfolio.map((p, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 grid grid-cols-3 gap-3 items-end">
              <Field label="Nom client">
                <Input value={p.client} onChange={e => {
                  const po = [...cfg.portfolio]; po[i] = { ...po[i], client: e.target.value };
                  setCfg(pr => ({ ...pr, portfolio: po }));
                }} />
              </Field>
              <Field label="Type d'événement">
                <Input value={p.type} onChange={e => {
                  const po = [...cfg.portfolio]; po[i] = { ...po[i], type: e.target.value };
                  setCfg(pr => ({ ...pr, portfolio: po }));
                }} />
              </Field>
              <Field label="Image miniature (URL)">
                <div className="flex gap-2">
                  <Input value={p.thumb} onChange={e => {
                    const po = [...cfg.portfolio]; po[i] = { ...po[i], thumb: e.target.value };
                    setCfg(pr => ({ ...pr, portfolio: po }));
                  }} />
                  <button onClick={() => setCfg(pr => ({ ...pr, portfolio: pr.portfolio.filter((_, j) => j !== i) }))}
                    className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              </Field>
            </div>
          ))}
          <button onClick={() => setCfg(p => ({ ...p, portfolio: [...p.portfolio, { client: '', type: '', thumb: '' }] }))}
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
            <Plus className="w-4 h-4" /> Ajouter un projet
          </button>
        </div>
      </Section>

      {/* Save bottom */}
      <div className="flex justify-end pb-10">
        <Button onClick={save} disabled={saving} className="px-8">
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Enregistrement…' : 'Enregistrer toutes les modifications'}
        </Button>
      </div>
    </div>
  );
};

export default HomepageSettings;
