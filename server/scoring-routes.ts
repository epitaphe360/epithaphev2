/**
 * BMI 360™ — Routes de Scoring Intelligence
 * Tunnel CDC : Discover (gratuit) → Intelligence (payant, rapport IA) → Transform (devis)
 */
import { Express, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { db } from "./db";
import { scoringResults, payments } from "../shared/schema";
import { processAssessment, calculateMaturityLevel } from "./lib/scoring-engine";
import { generateAIReport } from "./lib/ai-report";
import { requireAdmin } from "./lib/auth";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { sendMail } from "./lib/email";
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

const ALLOWED_TOOL_IDS = [
  "brandmaturity", "commpulse", "talentprint", "impacttrace", "safesignal",
  "eventimpact", "spacescore", "finnarrative",
];

const INTELLIGENCE_PRICES: Record<string, number> = {
  commpulse: 4900, talentprint: 7500, impacttrace: 8400,
  safesignal: 7900, eventimpact: 7900, spacescore: 6500, finnarrative: 9900,
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

  // POST /api/scoring/:toolId/discover — Tier Discover (GRATUIT)
  app.post("/api/scoring/:toolId/discover", scoringLimiter, async (req: Request, res: Response) => {
    try {
      const toolId = req.params.toolId.toLowerCase();
      if (!ALLOWED_TOOL_IDS.includes(toolId)) return res.status(400).json({ error: "Outil non reconnu." });

      const parsed = discoverBodySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Données invalides.", details: parsed.error.errors });

      const { answers, companyName, sector, companySize, voiceType, email, respondentName } = parsed.data;
      const { globalScore, maturityLevel, pillarScores } = computeScoreFromAnswers(toolId, answers, 4);

      const [result] = await db.insert(scoringResults).values({
        toolId, tier: 'discover', voiceType, companyName, sector, companySize,
        email, respondentName, globalScore, pillarScores, maturityLevel,
        sessionId: Math.random().toString(36).substring(7),
        userAgent: req.headers['user-agent'] ?? null,
      } as any).returning();

      return res.status(201).json({
        id: result.id, tier: 'discover', globalScore, maturityLevel, pillarScores,
        intelligencePrice: INTELLIGENCE_PRICES[toolId] ?? 4900,
      });
    } catch (error) {
      console.error("[Scoring/Discover]", error);
      return res.status(500).json({ error: "Erreur serveur." });
    }
  });

  // POST /api/scoring/:id/unlock-intelligence — Déverrouiller après paiement
  app.post("/api/scoring/:id/unlock-intelligence", intelligenceLimiter, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "ID invalide." });

      const bodySchema = discoverBodySchema.extend({
        paymentRef: z.string().max(100).optional(),
      });
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Données invalides.", details: parsed.error.errors });

      const { answers, companyName, sector, companySize, voiceType, email, respondentName, paymentRef } = parsed.data;

      const existing = await db.query.scoringResults.findFirst({ where: (t, { eq }) => eq(t.id, id) });
      if (!existing) return res.status(404).json({ error: "Résultat introuvable." });
      if (existing.tier === 'intelligence') {
        return res.json({ id, tier: 'intelligence', aiReport: existing.aiReport, globalScore: existing.globalScore, maturityLevel: existing.maturityLevel, pillarScores: existing.pillarScores });
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
        intelligencePaymentRef: paymentRef ?? 'direct',
        intelligenceUnlockedAt: new Date(),
        voiceType: voiceType ?? existing.voiceType ?? 'direction',
        companyName: companyName ?? existing.companyName,
        sector: sector ?? existing.sector,
        companySize: companySize ?? existing.companySize,
        email: email ?? existing.email,
        respondentName: respondentName ?? existing.respondentName,
      }).where(eq(scoringResults.id, id)).returning();

      const recipientEmail = email ?? existing.email;
      if (recipientEmail) {
        const labels: Record<string, string> = {
          commpulse: 'CommPulse™', talentprint: 'TalentPrint™', impacttrace: 'ImpactTrace™',
          safesignal: 'SafeSignal™', eventimpact: 'EventImpact™', spacescore: 'SpaceScore™', finnarrative: 'FinNarrative™',
        };
        await sendMail({
          to: recipientEmail,
          subject: `Votre rapport Intelligence™ ${labels[toolId] ?? toolId} est prêt`,
          html: `<h2>Votre rapport Intelligence™ est disponible</h2><p>Bonjour ${respondentName ?? 'cher client'},</p><p>Score global : <strong>${globalScore}/100</strong></p><p><a href="${process.env.PUBLIC_URL ?? 'https://epitaphe360.ma'}/outils/${toolId}?result=${id}">Voir mon rapport complet</a></p><p>— L'équipe Epitaphe360</p>`,
        }).catch(e => console.error('[AI Report] Email failed:', e));
      }

      return res.json({ id: updated.id, tier: 'intelligence', globalScore, maturityLevel, pillarScores, aiReport });
    } catch (error) {
      console.error("[Scoring/UnlockIntelligence]", error);
      return res.status(500).json({ error: "Erreur lors de la génération du rapport." });
    }
  });

  // POST /api/scoring/:id/simulate-payment — Paiement simulé (TEST uniquement)
  // Activé si PAYMENT_SIMULATION_ENABLED=true ou NODE_ENV !== 'production'
  app.post("/api/scoring/:id/simulate-payment", scoringLimiter, async (req: Request, res: Response) => {
    const simulationEnabled =
      process.env.PAYMENT_SIMULATION_ENABLED === 'true' ||
      process.env.NODE_ENV !== 'production';

    if (!simulationEnabled) {
      return res.status(403).json({ error: "Simulation désactivée en production." });
    }

    try {
      const { id } = req.params;
      if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "ID invalide." });

      const bodySchema = z.object({
        answers:      answersSchema,
        email:        z.string().email(),
        respondentName: z.string().min(1).max(200),
        companyName:  z.string().max(200).optional(),
        sector:       z.string().max(100).optional(),
        companySize:  z.string().max(50).optional(),
      });
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Données invalides.", details: parsed.error.errors });

      const { answers, email, respondentName, companyName, sector, companySize } = parsed.data;

      const existing = await db.query.scoringResults.findFirst({ where: (t, { eq }) => eq(t.id, id) });
      if (!existing) return res.status(404).json({ error: "Résultat introuvable." });

      const toolId   = existing.toolId;
      const priceHT  = INTELLIGENCE_PRICES[toolId] ?? 4900;
      const priceTTC = Math.round(priceHT * 1.20);
      const toolName = toolId.charAt(0).toUpperCase() + toolId.slice(1);

      // 1. Créer enregistrement paiement simulé
      const [payment] = await db.insert(payments).values({
        scoringResultId: id,
        type:          'intelligence',
        amount:        priceTTC,
        currency:      'MAD',
        status:        'paid',
        paymentMethod: 'simulation',
        metadata:      { toolId, email, companyName, simulation: 'true' },
      }).returning();

      // 2. Générer la facture PDF + envoyer par email
      const invoiceNumber = await generateInvoiceNumber();
      const invoiceResult = await createAndSendInvoice({
        invoiceNumber,
        paymentId:       payment.id,
        scoringResultId: id,
        clientEmail:     email,
        clientName:      respondentName,
        clientCompany:   companyName,
        toolId,
        description:     `[TEST] Rapport Intelligence BMI 360™ — ${toolName}`,
        amountHT:        priceHT,
        currency:        'MAD',
      });

      // 3. Générer le rapport IA
      const { globalScore, maturityLevel, pillarScores } = computeScoreFromAnswers(toolId, answers);
      const aiReport = await generateAIReport({
        toolId,
        companyName: companyName ?? existing.companyName ?? undefined,
        sector:      sector      ?? existing.sector      ?? undefined,
        companySize: companySize ?? existing.companySize ?? undefined,
        globalScore, maturityLevel, pillarScores,
      });

      // 4. Mettre à jour le scoring result en intelligence tier
      const [updated] = await db.update(scoringResults).set({
        tier: 'intelligence', globalScore, pillarScores, maturityLevel,
        aiReport: aiReport as any,
        intelligencePaymentRef: `SIM-${payment.id}`,
        intelligenceUnlockedAt: new Date(),
        companyName: companyName ?? existing.companyName,
        sector:      sector      ?? existing.sector,
        companySize: companySize ?? existing.companySize,
        email:       email       ?? existing.email,
        respondentName: respondentName ?? existing.respondentName,
      }).where(eq(scoringResults.id, id)).returning();

      return res.json({
        id:            updated.id,
        tier:          'intelligence',
        globalScore,
        maturityLevel,
        pillarScores,
        aiReport,
        simulation:    true,
        paymentId:     payment.id,
        invoiceNumber: invoiceResult.invoiceNumber,
        amountTTC:     priceTTC,
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
        intelligencePrice: INTELLIGENCE_PRICES[result.toolId] ?? 4900,
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
      const priceHT  = INTELLIGENCE_PRICES[toolId] ?? 4900; // centimes MAD HT
      const priceTTC = Math.round(priceHT * 1.20);          // TVA 20%
      const toolName = toolId.charAt(0).toUpperCase() + toolId.slice(1);
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

  // POST /api/scoring/:toolId — Rétro-compat (ancien endpoint)
  app.post("/api/scoring/:toolId", scoringLimiter, async (req: Request, res: Response) => {
    try {
      const toolId = req.params.toolId.toLowerCase();
      if (!ALLOWED_TOOL_IDS.includes(toolId)) return res.status(400).json({ error: "Outil non reconnu." });

      const { answers } = req.body;
      if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
        return res.status(400).json({ error: "Objet answers requis." });
      }

      const processed = processAssessment(toolId, answers as Record<string, number>);
      const [newResult] = await db.insert(scoringResults).values(processed as any).returning();
      return res.status(201).json(newResult);
    } catch (error) {
      console.error("[Scoring/Legacy]", error);
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
