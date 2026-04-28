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
  diagnostic: string;
  risquesCles: string[];
  actions: string[];
  quickWin: string;
}

interface ActionPlan {
  days30: string[];
  days60: string[];
  days90: string[];
}

interface AIReport {
  executiveSummary: string;
  pillarAnalyses: PillarAnalysis[];
  topRecommendations: string[];
  actionPlan90Days: ActionPlan;
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
                  <div className="text-xs text-gray-500 mt-0.5">{pa.pillar}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: toolColor }}>{pa.score}</div>
                  <div className="text-xs text-gray-600">/100</div>
                </div>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed mb-3">{pa.diagnostic}</p>
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
              {pa.quickWin && (
                <div className="rounded-lg p-3 mt-2" style={{ backgroundColor: `${toolColor}10`, border: `1px solid ${toolColor}20` }}>
                  <p className="text-xs font-medium mb-1" style={{ color: toolColor }}>⚡ Quick Win (30 jours)</p>
                  <p className="text-xs text-gray-400">{pa.quickWin}</p>
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
          <ol className="space-y-3">
            {aiReport.topRecommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-300">
                <span className="shrink-0 font-bold w-5 text-center" style={{ color: toolColor }}>{i + 1}.</span>
                <span>{rec}</span>
              </li>
            ))}
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
            {(['days30', 'days60', 'days90'] as const).map((period, i) => {
              const items = aiReport.actionPlan90Days[period] ?? [];
              const labels = ['30 premiers jours', '30–60 jours', '60–90 jours'];
              return (
                <div key={period} className="rounded-xl p-4 bg-gray-900 border border-gray-800">
                  <h4 className="text-xs font-semibold mb-3" style={{ color: toolColor }}>
                    {labels[i]}
                  </h4>
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
            })}
          </div>
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
