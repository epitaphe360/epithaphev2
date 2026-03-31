import { insertScoringResultSchema, type InsertScoringResult } from '../../shared/schema';

export function calculateMaturityLevel(globalScore: number): number {
  if (globalScore < 30) return 1; // Emergent
  if (globalScore < 50) return 2; // Basic
  if (globalScore < 70) return 3; // Intermediate
  if (globalScore < 85) return 4; // Advanced
  return 5; // Leader
}

export function processAssessment(toolId: string, answers: Record<string, number>): Omit<InsertScoringResult, 'id'> {
  // Placeholder logic for the assessment engine
  const total = Object.values(answers).reduce((acc, val) => acc + val, 0);
  const maxPossible = Object.keys(answers).length * 10; // Assuming 0-10 scale
  const globalScore = Math.round((total / maxPossible) * 100);
  
  return {
    toolId,
    globalScore,
    pillarScores: { general: globalScore },
    maturityLevel: calculateMaturityLevel(globalScore),
    sessionId: Math.random().toString(36).substring(7),
  };
}
