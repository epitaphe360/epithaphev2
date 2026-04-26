/**
 * IntelligenceResults — Rapport complet Intelligence™ généré par IA
 * CDC BMI 360™ : Discover → Intelligence → Transform
 */
import { motion } from 'framer-motion';
import { MATURITY_LEVELS } from '@/lib/scoring-engine';
import type { MaturityLevel } from '@/lib/scoring-engine';
import { BookExpertCTA } from './book-expert-cta';

interface PillarAnalysis {
  pillar: string;
  pillarLabel: string;
  score: number;
  niveau?: string;
  diagnostic: string;
  impactOrganisationnel?: string;
  benchmarkMENA?: string;
  risquesCles: string[];
  facteursBloquants?: string[];
  actions: string[];
  quickWin: string;
  indicateursCles?: string[];
  prochainNiveau?: string;
}

interface ActionPlanEntry {
  week: string;
  actions: string[];
  livrable?: string;
  kpi?: string;
}

interface TopRecommendation {
  priority?: number;
  title: string;
  rationale?: string;
  impact?: string;
  effortRequis?: string;
  timeline?: string;
  roiEstimate?: string;
  responsable?: string;
  prerequis?: string;
}

interface AIReport {
  syntheseDirecteur?: string;
  executiveSummary: string;
  positionConcurrentielle?: string;
  risqueStrategique?: string;
  opportuniteStrategique?: string;
  pillarAnalyses: PillarAnalysis[];
  topRecommendations: Array<TopRecommendation | string>;
  actionPlan90Days: Array<ActionPlanEntry> | { days30: string[]; days60: string[]; days90: string[] };
  messageDirigeant?: string;
  transformCTA: string;
}

interface PillarInfo {
  id: string;
  label: string;
  color?: string;
}

interface IntelligenceResultsProps {
  toolId: string;
  toolLabel: string;
  toolColor: string;
  globalScore: number;
  maturityLevel: number;
  pillarScores: Record<string, number>;
  aiReport: AIReport | null;
  allPillars: PillarInfo[];
  /** UUID du résultat de scoring (pour relier la demande Transform au scoring). */
  resultId?: string;
}

export function IntelligenceResults({
  toolId,
  toolLabel,
  toolColor,
  globalScore,
  maturityLevel,
  pillarScores,
  aiReport,
  allPillars,
  resultId,
}: IntelligenceResultsProps) {
  const level = Math.min(Math.max(maturityLevel, 1), 5) as MaturityLevel;
  const maturity = MATURITY_LEVELS[level];

  const getPillarLabel = (id: string) =>
    allPillars.find(p => p.id === id)?.label ??
    aiReport?.pillarAnalyses?.find(p => p.pillar === id)?.pillarLabel ??
    id;

  const getPillarColor = (id: string) => allPillars.find(p => p.id === id)?.color ?? toolColor;

  return (
    <div className="space-y-8">
      {/* Header Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 text-center"
        style={{ background: `linear-gradient(135deg, ${toolColor}18, ${toolColor}06)`, border: `1px solid ${toolColor}40` }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ backgroundColor: `${toolColor}20`, color: toolColor }}>
          🔓 Rapport Intelligence™ · {toolLabel}
        </div>
        <div className="text-6xl font-bold mb-2" style={{ color: toolColor }}>
          {globalScore}<span className="text-2xl text-gray-400">/100</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">{maturity.emoji}</span>
          <span className="text-xl font-semibold" style={{ color: maturity.color }}>{maturity.label}</span>
        </div>
        <p className="text-gray-400 text-sm">{maturity.description}</p>
      </motion.div>

      {/* Synthèse Dirigeant */}
      {aiReport?.syntheseDirecteur && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl p-6 bg-gray-900/80 border border-gray-700"
          style={{ borderLeft: `3px solid ${toolColor}` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">✍️</span>
            <h3 className="text-sm font-semibold text-white">Note du Senior Partner</h3>
          </div>
          {aiReport.syntheseDirecteur.split('\n\n').map((para, i) => (
            <p key={i} className={`text-gray-300 text-sm leading-relaxed ${i > 0 ? 'mt-3' : ''}`}>{para}</p>
          ))}
        </motion.div>
      )}

      {/* Executive Summary IA */}
      {aiReport?.executiveSummary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 bg-gray-900/50 border border-gray-800"
        >
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Synthèse exécutive
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">{aiReport.executiveSummary}</p>
        </motion.div>
      )}

      {/* Signaux stratégiques */}
      {(aiReport?.positionConcurrentielle || aiReport?.risqueStrategique || aiReport?.opportuniteStrategique) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {aiReport.positionConcurrentielle && (
            <div className="rounded-xl p-4 bg-gray-900/50 border border-gray-800">
              <p className="text-xs font-semibold text-blue-400 mb-1.5">🌍 Position concurrentielle</p>
              <p className="text-xs text-gray-400 leading-relaxed">{aiReport.positionConcurrentielle}</p>
            </div>
          )}
          {aiReport.risqueStrategique && (
            <div className="rounded-xl p-4 bg-gray-900/50 border border-red-900/30">
              <p className="text-xs font-semibold text-red-400 mb-1.5">⚠ Risque stratégique #1</p>
              <p className="text-xs text-gray-400 leading-relaxed">{aiReport.risqueStrategique}</p>
            </div>
          )}
          {aiReport.opportuniteStrategique && (
            <div className="rounded-xl p-4 bg-gray-900/50 border border-green-900/30">
              <p className="text-xs font-semibold text-green-400 mb-1.5">🚀 Opportunité prioritaire</p>
              <p className="text-xs text-gray-400 leading-relaxed">{aiReport.opportuniteStrategique}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Radar visuel — tous les pilliers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-6 bg-gray-900/50 border border-gray-800"
      >
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
          Score par pillier
        </h3>
        <div className="space-y-3">
          {Object.entries(pillarScores).map(([pillarId, score]) => (
            <div key={pillarId} className="flex items-center gap-3">
              <div className="w-28 text-xs text-gray-400 shrink-0">{getPillarLabel(pillarId)}</div>
              <div className="flex-1 bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getPillarColor(pillarId) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <div className="w-12 text-xs font-medium text-right" style={{ color: getPillarColor(pillarId) }}>
                {score}/100
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Analyses IA par pillier */}
      {aiReport?.pillarAnalyses && aiReport.pillarAnalyses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-base font-semibold text-white">Analyse détaillée par pillier</h3>
          {aiReport.pillarAnalyses.map((pa, i) => (
            <motion.div
              key={pa.pillar}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="rounded-xl p-5 bg-gray-900/50 border border-gray-800"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white text-sm">{pa.pillarLabel}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs text-gray-500">{pa.pillar}</div>
                    {pa.niveau && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        pa.niveau === 'Critique' ? 'bg-red-900/40 text-red-400' :
                        pa.niveau === 'Préoccupant' ? 'bg-orange-900/40 text-orange-400' :
                        pa.niveau === 'En développement' ? 'bg-yellow-900/40 text-yellow-400' :
                        pa.niveau === 'Performant' ? 'bg-blue-900/40 text-blue-400' :
                        'bg-green-900/40 text-green-400'
                      }`}>{pa.niveau}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: toolColor }}>{pa.score}</div>
                  <div className="text-xs text-gray-600">/100</div>
                </div>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed mb-3">{pa.diagnostic}</p>
              {pa.impactOrganisationnel && (
                <div className="rounded-lg p-3 mb-3 bg-gray-800/50 border border-gray-700/50">
                  <p className="text-xs font-medium text-gray-400 mb-1">📊 Impact organisationnel</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{pa.impactOrganisationnel}</p>
                </div>
              )}
              {pa.benchmarkMENA && (
                <div className="flex items-start gap-1.5 mb-3">
                  <span className="text-xs text-blue-500 shrink-0">🌍</span>
                  <p className="text-xs text-blue-400/80 italic">{pa.benchmarkMENA}</p>
                </div>
              )}
              {pa.risquesCles && pa.risquesCles.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-red-400 mb-1.5">⚠ Risques clés</p>
                  <ul className="space-y-1">
                    {pa.risquesCles.map((r, j) => (
                      <li key={j} className="text-xs text-gray-500 flex gap-1.5">
                        <span className="text-red-600 shrink-0">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pa.facteursBloquants && pa.facteursBloquants.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-orange-400 mb-1.5">🔒 Facteurs bloquants</p>
                  <ul className="space-y-1">
                    {pa.facteursBloquants.map((f, j) => (
                      <li key={j} className="text-xs text-gray-500 flex gap-1.5">
                        <span className="text-orange-600 shrink-0">—</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pa.actions && pa.actions.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-green-400 mb-1.5">✓ Actions recommandées</p>
                  <ul className="space-y-1">
                    {pa.actions.map((a, j) => (
                      <li key={j} className="text-xs text-gray-500 flex gap-1.5">
                        <span className="shrink-0" style={{ color: toolColor }}>→</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pa.indicateursCles && pa.indicateursCles.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-purple-400 mb-1.5">📈 KPIs de suivi</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pa.indicateursCles.map((kpi, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-300 border border-purple-800/30">{kpi}</span>
                    ))}
                  </div>
                </div>
              )}
              {pa.quickWin && (
                <div className="rounded-lg p-3 mt-2" style={{ backgroundColor: `${toolColor}10`, border: `1px solid ${toolColor}20` }}>
                  <p className="text-xs font-medium mb-1" style={{ color: toolColor }}>⚡ Quick Win (30 jours)</p>
                  <p className="text-xs text-gray-400">{pa.quickWin}</p>
                </div>
              )}
              {pa.prochainNiveau && (
                <div className="mt-2 flex items-start gap-1.5">
                  <span className="text-xs text-gray-600 shrink-0">↑</span>
                  <p className="text-xs text-gray-600 italic leading-relaxed">{pa.prochainNiveau}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Recommandations top */}
      {aiReport?.topRecommendations && aiReport.topRecommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6 bg-gray-900/50 border border-gray-800"
        >
          <h3 className="text-base font-semibold text-white mb-4">
            Top recommandations stratégiques
          </h3>
          <ol className="space-y-4">
            {aiReport.topRecommendations.map((rec, i) => {
              const isObj = typeof rec === 'object' && rec !== null;
              const title       = isObj ? (rec as TopRecommendation).title       : rec as string;
              const rationale   = isObj ? (rec as TopRecommendation).rationale   : undefined;
              const timeline    = isObj ? (rec as TopRecommendation).timeline    : undefined;
              const impact      = isObj ? (rec as TopRecommendation).impact      : undefined;
              const effortRequis= isObj ? (rec as TopRecommendation).effortRequis: undefined;
              const roiEstimate = isObj ? (rec as TopRecommendation).roiEstimate : undefined;
              const responsable = isObj ? (rec as TopRecommendation).responsable : undefined;
              const prerequis   = isObj ? (rec as TopRecommendation).prerequis   : undefined;
              return (
                <li key={i} className="rounded-xl p-4 bg-gray-900/80 border border-gray-800">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                      style={{ backgroundColor: toolColor }}>{i + 1}</span>
                    <span className="font-semibold text-white text-sm">{title}</span>
                  </div>
                  <div className="ml-9 space-y-2">
                    {rationale && <p className="text-xs text-gray-400 leading-relaxed">{rationale}</p>}
                    <div className="flex flex-wrap gap-1.5">
                      {impact && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          impact === 'Élevé' || impact === 'Fort' ? 'bg-red-900/40 text-red-400' : 'bg-yellow-900/40 text-yellow-400'
                        }`}>Impact: {impact}</span>
                      )}
                      {effortRequis && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                          Effort: {effortRequis}
                        </span>
                      )}
                      {timeline && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${toolColor}20`, color: toolColor }}>
                          ⏱ {timeline}
                        </span>
                      )}
                      {responsable && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400">
                          👤 {responsable}
                        </span>
                      )}
                    </div>
                    {roiEstimate && (
                      <p className="text-xs text-green-400/80 flex gap-1.5">
                        <span className="shrink-0">💰</span>
                        <span>{roiEstimate}</span>
                      </p>
                    )}
                    {prerequis && (
                      <p className="text-xs text-gray-600 flex gap-1.5">
                        <span className="shrink-0">📋</span>
                        <span>Prérequis : {prerequis}</span>
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </motion.div>
      )}

      {/* Plan d'action 90 jours */}
      {aiReport?.actionPlan90Days && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl p-6 bg-gray-900/50 border border-gray-800"
        >
          <h3 className="text-base font-semibold text-white mb-4">Plan d'action 90 jours</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(() => {
              const plan = aiReport.actionPlan90Days;
              // Format array [{week, actions}] (serveur)
              if (Array.isArray(plan)) {
                const labels = ['30 premiers jours', '30–60 jours', '60–90 jours'];
                return plan.slice(0, 3).map((entry, i) => (
                  <div key={i} className="rounded-xl p-4 bg-gray-900 border border-gray-800">
                    <h4 className="text-xs font-semibold mb-3" style={{ color: toolColor }}>{entry.week ?? labels[i]}</h4>
                    <ul className="space-y-2 mb-3">
                      {(entry.actions ?? []).map((item: string, j: number) => (
                        <li key={j} className="text-xs text-gray-400 flex gap-1.5">
                          <span className="shrink-0 text-gray-600">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {entry.livrable && (
                      <div className="border-t border-gray-800 pt-2 mt-2">
                        <p className="text-[10px] text-gray-600 font-medium mb-0.5">📄 Livrable</p>
                        <p className="text-[10px] text-gray-500">{entry.livrable}</p>
                      </div>
                    )}
                    {entry.kpi && (
                      <div className="mt-1.5">
                        <p className="text-[10px] text-gray-600 font-medium mb-0.5">📊 KPI</p>
                        <p className="text-[10px] text-purple-400/80">{entry.kpi}</p>
                      </div>
                    )}
                  </div>
                ));
              }
              // Format objet {days30, days60, days90} (legacy)
              const obj = plan as { days30: string[]; days60: string[]; days90: string[] };
              return (['days30', 'days60', 'days90'] as const).map((period, i) => {
                const items = obj[period] ?? [];
                const labels = ['30 premiers jours', '30–60 jours', '60–90 jours'];
                return (
                  <div key={period} className="rounded-xl p-4 bg-gray-900 border border-gray-800">
                    <h4 className="text-xs font-semibold mb-3" style={{ color: toolColor }}>{labels[i]}</h4>
                    <ul className="space-y-2">
                      {items.map((item: string, j: number) => (
                        <li key={j} className="text-xs text-gray-400 flex gap-1.5">
                          <span className="shrink-0 text-gray-600">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              });
            })()}
          </div>
        </motion.div>
      )}

      {/* Message au Dirigeant */}
      {aiReport?.messageDirigeant && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="rounded-2xl p-6"
          style={{ background: `linear-gradient(135deg, ${toolColor}10, ${toolColor}04)`, border: `1px solid ${toolColor}30` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">💬</span>
            <h3 className="text-sm font-semibold text-white">Message au dirigeant</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed italic">{aiReport.messageDirigeant}</p>
        </motion.div>
      )}

      {/* Transform CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl p-8 text-center"
        style={{ background: `linear-gradient(135deg, ${toolColor}20, ${toolColor}08)`, border: `1px solid ${toolColor}40` }}
      >
        <div className="text-3xl mb-3">🚀</div>
        <h3 className="text-xl font-bold text-white mb-2">
          Passez à l'action avec Transform™
        </h3>
        <p className="text-gray-400 text-sm mb-2 max-w-md mx-auto">
          {aiReport?.transformCTA ?? `Votre diagnostic Intelligence™ révèle des leviers prioritaires. L'équipe Epitaphe 360 vous accompagne pour les activer avec un programme Transform sur mesure.`}
        </p>
        <a
          href="/contact"
          className="inline-block mt-4 px-8 py-4 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90"
          style={{ backgroundColor: toolColor }}
        >
          Prendre RDV avec un Expert Transform™ →
        </a>
        <p className="text-xs text-gray-600 mt-3">Sur devis · Accompagnement personnalisé</p>
      </motion.div>

      {/* Formulaire interne RDV expert (Transform) */}
      <BookExpertCTA
        scoringResultId={resultId}
        toolId={toolId}
        toolColor={toolColor}
        globalScore={globalScore}
      />
    </div>
  );
}
