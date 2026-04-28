/**
 * ScoringPromptSettings — Éditeur de prompts IA par outil BMI 360™
 * Stockage dans la table settings (group: 'ai_prompts', key: 'prompt_<toolId>')
 */
import React, { useState, useEffect } from 'react';
import { Bot, Save, RotateCcw, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';

const TOOLS = [
  { id: 'commpulse',    label: 'CommPulse™',    domain: 'Communication Interne' },
  { id: 'talentprint',  label: 'TalentPrint™',  domain: 'Marque Employeur' },
  { id: 'impacttrace',  label: 'ImpactTrace™',  domain: 'Communication RSE & Impact' },
  { id: 'safesignal',   label: 'SafeSignal™',   domain: 'Santé, Sécurité & Culture SST' },
  { id: 'eventimpact',  label: 'EventImpact™',  domain: 'Événementiel Stratégique' },
  { id: 'spacescore',   label: 'SpaceScore™',   domain: 'Environnement de Travail' },
  { id: 'finnarrative', label: 'FinNarrative™', domain: 'Communication Financière' },
];

// Variables disponibles dans les prompts (documentation inline)
const PROMPT_VARS = [
  { name: '{{toolId}}',      desc: "Identifiant de l'outil (ex: commpulse)" },
  { name: '{{toolName}}',    desc: "Nom affiché de l'outil (ex: CommPulse™)" },
  { name: '{{domain}}',      desc: "Domaine d'expertise" },
  { name: '{{companyName}}', desc: "Nom de l'entreprise évaluée" },
  { name: '{{sector}}',      desc: 'Secteur d\'activité' },
  { name: '{{companySize}}', desc: 'Taille de l\'entreprise' },
  { name: '{{globalScore}}', desc: 'Score global sur 100' },
  { name: '{{maturityLevel}}', desc: 'Niveau de maturité (1-5)' },
  { name: '{{pillarScores}}', desc: 'Scores par pilier (liste)' },
];

const PLACEHOLDER_PROMPT = `Tu es un consultant expert en {{domain}} au sein de l'agence Epitaphe360.

Génère un rapport de diagnostic stratégique en JSON pour :
- Entreprise : {{companyName}}
- Secteur : {{sector}}
- Score global : {{globalScore}}/100 (maturité {{maturityLevel}}/5)
- Scores par pilier :
{{pillarScores}}

Le rapport JSON doit inclure :
1. executiveSummary (3-4 phrases en français)
2. pillarAnalyses (diagnostic + risques + actions par pilier)
3. topRecommendations (5 recommandations avec business case en MAD)
4. actionPlan90Days (J1-J30, J31-J60, J61-J90)
5. scenarios (conservateur, base, ambitieux)
6. transformCTA (appel à l'action vers Epitaphe360)`;

export default function ScoringPromptSettings() {
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>('commpulse');
  const [showVars, setShowVars] = useState(false);
  const toast = useToast();

  const token = localStorage.getItem('cms_token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const res = await fetch('/api/admin/settings/ai_prompts', { headers });
      if (res.ok) {
        const { data } = await res.json();
        const loaded: Record<string, string> = {};
        for (const toolId of TOOLS.map(t => t.id)) {
          loaded[toolId] = (data as Record<string, string>)[`prompt_${toolId}`] ?? '';
        }
        setPrompts(loaded);
      }
    } catch (err) {
      console.error('Erreur chargement prompts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (toolId: string) => {
    setSaving(prev => ({ ...prev, [toolId]: true }));
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          group: 'ai_prompts',
          data: { [`prompt_${toolId}`]: prompts[toolId] ?? '' },
        }),
      });
      if (res.ok) {
        toast.success('Sauvegardé', `Prompt ${TOOLS.find(t => t.id === toolId)?.label} mis à jour`);
      } else {
        throw new Error('Erreur serveur');
      }
    } catch {
      toast.error('Erreur', 'Impossible de sauvegarder le prompt');
    } finally {
      setSaving(prev => ({ ...prev, [toolId]: false }));
    }
  };

  const handleReset = (toolId: string) => {
    if (window.confirm('Réinitialiser ce prompt au modèle par défaut ?')) {
      setPrompts(prev => ({ ...prev, [toolId]: '' }));
    }
  };

  const charCount = (toolId: string) => (prompts[toolId] ?? '').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <Bot className="w-6 h-6 animate-pulse mr-2" /> Chargement des prompts IA…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-amber-400" />
            Prompts IA — BMI 360™
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Personnalisez le prompt envoyé à Claude pour générer le rapport Intelligence™ de chaque outil.
            Un prompt vide utilise le modèle par défaut d'Epitaphe360.
          </p>
        </div>
      </div>

      {/* Variables disponibles */}
      <Card>
        <CardContent className="p-4">
          <button
            onClick={() => setShowVars(v => !v)}
            className="flex items-center gap-2 text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors"
          >
            <Info className="w-4 h-4" />
            Variables disponibles dans les prompts
            {showVars ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {showVars && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {PROMPT_VARS.map(v => (
                <div key={v.name} className="flex gap-2 text-sm">
                  <code className="text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded text-xs font-mono shrink-0">
                    {v.name}
                  </code>
                  <span className="text-gray-400">{v.desc}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Un accordéon par outil */}
      <div className="space-y-3">
        {TOOLS.map(tool => (
          <Card key={tool.id} className="overflow-hidden">
            {/* Entête accordéon */}
            <button
              onClick={() => setExpanded(prev => prev === tool.id ? null : tool.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <div className="text-left">
                  <div className="text-white font-medium">{tool.label}</div>
                  <div className="text-gray-500 text-xs">{tool.domain}</div>
                </div>
                {prompts[tool.id] ? (
                  <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                    Prompt personnalisé
                  </span>
                ) : (
                  <span className="ml-2 text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
                    Prompt par défaut
                  </span>
                )}
              </div>
              {expanded === tool.id
                ? <ChevronDown className="w-4 h-4 text-gray-400" />
                : <ChevronRight className="w-4 h-4 text-gray-400" />
              }
            </button>

            {/* Éditeur */}
            {expanded === tool.id && (
              <CardContent className="border-t border-white/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Le prompt est envoyé à Claude (Anthropic) lors de la génération du rapport Intelligence™.
                    Laissez vide pour utiliser le prompt expert par défaut.
                  </p>
                  <span className="text-xs text-gray-600 shrink-0 ml-4">
                    {charCount(tool.id).toLocaleString()} caractères
                  </span>
                </div>
                <textarea
                  value={prompts[tool.id] ?? ''}
                  onChange={e => setPrompts(prev => ({ ...prev, [tool.id]: e.target.value }))}
                  placeholder={PLACEHOLDER_PROMPT}
                  rows={16}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm text-gray-200
                    placeholder:text-gray-700 font-mono resize-y focus:outline-none focus:border-amber-400/50
                    transition-colors"
                  spellCheck={false}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleReset(tool.id)}
                    className="flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Réinitialiser
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSave(tool.id)}
                    disabled={saving[tool.id]}
                    className="flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {saving[tool.id] ? 'Sauvegarde…' : 'Sauvegarder'}
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
