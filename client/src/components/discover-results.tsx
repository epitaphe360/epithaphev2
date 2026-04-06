/**
 * DiscoverResults — Résultats Tier Gratuit (4 premiers pilliers)
 * CDC BMI 360™ : Discover → Intelligence → Transform
 */
import { motion } from 'framer-motion';
import { MATURITY_LEVELS } from '@/lib/scoring-engine';
import type { MaturityLevel } from '@/lib/scoring-engine';

interface PillarInfo {
  id: string;
  label: string;
  color?: string;
}

interface DiscoverResultsProps {
  toolId: string;
  toolLabel: string;
  toolColor: string;
  resultId: string;
  globalScore: number;
  maturityLevel: number;
  pillarScores: Record<string, number>;   // 4 premiers pilliers seulement
  allPillars: PillarInfo[];               // Tous les pilliers (pour montrer les verrouillés)
  intelligencePrice: number;
  onUpgrade: () => void;
}

const RECOMMENDATIONS: Record<string, string[]> = {
  commpulse: [
    'Alignez vos messages direction/terrain — créez un guide éditorial interne.',
    'Mettez en place des pulse surveys mensuels pour détecter les signaux faibles.',
    'Rationalisez vos canaux : email, intranet, Teams — une charte de communication s\'impose.',
  ],
  talentprint: [
    'Formalisez votre marque employeur avec une EVP claire et des témoignages authentiques.',
    'Créez un parcours d\'onboarding structuré sur les 90 premiers jours.',
    'Installez un système de feedback continu entre managers et collaborateurs.',
  ],
  impacttrace: [
    'Définissez vos KPIs RSE prioritaires et publiez un tableau de bord trimestriel.',
    'Impliquez vos parties prenantes dans la définition de vos objectifs d\'impact.',
    'Renforcez la cohérence entre vos engagements publics et vos pratiques internes.',
  ],
  safesignal: [
    'Mettez en place un protocole de signalement anonyme des risques psychosociaux.',
    'Formez vos managers à la détection des signaux faibles de mal-être.',
    'Créez un comité de sécurité psychologique réunissant RH, médecine du travail et direction.',
  ],
  eventimpact: [
    'Définissez des objectifs SMART et des KPIs mesurables avant chaque événement.',
    'Impliquez vos participants dans la conception pour maximiser l\'engagement.',
    'Mettez en place un système de capitalisation post-événement.',
  ],
  spacescore: [
    'Réalisez un diagnostic d\'utilisation de vos espaces par profil de collaborateur.',
    'Intégrez la flexibilité dans vos politiques espace/télétravail.',
    'Mesurez régulièrement la satisfaction espace pour ajuster en temps réel.',
  ],
  finnarrative: [
    'Simplifiez votre communication financière — utilisez des infographies et des analogies.',
    'Segmentez vos messages selon les audiences (investisseurs, équipes, grand public).',
    'Alignez votre narrative financière avec votre stratégie RSE et de croissance.',
  ],
};

export function DiscoverResults({
  toolId,
  toolLabel,
  toolColor,
  resultId,
  globalScore,
  maturityLevel,
  pillarScores,
  allPillars,
  intelligencePrice,
  onUpgrade,
}: DiscoverResultsProps) {
  const level = Math.min(Math.max(maturityLevel, 1), 5) as MaturityLevel;
  const maturity = MATURITY_LEVELS[level];
  const discoverPillarIds = Object.keys(pillarScores);
  const lockedPillars = allPillars.filter(p => !discoverPillarIds.includes(p.id));
  const recs = RECOMMENDATIONS[toolId] ?? [
    'Structurez vos processus internes pour gagner en cohérence.',
    'Formalisez votre stratégie et impliquez vos équipes.',
    'Mettez en place des indicateurs de performance régulièrement suivis.',
  ];

  return (
    <div className="space-y-6">
      {/* Header résultat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 text-center"
        style={{ background: `linear-gradient(135deg, ${toolColor}15, ${toolColor}05)`, border: `1px solid ${toolColor}30` }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ backgroundColor: `${toolColor}20`, color: toolColor }}>
          Rapport Discover™ · Gratuit
        </div>
        <div className="text-6xl font-bold mb-2" style={{ color: toolColor }}>
          {globalScore}<span className="text-2xl text-gray-400">/100</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">{maturity.emoji}</span>
          <span className="text-xl font-semibold" style={{ color: maturity.color }}>{maturity.label}</span>
        </div>
        <p className="text-gray-400 text-sm">{maturity.description}</p>
        <p className="text-gray-600 text-xs mt-2">Résultat #{resultId.slice(0, 8).toUpperCase()}</p>
      </motion.div>

      {/* Pilliers découverts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-6 bg-gray-900/50 border border-gray-800"
      >
        <h3 className="text-base font-semibold text-white mb-4">
          Analyse partielle — {discoverPillarIds.length} pilliers sur {allPillars.length}
        </h3>
        <div className="space-y-3">
          {allPillars.map((pillar) => {
            const score = pillarScores[pillar.id];
            const isLocked = score === undefined;
            return (
              <div key={pillar.id} className={`flex items-center gap-3 ${isLocked ? 'opacity-50' : ''}`}>
                <div className="w-24 text-xs text-gray-400 shrink-0">{pillar.label}</div>
                <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden relative">
                  {isLocked ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full bg-gray-700 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: pillar.color ?? toolColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  )}
                </div>
                <div className="w-12 text-xs font-medium text-right">
                  {isLocked ? (
                    <span className="text-gray-600">🔒 ?</span>
                  ) : (
                    <span style={{ color: toolColor }}>{score}/100</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {lockedPillars.length > 0 && (
          <p className="text-xs text-gray-600 mt-4 text-center">
            {lockedPillars.length} pillier{lockedPillars.length > 1 ? 's' : ''} verrouillé{lockedPillars.length > 1 ? 's' : ''} — débloqués dans le rapport Intelligence™
          </p>
        )}
      </motion.div>

      {/* Recommandations rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-6 bg-gray-900/50 border border-gray-800"
      >
        <h3 className="text-base font-semibold text-white mb-4">
          Recommandations prioritaires
        </h3>
        <ul className="space-y-3">
          {recs.slice(0, 2).map((rec, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-400">
              <span className="shrink-0 mt-0.5" style={{ color: toolColor }}>→</span>
              <span>{rec}</span>
            </li>
          ))}
          {/* Recommandation verrouillée */}
          <li className="flex gap-3 text-sm relative">
            <span className="shrink-0 mt-0.5 text-gray-700">→</span>
            <span className="text-gray-700 blur-sm select-none">
              {recs[2] ?? 'Déployez une stratégie de transformation avec des quick wins à 30, 60 et 90 jours.'}
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-gray-600">🔒 Débloquer avec Intelligence™</span>
            </div>
          </li>
        </ul>
      </motion.div>

      {/* CTA Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-8 text-center"
        style={{ background: `linear-gradient(135deg, ${toolColor}18, ${toolColor}06)`, border: `1px solid ${toolColor}40` }}
      >
        <div className="text-3xl mb-3">🔓</div>
        <h3 className="text-xl font-bold text-white mb-2">
          Débloquez votre rapport Intelligence™ complet
        </h3>
        <p className="text-gray-400 text-sm mb-4 max-w-sm mx-auto">
          Analyse IA de tous les pilliers, plan d'action 90 jours, diagnostic expert personnalisé et accès au programme Transform.
        </p>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-3xl font-bold text-white">
            {intelligencePrice.toLocaleString('fr-MA')}
          </span>
          <span className="text-gray-400">MAD HT</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
          <button
            onClick={onUpgrade}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: toolColor }}
          >
            Obtenir mon rapport Intelligence™ →
          </button>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <span>✓ Rapport IA personnalisé</span>
          <span>✓ Tous les pilliers</span>
          <span>✓ Plan 90 jours</span>
        </div>
      </motion.div>
    </div>
  );
}
