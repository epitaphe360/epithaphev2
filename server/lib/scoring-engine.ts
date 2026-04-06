import type { InsertScoringResult } from '../../shared/schema';

// Poids par outil et dimension issus du cahier des charges BMI 360™ (CDC)
const TOOL_PILLAR_WEIGHTS: Record<string, Record<string, number>> = {
  commpulse:   { C: 0.18, L: 0.18, A: 0.15, R: 0.15, I: 0.12, T: 0.12, Y: 0.10 },
  talentprint: { A: 0.18, T1: 0.15, T2: 0.15, R: 0.14, AM: 0.13, CF: 0.13, TR: 0.12 },
  impacttrace: { P: 0.25, R: 0.18, O: 0.20, OC: 0.20, F: 0.17 },
  safesignal:  { S: 0.18, H: 0.22, IA: 0.14, E: 0.16, L: 0.14, D: 0.16 },
  eventimpact: { S: 0.25, T: 0.25, A: 0.20, G: 0.20, E: 0.10 },
  spacescore:  { S: 0.22, P: 0.22, A: 0.23, C: 0.18, E: 0.15 },
  finnarrative:{ C: 0.18, A: 0.15, P: 0.20, I: 0.16, T: 0.16, AL: 0.15 },
};

// Niveaux de maturité CDC (5 niveaux nommés)
export function calculateMaturityLevel(globalScore: number): number {
  if (globalScore <= 20) return 1; // Fragile / Pathologique
  if (globalScore <= 40) return 2; // Émergent / Réactif
  if (globalScore <= 60) return 3; // Structuré / Calculatif
  if (globalScore <= 80) return 4; // Performant / Proactif
  return 5;                        // Leader / Générateur
}

// Calcul d'un score pondéré sur 4 premières dimensions (Discover tier)
export function processDiscoverAssessment(
  toolId: string,
  answers: Record<string, { value: number; pillar: string; weight: number }>
): Omit<InsertScoringResult, 'id'> {
  const pillarWeights = TOOL_PILLAR_WEIGHTS[toolId] ?? {};
  const pillars = Array.from(new Set(Object.values(answers).map(a => a.pillar)));
  const discoverPillars = pillars.slice(0, 4); // Discover: 4 premières dimensions

  const pillarScores: Record<string, number> = {};
  let weightedSum = 0;
  let totalWeight = 0;

  for (const pillar of discoverPillars) {
    const pillarAnswers = Object.values(answers).filter(a => a.pillar === pillar);
    if (pillarAnswers.length === 0) continue;

    // Score par pilier : moyenne pondérée (scale 1-5 → 0-100)
    let pWeighted = 0;
    let pMaxWeight = 0;
    for (const ans of pillarAnswers) {
      pWeighted += ans.value * ans.weight;
      pMaxWeight += 5 * ans.weight;
    }
    const pillarScore = pMaxWeight > 0 ? Math.round((pWeighted / pMaxWeight) * 100) : 0;
    pillarScores[pillar] = pillarScore;

    const dimWeight = pillarWeights[pillar] ?? (1 / discoverPillars.length);
    weightedSum += pillarScore * dimWeight;
    totalWeight += dimWeight;
  }

  const globalScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  return {
    toolId,
    tier: 'discover',
    globalScore,
    pillarScores,
    maturityLevel: calculateMaturityLevel(globalScore),
    sessionId: Math.random().toString(36).substring(7),
  };
}

// Calcul complet Intelligence (toutes les dimensions)
export function processIntelligenceAssessment(
  toolId: string,
  answers: Record<string, { value: number; pillar: string; weight: number }>
): Omit<InsertScoringResult, 'id'> {
  const pillarWeights = TOOL_PILLAR_WEIGHTS[toolId] ?? {};
  const pillars = Array.from(new Set(Object.values(answers).map(a => a.pillar)));

  const pillarScores: Record<string, number> = {};
  let weightedSum = 0;
  let totalWeight = 0;

  for (const pillar of pillars) {
    const pillarAnswers = Object.values(answers).filter(a => a.pillar === pillar);
    if (pillarAnswers.length === 0) continue;

    let pWeighted = 0;
    let pMaxWeight = 0;
    for (const ans of pillarAnswers) {
      pWeighted += ans.value * ans.weight;
      pMaxWeight += 5 * ans.weight;
    }
    const pillarScore = pMaxWeight > 0 ? Math.round((pWeighted / pMaxWeight) * 100) : 0;
    pillarScores[pillar] = pillarScore;

    const dimWeight = pillarWeights[pillar] ?? (1 / pillars.length);
    weightedSum += pillarScore * dimWeight;
    totalWeight += dimWeight;
  }

  const globalScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  return {
    toolId,
    tier: 'intelligence',
    globalScore,
    pillarScores,
    maturityLevel: calculateMaturityLevel(globalScore),
    sessionId: Math.random().toString(36).substring(7),
  };
}

// Rétro-compatibilité avec les anciennes routes
export function processAssessment(toolId: string, answers: Record<string, number>): Omit<InsertScoringResult, 'id'> {
  const total = Object.values(answers).reduce((acc, val) => acc + val, 0);
  const maxPossible = Object.keys(answers).length * 5; // scale 1-5
  const globalScore = Math.round((total / maxPossible) * 100);
  return {
    toolId,
    tier: 'discover',
    globalScore,
    pillarScores: { general: globalScore },
    maturityLevel: calculateMaturityLevel(globalScore),
    sessionId: Math.random().toString(36).substring(7),
  };
}
