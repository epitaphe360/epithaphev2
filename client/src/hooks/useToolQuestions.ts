/**
 * useToolQuestions — charge les questions d'un outil de scoring depuis l'API.
 * Fallback sur les questions hardcodées si l'API ne répond pas ou ne renvoie rien.
 */
import { useState, useEffect } from 'react';
import type { ScoringQuestion } from '@/lib/scoring-engine';

export function useToolQuestions(
  toolId: string,
  defaultQuestions: ScoringQuestion[]
): ScoringQuestion[] {
  const [questions, setQuestions] = useState<ScoringQuestion[]>(defaultQuestions);

  useEffect(() => {
    fetch(`/api/settings?group=forms_scoring`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const key = `scoring_questions_${toolId}`;
        const raw = data[key];
        if (!raw) return;
        try {
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuestions(parsed);
          }
        } catch { /* fallback silencieux */ }
      })
      .catch(() => {});
  }, [toolId]);

  return questions;
}

/**
 * useBriefConfig — charge les options du formulaire de brief depuis l'API.
 * Retourne les tableaux de secteurs, besoins, budgets, délais.
 */
export interface BriefOption { value: string; label: string }

export interface BriefConfig {
  sectors: string[];
  needs: BriefOption[];
  budgets: string[];
  timelines: string[];
}

export function useBriefConfig(defaults: BriefConfig): BriefConfig {
  const [config, setConfig] = useState<BriefConfig>(defaults);

  useEffect(() => {
    fetch('/api/settings?group=forms_brief')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const next: Partial<BriefConfig> = {};
        try {
          if (data.brief_sectors) {
            const v = typeof data.brief_sectors === 'string' ? JSON.parse(data.brief_sectors) : data.brief_sectors;
            if (Array.isArray(v) && v.length) next.sectors = v;
          }
          if (data.brief_needs) {
            const v = typeof data.brief_needs === 'string' ? JSON.parse(data.brief_needs) : data.brief_needs;
            if (Array.isArray(v) && v.length) next.needs = v;
          }
          if (data.brief_budgets) {
            const v = typeof data.brief_budgets === 'string' ? JSON.parse(data.brief_budgets) : data.brief_budgets;
            if (Array.isArray(v) && v.length) next.budgets = v;
          }
          if (data.brief_timelines) {
            const v = typeof data.brief_timelines === 'string' ? JSON.parse(data.brief_timelines) : data.brief_timelines;
            if (Array.isArray(v) && v.length) next.timelines = v;
          }
          if (Object.keys(next).length) setConfig(prev => ({ ...prev, ...next }));
        } catch { /* fallback silencieux */ }
      })
      .catch(() => {});
  }, []);

  return config;
}
