/**
 * ScoringResultsList — Vue admin des résultats BMI 360™
 * Stats par outil + tableau paginé des résultats individuels
 */
import React, { useState, useEffect } from 'react';
import { BarChart3, Trash2, Filter, Download } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';

interface ScoringResult {
  id: string;
  toolId: string;
  companyName: string | null;
  sector: string | null;
  companySize: string | null;
  globalScore: number;
  maturityLevel: number;
  createdAt: string;
}

interface ToolStat {
  toolId: string;
  count: number;
  avgScore: number;
  avgMaturity: string;
}

const TOOL_LABELS: Record<string, string> = {
  commpulse: 'CommPulse',
  talentprint: 'TalentPrint',
  impacttrace: 'ImpactTrace',
  safesignal: 'SafeSignal',
  eventimpact: 'EventImpact',
  spacescore: 'SpaceScore',
  finnarrative: 'FinNarrative',
  bmi360: 'BMI 360™',
};

const MATURITY_LABELS = ['', 'Émergent', 'En développement', 'Avancé', 'Expert', 'Leader'];

function maturityColor(level: number) {
  const colors = ['', 'bg-red-500/20 text-red-300', 'bg-orange-500/20 text-orange-300',
    'bg-yellow-500/20 text-yellow-300', 'bg-blue-500/20 text-blue-300', 'bg-green-500/20 text-green-300'];
  return colors[level] ?? colors[1];
}

export function ScoringResultsList() {
  const [results, setResults] = useState<ScoringResult[]>([]);
  const [stats, setStats] = useState<ToolStat[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterTool, setFilterTool] = useState('');
  const [page, setPage] = useState(0);
  const LIMIT = 20;
  const toast = useToast();

  const token = localStorage.getItem('cms_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { loadResults(); }, [filterTool, page]);

  const loadStats = async () => {
    try {
      const res = await fetch('/api/admin/scoring/stats', { headers });
      if (res.ok) setStats(await res.json());
    } catch { /* ignore */ }
  };

  const loadResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(LIMIT), offset: String(page * LIMIT) });
      if (filterTool) params.set('toolId', filterTool);
      const res = await fetch(`/api/admin/scoring?${params}`, { headers });
      if (res.ok) {
        const json = await res.json();
        setResults(json.data ?? []);
        setTotal(json.total ?? 0);
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };

  const deleteResult = async (id: string) => {
    if (!confirm('Supprimer ce résultat ?')) return;
    try {
      await fetch(`/api/admin/scoring/${id}`, { method: 'DELETE', headers });
      toast.success('Supprimé', 'Résultat supprimé');
      loadResults(); loadStats();
    } catch {
      toast.error('Erreur', 'Impossible de supprimer');
    }
  };

  const exportCSV = () => {
    const header = 'ID,Outil,Entreprise,Secteur,Taille,Score,Maturité,Date';
    const rows = results.map(r =>
      [r.id.slice(0, 8), TOOL_LABELS[r.toolId] ?? r.toolId, r.companyName ?? '', r.sector ?? '',
        r.companySize ?? '', r.globalScore, MATURITY_LABELS[r.maturityLevel] ?? r.maturityLevel,
        new Date(r.createdAt).toLocaleDateString('fr-MA')].join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'scoring-bmi360.csv'; a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Résultats Scoring BMI 360™
          </h1>
          <p className="text-slate-400 text-sm mt-1">{total} résultat{total !== 1 ? 's' : ''} au total</p>
        </div>
        <Button variant="secondary" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" /> Exporter CSV
        </Button>
      </div>

      {/* Stats par outil */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card key={s.toolId}>
              <CardContent className="p-4">
                <p className="text-xs text-slate-400 mb-1">{TOOL_LABELS[s.toolId] ?? s.toolId}</p>
                <p className="text-2xl font-bold text-white">{s.count}</p>
                <p className="text-xs text-slate-400 mt-1">Score moyen : <span className="text-blue-300 font-semibold">{s.avgScore}/100</span></p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Filtre */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <select
          value={filterTool}
          onChange={e => { setFilterTool(e.target.value); setPage(0); }}
          className="bg-[#1E293B] text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Tous les outils</option>
          {Object.entries(TOOL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Tableau */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700">
              <tr className="text-left text-slate-400">
                <th className="px-4 py-3">Outil</th>
                <th className="px-4 py-3">Entreprise</th>
                <th className="px-4 py-3">Secteur</th>
                <th className="px-4 py-3">Taille</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Maturité</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">Chargement…</td></tr>
              ) : results.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500">Aucun résultat</td></tr>
              ) : results.map(r => (
                <tr key={r.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-blue-300">{TOOL_LABELS[r.toolId] ?? r.toolId}</td>
                  <td className="px-4 py-3 text-white">{r.companyName || <span className="text-slate-500">—</span>}</td>
                  <td className="px-4 py-3 text-slate-300">{r.sector || '—'}</td>
                  <td className="px-4 py-3 text-slate-300">{r.companySize || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-white">{r.globalScore}</span>
                    <span className="text-slate-500">/100</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${maturityColor(r.maturityLevel)}`}>
                      {MATURITY_LABELS[r.maturityLevel] ?? `Niveau ${r.maturityLevel}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{new Date(r.createdAt).toLocaleDateString('fr-MA')}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteResult(r.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {total > LIMIT && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
            <p className="text-sm text-slate-400">
              {page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, total)} sur {total}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                Précédent
              </Button>
              <Button variant="secondary" onClick={() => setPage(p => p + 1)} disabled={(page + 1) * LIMIT >= total}>
                Suivant
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default ScoringResultsList;
