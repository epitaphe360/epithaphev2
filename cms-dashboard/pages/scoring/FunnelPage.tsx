/**
 * FunnelPage — Admin BMI 360™
 * Visualisation de l'entonnoir de conversion Discover → Intelligence → Transform
 */
import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, RefreshCw, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';

interface FunnelData {
  sinceDays: number;
  totalEvents: number;
  counts: Record<string, number>;
  byTool: Record<string, Record<string, number>>;
}

const TOOL_LABELS: Record<string, string> = {
  commpulse:    'CommPulse™',
  talentprint:  'TalentPrint™',
  impacttrace:  'ImpactTrace™',
  safesignal:   'SafeSignal™',
  eventimpact:  'EventImpact™',
  spacescore:   'SpaceScore™',
  finnarrative: 'FinNarrative™',
};

const TOOL_COLORS: Record<string, string> = {
  commpulse:    '#3B82F6',
  talentprint:  '#8B5CF6',
  impacttrace:  '#10B981',
  safesignal:   '#F59E0B',
  eventimpact:  '#8B5CF6',
  spacescore:   '#EC4899',
  finnarrative: '#EF4444',
};

const FUNNEL_STEPS = [
  { key: 'discover_completed',              label: 'Discover complété',       color: '#3B82F6' },
  { key: 'discover_email_sent',             label: 'Email Discover envoyé',   color: '#6366F1' },
  { key: 'intelligence_payment_initiated',  label: 'Paiement initié',         color: '#F59E0B' },
  { key: 'intelligence_unlocked',           label: 'Rapport IA déverrouillé', color: '#10B981' },
  { key: 'expert_requested',               label: 'RDV Expert demandé',       color: '#EC4899' },
];

const RELANCE_STEPS = [
  { key: 'relance_d1_sent', label: 'Relance J+1' },
  { key: 'relance_d3_sent', label: 'Relance J+3' },
  { key: 'relance_d7_sent', label: 'Relance J+7' },
];

function pct(num: number, denom: number): string {
  if (!denom) return '—';
  return `${Math.round((num / denom) * 100)}%`;
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const w = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${w}%`, background: color }} />
    </div>
  );
}

export function FunnelPage() {
  const [data, setData]     = useState<FunnelData | null>(null);
  const [days, setDays]     = useState(30);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const token = localStorage.getItem('cms_token');
  const headers = { Authorization: `Bearer ${token}` };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/funnel?days=${days}`, { headers });
      if (!res.ok) throw new Error('Erreur');
      setData(await res.json() as FunnelData);
    } catch {
      toast.error('Impossible de charger les analytics');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  const c = data?.counts ?? {};
  const maxFunnel = c['discover_completed'] ?? 1;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Funnel BMI 360™</h1>
          <p className="text-sm text-gray-500 mt-1">Entonnoir de conversion Discover → Intelligence → Transform</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value={7}>7 jours</option>
            <option value={30}>30 jours</option>
            <option value={90}>90 jours</option>
            <option value={180}>180 jours</option>
            <option value={365}>365 jours</option>
          </select>
          <Button variant="outline" onClick={load} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Chargement…</div>
      ) : data ? (
        <>
          {/* KPIs globaux */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{c['discover_completed'] ?? 0}</div>
                <div className="text-xs text-gray-500 mt-1">Discovers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-amber-600">{c['intelligence_payment_initiated'] ?? 0}</div>
                <div className="text-xs text-gray-500 mt-1">Paiements initiés</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{c['intelligence_unlocked'] ?? 0}</div>
                <div className="text-xs text-gray-500 mt-1">Rapports IA</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-pink-600">{c['expert_requested'] ?? 0}</div>
                <div className="text-xs text-gray-500 mt-1">RDV Expert</div>
              </CardContent>
            </Card>
          </div>

          {/* Entonnoir visuel */}
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-500" />
                Entonnoir principal ({days}j)
              </h2>
              <div className="space-y-4">
                {FUNNEL_STEPS.map((step, i) => {
                  const count = c[step.key] ?? 0;
                  const prevCount = i === 0 ? count : (c[FUNNEL_STEPS[i - 1].key] ?? 0);
                  return (
                    <div key={step.key} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{step.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-xs">{pct(count, prevCount)} vs étape préc.</span>
                          <span className="font-bold text-gray-900 w-8 text-right">{count}</span>
                        </div>
                      </div>
                      <Bar value={count} max={maxFunnel} color={step.color} />
                      {i < FUNNEL_STEPS.length - 1 && (
                        <div className="flex justify-center">
                          <ArrowDown className="w-3 h-3 text-gray-300" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Taux de conversion global */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <span className="text-gray-500">Taux Discover → Rapport IA</span>
                <span className="font-bold text-green-600 text-lg">
                  {pct(c['intelligence_unlocked'] ?? 0, c['discover_completed'] ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-500">Taux Rapport IA → RDV Expert</span>
                <span className="font-bold text-pink-600 text-lg">
                  {pct(c['expert_requested'] ?? 0, c['intelligence_unlocked'] ?? 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Relances */}
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Relances automatiques</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                {RELANCE_STEPS.map(r => (
                  <div key={r.key} className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-indigo-600">{c[r.key] ?? 0}</div>
                    <div className="text-xs text-gray-500 mt-1">{r.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                {(c['relance_d1_sent'] ?? 0) + (c['relance_d3_sent'] ?? 0) + (c['relance_d7_sent'] ?? 0)} relances envoyées au total
              </p>
            </CardContent>
          </Card>

          {/* Par outil */}
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Répartition par outil</h2>
              <div className="space-y-4">
                {Object.keys(TOOL_LABELS).map(toolId => {
                  const toolData = data.byTool[toolId] ?? {};
                  const discovers = toolData['discover_completed'] ?? 0;
                  const unlocks   = toolData['intelligence_unlocked'] ?? 0;
                  const experts   = toolData['expert_requested'] ?? 0;
                  if (discovers === 0) return null;
                  return (
                    <div key={toolId} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{TOOL_LABELS[toolId]}</span>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="text-blue-600 font-bold">{discovers} Disc.</span>
                          <span className="text-green-600 font-bold">{unlocks} IA</span>
                          <span className="text-pink-600 font-bold">{experts} RDV</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                        <div
                          className="h-full rounded-full transition-all duration-500 absolute left-0"
                          style={{ width: `${pct(unlocks, discovers)}`, background: TOOL_COLORS[toolId] ?? '#6366F1', opacity: 0.4 }}
                        />
                        <div
                          className="h-full rounded-full transition-all duration-500 absolute left-0"
                          style={{ width: `${pct(experts, discovers)}`, background: TOOL_COLORS[toolId] ?? '#6366F1' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Denied payments */}
          {(c['unlock_denied_no_payment'] ?? 0) > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-red-700">Tentatives unlock sans paiement</div>
                    <div className="text-xs text-gray-500">Tentatives bloquées par la sécurité</div>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{c['unlock_denied_no_payment']}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}

export default FunnelPage;
