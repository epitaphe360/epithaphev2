import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { loadBMI360Scores, calculateBMI360Global, MATURITY_LEVELS, type ScoringResult, type ToolId } from '@/lib/scoring-engine';

const TOOL_META: Record<ToolId, { name: string; model: string; color: string; href: string; icon: string; tagline: string; price: string }> = {
  commpulse: { name: 'CommPulse™', model: 'CLARITY™', color: '#6366F1', href: '/outils/commpulse', icon: '📡', tagline: 'Communication Interne', price: '4 900 MAD' },
  talentprint: { name: 'TalentPrint™', model: 'ATTRACT™', color: '#EC4899', href: '/outils/talentprint', icon: '🌟', tagline: 'Marque Employeur', price: '7 500 MAD' },
  impacttrace: { name: 'ImpactTrace™', model: 'PROOF™', color: '#10B981', href: '/outils/impacttrace', icon: '🌿', tagline: 'RSE & Impact', price: '8 400 MAD' },
  safesignal: { name: 'SafeSignal™', model: 'SHIELD™', color: '#F97316', href: '/outils/safesignal', icon: '🛡️', tagline: 'Sécurité QHSE', price: '7 900 MAD' },
  eventimpact: { name: 'EventImpact™', model: 'STAGE™', color: '#8B5CF6', href: '/outils/eventimpact', icon: '🎪', tagline: 'Événementiel', price: '7 900 MAD' },
  spacescore: { name: 'SpaceScore™', model: 'SPACE™', color: '#F59E0B', href: '/outils/spacescore', icon: '🏢', tagline: 'Brand Physique', price: '6 500 MAD' },
  finnarrative: { name: 'FinNarrative™', model: 'CAPITAL™', color: '#0EA5E9', href: '/outils/finnarrative', icon: '💹', tagline: 'Com Financière', price: '9 900 MAD' },
};

const TOOL_IDS = Object.keys(TOOL_META) as ToolId[];

function RadarChart({ scores }: { scores: Record<ToolId, number | null> }) {
  const tools = TOOL_IDS.slice(0, 6); // 6 axes principaux (sans FinNarrative pour lisibilité)
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;
  const levels = [20, 40, 60, 80, 100];

  const getPoint = (angle: number, value: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    const dist = (value / 100) * r;
    return { x: cx + dist * Math.cos(rad), y: cy + dist * Math.sin(rad) };
  };

  const getAxisEnd = (i: number) => getPoint((i * 360) / tools.length, 100);

  const filledPoints = tools.map((id, i) => {
    const val = scores[id] ?? 0;
    return getPoint((i * 360) / tools.length, val);
  });

  const pathD = filledPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Level circles */}
      {levels.map(l => (
        <polygon key={l}
          points={tools.map((_, i) => { const p = getPoint((i * 360) / tools.length, l); return `${p.x},${p.y}`; }).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      {/* Axes */}
      {tools.map((_, i) => {
        const end = getAxisEnd(i);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />;
      })}
      {/* Filled area */}
      <path d={pathD} fill="rgba(99,102,241,0.25)" stroke="#6366F1" strokeWidth="2" />
      {/* Dots */}
      {filledPoints.map((p, i) => {
        const meta = TOOL_META[tools[i]];
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill={meta.color} stroke="#0A0A0A" strokeWidth="2" />
          </g>
        );
      })}
      {/* Labels */}
      {tools.map((id, i) => {
        const angle = (i * 360) / tools.length;
        const labelPoint = getPoint(angle, 118);
        const meta = TOOL_META[id];
        return (
          <text key={id} x={labelPoint.x} y={labelPoint.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fill={meta.color} fontWeight="600">
            {meta.name.replace('™', '')}
          </text>
        );
      })}
    </svg>
  );
}

export default function BMI360Page() {
  const [scores, setScores] = useState<Partial<Record<ToolId, number>>>({});
  const [globalScore, setGlobalScore] = useState<number | null>(null);

  useEffect(() => {
    const loaded = loadBMI360Scores();
    setScores(loaded);
    const global = calculateBMI360Global(loaded);
    setGlobalScore(global);
  }, []);

  const completedTools = TOOL_IDS.filter(id => scores[id] !== null && scores[id] !== undefined);
  const numericScores = Object.fromEntries(TOOL_IDS.map(id => [id, scores[id] ?? null])) as Record<ToolId, number | null>;

  const globalMaturity = globalScore !== null ? MATURITY_LEVELS[Math.ceil(globalScore / 20) as 1 | 2 | 3 | 4 | 5 || 1] : null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ backgroundColor: '#6366F120', color: '#6366F1', border: '1px solid #6366F140' }}>
              BMI 360™ · Business Maturity Intelligence
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Votre intelligence<br />
              <span className="bg-gradient-to-r from-[#6366F1] via-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
                d'entreprise à 360°
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Le BMI 360™ agrège vos scores sur les 7 dimensions critiques pour révéler votre maturité organisationnelle globale et votre potentiel de croissance.
            </p>
          </div>

          {/* Global score */}
          {globalScore !== null ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-8 mb-10 border border-gray-800"
              style={{ background: 'linear-gradient(135deg, #6366F115, #0A0A0A)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-3">Score BMI 360™ Global</p>
                  <div className="relative inline-flex items-center justify-center">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                      <circle cx="80" cy="80" r="68" fill="none" stroke={globalMaturity?.color || '#6366F1'} strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(globalScore / 100) * 427} 427`}
                        transform="rotate(-90 80 80)" />
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-4xl font-bold text-white">{Math.round(globalScore)}</div>
                      <div className="text-xs text-gray-400">/100</div>
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: `${globalMaturity?.color}20`, color: globalMaturity?.color, border: `1px solid ${globalMaturity?.color}40` }}>
                    Niveau {globalMaturity?.label}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{completedTools.length}/7 outils complétés</p>
                </div>
                <div>
                  <RadarChart scores={numericScores} />
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-2xl p-10 mb-10 border border-dashed border-gray-700 text-center">
              <div className="text-5xl mb-4">🧭</div>
              <h2 className="text-xl font-bold text-white mb-2">Aucun score disponible</h2>
              <p className="text-gray-400 text-sm mb-6">Complétez au moins un outil de scoring pour visualiser votre BMI 360™.</p>
              <Link href="/outils/commpulse" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                  Commencer par CommPulse™ →
              </Link>
            </div>
          )}

          {/* Tool grid */}
          <h2 className="text-xl font-bold text-white mb-6">Les 7 dimensions BMI 360™</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {TOOL_IDS.map(id => {
              const meta = TOOL_META[id];
              const score = scores[id];
              const done = !!score;
              return (
                <motion.div key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border overflow-hidden"
                  style={{ borderColor: done ? `${meta.color}60` : 'rgba(255,255,255,0.08)' }}>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                          style={{ backgroundColor: `${meta.color}20` }}>
                          {meta.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white" style={{ color: meta.color }}>{meta.name}</h3>
                          <p className="text-xs text-gray-500">{meta.tagline}</p>
                        </div>
                      </div>
                      {done && (
                        <div className="text-2xl font-bold" style={{ color: meta.color }}>
                          {Math.round(score)}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">Modèle {meta.model}</div>
                    {done ? (
                      <>
                        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3">
                          <div className="h-1.5 rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: meta.color }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
                            {MATURITY_LEVELS[Math.ceil((score as number) / 20) as 1 | 2 | 3 | 4 | 5 || 1].label}
                          </span>
                          <Link href={meta.href} className="text-xs text-gray-500 hover:text-white transition-colors">Refaire →</Link>
                        </div>
                      </>
                    ) : (
                      <Link href={meta.href} className="flex items-center justify-center w-full py-2 rounded-xl border text-xs font-semibold transition-all hover:opacity-90"
                          style={{ borderColor: `${meta.color}40`, color: meta.color }}>
                          + Démarrer ce scoring — {meta.price}
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA section */}
          <div className="rounded-2xl p-8 border border-gray-800 text-center"
            style={{ background: 'linear-gradient(135deg, #6366F110, #EC489910, #0EA5E910)' }}>
            <h2 className="text-2xl font-bold text-white mb-3">Obtenez votre restitution BMI 360™</h2>
            <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">
              Un consultant senior Epitaphe360 analyse vos scores, identifie vos 3 leviers prioritaires et co-construit avec vous une feuille de route sur 12 mois.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-3 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                  Réserver ma restitution BMI 360™ — 9 900 MAD
              </Link>
              {completedTools.length < 7 && (
                <Link href={TOOL_META[TOOL_IDS.find(id => !scores[id]) ?? 'commpulse'].href} className="px-8 py-3 rounded-xl text-sm font-semibold border border-gray-700 text-gray-300 hover:border-gray-500 transition-colors">
                    Compléter les {7 - completedTools.length} outils restants →
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}




