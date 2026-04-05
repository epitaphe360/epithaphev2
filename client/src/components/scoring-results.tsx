import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ScoringResult } from '@/lib/scoring-engine';
import { MATURITY_LEVELS } from '@/lib/scoring-engine';
import { Link } from 'wouter';

interface ScoringResultsProps {
  result: ScoringResult;
  toolName: string;
  toolColor: string;
  toolModel: string;
}

// Radar chart SVG simple
function RadarChart({ pillarScores, color }: { pillarScores: ScoringResult['pillarScores']; color: string }) {
  const size = 240;
  const center = size / 2;
  const radius = 90;
  const n = pillarScores.length;

  const points = pillarScores.map((ps, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (ps.score / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  });

  const gridPoints = (level: number) =>
    pillarScores.map((_, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = (level / 5) * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');

  const labelPoints = pillarScores.map((ps, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = radius + 22;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle), label: ps.pillarLabel };
  });

  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
      {/* Grid */}
      {[1, 2, 3, 4, 5].map(level => (
        <polygon key={level} points={gridPoints(level)} fill="none" stroke="#333" strokeWidth="0.5" />
      ))}
      {/* Axes */}
      {pillarScores.map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center} y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke="#444" strokeWidth="0.5"
          />
        );
      })}
      {/* Data polygon */}
      <polygon points={polyPoints} fill={`${color}30`} stroke={color} strokeWidth="2" />
      {/* Points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} />
      ))}
      {/* Labels */}
      {labelPoints.map((lp, i) => (
        <text
          key={i}
          x={lp.x} y={lp.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fill="#9CA3AF"
        >
          {lp.label.length > 10 ? lp.label.slice(0, 9) + '…' : lp.label}
        </text>
      ))}
    </svg>
  );
}

export function ScoringResults({ result, toolName, toolColor, toolModel }: ScoringResultsProps) {
  const maturity = MATURITY_LEVELS[result.maturityLevel];

  const sortedPillars = useMemo(() =>
    [...result.pillarScores].sort((a, b) => a.score - b.score),
    [result.pillarScores]
  );

  const weakest = sortedPillars.slice(0, 2);
  const strongest = sortedPillars.slice(-2).reverse();

  return (
    <div className="space-y-8">
      {/* Score global */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div
          className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 mb-4"
          style={{ borderColor: maturity.color, boxShadow: `0 0 40px ${maturity.color}30` }}
        >
          <div>
            <div className="text-4xl font-bold" style={{ color: maturity.color }}>
              {result.globalScore}
            </div>
            <div className="text-xs text-gray-400">/100</div>
          </div>
        </div>
        <div>
          <span className="text-2xl mr-2">{maturity.emoji}</span>
          <span className="text-xl font-bold text-white">{maturity.label}</span>
        </div>
        <p className="text-gray-400 mt-1">{maturity.description}</p>
        {result.benchmarkPercentile && (
          <p className="text-sm mt-2" style={{ color: toolColor }}>
            Mieux que {result.benchmarkPercentile}% des entreprises de votre secteur
          </p>
        )}
      </motion.div>

      {/* Gap Direction/Terrain */}
      {result.gap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-yellow-500/30 rounded-xl p-5 bg-yellow-500/5"
        >
          <h3 className="text-sm font-semibold text-yellow-400 mb-4 uppercase tracking-wider">
            ⚡ Dual Voice Score™ — Écart perceptuel
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{result.gap.direction}</div>
              <div className="text-xs text-gray-400">Direction</div>
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: result.gap.delta > 15 ? '#EF4444' : '#EAB308' }}>
                Δ {result.gap.delta}
              </div>
              <div className="text-xs text-gray-400">Écart</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{result.gap.terrain}</div>
              <div className="text-xs text-gray-400">Terrain</div>
            </div>
          </div>
          {result.gap.delta > 15 && (
            <p className="text-xs text-red-400 mt-3 text-center">
              ⚠️ Écart critique — risque élevé de désengagement et d'inefficacité
            </p>
          )}
        </motion.div>
      )}

      {/* ROI Estimate */}
      {result.roiEstimate && result.roiEstimate > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border rounded-xl p-5"
          style={{ borderColor: `${toolColor}40`, background: `${toolColor}08` }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: toolColor }}>
            💸 Coût estimé de la défaillance
          </h3>
          <div className="text-3xl font-bold text-white">
            {result.roiEstimate.toLocaleString('fr-MA')} MAD<span className="text-sm text-gray-400">/an</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Basé sur votre effectif et les benchmarks sectoriels MENA
          </p>
        </motion.div>
      )}

      {/* Radar chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="border border-gray-800 rounded-xl p-5"
      >
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
          Profil {toolModel}
        </h3>
        <RadarChart pillarScores={result.pillarScores} color={toolColor} />
      </motion.div>

      {/* Pillar scores bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Scores par pilier</h3>
        {result.pillarScores.map((ps, i) => (
          <div key={ps.pillarId}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-300">{ps.pillarLabel}</span>
              <span className="text-sm font-bold" style={{ color: ps.score < 40 ? '#EF4444' : ps.score < 60 ? '#EAB308' : '#22C55E' }}>
                {ps.score}/100
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: toolColor }}
                initial={{ width: 0 }}
                animate={{ width: `${ps.score}%` }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Recommandations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-4"
      >
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          🎯 Axes prioritaires
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-red-400 font-semibold mb-2">À améliorer en priorité</p>
            {weakest.map(ps => (
              <div key={ps.pillarId} className="flex items-center gap-3 py-2 border-b border-gray-800">
                <span className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-xs font-bold text-red-400">
                  {ps.score}
                </span>
                <span className="text-sm text-gray-300">{ps.pillarLabel}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-green-400 font-semibold mb-2">Points forts à capitaliser</p>
            {strongest.map(ps => (
              <div key={ps.pillarId} className="flex items-center gap-3 py-2 border-b border-gray-800">
                <span className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-xs font-bold text-green-400">
                  {ps.score}
                </span>
                <span className="text-sm text-gray-300">{ps.pillarLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recommandations texte */}
      {result.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="border border-gray-800 rounded-xl p-5 space-y-3"
        >
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Recommandations Epitaphe360
          </h3>
          {result.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-black mt-0.5"
                style={{ backgroundColor: toolColor }}>
                {i + 1}
              </span>
              <p className="text-sm text-gray-300">{rec}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="border rounded-2xl p-6 text-center"
        style={{ borderColor: `${toolColor}40`, background: `linear-gradient(135deg, ${toolColor}10, transparent)` }}
      >
        <p className="text-white font-semibold text-lg mb-2">
          Prêt à transformer votre score en plan d'action ?
        </p>
        <p className="text-gray-400 text-sm mb-5">
          Restitution stratégique de 45 min avec un expert Epitaphe360 — incluse dans votre scoring.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/contact"
            className="px-6 py-3 rounded-full text-sm font-semibold text-black transition-all hover:opacity-90"
            style={{ backgroundColor: toolColor }}
          >
            Réserver ma restitution
          </a>
          <Link
            href="/outils/bmi360"
            className="px-6 py-3 rounded-full text-sm font-semibold border border-gray-700 text-gray-300 hover:border-gray-500 transition-all"
          >
            Voir mon BMI 360™
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
