/**
 * BriefFormEditor — Gestion des options du formulaire de Brief
 * Permet d'ajouter/supprimer/réordonner les secteurs, besoins, budgets et délais
 */
import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, GripVertical, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { Toast } from '../../components/Toast';

const API_BASE = '/api/admin';
const getToken = () => localStorage.getItem('cms_token') || '';

// ─── Défauts hardcodés (miroir de brief.tsx) ────────────────────────────────
const DEFAULT_SECTORS = [
  'Industrie & BTP', 'Finance & Assurance', 'Télécommunications',
  'Grande Distribution', 'Santé & Pharma', 'Énergie & Environnement',
  'Immobilier', 'Éducation', 'Tourisme & Hôtellerie', 'Agroalimentaire',
  'Automobile', 'Administration publique', 'Autre',
];

const DEFAULT_NEEDS = [
  { value: 'evenement', label: "Organisation d'événement" },
  { value: 'stand', label: 'Stand salon/exposition' },
  { value: 'signaletique', label: 'Signalétique' },
  { value: 'impression', label: 'Impression grand format' },
  { value: 'marque_employeur', label: 'Marque employeur' },
  { value: 'communication_qhse', label: 'Communication QHSE' },
  { value: 'experience_client', label: 'Expérience client' },
  { value: 'menuiserie', label: 'Menuiserie & décor' },
  { value: 'amenagement', label: "Aménagement d'espace" },
  { value: 'video', label: 'Production vidéo' },
  { value: 'autre', label: 'Autre besoin' },
];

const DEFAULT_BUDGETS = [
  'Moins de 50 000 MAD',
  '50 000 – 150 000 MAD',
  '150 000 – 500 000 MAD',
  '500 000 – 1 000 000 MAD',
  'Plus de 1 000 000 MAD',
];

const DEFAULT_TIMELINES = [
  'Moins de 2 semaines (urgent)',
  '2 à 4 semaines',
  '1 à 3 mois',
  '3 à 6 mois',
  'Plus de 6 mois',
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface NeedItem { value: string; label: string }

// ─── Composant liste éditable de strings ─────────────────────────────────────
function StringList({
  title, items, onChange
}: { title: string; items: string[]; onChange: (items: string[]) => void }) {
  const [newItem, setNewItem] = useState('');

  const add = () => {
    const trimmed = newItem.trim();
    if (!trimmed || items.includes(trimmed)) return;
    onChange([...items, trimmed]);
    setNewItem('');
  };

  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };
  const moveDown = (idx: number) => {
    if (idx === items.length - 1) return;
    const next = [...items];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">{title}</h3>
      <div className="space-y-2 mb-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-[#0F1629] border border-[#1E293B] rounded-lg px-3 py-2">
            <GripVertical className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <span className="flex-1 text-sm text-slate-200">{item}</span>
            <button onClick={() => moveUp(idx)} className="p-1 text-slate-500 hover:text-white transition-colors" title="Monter">
              <ChevronUp className="w-3 h-3" />
            </button>
            <button onClick={() => moveDown(idx)} className="p-1 text-slate-500 hover:text-white transition-colors" title="Descendre">
              <ChevronDown className="w-3 h-3" />
            </button>
            <button onClick={() => remove(idx)} className="p-1 text-red-400 hover:text-red-300 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(e.target.value)}
          placeholder={`Nouvelle option...`}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && add()}
          className="flex-1"
        />
        <Button onClick={add} variant="secondary" size="sm">
          <Plus className="w-4 h-4 mr-1" /> Ajouter
        </Button>
      </div>
    </div>
  );
}

// ─── Composant liste de besoins (value + label) ────────────────────────────
function NeedsList({
  items, onChange
}: { items: NeedItem[]; onChange: (items: NeedItem[]) => void }) {
  const [newValue, setNewValue] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const add = () => {
    if (!newValue.trim() || !newLabel.trim()) return;
    const v = newValue.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if (items.some(i => i.value === v)) return;
    onChange([...items, { value: v, label: newLabel.trim() }]);
    setNewValue('');
    setNewLabel('');
  };

  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };
  const moveDown = (idx: number) => {
    if (idx === items.length - 1) return;
    const next = [...items];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Besoins / Services</h3>
      <div className="space-y-2 mb-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-[#0F1629] border border-[#1E293B] rounded-lg px-3 py-2">
            <GripVertical className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <code className="text-xs text-slate-500 w-36 flex-shrink-0">{item.value}</code>
            <span className="flex-1 text-sm text-slate-200">{item.label}</span>
            <button onClick={() => moveUp(idx)} className="p-1 text-slate-500 hover:text-white transition-colors">
              <ChevronUp className="w-3 h-3" />
            </button>
            <button onClick={() => moveDown(idx)} className="p-1 text-slate-500 hover:text-white transition-colors">
              <ChevronDown className="w-3 h-3" />
            </button>
            <button onClick={() => remove(idx)} className="p-1 text-red-400 hover:text-red-300 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newLabel}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLabel(e.target.value)}
          placeholder="Libellé affiché (ex: Stand salon)"
          className="flex-1"
        />
        <Input
          value={newValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value)}
          placeholder="Clé (ex: stand)"
          className="w-40"
        />
        <Button onClick={add} variant="secondary" size="sm">
          <Plus className="w-4 h-4 mr-1" /> Ajouter
        </Button>
      </div>
      <p className="text-xs text-slate-500 mt-1">La clé est générée automatiquement depuis le libellé si laissé vide.</p>
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────
export function BriefFormEditor() {
  const [sectors, setSectors] = useState<string[]>(DEFAULT_SECTORS);
  const [needs, setNeeds] = useState<NeedItem[]>(DEFAULT_NEEDS);
  const [budgets, setBudgets] = useState<string[]>(DEFAULT_BUDGETS);
  const [timelines, setTimelines] = useState<string[]>(DEFAULT_TIMELINES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Charger depuis l'API
  useEffect(() => {
    fetch(`${API_BASE}/settings/forms_brief`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d?.data) return;
        const data = d.data;
        try {
          if (data.brief_sectors) {
            const v = typeof data.brief_sectors === 'string' ? JSON.parse(data.brief_sectors) : data.brief_sectors;
            if (Array.isArray(v) && v.length) setSectors(v);
          }
          if (data.brief_needs) {
            const v = typeof data.brief_needs === 'string' ? JSON.parse(data.brief_needs) : data.brief_needs;
            if (Array.isArray(v) && v.length) setNeeds(v);
          }
          if (data.brief_budgets) {
            const v = typeof data.brief_budgets === 'string' ? JSON.parse(data.brief_budgets) : data.brief_budgets;
            if (Array.isArray(v) && v.length) setBudgets(v);
          }
          if (data.brief_timelines) {
            const v = typeof data.brief_timelines === 'string' ? JSON.parse(data.brief_timelines) : data.brief_timelines;
            if (Array.isArray(v) && v.length) setTimelines(v);
          }
        } catch { /* ignore */ }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          group: 'forms_brief',
          data: {
            brief_sectors: JSON.stringify(sectors),
            brief_needs: JSON.stringify(needs),
            brief_budgets: JSON.stringify(budgets),
            brief_timelines: JSON.stringify(timelines),
          },
        }),
      });
      if (!res.ok) throw new Error();
      setToast({ message: 'Formulaire de brief mis à jour !', type: 'success' });
    } catch {
      setToast({ message: 'Erreur lors de la sauvegarde', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setSectors(DEFAULT_SECTORS);
    setNeeds(DEFAULT_NEEDS);
    setBudgets(DEFAULT_BUDGETS);
    setTimelines(DEFAULT_TIMELINES);
    setToast({ message: 'Valeurs par défaut restaurées (non sauvegardées)', type: 'success' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2" />
        Chargement...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Formulaire de Brief</h1>
          <p className="text-slate-400 mt-1">
            Gérez les options du formulaire "/contact/brief" — secteurs, besoins, budgets et délais.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" /> Défauts
          </Button>
          <Button onClick={save} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Sauvegarde...' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Secteurs', count: sectors.length, color: 'blue' },
          { label: 'Besoins', count: needs.length, color: 'purple' },
          { label: 'Tranches budget', count: budgets.length, color: 'green' },
          { label: 'Délais', count: timelines.length, color: 'yellow' },
        ].map(s => (
          <div key={s.label} className="bg-[#0F1629] border border-[#1E293B] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{s.count}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Secteurs */}
        <Card>
          <div className="p-6">
            <StringList
              title={`Secteurs d'activité (${sectors.length})`}
              items={sectors}
              onChange={setSectors}
            />
          </div>
        </Card>

        {/* Besoins */}
        <Card>
          <div className="p-6">
            <NeedsList items={needs} onChange={setNeeds} />
          </div>
        </Card>

        {/* Budgets */}
        <Card>
          <div className="p-6">
            <StringList
              title={`Tranches de budget (${budgets.length})`}
              items={budgets}
              onChange={setBudgets}
            />
          </div>
        </Card>

        {/* Délais */}
        <Card>
          <div className="p-6">
            <StringList
              title={`Délais (${timelines.length})`}
              items={timelines}
              onChange={setTimelines}
            />
          </div>
        </Card>
      </div>

      {/* Aide */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <p className="text-xs text-blue-300 font-medium mb-1">ℹ️ Fonctionnement</p>
        <p className="text-xs text-blue-200/70">
          Les modifications sont chargées en temps réel sur le formulaire public "/contact/brief". 
          Si aucune configuration n'est sauvegardée, les valeurs par défaut du code source sont utilisées.
        </p>
      </div>
    </div>
  );
}

export default BriefFormEditor;
