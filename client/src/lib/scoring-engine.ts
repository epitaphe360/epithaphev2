// BMI 360™ — Moteur de scoring Epitaphe360
// Moteur commun à tous les 7 outils de scoring

export type SectorType = 'pharma' | 'auto' | 'finance' | 'tech' | 'energie' | 'luxury' | 'btp' | 'agroalimentaire' | 'textile' | 'autre';
export type CompanySizeType = 'tpe' | 'pme' | 'eti' | 'ge';
export type MaturityLevel = 1 | 2 | 3 | 4 | 5;
export type ToolId = 'commpulse' | 'talentprint' | 'impacttrace' | 'safesignal' | 'eventimpact' | 'spacescore' | 'finnarrative';

export interface ScoringQuestion {
  id: string;
  pillar: string;
  pillarLabel: string;
  text: string;
  weight: number; // 1-3
  reverseScored?: boolean;
}

export interface ScoringAnswer {
  questionId: string;
  value: number; // 1-5
}

export interface PillarScore {
  pillarId: string;
  pillarLabel: string;
  score: number; // 0-100
  color: string;
}

export interface ScoringResult {
  toolId: ToolId;
  companyName: string;
  respondentType?: 'direction' | 'terrain'; // pour le Dual Voice Score
  sector: SectorType;
  companySize: CompanySizeType;
  effectif?: number;
  pillarScores: PillarScore[];
  globalScore: number; // 0-100
  maturityLevel: MaturityLevel;
  maturityLabel: string;
  maturityColor: string;
  gap?: { direction: number; terrain: number; delta: number };
  roiEstimate?: number; // coût estimé en MAD de la défaillance
  recommendations: string[];
  benchmarkPercentile?: number; // % d'entreprises similaires sous ce score
  createdAt: Date;
}

// Niveaux de maturité universels BMI 360™
export const MATURITY_LEVELS: Record<MaturityLevel, { label: string; color: string; description: string; emoji: string }> = {
  1: { label: 'Fragile', color: '#EF4444', description: 'Absence de stratégie structurée', emoji: '🔴' },
  2: { label: 'Émergent', color: '#F97316', description: 'Initiatives isolées sans cohérence', emoji: '🟠' },
  3: { label: 'Structuré', color: '#EAB308', description: 'Processus en place mais non optimisés', emoji: '🟡' },
  4: { label: 'Performant', color: '#22C55E', description: 'Pratiques solides et mesurables', emoji: '🟢' },
  5: { label: 'Leader', color: '#3B82F6', description: 'Excellence et benchmark sectoriel', emoji: '🔵' },
};

export function getMaturityLevel(score: number): MaturityLevel {
  if (score <= 20) return 1;
  if (score <= 40) return 2;
  if (score <= 60) return 3;
  if (score <= 80) return 4;
  return 5;
}

export function calculateScore(answers: ScoringAnswer[], questions: ScoringQuestion[]): number {
  if (answers.length === 0) return 0;
  let totalWeighted = 0;
  let totalWeight = 0;
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;
    const normalizedValue = question.reverseScored ? 6 - answer.value : answer.value;
    totalWeighted += normalizedValue * question.weight;
    totalWeight += 5 * question.weight; // max possible
  });
  return totalWeight > 0 ? Math.round((totalWeighted / totalWeight) * 100) : 0;
}

export function calculatePillarScores(
  answers: ScoringAnswer[],
  questions: ScoringQuestion[],
  pillarColors: Record<string, string>
): PillarScore[] {
  const pillars = Array.from(new Set(questions.map(q => q.pillar)));
  return pillars.map(pillarId => {
    const pillarQuestions = questions.filter(q => q.pillar === pillarId);
    const pillarAnswers = answers.filter(a =>
      pillarQuestions.some(q => q.id === a.questionId)
    );
    const score = calculateScore(pillarAnswers, pillarQuestions);
    const pillarLabel = pillarQuestions[0]?.pillarLabel || pillarId;
    return { pillarId, pillarLabel, score, color: pillarColors[pillarId] || '#C8A96E' };
  });
}

// Calcul du ROI — coût de communication défaillante
export function calculateRoiEstimate(effectif: number, salaireMoyen: number, facteur: number = 0.18): number {
  // facteur CLARITY par défaut : 18% du coût salarial perdu en inefficacité com
  return Math.round(effectif * salaireMoyen * facteur);
}

export const SECTOR_LABELS: Record<SectorType, string> = {
  pharma: 'Pharma / Santé',
  auto: 'Automobile',
  finance: 'Banque / Finance',
  tech: 'Tech / IT',
  energie: 'Énergie / Industrie',
  luxury: 'Luxe / Retail',
  btp: 'BTP / Immobilier',
  agroalimentaire: 'Agroalimentaire',
  textile: 'Textile / Mode',
  autre: 'Autre',
};

export const SIZE_LABELS: Record<CompanySizeType, string> = {
  tpe: 'TPE (< 10 employés)',
  pme: 'PME (10-250 employés)',
  eti: 'ETI (250-5000 employés)',
  ge: 'Grande Entreprise (> 5000)',
};

// Stockage local des résultats (localStorage)
export const STORAGE_KEY_PREFIX = 'bmi360_score_';

export function saveScore(result: ScoringResult): void {
  const key = `${STORAGE_KEY_PREFIX}${result.toolId}`;
  const existing = loadAllScores(result.toolId);
  existing.push(result);
  localStorage.setItem(key, JSON.stringify(existing));
}

export function loadAllScores(toolId: ToolId): ScoringResult[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${toolId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function loadBMI360Scores(): Partial<Record<ToolId, number>> {
  const tools: ToolId[] = ['commpulse', 'talentprint', 'impacttrace', 'safesignal', 'eventimpact', 'spacescore', 'finnarrative'];
  const result: Partial<Record<ToolId, number>> = {};
  tools.forEach(toolId => {
    const scores = loadAllScores(toolId);
    if (scores.length > 0) {
      result[toolId] = scores[scores.length - 1].globalScore;
    }
  });
  return result;
}

export function calculateBMI360Global(scores: Partial<Record<ToolId, number>>): number {
  const values = Object.values(scores).filter(v => v !== undefined) as number[];
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

