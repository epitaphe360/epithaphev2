/**
 * BMI 360™ — Routes de Scoring Intelligence
 * Tunnel CDC : Discover (gratuit) → Intelligence (payé, rapport IA) → Transform (RDV expert humain)
 */
import { Express, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { db } from "./db";
import { scoringResults, payments, expertConsultations, funnelEvents } from "../shared/schema";
import { processAssessment as _processAssessment, calculateMaturityLevel } from "./lib/scoring-engine";
void _processAssessment;
import { generateAIReport } from "./lib/ai-report";
import { requireAdmin } from "./lib/auth";
import { z } from "zod";
import { desc, eq, gte } from "drizzle-orm";
import {
  sendMail,
  sendDiscoverScoreEmail,
  sendExpertRequestConfirmation,
  sendExpertRequestNotification,
} from "./lib/email";
import { createPayPalOrder } from "./lib/paypal";
import { generateCMIForm } from "./lib/cmi";
import { createAndSendInvoice, generateInvoiceNumber } from "./lib/invoice-generator";

const scoringLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Trop de requêtes de scoring. Réessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const intelligenceLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Limite de génération IA atteinte. Réessayez dans 1 heure." },
  standardHeaders: true,
  legacyHeaders: false,
});

const expertLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: "Trop de demandes de RDV. Réessayez plus tard." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================
// CATALOGUE BMI 360™ — source de vérité unique (UI lit /api/scoring/catalog)
// ============================================================

const TVA_RATE = 0.20;
const PUBLIC_URL = process.env.PUBLIC_URL ?? process.env.FRONTEND_URL ?? "https://epitaphe360.ma";
const ADMIN_NOTIF_EMAIL = process.env.ADMIN_NOTIF_EMAIL ?? process.env.EMAIL_FROM ?? "contact@epitaphe360.ma";

// Plan annuel one-shot (accès aux 7 outils Intelligence pendant 12 mois)
const FULL_ANNUAL_PRICE_MAD = 39000; // MAD HT — 26 % d'économie vs achat outil par outil (53 000 MAD)

// Prix unitaires Intelligence — valeurs en DIRHAMS HT (affichées telles quelles dans l'UI)
const INTELLIGENCE_PRICES: Record<string, number> = {
  commpulse:    4900,
  talentprint:  7500,
  impacttrace:  8400,
  safesignal:   7900,
  eventimpact:  7900,
  spacescore:   6500,
  finnarrative: 9900,
};

const ALLOWED_TOOL_IDS = Object.keys(INTELLIGENCE_PRICES);

const TOOL_LABELS: Record<string, string> = {
  commpulse:    'CommPulse™',
  talentprint:  'TalentPrint™',
  impacttrace:  'ImpactTrace™',
  safesignal:   'SafeSignal™',
  eventimpact:  'EventImpact™',
  spacescore:   'SpaceScore™',
  finnarrative: 'FinNarrative™',
};

const TOOL_PILLAR_WEIGHTS: Record<string, Record<string, number>> = {
  commpulse:   { C: 0.18, L: 0.18, A: 0.15, R: 0.15, I: 0.12, T: 0.12, Y: 0.10 },
  talentprint: { A: 0.18, T1: 0.15, T2: 0.15, R: 0.14, AM: 0.13, CF: 0.13, TR: 0.12 },
  impacttrace: { P: 0.25, R: 0.18, O: 0.20, OC: 0.20, F: 0.17 },
  safesignal:  { S: 0.18, H: 0.22, IA: 0.14, E: 0.16, L: 0.14, D: 0.16 },
  eventimpact: { S: 0.25, T: 0.25, A: 0.20, G: 0.20, E: 0.10 },
  spacescore:  { S: 0.22, P: 0.22, A: 0.23, C: 0.18, E: 0.15 },
  finnarrative:{ C: 0.18, A: 0.15, P: 0.20, I: 0.16, T: 0.16, AL: 0.15 },
};

// ============================================================
// HELPERS
// ============================================================

async function trackEvent(opts: {
  scoringResultId?: string | null;
  toolId?: string | null;
  eventType: string;
  email?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await db.insert(funnelEvents).values({
      scoringResultId: opts.scoringResultId ?? null,
      toolId: opts.toolId ?? null,
      eventType: opts.eventType,
      email: opts.email ?? null,
      metadata: opts.metadata ?? null,
    });
  } catch (err) {
    // Ne jamais bloquer le tunnel pour un échec d'analytics
    console.error('[Scoring/Funnel] track failed:', err);
  }
}

const answersSchema = z.record(
  z.string(),
  z.object({
    value:  z.number().int().min(1).max(5),
    pillar: z.string(),
    weight: z.number().int().min(1).max(3),
  })
);

function computeScoreFromAnswers(
  toolId: string,
  answers: Record<string, { value: number; pillar: string; weight: number }>,
  maxPillars?: number
): { globalScore: number; maturityLevel: number; pillarScores: Record<string, number> } {
  const pillarWeights = TOOL_PILLAR_WEIGHTS[toolId] ?? {};
  const allPillars = Array.from(new Set(Object.values(answers).map(a => a.pillar)));
  const pillars = maxPillars ? allPillars.slice(0, maxPillars) : allPillars;

  const pillarScores: Record<string, number> = {};
  let weightedSum = 0, totalWeight = 0;

  for (const pillar of pillars) {
    const pas = Object.values(answers).filter(a => a.pillar === pillar);
    if (pas.length === 0) continue;
    let pW = 0, pM = 0;
    for (const ans of pas) { pW += ans.value * ans.weight; pM += 5 * ans.weight; }
    const pS = pM > 0 ? Math.round((pW / pM) * 100) : 0;
    pillarScores[pillar] = pS;
    const dW = pillarWeights[pillar] ?? (1 / pillars.length);
    weightedSum += pS * dW; totalWeight += dW;
  }

  const globalScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  return { globalScore, maturityLevel: calculateMaturityLevel(globalScore), pillarScores };
}

const discoverBodySchema = z.object({
  answers:        answersSchema,
  companyName:    z.string().max(200).optional(),
  sector:         z.string().max(80).optional(),
  companySize:    z.string().max(30).optional(),
  voiceType:      z.enum(['direction', 'terrain']).optional().default('direction'),
  email:          z.string().email().optional(),
  respondentName: z.string().max(200).optional(),
});

export function registerScoringRoutes(app: Express) {

  // ========================================================
  // GET /api/scoring/catalog — Source de vérité prix/labels
  // ========================================================
  app.get("/api/scoring/catalog", (_req: Request, res: Response) => {
    return res.json({
      tools: ALLOWED_TOOL_IDS.map(id => ({
        id,
        label: TOOL_LABELS[id] ?? id,
        intelligencePriceMad: INTELLIGENCE_PRICES[id],
      })),
      tvaRate: TVA_RATE,
      annualPlan: {
        label: 'BMI 360™ Full — Annuel',
        priceMad: FULL_ANNUAL_PRICE_MAD,
        savings: 53000 - FULL_ANNUAL_PRICE_MAD,
        includes: ALLOWED_TOOL_IDS,
        durationMonths: 12,
      },
    });
  });

  // POST /api/scoring/:toolId/discover — Tier Discover (GRATUIT)
  app.post("/api/scoring/:toolId/discover", scoringLimiter, async (req: Request, res: Response) => {
    try {
      const toolId = req.params.toolId.toLowerCase();
      if (!ALLOWED_TOOL_IDS.includes(toolId)) return res.status(400).json({ error: "Outil non reconnu." });

      const parsed = discoverBodySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Données invalides.", details: parsed.error.errors });

      const { answers, companyName, sector, companySize, voiceType, email, respondentName } = parsed.data;
      const { globalScore, maturityLevel, pillarScores } = computeScoreFromAnswers(toolId, answers, 4);
      const intelligencePrice = INTELLIGENCE_PRICES[toolId];

      // Sauvegarde DB non bloquante — les scores sont retournés même si la DB échoue
      let resultId: string = `local-${toolId}-${Date.now()}`;
      try {
        const [result] = await db.insert(scoringResults).values({
          toolId, tier: 'discover', voiceType, companyName, sector, companySize,
          email, respondentName, globalScore, pillarScores, maturityLevel,
          sessionId: Math.random().toString(36).substring(7),
          userAgent: req.headers['user-agent'] ?? null,
        } as any).returning();
        resultId = result.id;

        // Funnel event & email (non bloquants)
        trackEvent({ scoringResultId: result.id, toolId, eventType: 'discover_completed', email, metadata: { globalScore, maturityLevel } }).catch(() => {});
        if (email) {
          sendDiscoverScoreEmail({ to: email, name: respondentName, toolId, globalScore, maturityLevel, resultId: result.id, intelligencePriceMad: intelligencePrice })
            .then(() => trackEvent({ scoringResultId: result.id, toolId, eventType: 'discover_email_sent', email }))
            .catch(e => console.error('[Discover] Email failed:', e));
        }
      } catch (dbErr) {
        console.error('[Scoring/Discover] DB save failed (scores still returned):', dbErr);
      }

      return res.status(201).json({
        id: resultId, tier: 'discover', globalScore, maturityLevel, pillarScores,
        intelligencePrice,
      });
    } catch (error) {
      console.error("[Scoring/Discover]", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  });

  // POST /api/scoring/:id/unlock-intelligence — Déverrouille APRÈS paiement vérifié en base
  app.post("/api/scoring/:id/unlock-intelligence", intelligenceLimiter, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "ID invalide." });

      const bodySchema = discoverBodySchema.extend({
        paymentRef: z.string().max(100).optional(), // ID interne payments.id ou référence externe
      });
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Données invalides.", details: parsed.error.errors });

      const { answers, companyName, sector, companySize, voiceType, email, respondentName, paymentRef } = parsed.data;

      const existing = await db.query.scoringResults.findFirst({ where: (t, { eq }) => eq(t.id, id) });
      if (!existing) return res.status(404).json({ error: "Résultat introuvable." });

      // Idempotence : déjà déverrouillé → renvoyer le rapport existant
      if (existing.tier === 'intelligence') {
        return res.json({
          id, tier: 'intelligence',
          aiReport: existing.aiReport,
          globalScore: existing.globalScore,
          maturityLevel: existing.maturityLevel,
          pillarScores: existing.pillarScores,
        });
      }

      // ⚠️ SÉCURITÉ — Vérifier qu'un paiement valide existe pour CE résultat
      const verifiedPayment = await db.query.payments.findFirst({
        where: (t, { and, eq }) => and(
          eq(t.scoringResultId, id),
          eq(t.status, 'paid'),
          eq(t.type, 'intelligence'),
        ),
      });

      if (!verifiedPayment) {
        await trackEvent({
          scoringResultId: id, toolId: existing.toolId,
          eventType: 'unlock_denied_no_payment',
          email: email ?? existing.email,
        });
        return res.status(402).json({
          error: "Aucun paiement vérifié trouvé pour ce résultat. Veuillez compléter le paiement avant de déverrouiller le rapport.",
        });
      }

      const toolId = existing.toolId;
      const { globalScore, maturityLevel, pillarScores } = computeScoreFromAnswers(toolId, answers);

      const aiReport = await generateAIReport({
        toolId,
        companyName: companyName ?? existing.companyName ?? undefined,
        sector: sector ?? existing.sector ?? undefined,
        companySize: companySize ?? existing.companySize ?? undefined,
        globalScore, maturityLevel, pillarScores,
      });

      const [updated] = await db.update(scoringResults).set({
        tier: 'intelligence', globalScore, pillarScores, maturityLevel,
        aiReport: aiReport as any,
        intelligencePaymentRef: paymentRef ?? `payment-${verifiedPayment.id}`,
        intelligenceUnlockedAt: new Date(),
        voiceType: voiceType ?? existing.voiceType ?? 'direction',
        companyName: companyName ?? existing.companyName,
        sector: sector ?? existing.sector,
        companySize: companySize ?? existing.companySize,
        email: email ?? existing.email,
        respondentName: respondentName ?? existing.respondentName,
      }).where(eq(scoringResults.id, id)).returning();

      await trackEvent({
        scoringResultId: id, toolId,
        eventType: 'intelligence_unlocked',
        email: email ?? existing.email,
        metadata: { paymentId: verifiedPayment.id, globalScore },
      });

      const recipientEmail = email ?? existing.email;
      if (recipientEmail) {
        await sendMail({
          to: recipientEmail,
          subject: `Votre rapport Intelligence™ ${TOOL_LABELS[toolId] ?? toolId} est prêt`,
          html: `<h2>Votre rapport Intelligence™ est disponible</h2><p>Bonjour ${respondentName ?? 'cher client'},</p><p>Score global : <strong>${globalScore}/100</strong></p><p><a href="${PUBLIC_URL}/outils/${toolId}?result=${id}">Voir mon rapport complet</a></p><p>— L'équipe Epitaphe360</p>`,
        }).catch(e => console.error('[AI Report] Email failed:', e));
      }

      return res.json({ id: updated.id, tier: 'intelligence', globalScore, maturityLevel, pillarScores, aiReport });
    } catch (error) {
      console.error("[Scoring/UnlockIntelligence]", error);
      return res.status(500).json({ error: "Erreur lors de la génération du rapport." });
    }
  });

  // POST /api/scoring/:id/simulate-payment — Paiement simulé (TEST)
  app.post("/api/scoring/:id/simulate-payment", scoringLimiter, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const isLocalId = id.startsWith('local-');

      if (!isLocalId && !/^[0-9a-f-]{36}$/i.test(id)) {
        return res.status(400).json({ error: "ID invalide." });
      }

      const bodySchema = z.object({
        answers:      answersSchema,
        email:        z.string().email(),
        respondentName: z.string().min(1).max(200),
        companyName:  z.string().max(200).optional(),
        sector:       z.string().max(100).optional(),
        companySize:  z.string().max(50).optional(),
        toolId:       z.string().optional(), // fallback si ID local
      });
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Données invalides.", details: parsed.error.errors });

      const { answers, email, respondentName, companyName, sector, companySize } = parsed.data;

      // Récupérer l'enregistrement DB — peut être absent si la sauvegarde discover a échoué
      let existing: typeof scoringResults.$inferSelect | undefined;
      if (!isLocalId) {
        existing = await db.query.scoringResults.findFirst({ where: (t, { eq }) => eq(t.id, id) });
      }

      // toolId : depuis DB, depuis le body, ou depuis l'ID local (format local-{toolId}-{ts})
      const toolId = existing?.toolId
        ?? parsed.data.toolId
        ?? (isLocalId ? id.split('-')[1] : undefined)
        ?? 'commpulse';

      if (!ALLOWED_TOOL_IDS.includes(toolId)) return res.status(400).json({ error: "Outil non reconnu." });

      const priceHT  = INTELLIGENCE_PRICES[toolId];
      if (!priceHT) return res.status(400).json({ error: "Outil non facturé." });
      const priceTTC = Math.round(priceHT * (1 + TVA_RATE));
      const toolName = toolId.charAt(0).toUpperCase() + toolId.slice(1);

      // Calcul du score complet (tous les piliers)
      const { globalScore, maturityLevel, pillarScores } = computeScoreFromAnswers(toolId, answers);

      // Générer rapport IA
      const aiReport = await generateAIReport({
        toolId,
        companyName: companyName ?? existing?.companyName ?? undefined,
        sector:      sector      ?? existing?.sector      ?? undefined,
        companySize: companySize ?? existing?.companySize ?? undefined,
        globalScore, maturityLevel, pillarScores,
      });

      // DB ops non bloquantes — simulation réussit même si DB indisponible
      let paymentId = `sim-local-${Date.now()}`;
      let invoiceNumber = `INV-SIM-${Date.now()}`;
      try {
        // Upsert scoring result
        let targetId = id;
        if (isLocalId || !existing) {
          const [inserted] = await db.insert(scoringResults).values({
            toolId, tier: 'intelligence', voiceType: 'direction',
            companyName, sector, companySize, email, respondentName,
            globalScore, pillarScores, maturityLevel,
            aiReport: aiReport as any,
            intelligencePaymentRef: `SIM-pending`,
            intelligenceUnlockedAt: new Date(),
            sessionId: Math.random().toString(36).substring(7),
          } as any).returning();
          targetId = inserted.id;
        } else {
          await db.update(scoringResults).set({
            tier: 'intelligence', globalScore, pillarScores, maturityLevel,
            aiReport: aiReport as any,
            intelligenceUnlockedAt: new Date(),
            companyName: companyName ?? existing.companyName,
            sector:      sector      ?? existing.sector,
            companySize: companySize ?? existing.companySize,
            email:       email       ?? existing.email,
            respondentName: respondentName ?? existing.respondentName,
          }).where(eq(scoringResults.id, id));
        }

        const [payment] = await db.insert(payments).values({
          scoringResultId: targetId,
          type: 'intelligence', amount: priceTTC, currency: 'MAD',
          status: 'paid', paymentMethod: 'simulation',
          metadata: { toolId, email, companyName, simulation: 'true' },
        }).returning();
        paymentId = payment.id;

        const invNum = await generateInvoiceNumber();
        const invoiceResult = await createAndSendInvoice({
          invoiceNumber: invNum, paymentId: payment.id, scoringResultId: targetId,
          clientEmail: email, clientName: respondentName, clientCompany: companyName,
          toolId, description: `[TEST] Rapport Intelligence BMI 360™ — ${toolName}`,
          amountHT: priceHT, currency: 'MAD',
        });
        invoiceNumber = invoiceResult.invoiceNumber;

        await db.update(scoringResults).set({ intelligencePaymentRef: `SIM-${payment.id}` }).where(eq(scoringResults.id, targetId));
      } catch (dbErr) {
        console.error('[Scoring/SimulatePayment] DB ops failed (report still returned):', dbErr);
      }

      return res.json({
        id, tier: 'intelligence', globalScore, maturityLevel, pillarScores,
        aiReport, simulation: true, paymentId, invoiceNumber, amountTTC: priceTTC,
      });
    } catch (error) {
      console.error("[Scoring/SimulatePayment]", error);
      return res.status(500).json({ error: "Erreur lors de la simulation." });
    }
  });

  // GET /api/scoring/result/:id — Récupérer un résultat
  app.get("/api/scoring/result/:id", scoringLimiter, async (req: Request, res: Response) => {    try {
      const { id } = req.params;
      if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "Format d'ID invalide." });

      const result = await db.query.scoringResults.findFirst({ where: (t, { eq }) => eq(t.id, id) });
      if (!result) return res.status(404).json({ error: "Résultat introuvable." });

      return res.json({
        id: result.id, toolId: result.toolId, tier: result.tier,
        globalScore: result.globalScore, maturityLevel: result.maturityLevel,
        pillarScores: result.tier === 'intelligence'
          ? result.pillarScores
          : Object.fromEntries(Object.entries(result.pillarScores ?? {}).slice(0, 4)),
        aiReport: result.tier === 'intelligence' ? result.aiReport : null,
        intelligencePrice: INTELLIGENCE_PRICES[result.toolId] ?? null,
        createdAt: result.createdAt,
      });
    } catch (error) {
      console.error("[Scoring/GetResult]", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  });

  // POST /api/scoring/intelligence-payment — Initier un paiement Intelligence
  app.post("/api/scoring/intelligence-payment", scoringLimiter, async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        scoringResultId: z.string().uuid(),
        toolId:          z.string(),
        email:           z.string().email(),
        companyName:     z.string().max(200).optional(),
        method:          z.enum(['paypal', 'cmi', 'virement']).default('paypal'),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Données invalides.", details: parsed.error.errors });

      const { toolId, email, companyName, scoringResultId, method } = parsed.data;
      if (!ALLOWED_TOOL_IDS.includes(toolId)) {
        return res.status(400).json({ error: "Outil non reconnu." });
      }
      const priceHT  = INTELLIGENCE_PRICES[toolId];
      const priceTTC = Math.round(priceHT * (1 + TVA_RATE));          // TVA 20%
      const toolName = TOOL_LABELS[toolId] ?? toolId;
      const description = `Rapport Intelligence BMI 360™ — ${toolName}`;

      // Créer l'enregistrement payment en base (statut pending)
      const paymentRef = `INT-${toolId.toUpperCase().slice(0, 3)}-${Date.now().toString(36).toUpperCase()}`;
      const [payment] = await db.insert(payments).values({
        scoringResultId,
        type:          'intelligence',
        amount:        priceTTC,
        currency:      'MAD',
        status:        'pending',
        paymentMethod: method,
        metadata:      { toolId, email, companyName, paymentRef },
      }).returning();

      // Funnel : paiement initié
      await trackEvent({
        scoringResultId, toolId,
        eventType: 'intelligence_payment_initiated',
        email,
        metadata: { method, amount: priceTTC, paymentId: payment.id },
      });

      if (method === 'paypal') {
        // Créer une commande PayPal (montant en MAD converti)
        const amountMAD = priceTTC / 100; // centimes → dirhams
        const order = await createPayPalOrder(
          amountMAD,
          description,
          `${payment.id}|${scoringResultId}`,
        );

        // Mettre à jour le paiement avec l'ID PayPal
        await db.update(payments)
          .set({ paypalOrderId: order.orderId })
          .where(eq(payments.id, payment.id));

        return res.status(201).json({
          paymentMethod: 'paypal',
          paymentId:     payment.id,
          paypalOrderId: order.orderId,
          approvalUrl:   order.approvalUrl,
          amount:        priceTTC,
          amountHT:      priceHT,
          amountTVA:     priceTTC - priceHT,
          currency:      'MAD',
        });

      } else if (method === 'cmi') {
        // Générer le formulaire CMI (montant en dirhams)
        const amountMAD = priceTTC / 100;
        const cmiOrderId = `CMI-${payment.id}-${Date.now().toString(36).toUpperCase()}`;
        const form = generateCMIForm(amountMAD, cmiOrderId, description, email);

        // Mettre à jour le paiement avec l'ID CMI
        await db.update(payments)
          .set({ cmiOrderId })
          .where(eq(payments.id, payment.id));

        return res.status(201).json({
          paymentMethod: 'cmi',
          paymentId:     payment.id,
          cmiOrderId,
          gatewayUrl:    form.gatewayUrl,
          formFields:    form.fields,
          amount:        priceTTC,
          amountHT:      priceHT,
          amountTVA:     priceTTC - priceHT,
          currency:      'MAD',
        });

      } else {
        // Virement bancaire (fallback)
        return res.status(201).json({
          paymentMethod:    'virement',
          paymentId:        payment.id,
          paymentRef,
          amount:           priceTTC,
          amountHT:         priceHT,
          amountTVA:        priceTTC - priceHT,
          currency:         'MAD',
          bankInstructions: {
            beneficiary: 'Epitaphe360 SARL',
            reference:   paymentRef,
            amount:      `${(priceTTC / 100).toFixed(2)} MAD TTC`,
            note:        'Veuillez indiquer la référence lors du virement.',
          },
        });
      }
    } catch (error) {
      console.error("[Scoring/Payment]", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  });

  // POST /api/scoring/:toolId — Endpoint legacy, désactivé (utiliser /discover)
  app.post("/api/scoring/:toolId", scoringLimiter, (_req: Request, res: Response) => {
    return res.status(410).json({
      error: "Endpoint déprécié. Utilisez POST /api/scoring/:toolId/discover.",
    });
  });

  // ========================================================
  // PHASE TRANSFORM — RDV avec un expert humain
  // ========================================================

  // POST /api/scoring/:id/request-expert — Demande de RDV expert
  app.post("/api/scoring/:id/request-expert", expertLimiter, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const isUuid = /^[0-9a-f-]{36}$/i.test(id);

      const schema = z.object({
        contactName:      z.string().min(2).max(200),
        contactEmail:     z.string().email().max(254),
        contactPhone:     z.string().max(30).optional(),
        companyName:      z.string().max(200).optional(),
        jobTitle:         z.string().max(150).optional(),
        companySize:      z.string().max(30).optional(),
        message:          z.string().max(2000).optional(),
        preferredSlot:    z.enum(['matin', 'apres-midi', 'soir', 'flexible']).optional(),
        preferredChannel: z.enum(['visio', 'telephone', 'presentiel']).default('visio'),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Données invalides.", details: parsed.error.errors });

      const data = parsed.data;
      let scoringResultId: string | undefined;
      let toolId: string | undefined;
      let globalScore: number | undefined;

      if (isUuid) {
        const existing = await db.query.scoringResults.findFirst({ where: (t, { eq }) => eq(t.id, id) });
        if (existing) {
          scoringResultId = existing.id;
          toolId = existing.toolId;
          globalScore = existing.globalScore;
        }
      }

      const [consultation] = await db.insert(expertConsultations).values({
        scoringResultId: scoringResultId ?? null,
        toolId: toolId ?? null,
        contactName:      data.contactName,
        contactEmail:     data.contactEmail,
        contactPhone:     data.contactPhone ?? null,
        companyName:      data.companyName ?? null,
        jobTitle:         data.jobTitle ?? null,
        companySize:      data.companySize ?? null,
        message:          data.message ?? null,
        preferredSlot:    data.preferredSlot ?? null,
        preferredChannel: data.preferredChannel,
        source:           scoringResultId ? 'intelligence-report' : 'direct',
        ipAddress:        (req.ip ?? req.headers['x-forwarded-for'] as string ?? '').toString().slice(0, 45),
        userAgent:        req.headers['user-agent'] ?? null,
      } as any).returning();

      await trackEvent({
        scoringResultId: scoringResultId ?? null,
        toolId: toolId ?? null,
        eventType: 'expert_requested',
        email: data.contactEmail,
        metadata: { consultationId: consultation.id, channel: data.preferredChannel },
      });

      // Notifications email (non bloquantes)
      sendExpertRequestConfirmation({
        to: data.contactEmail,
        name: data.contactName,
        toolId,
      }).catch(e => console.error('[Expert] Confirmation failed:', e));

      sendExpertRequestNotification({
        adminEmail: ADMIN_NOTIF_EMAIL,
        contactName:      data.contactName,
        contactEmail:     data.contactEmail,
        contactPhone:     data.contactPhone,
        companyName:      data.companyName,
        jobTitle:         data.jobTitle,
        toolId,
        message:          data.message,
        preferredSlot:    data.preferredSlot,
        preferredChannel: data.preferredChannel,
        consultationId:   consultation.id,
        scoringResultId,
        globalScore,
      }).catch(e => console.error('[Expert] Notification failed:', e));

      return res.status(201).json({
        id: consultation.id,
        status: 'received',
        message: "Votre demande a bien été reçue. Un expert vous contactera sous 24 h ouvrées.",
      });
    } catch (error) {
      console.error("[Scoring/RequestExpert]", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  });

  // ========================================================
  // PLAN ANNUEL FULL — Accès aux 7 outils Intelligence pendant 12 mois
  // ========================================================

  // POST /api/scoring/full-annual-payment — Initier le paiement plan annuel
  app.post("/api/scoring/full-annual-payment", scoringLimiter, async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        email:       z.string().email(),
        companyName: z.string().max(200).optional(),
        method:      z.enum(['paypal', 'cmi', 'virement']).default('cmi'),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Données invalides.", details: parsed.error.errors });

      const { email, companyName, method } = parsed.data;
      const priceHT  = FULL_ANNUAL_PRICE_MAD;
      const priceTTC = Math.round(priceHT * (1 + TVA_RATE));
      const description = `BMI 360™ Full — Abonnement Annuel (12 mois)`;
      const paymentRef = `FULL-${Date.now().toString(36).toUpperCase()}`;

      const [payment] = await db.insert(payments).values({
        type:          'intelligence',
        amount:        priceTTC,
        currency:      'MAD',
        status:        'pending',
        paymentMethod: method,
        metadata:      { plan: 'bmi360-full-annual', email, companyName, paymentRef, durationMonths: 12 },
      }).returning();

      await trackEvent({
        eventType: 'full_annual_payment_initiated',
        email,
        metadata: { method, amount: priceTTC, paymentId: payment.id },
      });

      if (method === 'paypal') {
        const order = await createPayPalOrder(priceTTC, description, `${payment.id}|full-annual`);
        await db.update(payments).set({ paypalOrderId: order.orderId }).where(eq(payments.id, payment.id));
        return res.status(201).json({
          paymentMethod: 'paypal', paymentId: payment.id,
          paypalOrderId: order.orderId, approvalUrl: order.approvalUrl,
          amount: priceTTC, amountHT: priceHT, amountTVA: priceTTC - priceHT, currency: 'MAD',
        });
      }

      if (method === 'cmi') {
        const cmiOrderId = `CMIFULL-${payment.id}-${Date.now().toString(36).toUpperCase()}`;
        const form = generateCMIForm(priceTTC, cmiOrderId, description, email);
        await db.update(payments).set({ cmiOrderId }).where(eq(payments.id, payment.id));
        return res.status(201).json({
          paymentMethod: 'cmi', paymentId: payment.id, cmiOrderId,
          gatewayUrl: form.gatewayUrl, formFields: form.fields,
          amount: priceTTC, amountHT: priceHT, amountTVA: priceTTC - priceHT, currency: 'MAD',
        });
      }

      // Virement
      return res.status(201).json({
        paymentMethod: 'virement', paymentId: payment.id, paymentRef,
        amount: priceTTC, amountHT: priceHT, amountTVA: priceTTC - priceHT, currency: 'MAD',
        bankInstructions: {
          beneficiary: 'Epitaphe360 SARL',
          reference:   paymentRef,
          amount:      `${priceTTC.toLocaleString('fr-MA')} MAD TTC`,
          note:        'Plan annuel BMI 360 Full — accès 12 mois aux 7 outils Intelligence.',
        },
      });
    } catch (error) {
      console.error("[Scoring/FullAnnualPayment]", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  });

  // ========================================================
  // ADMIN — Consultations Transform
  // ========================================================

  app.get("/api/admin/consultations", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const list = await db.select().from(expertConsultations).orderBy(desc(expertConsultations.createdAt));
      return res.json(list);
    } catch (error) {
      console.error("[Admin/Consultations]", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  });

  app.patch("/api/admin/consultations/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const schema = z.object({
        status:      z.enum(['new', 'contacted', 'scheduled', 'done', 'cancelled']).optional(),
        scheduledAt: z.string().datetime().optional(),
        expertNotes: z.string().max(5000).optional(),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Données invalides.", details: parsed.error.errors });

      const patch: Record<string, unknown> = { updatedAt: new Date() };
      if (parsed.data.status)      patch.status = parsed.data.status;
      if (parsed.data.scheduledAt) patch.scheduledAt = new Date(parsed.data.scheduledAt);
      if (parsed.data.expertNotes !== undefined) patch.expertNotes = parsed.data.expertNotes;

      const [updated] = await db.update(expertConsultations)
        .set(patch as any)
        .where(eq(expertConsultations.id, id))
        .returning();

      if (!updated) return res.status(404).json({ error: "Consultation introuvable." });
      return res.json(updated);
    } catch (error) {
      console.error("[Admin/Consultations/Patch]", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  });

  // ========================================================
  // ADMIN — Funnel analytics (entonnoir de conversion)
  // ========================================================

  app.get("/api/admin/funnel", requireAdmin, async (req: Request, res: Response) => {
    try {
      const days = Math.min(parseInt(String(req.query.days ?? '30'), 10) || 30, 365);
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const events = await db.select().from(funnelEvents)
        .where(gte(funnelEvents.createdAt, since))
        .orderBy(desc(funnelEvents.createdAt))
        .limit(5000);

      // Compte par type d'event
      const counts: Record<string, number> = {};
      for (const e of events) counts[e.eventType] = (counts[e.eventType] ?? 0) + 1;

      // Compte par outil
      const byTool: Record<string, Record<string, number>> = {};
      for (const e of events) {
        if (!e.toolId) continue;
        byTool[e.toolId] ??= {};
        byTool[e.toolId][e.eventType] = (byTool[e.toolId][e.eventType] ?? 0) + 1;
      }

      return res.json({
        sinceDays: days,
        totalEvents: events.length,
        counts,
        byTool,
      });
    } catch (error) {
      console.error("[Admin/Funnel]", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  });

  // GET /api/admin/scoring — Admin: liste des résultats
  app.get("/api/admin/scoring", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const results = await db.select({
        id: scoringResults.id, toolId: scoringResults.toolId, tier: scoringResults.tier,
        companyName: scoringResults.companyName, email: scoringResults.email,
        globalScore: scoringResults.globalScore, maturityLevel: scoringResults.maturityLevel,
        sector: scoringResults.sector, createdAt: scoringResults.createdAt,
      }).from(scoringResults).orderBy(scoringResults.createdAt);
      return res.json(results);
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur." });
    }
  });
}
