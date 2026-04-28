/**
 * Relance scheduler — Réactive automatiquement les leads Discover™
 * qui n'ont pas converti en Intelligence™ après 1, 3 et 7 jours.
 *
 * Stratégie :
 *   - Tick toutes les heures
 *   - Pour chaque step (1, 3, 7), on cible les scoringResults `discover`
 *     créés dans la fenêtre [now - step jours - 1 h, now - step jours]
 *   - Idempotent : on n'envoie qu'une fois par step (vérification
 *     funnel_events.event_type = 'relance_dN_sent')
 */
import { db } from '../db';
import { scoringResults, funnelEvents, payments } from '@shared/schema';
import { and, eq, gte, lte, isNotNull } from 'drizzle-orm';
import { sendDiscoverRelance, INTELLIGENCE_PRICES_HINT } from './email';

type RelanceStep = 1 | 3 | 7;
const STEPS: RelanceStep[] = [1, 3, 7];

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS  = 24 * HOUR_MS;

let started = false;

export function startRelanceScheduler() {
  if (started) return;
  started = true;
  console.log('[Relance] Scheduler démarré — tick horaire (J+1, J+3, J+7)');

  // Premier tick immédiat (utile en dev / au déploiement)
  // setTimeout récursif pour éviter le drift de setInterval
  const scheduleNext = () => {
    setTimeout(() => {
      relanceTick()
        .catch(err => console.error('[Relance] Tick échoué:', err))
        .finally(() => scheduleNext());
    }, HOUR_MS);
  };

  relanceTick()
    .catch(err => console.error('[Relance] Tick initial échoué:', err))
    .finally(() => scheduleNext());
}

async function relanceTick() {
  for (const step of STEPS) {
    try {
      await processStep(step);
    } catch (err) {
      console.error(`[Relance] Step J+${step} échoué:`, err);
    }
  }
}

async function processStep(step: RelanceStep) {
  const now = Date.now();
  const windowEnd   = new Date(now - step * DAY_MS);
  const windowStart = new Date(now - step * DAY_MS - HOUR_MS);
  const eventType = `relance_d${step}_sent` as const;

  const candidates = await db.select().from(scoringResults).where(
    and(
      eq(scoringResults.tier, 'discover'),
      isNotNull(scoringResults.email),
      gte(scoringResults.createdAt, windowStart),
      lte(scoringResults.createdAt, windowEnd),
    ),
  );

  if (!candidates.length) return;
  console.log(`[Relance] J+${step} → ${candidates.length} candidat(s) à évaluer`);

  for (const row of candidates) {
    if (!row.email) continue;

    // Idempotence : déjà relancé ?
    const already = await db.select().from(funnelEvents).where(
      and(
        eq(funnelEvents.scoringResultId, row.id),
        eq(funnelEvents.eventType, eventType),
      ),
    ).limit(1);
    if (already.length) continue;

    // Skip si l'utilisateur a déjà payé l'Intelligence
    const paid = await db.select().from(payments).where(
      and(
        eq(payments.scoringResultId, row.id),
        eq(payments.status, 'paid'),
        eq(payments.type, 'intelligence'),
      ),
    ).limit(1);
    if (paid.length) continue;

    const intelligencePriceMad = INTELLIGENCE_PRICES_HINT[row.toolId] ?? 4900;

    try {
      await sendDiscoverRelance({
        to: row.email,
        name: row.respondentName ?? undefined,
        toolId: row.toolId,
        globalScore: row.globalScore,
        resultId: row.id,
        intelligencePriceMad,
        relanceStep: step,
      });

      await db.insert(funnelEvents).values({
        scoringResultId: row.id,
        toolId: row.toolId,
        eventType,
        email: row.email,
        metadata: { step, intelligencePriceMad },
      });

      console.log(`[Relance] ✓ J+${step} envoyée à ${row.email} (${row.toolId})`);
    } catch (err) {
      console.error(`[Relance] ✗ Échec envoi J+${step} à ${row.email}:`, err);
    }
  }
}
