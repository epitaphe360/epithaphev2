/**
 * IntelligenceResults — Rapport complet Intelligence™ généré par IA
 * CDC BMI 360™ : Discover → Intelligence → Transform
 */
import { motion } from 'framer-motion';
import { MATURITY_LEVELS } from '@/lib/scoring-engine';
import type { MaturityLevel } from '@/lib/scoring-engine';
import { BookExpertCTA } from './book-expert-cta';

// ─── Types riches alignés sur le schéma backend tier-1 ──────────────────────

interface QuantifiedRisk {
  risque: string;
  consequence?: string;
  probabilite?: string;
  impact?: string;
  horizon?: string;
  coutEstime?: string;
  mitigation?: string;
}

interface QuantifiedOpportunity {
  opportunite: string;
  facilite?: string;
  valeur?: string;
  horizon?: string;
  valeurEstimee?: string;
  actionPourSaisir?: string;
}

interface BloquantTypé {
  facteur: string;
  type?: string;
  leverDeblocage?: string;
}

interface ActionDetaillee {
  action: string;
  responsable?: string;
  delai?: string;
  ressources?: string;
  kpiSucces?: string;
}

interface QuickWinDetaille {
  titre?: string;
  description?: string;
  responsable?: string;
  delai?: string;
  livrable?: string;
  investissement?: string;
  impactAttendu?: string;
}

interface BusinessCase {
  investissementEstime?: string;
  gainAnnuelEstime?: string;
  paybackPeriod?: string;
  horizonROI?: string;
  hypothesesClefs?: string[];
  ratioROI?: string;
}

interface RACI {
  responsable?: string;
  imputable?: string;
  consultes?: string[];
  informes?: string[];
}

interface PillarAnalysis {
  pillar: string;
  pillarLabel: string;
  score: number;
  niveau?: string;
  diagnostic: string;
  rootCauseAnalysis?: string;
  impactOrganisationnel?: string;
  impactQuantifie?: {
    coutCacheAnnuel?: string;
    impactProductivite?: string;
    impactEngagement?: string;
    impactReputationnel?: string;
  };
  benchmarkMENA?: string;
  benchmarkSectoriel?: {
    vousEtes?: number;
    moyenneMENA?: number;
    topQuartileMENA?: number;
    leaderSecteur?: number;
    ecartAuLeader?: string;
    interpretation?: string;
  };
  risquesCles: Array<QuantifiedRisk | string>;
  facteursBloquants?: Array<BloquantTypé | string>;
  actions: Array<ActionDetaillee | string>;
  quickWin: QuickWinDetaille | string;
  indicateursCles?: { lagging?: string[]; leading?: string[] } | string[];
  cheminVersExcellence?: {
    niveauActuel?: string;
    prochainNiveau?: string;
    leviersClefs?: string[];
    horizonAtteinte?: string;
  };
  prochainNiveau?: string;
}

interface ActionPlanEntry {
  phase?: string;
  week: string;
  objectif?: string;
  actions: Array<ActionDetaillee | string>;
  livrable?: string;
  kpi?: string;
  comiteValidation?: string;
  ressourcesRequises?: string;
  budgetAlloue?: string;
}

interface TopRecommendation {
  priority?: number;
  title: string;
  narrativeStrategique?: string;
  rationale?: string;
  businessCase?: BusinessCase;
  raci?: RACI;
  impact?: string;
  effortRequis?: string;
  timeline?: string;
  roiEstimate?: string;
  responsable?: string;
  prerequis?: string[] | string;
  facteursCritiquesSucces?: string[];
  piegesAEviter?: string[];
  methodologie?: string;
}

interface ScenarioProjection {
  scoreCible12Mois?: number;
  investissement?: string;
  description?: string;
  conditionsRealisation?: string[];
}

interface CasReference {
  secteur: string;
  tailleEntreprise?: string;
  situationDepart?: string;
  actionsClefs?: string[];
  resultats?: string;
  duree?: string;
}

interface StakeholderImpact {
  groupe: string;
  posture?: string;
  enjeu?: string;
  actionRequise?: string;
}

interface AIReport {
  couverture?: {
    titre?: string;
    sousTitre?: string;
    verdictUneLigne?: string;
    dateDiagnostic?: string;
    perimetre?: string;
  };
  syntheseDirecteur?: string;
  executiveSummary: string;
  troisChiffresClefs?: Array<{ chiffre: string; label: string; interpretation?: string }>;
  troisMessagesClefs?: string[];
  positionConcurrentielle?: string;
  positionnementStrategique?: {
    vsBenchmarkMENA?: string;
    vsTop25Pct?: string;
    vsLeaderSecteur?: string;
    trajectoireProjete5Ans?: string;
  };
  risqueStrategique?: string;
  opportuniteStrategique?: string;
  matriceRisques?: QuantifiedRisk[];
  matriceOpportunites?: QuantifiedOpportunity[];
  pillarAnalyses: PillarAnalysis[];
  topRecommendations: Array<TopRecommendation | string>;
  actionPlan90Days: Array<ActionPlanEntry> | { days30: string[]; days60: string[]; days90: string[] };
  scenariosProjection?: {
    conservateur?: ScenarioProjection;
    base?: ScenarioProjection;
    ambitieux?: ScenarioProjection;
  };
  gouvernance?: {
    instancePilotage?: string;
    frequenceReporting?: string;
    sponsorExecutif?: string;
    equipeProjet?: string;
    budgetTotalRecommande?: string;
  };
  changeManagement?: {
    stakeholdersCritiques?: StakeholderImpact[];
    risquesAdoption?: string[];
    leviersAdoption?: string[];
    planCommunicationInterne?: string;
  };
  casReference?: CasReference[];
  messageDirigeant?: string;
  transformCTA: string;
}

// ─── Helpers d'extraction (string ou objet) ──────────────────────────────────

const asText = {
  risque: (r: QuantifiedRisk | string): string => typeof r === 'string' ? r : r.risque,
  bloquant: (b: BloquantTypé | string): string => typeof b === 'string' ? b : b.facteur,
  action: (a: ActionDetaillee | string): string => typeof a === 'string' ? a : a.action,
};

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

      {/* COUVERTURE — verdict une ligne (premium) */}
      {aiReport?.couverture && (aiReport.couverture.titre || aiReport.couverture.verdictUneLigne) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="rounded-2xl p-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-700"
          style={{ borderTop: `3px solid ${toolColor}` }}
        >
          {aiReport.couverture.titre && <h2 className="text-lg font-bold text-white mb-1">{aiReport.couverture.titre}</h2>}
          {aiReport.couverture.sousTitre && <p className="text-xs text-gray-500 mb-3">{aiReport.couverture.sousTitre}</p>}
          {aiReport.couverture.verdictUneLigne && (
            <p className="text-base text-white font-medium leading-snug border-l-2 pl-3 mt-3" style={{ borderColor: toolColor }}>
              « {aiReport.couverture.verdictUneLigne} »
            </p>
          )}
          {aiReport.couverture.perimetre && <p className="text-[11px] text-gray-600 italic mt-3">Périmètre&nbsp;: {aiReport.couverture.perimetre}</p>}
        </motion.div>
      )}

      {/* 3 CHIFFRES CLEFS (premium) */}
      {aiReport?.troisChiffresClefs && aiReport.troisChiffresClefs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {aiReport.troisChiffresClefs.slice(0, 3).map((c, i) => (
            <div key={i} className="rounded-xl p-5 bg-gray-900/80 border border-gray-800 text-center">
              <p className="text-3xl font-bold mb-1" style={{ color: toolColor }}>{c.chiffre}</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{c.label}</p>
              {c.interpretation && <p className="text-[11px] text-gray-500 mt-2 italic">{c.interpretation}</p>}
            </div>
          ))}
        </motion.div>
      )}

      {/* 3 MESSAGES CLEFS (premium) */}
      {aiReport?.troisMessagesClefs && aiReport.troisMessagesClefs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="rounded-2xl p-5 bg-gray-900/40 border border-gray-800"
        >
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Messages clés</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiReport.troisMessagesClefs.slice(0, 3).map((m, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-black" style={{ backgroundColor: toolColor }}>{i + 1}</span>
                <p className="text-sm text-gray-300 font-medium leading-snug">{m}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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

      {/* POSITIONNEMENT STRATÉGIQUE détaillé (premium) */}
      {aiReport?.positionnementStrategique && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }}
          className="rounded-2xl p-5 bg-gray-900/50 border border-gray-800"
        >
          <h3 className="text-sm font-semibold text-white mb-3">📊 Positionnement stratégique</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiReport.positionnementStrategique.vsBenchmarkMENA && (
              <div className="rounded-lg p-3 bg-gray-900/60">
                <p className="text-[10px] font-semibold text-blue-400 uppercase mb-1">vs Benchmark MENA</p>
                <p className="text-xs text-gray-300">{aiReport.positionnementStrategique.vsBenchmarkMENA}</p>
              </div>
            )}
            {aiReport.positionnementStrategique.vsTop25Pct && (
              <div className="rounded-lg p-3 bg-gray-900/60">
                <p className="text-[10px] font-semibold text-purple-400 uppercase mb-1">vs Top 25% MENA</p>
                <p className="text-xs text-gray-300">{aiReport.positionnementStrategique.vsTop25Pct}</p>
              </div>
            )}
            {aiReport.positionnementStrategique.vsLeaderSecteur && (
              <div className="rounded-lg p-3 bg-gray-900/60">
                <p className="text-[10px] font-semibold text-yellow-400 uppercase mb-1">vs Leader secteur</p>
                <p className="text-xs text-gray-300">{aiReport.positionnementStrategique.vsLeaderSecteur}</p>
              </div>
            )}
            {aiReport.positionnementStrategique.trajectoireProjete5Ans && (
              <div className="rounded-lg p-3 bg-gray-900/60">
                <p className="text-[10px] font-semibold text-orange-400 uppercase mb-1">Trajectoire 5 ans (sans action)</p>
                <p className="text-xs text-gray-300">{aiReport.positionnementStrategique.trajectoireProjete5Ans}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* MATRICE RISQUES (premium) */}
      {aiReport?.matriceRisques && aiReport.matriceRisques.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="rounded-2xl p-5 bg-gray-900/50 border border-red-900/20"
        >
          <h3 className="text-sm font-semibold text-white mb-3">⚠ Matrice des risques quantifiés</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] uppercase text-gray-500 border-b border-gray-800">
                  <th className="text-left pb-2 pr-2">Risque</th>
                  <th className="text-left pb-2 pr-2">Probabilité</th>
                  <th className="text-left pb-2 pr-2">Impact</th>
                  <th className="text-left pb-2 pr-2">Horizon</th>
                  <th className="text-left pb-2 pr-2">Coût estimé</th>
                  <th className="text-left pb-2">Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {aiReport.matriceRisques.map((r, i) => (
                  <tr key={i} className="border-b border-gray-900 align-top">
                    <td className="py-2 pr-2 text-gray-300 font-medium">{r.risque}{r.consequence && <div className="text-[10px] text-gray-500 mt-0.5">{r.consequence}</div>}</td>
                    <td className="py-2 pr-2 text-gray-400">{r.probabilite ?? '—'}</td>
                    <td className="py-2 pr-2 text-gray-400">{r.impact ?? '—'}</td>
                    <td className="py-2 pr-2 text-gray-500">{r.horizon ?? '—'}</td>
                    <td className="py-2 pr-2 text-red-400 font-medium">{r.coutEstime ?? '—'}</td>
                    <td className="py-2 text-green-400/80">{r.mitigation ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* MATRICE OPPORTUNITÉS (premium) */}
      {aiReport?.matriceOpportunites && aiReport.matriceOpportunites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-5 bg-gray-900/50 border border-green-900/20"
        >
          <h3 className="text-sm font-semibold text-white mb-3">🚀 Matrice des opportunités quantifiées</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] uppercase text-gray-500 border-b border-gray-800">
                  <th className="text-left pb-2 pr-2">Opportunité</th>
                  <th className="text-left pb-2 pr-2">Facilité</th>
                  <th className="text-left pb-2 pr-2">Valeur</th>
                  <th className="text-left pb-2 pr-2">Horizon</th>
                  <th className="text-left pb-2 pr-2">Valeur estimée</th>
                  <th className="text-left pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {aiReport.matriceOpportunites.map((o, i) => (
                  <tr key={i} className="border-b border-gray-900 align-top">
                    <td className="py-2 pr-2 text-gray-300 font-medium">{o.opportunite}</td>
                    <td className="py-2 pr-2 text-gray-400">{o.facilite ?? '—'}</td>
                    <td className="py-2 pr-2 text-gray-400">{o.valeur ?? '—'}</td>
                    <td className="py-2 pr-2 text-gray-500">{o.horizon ?? '—'}</td>
                    <td className="py-2 pr-2 text-green-400 font-medium">{o.valeurEstimee ?? '—'}</td>
                    <td className="py-2 text-gray-400">{o.actionPourSaisir ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              {pa.rootCauseAnalysis && (
                <div className="rounded-lg p-3 mb-3 bg-orange-900/10 border border-orange-900/20">
                  <p className="text-xs font-medium text-orange-400 mb-1">🔍 Analyse causale (5-Why)</p>
                  <p className="text-xs text-gray-400 leading-relaxed italic">{pa.rootCauseAnalysis}</p>
                </div>
              )}
              {pa.impactQuantifie && (
                <div className="rounded-lg p-3 mb-3 bg-red-900/10 border border-red-900/20">
                  <p className="text-xs font-medium text-red-400 mb-2">💰 Impact quantifié</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    {pa.impactQuantifie.coutCacheAnnuel && <div><span className="text-gray-500">Coût caché annuel&nbsp;: </span><span className="text-red-300 font-medium">{pa.impactQuantifie.coutCacheAnnuel}</span></div>}
                    {pa.impactQuantifie.impactProductivite && <div><span className="text-gray-500">Productivité&nbsp;: </span><span className="text-gray-300">{pa.impactQuantifie.impactProductivite}</span></div>}
                    {pa.impactQuantifie.impactEngagement && <div><span className="text-gray-500">Engagement&nbsp;: </span><span className="text-gray-300">{pa.impactQuantifie.impactEngagement}</span></div>}
                    {pa.impactQuantifie.impactReputationnel && <div><span className="text-gray-500">Réputation&nbsp;: </span><span className="text-gray-300">{pa.impactQuantifie.impactReputationnel}</span></div>}
                  </div>
                </div>
              )}
              {pa.benchmarkSectoriel && (
                <div className="rounded-lg p-3 mb-3 bg-blue-900/10 border border-blue-900/20">
                  <p className="text-xs font-medium text-blue-400 mb-2">🌍 Benchmark sectoriel MENA</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] mb-2">
                    {pa.benchmarkSectoriel.vousEtes !== undefined && (
                      <div className="text-center"><div className="text-base font-bold" style={{ color: toolColor }}>{pa.benchmarkSectoriel.vousEtes}</div><div className="text-[9px] text-gray-500 uppercase">Vous</div></div>
                    )}
                    {pa.benchmarkSectoriel.moyenneMENA !== undefined && (
                      <div className="text-center"><div className="text-base font-bold text-gray-400">{pa.benchmarkSectoriel.moyenneMENA}</div><div className="text-[9px] text-gray-500 uppercase">Moy. MENA</div></div>
                    )}
                    {pa.benchmarkSectoriel.topQuartileMENA !== undefined && (
                      <div className="text-center"><div className="text-base font-bold text-purple-400">{pa.benchmarkSectoriel.topQuartileMENA}</div><div className="text-[9px] text-gray-500 uppercase">Top 25%</div></div>
                    )}
                    {pa.benchmarkSectoriel.leaderSecteur !== undefined && (
                      <div className="text-center"><div className="text-base font-bold text-yellow-400">{pa.benchmarkSectoriel.leaderSecteur}</div><div className="text-[9px] text-gray-500 uppercase">Leader</div></div>
                    )}
                  </div>
                  {pa.benchmarkSectoriel.ecartAuLeader && <p className="text-[11px] text-yellow-400/70">Écart au leader&nbsp;: {pa.benchmarkSectoriel.ecartAuLeader}</p>}
                  {pa.benchmarkSectoriel.interpretation && <p className="text-[11px] text-gray-400 italic mt-1">{pa.benchmarkSectoriel.interpretation}</p>}
                </div>
              )}
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
                  <ul className="space-y-1.5">
                    {pa.risquesCles.map((r, j) => {
                      const isObj = typeof r === 'object' && r !== null;
                      const o = isObj ? (r as QuantifiedRisk) : null;
                      return (
                        <li key={j} className="text-xs text-gray-500">
                          <div className="flex gap-1.5">
                            <span className="text-red-600 shrink-0">•</span>
                            <span className="font-medium text-gray-400">{o ? o.risque : (r as string)}</span>
                          </div>
                          {o && (o.consequence || o.coutEstime || o.probabilite || o.impact || o.horizon || o.mitigation) && (
                            <div className="ml-3 mt-0.5 space-y-0.5 text-[11px] text-gray-600">
                              {o.consequence && <div>Conséquence&nbsp;: {o.consequence}</div>}
                              <div className="flex flex-wrap gap-1.5">
                                {o.probabilite && <span className="px-1.5 py-0.5 rounded bg-gray-800/60">Proba&nbsp;: {o.probabilite}</span>}
                                {o.impact && <span className="px-1.5 py-0.5 rounded bg-gray-800/60">Impact&nbsp;: {o.impact}</span>}
                                {o.horizon && <span className="px-1.5 py-0.5 rounded bg-gray-800/60">{o.horizon}</span>}
                                {o.coutEstime && <span className="px-1.5 py-0.5 rounded bg-red-900/30 text-red-400">{o.coutEstime}</span>}
                              </div>
                              {o.mitigation && <div className="text-green-400/70">Mitigation&nbsp;: {o.mitigation}</div>}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {pa.facteursBloquants && pa.facteursBloquants.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-orange-400 mb-1.5">🔒 Facteurs bloquants</p>
                  <ul className="space-y-1">
                    {pa.facteursBloquants.map((f, j) => {
                      const o = typeof f === 'object' && f !== null ? (f as BloquantTypé) : null;
                      return (
                        <li key={j} className="text-xs text-gray-500">
                          <div className="flex gap-1.5">
                            <span className="text-orange-600 shrink-0">—</span>
                            <span>{o ? o.facteur : (f as string)}</span>
                            {o?.type && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-900/30 text-orange-400">{o.type}</span>}
                          </div>
                          {o?.leverDeblocage && <div className="ml-3 text-[11px] text-green-400/70">Levier&nbsp;: {o.leverDeblocage}</div>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {pa.actions && pa.actions.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-green-400 mb-1.5">✓ Actions recommandées</p>
                  <ul className="space-y-1.5">
                    {pa.actions.map((a, j) => {
                      const o = typeof a === 'object' && a !== null ? (a as ActionDetaillee) : null;
                      return (
                        <li key={j} className="text-xs text-gray-500">
                          <div className="flex gap-1.5">
                            <span className="shrink-0" style={{ color: toolColor }}>→</span>
                            <span>{o ? o.action : (a as string)}</span>
                          </div>
                          {o && (o.responsable || o.delai || o.ressources || o.kpiSucces) && (
                            <div className="ml-3 mt-0.5 flex flex-wrap gap-1.5 text-[10px]">
                              {o.responsable && <span className="px-1.5 py-0.5 rounded-full bg-blue-900/30 text-blue-400">👤 {o.responsable}</span>}
                              {o.delai && <span className="px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400">⏱ {o.delai}</span>}
                              {o.ressources && <span className="px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400">{o.ressources}</span>}
                              {o.kpiSucces && <span className="px-1.5 py-0.5 rounded-full bg-purple-900/30 text-purple-300">KPI&nbsp;: {o.kpiSucces}</span>}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {pa.indicateursCles && (() => {
                const ic = pa.indicateursCles;
                const isArr = Array.isArray(ic);
                const lagging = isArr ? (ic as string[]) : (ic.lagging ?? []);
                const leading = isArr ? [] : (ic.leading ?? []);
                if (lagging.length === 0 && leading.length === 0) return null;
                return (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-purple-400 mb-1.5">📈 KPIs de suivi</p>
                    {lagging.length > 0 && (
                      <div className="mb-1.5">
                        {!isArr && <p className="text-[10px] text-purple-300/70 mb-1">Lagging (résultat)</p>}
                        <div className="flex flex-wrap gap-1.5">
                          {lagging.map((kpi, j) => (
                            <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-300 border border-purple-800/30">{kpi}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {leading.length > 0 && (
                      <div>
                        <p className="text-[10px] text-blue-300/70 mb-1">Leading (prédictif)</p>
                        <div className="flex flex-wrap gap-1.5">
                          {leading.map((kpi, j) => (
                            <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/30">{kpi}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
              {pa.quickWin && (() => {
                const qw = pa.quickWin;
                const o = typeof qw === 'object' && qw !== null ? (qw as QuickWinDetaille) : null;
                return (
                  <div className="rounded-lg p-3 mt-2" style={{ backgroundColor: `${toolColor}10`, border: `1px solid ${toolColor}20` }}>
                    <p className="text-xs font-medium mb-1" style={{ color: toolColor }}>⚡ Quick Win {o?.delai ? `(${o.delai})` : '(30 jours)'}</p>
                    {o ? (
                      <div className="space-y-1">
                        {o.titre && <p className="text-xs font-semibold text-gray-300">{o.titre}</p>}
                        {o.description && <p className="text-xs text-gray-400">{o.description}</p>}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {o.responsable && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-900/30 text-blue-400">👤 {o.responsable}</span>}
                          {o.livrable && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400">📦 {o.livrable}</span>}
                          {o.investissement && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-900/30 text-yellow-400">💵 {o.investissement}</span>}
                          {o.impactAttendu && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-900/30 text-green-400">📈 {o.impactAttendu}</span>}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">{qw as string}</p>
                    )}
                  </div>
                );
              })()}
              {(pa.prochainNiveau || pa.cheminVersExcellence?.prochainNiveau) && (
                <div className="mt-2 flex items-start gap-1.5">
                  <span className="text-xs text-gray-600 shrink-0">↑</span>
                  <p className="text-xs text-gray-600 italic leading-relaxed">
                    {pa.cheminVersExcellence?.prochainNiveau ?? pa.prochainNiveau}
                    {pa.cheminVersExcellence?.horizonAtteinte && <span className="text-gray-700"> · {pa.cheminVersExcellence.horizonAtteinte}</span>}
                  </p>
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
              const narrative   = isObj ? (rec as TopRecommendation).narrativeStrategique : undefined;
              const rationale   = isObj ? (rec as TopRecommendation).rationale   : undefined;
              const timeline    = isObj ? (rec as TopRecommendation).timeline    : undefined;
              const impact      = isObj ? (rec as TopRecommendation).impact      : undefined;
              const effortRequis= isObj ? (rec as TopRecommendation).effortRequis: undefined;
              const roiEstimate = isObj ? (rec as TopRecommendation).roiEstimate : undefined;
              const responsable = isObj ? (rec as TopRecommendation).responsable : undefined;
              const prerequis   = isObj ? (rec as TopRecommendation).prerequis   : undefined;
              const businessCase= isObj ? (rec as TopRecommendation).businessCase : undefined;
              const raci        = isObj ? (rec as TopRecommendation).raci        : undefined;
              const fcs         = isObj ? (rec as TopRecommendation).facteursCritiquesSucces : undefined;
              const pieges      = isObj ? (rec as TopRecommendation).piegesAEviter : undefined;
              const methodo     = isObj ? (rec as TopRecommendation).methodologie : undefined;
              return (
                <li key={i} className="rounded-xl p-4 bg-gray-900/80 border border-gray-800">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                      style={{ backgroundColor: toolColor }}>{i + 1}</span>
                    <span className="font-semibold text-white text-sm">{title}</span>
                  </div>
                  <div className="ml-9 space-y-2">
                    {narrative && <p className="text-xs text-gray-300 leading-relaxed font-medium">{narrative}</p>}
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
                      {methodo && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-300">📐 {methodo}</span>
                      )}
                    </div>
                    {businessCase && (
                      <div className="rounded-lg p-3 bg-green-900/10 border border-green-900/20 mt-2">
                        <p className="text-[10px] font-semibold text-green-400 uppercase mb-2">💼 Business Case</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                          {businessCase.investissementEstime && <div><div className="text-gray-500 text-[9px] uppercase">Investissement</div><div className="text-gray-200 font-medium">{businessCase.investissementEstime}</div></div>}
                          {businessCase.gainAnnuelEstime && <div><div className="text-gray-500 text-[9px] uppercase">Gain annuel</div><div className="text-green-300 font-medium">{businessCase.gainAnnuelEstime}</div></div>}
                          {businessCase.paybackPeriod && <div><div className="text-gray-500 text-[9px] uppercase">Payback</div><div className="text-gray-200 font-medium">{businessCase.paybackPeriod}</div></div>}
                          {businessCase.ratioROI && <div><div className="text-gray-500 text-[9px] uppercase">ROI</div><div className="font-medium" style={{ color: toolColor }}>{businessCase.ratioROI}</div></div>}
                        </div>
                        {businessCase.hypothesesClefs && businessCase.hypothesesClefs.length > 0 && (
                          <div className="mt-2 text-[10px] text-gray-500">
                            <span className="font-medium">Hypothèses&nbsp;:</span> {businessCase.hypothesesClefs.join(' · ')}
                          </div>
                        )}
                      </div>
                    )}
                    {raci && (raci.responsable || raci.imputable || raci.consultes?.length || raci.informes?.length) && (
                      <div className="rounded-lg p-3 bg-blue-900/10 border border-blue-900/20">
                        <p className="text-[10px] font-semibold text-blue-400 uppercase mb-2">RACI</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                          {raci.responsable && <div><div className="text-gray-500 text-[9px] uppercase">R</div><div className="text-gray-200">{raci.responsable}</div></div>}
                          {raci.imputable && <div><div className="text-gray-500 text-[9px] uppercase">A</div><div className="text-gray-200">{raci.imputable}</div></div>}
                          {raci.consultes && raci.consultes.length > 0 && <div><div className="text-gray-500 text-[9px] uppercase">C</div><div className="text-gray-300">{raci.consultes.join(', ')}</div></div>}
                          {raci.informes && raci.informes.length > 0 && <div><div className="text-gray-500 text-[9px] uppercase">I</div><div className="text-gray-300">{raci.informes.join(', ')}</div></div>}
                        </div>
                      </div>
                    )}
                    {fcs && fcs.length > 0 && (
                      <div className="text-xs">
                        <p className="text-[10px] font-semibold text-purple-400 uppercase mb-1">✅ Facteurs critiques de succès</p>
                        <ul className="ml-3 space-y-0.5">{fcs.map((f, k) => <li key={k} className="text-gray-400 text-[11px]">• {f}</li>)}</ul>
                      </div>
                    )}
                    {pieges && pieges.length > 0 && (
                      <div className="text-xs">
                        <p className="text-[10px] font-semibold text-orange-400 uppercase mb-1">⚠ Pièges à éviter</p>
                        <ul className="ml-3 space-y-0.5">{pieges.map((p, k) => <li key={k} className="text-gray-400 text-[11px]">• {p}</li>)}</ul>
                      </div>
                    )}
                    {roiEstimate && !businessCase && (
                      <p className="text-xs text-green-400/80 flex gap-1.5">
                        <span className="shrink-0">💰</span>
                        <span>{roiEstimate}</span>
                      </p>
                    )}
                    {prerequis && (
                      <p className="text-xs text-gray-600 flex gap-1.5">
                        <span className="shrink-0">📋</span>
                        <span>Prérequis&nbsp;: {Array.isArray(prerequis) ? prerequis.join(' · ') : prerequis}</span>
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
                    <h4 className="text-xs font-semibold mb-1" style={{ color: toolColor }}>
                      {entry.phase ?? entry.week ?? labels[i]}
                      {entry.phase && entry.week && <span className="text-gray-600 font-normal"> · {entry.week}</span>}
                    </h4>
                    {entry.objectif && <p className="text-[11px] text-gray-500 italic mb-2">{entry.objectif}</p>}
                    <ul className="space-y-2 mb-3">
                      {(entry.actions ?? []).map((item, j: number) => {
                        const o = typeof item === 'object' && item !== null ? (item as ActionDetaillee) : null;
                        return (
                          <li key={j} className="text-xs text-gray-400">
                            <div className="flex gap-1.5">
                              <span className="shrink-0 text-gray-600">•</span>
                              <span>{o ? o.action : (item as string)}</span>
                            </div>
                            {o && (o.responsable || o.delai) && (
                              <div className="ml-3 mt-0.5 flex flex-wrap gap-1.5 text-[10px]">
                                {o.responsable && <span className="px-1.5 py-0.5 rounded-full bg-blue-900/30 text-blue-400">👤 {o.responsable}</span>}
                                {o.delai && <span className="px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400">⏱ {o.delai}</span>}
                              </div>
                            )}
                          </li>
                        );
                      })}
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
                    {(entry.budgetAlloue || entry.comiteValidation || entry.ressourcesRequises) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {entry.budgetAlloue && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-900/30 text-yellow-400">💵 {entry.budgetAlloue}</span>}
                        {entry.comiteValidation && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400">🏛 {entry.comiteValidation}</span>}
                        {entry.ressourcesRequises && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400">{entry.ressourcesRequises}</span>}
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

      {/* SCÉNARIOS DE PROJECTION (premium) */}
      {aiReport?.scenariosProjection && (() => {
        const sp = aiReport.scenariosProjection;
        const items: Array<{ key: string; label: string; color: string; data?: ScenarioProjection }> = [
          { key: 'conservateur', label: 'Conservateur', color: 'gray',  data: sp.conservateur },
          { key: 'base',         label: 'Base',         color: 'blue',  data: sp.base },
          { key: 'ambitieux',    label: 'Ambitieux',    color: 'green', data: sp.ambitieux },
        ].filter(x => x.data);
        if (items.length === 0) return null;
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
            className="rounded-2xl p-6 bg-gray-900/50 border border-gray-800"
          >
            <h3 className="text-base font-semibold text-white mb-4">🎯 Scénarios de projection à 12 mois</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {items.map(({ key, label, color, data }) => (
                <div key={key} className={`rounded-xl p-4 bg-gray-900/80 border border-${color}-900/30`}>
                  <p className={`text-xs font-semibold text-${color}-400 uppercase mb-2`}>{label}</p>
                  {data!.scoreCible12Mois !== undefined && (
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-white">{data!.scoreCible12Mois}<span className="text-sm text-gray-500">/100</span></div>
                      <div className="text-[10px] text-gray-500 uppercase">Score cible</div>
                    </div>
                  )}
                  {data!.investissement && <p className="text-[11px] text-yellow-400 mb-2">💵 {data!.investissement}</p>}
                  {data!.description && <p className="text-xs text-gray-400 leading-relaxed mb-2">{data!.description}</p>}
                  {data!.conditionsRealisation && data!.conditionsRealisation.length > 0 && (
                    <ul className="space-y-0.5 mt-2">
                      {data!.conditionsRealisation.map((c, k) => (
                        <li key={k} className="text-[10px] text-gray-500 flex gap-1"><span>·</span><span>{c}</span></li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );
      })()}

      {/* GOUVERNANCE (premium) */}
      {aiReport?.gouvernance && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.37 }}
          className="rounded-2xl p-5 bg-gray-900/50 border border-gray-800"
        >
          <h3 className="text-sm font-semibold text-white mb-3">🏛 Gouvernance recommandée</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {aiReport.gouvernance.instancePilotage && <div><span className="text-gray-500">Instance de pilotage&nbsp;: </span><span className="text-gray-300">{aiReport.gouvernance.instancePilotage}</span></div>}
            {aiReport.gouvernance.frequenceReporting && <div><span className="text-gray-500">Reporting&nbsp;: </span><span className="text-gray-300">{aiReport.gouvernance.frequenceReporting}</span></div>}
            {aiReport.gouvernance.sponsorExecutif && <div><span className="text-gray-500">Sponsor exécutif&nbsp;: </span><span className="text-gray-300">{aiReport.gouvernance.sponsorExecutif}</span></div>}
            {aiReport.gouvernance.equipeProjet && <div><span className="text-gray-500">Équipe projet&nbsp;: </span><span className="text-gray-300">{aiReport.gouvernance.equipeProjet}</span></div>}
            {aiReport.gouvernance.budgetTotalRecommande && <div className="md:col-span-2"><span className="text-gray-500">Budget total recommandé&nbsp;: </span><span className="font-medium" style={{ color: toolColor }}>{aiReport.gouvernance.budgetTotalRecommande}</span></div>}
          </div>
        </motion.div>
      )}

      {/* CHANGE MANAGEMENT (premium) */}
      {aiReport?.changeManagement && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.375 }}
          className="rounded-2xl p-5 bg-gray-900/50 border border-gray-800"
        >
          <h3 className="text-sm font-semibold text-white mb-3">🔄 Change Management</h3>
          {aiReport.changeManagement.stakeholdersCritiques && aiReport.changeManagement.stakeholdersCritiques.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-gray-500 uppercase mb-2">Stakeholders critiques</p>
              <div className="space-y-1.5">
                {aiReport.changeManagement.stakeholdersCritiques.map((s, k) => {
                  const postureColor = s.posture === 'Promoteur' || s.posture === 'Allié' ? 'green'
                                      : s.posture === 'Sceptique' ? 'orange'
                                      : s.posture === 'Opposant' ? 'red' : 'gray';
                  return (
                    <div key={k} className="rounded-lg p-2 bg-gray-900/60 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-300">{s.groupe}</span>
                        {s.posture && <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-${postureColor}-900/30 text-${postureColor}-400`}>{s.posture}</span>}
                      </div>
                      {s.enjeu && <p className="text-[11px] text-gray-500">Enjeu&nbsp;: {s.enjeu}</p>}
                      {s.actionRequise && <p className="text-[11px] text-green-400/80 mt-0.5">→ {s.actionRequise}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiReport.changeManagement.risquesAdoption && aiReport.changeManagement.risquesAdoption.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-red-400 uppercase mb-1">⚠ Risques d'adoption</p>
                <ul className="space-y-0.5">{aiReport.changeManagement.risquesAdoption.map((r, k) => <li key={k} className="text-[11px] text-gray-400">• {r}</li>)}</ul>
              </div>
            )}
            {aiReport.changeManagement.leviersAdoption && aiReport.changeManagement.leviersAdoption.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-green-400 uppercase mb-1">✓ Leviers d'adoption</p>
                <ul className="space-y-0.5">{aiReport.changeManagement.leviersAdoption.map((l, k) => <li key={k} className="text-[11px] text-gray-400">• {l}</li>)}</ul>
              </div>
            )}
          </div>
          {aiReport.changeManagement.planCommunicationInterne && (
            <div className="mt-3 rounded-lg p-3 bg-gray-900/60">
              <p className="text-[10px] font-semibold text-blue-400 uppercase mb-1">📣 Plan de communication interne</p>
              <p className="text-xs text-gray-400 leading-relaxed">{aiReport.changeManagement.planCommunicationInterne}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* CAS RÉFÉRENCE (premium) */}
      {aiReport?.casReference && aiReport.casReference.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
          className="rounded-2xl p-5 bg-gray-900/50 border border-gray-800"
        >
          <h3 className="text-sm font-semibold text-white mb-3">📚 Cas références (anonymisés MENA)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiReport.casReference.map((cas, k) => (
              <div key={k} className="rounded-xl p-4 bg-gray-900/80 border border-gray-800">
                <p className="text-xs font-semibold text-white mb-1">{cas.secteur}</p>
                {cas.tailleEntreprise && <p className="text-[11px] text-gray-500 mb-2">{cas.tailleEntreprise}</p>}
                {cas.situationDepart && <p className="text-[11px] text-gray-400 mb-2"><span className="text-gray-500">Situation départ&nbsp;:</span> {cas.situationDepart}</p>}
                {cas.actionsClefs && cas.actionsClefs.length > 0 && (
                  <ul className="mb-2 space-y-0.5">
                    {cas.actionsClefs.map((a, j) => <li key={j} className="text-[11px] text-gray-400">• {a}</li>)}
                  </ul>
                )}
                {cas.resultats && <p className="text-xs text-green-400/80 font-medium">📈 {cas.resultats}</p>}
                {cas.duree && <p className="text-[10px] text-gray-600 mt-1">Durée&nbsp;: {cas.duree}</p>}
              </div>
            ))}
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
