/**
 * Routes paiement Epitaphe360
 * - Type 1 : Devis (analyse + plan d'action) → paiement à la carte
 * - Type 2 : Abonnements plateforme (Starter / Pro / Expert)
 *
 * Architecture Stripe-ready : toutes les routes sont préparées pour
 * l'intégration Stripe. En attendant la clé Stripe, elles fonctionnent
 * en mode "local" (mise à jour BDD directe, email confirmation).
 */
/// <reference path="./types.d.ts" />
import type { Express, Request, Response } from "express";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import {
  subscriptionPlans,
  clientSubscriptions,
  devis,
  payments,
  invoices,
  clientAccounts,
} from "@shared/schema";
import { requireClientAuth } from "./public-api-routes";
import type { ClientAuthRequest } from "./public-api-routes";
import { sendMail } from "./lib/email";
import { requireAuth, requireAdmin } from "./lib/auth";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { z } from "zod";
import { capturePayPalOrder } from "./lib/paypal";
import { verifyCMICallback } from "./lib/cmi";
import { createAndSendInvoice, generateInvoiceNumber } from "./lib/invoice-generator";
import { generateAIReport } from "./lib/ai-report";
import { scoringResults } from "../shared/schema";

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Trop de requêtes", retryAfter: 15 },
});

// ─── Générer une référence de devis unique (non prédictible) ─────────────────────────────
async function generateDevisRef(): Promise<string> {
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `DEV-${year}-${rand}`;
}

/**
 * Vérifie la signature HMAC d'un devis.
 * Retourne `true` si la signature est valide.
 */
function verifyDevisSignature(devisId: string | number, reference: string, sig: string): boolean {
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  const expectedSig = crypto.createHmac("sha256", secret)
    .update(`${devisId}:${reference}`)
    .digest("hex");
  if (sig.length !== expectedSig.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
}

export function registerPaymentRoutes(app: Express) {

  // ================================================================
  // PLANS D'ABONNEMENT (publics — pas besoin d'auth)
  // ================================================================

  /**
   * GET /api/plans
   * Liste des plans disponibles
   */
  app.get("/api/plans", async (_req: Request, res: Response) => {
    try {
      const plans = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.isActive, true))
        .orderBy(subscriptionPlans.sortOrder);
      res.json(plans);
    } catch (error) {
      console.error("[GET /api/plans]", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ================================================================
  // MON ABONNEMENT (client connecté)
  // ================================================================

  /**
   * GET /api/client/subscription
   * Abonnement actif du client connecté
   */
  app.get("/api/client/subscription", requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const clientId = req.clientId!;
      const [sub] = await db
        .select({
          id: clientSubscriptions.id,
          status: clientSubscriptions.status,
          billingCycle: clientSubscriptions.billingCycle,
          currentPeriodStart: clientSubscriptions.currentPeriodStart,
          currentPeriodEnd: clientSubscriptions.currentPeriodEnd,
          cancelAtPeriodEnd: clientSubscriptions.cancelAtPeriodEnd,
          plan: {
            id: subscriptionPlans.id,
            name: subscriptionPlans.name,
            slug: subscriptionPlans.slug,
            priceMonthly: subscriptionPlans.priceMonthly,
            priceAnnual: subscriptionPlans.priceAnnual,
            features: subscriptionPlans.features,
            maxProjects: subscriptionPlans.maxProjects,
          },
        })
        .from(clientSubscriptions)
        .innerJoin(subscriptionPlans, eq(clientSubscriptions.planId, subscriptionPlans.id))
        .where(
          and(
            eq(clientSubscriptions.clientId, clientId),
            eq(clientSubscriptions.status, "active")
          )
        )
        .limit(1);

      res.json(sub ?? null);
    } catch (error) {
      console.error("[GET /api/client/subscription]", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * POST /api/client/subscription
   * Souscrire à un plan (ou changer de plan)
   * En prod : déclenche Stripe Checkout Session
   */
  app.post("/api/client/subscription", paymentLimiter, requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const clientId = req.clientId!;
      const subscriptionInput = z.object({
        planSlug: z.string().min(1).max(100),
        billingCycle: z.enum(["monthly", "annual"]).default("monthly"),
      }).parse(req.body);

      const [plan] = await db
        .select()
        .from(subscriptionPlans)
        .where(and(eq(subscriptionPlans.slug, subscriptionInput.planSlug), eq(subscriptionPlans.isActive, true)))
        .limit(1);

      if (!plan) {
        return res.status(404).json({ error: "Plan introuvable" });
      }

      // Désactiver l'abonnement actuel si existant
      await db
        .update(clientSubscriptions)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(and(eq(clientSubscriptions.clientId, clientId), eq(clientSubscriptions.status, "active")));

      // Calculer les dates de période
      const now = new Date();
      const periodEnd = new Date(now);
      if (subscriptionInput.billingCycle === "annual") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      const amount = subscriptionInput.billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;

      // Créer le nouvel abonnement
      const [newSub] = await db
        .insert(clientSubscriptions)
        .values({
          clientId,
          planId: plan.id,
          status: "active",
          billingCycle: subscriptionInput.billingCycle,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        })
        .returning();

      // Enregistrer le paiement en mode « pending » — sera confirmé via webhook Stripe en prod
      await db.insert(payments).values({
        clientId,
        subscriptionId: newSub.id,
        type: "subscription",
        amount,
        currency: plan.currency ?? "MAD",
        status: "pending",  // Toujours « pending » — seul le webhook Stripe peut passer en « paid »
        paymentMethod: "card",
      });

      // Récupérer les infos client pour l'email
      const [account] = await db.select({ email: clientAccounts.email, name: clientAccounts.name })
        .from(clientAccounts).where(eq(clientAccounts.id, clientId)).limit(1);

      if (account) {
        sendMail({
          to: account.email,
          subject: `Confirmation de paiement — Epitaphe 360`,
          html: `<p>Bonjour ${account.name},</p><p>Votre abonnement <strong>${plan.name}</strong> (${amount / 100} ${plan.currency ?? "MAD"}/${subscriptionInput.billingCycle}) a bien été activé.</p><p>Merci de votre confiance !</p>`,
        }).catch(e => console.error("[email] payment confirmation:", e));
      }

      res.status(201).json({ success: true, subscription: newSub, plan });
    } catch (error) {
      console.error("[POST /api/client/subscription]", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * DELETE /api/client/subscription
   * Résilier l'abonnement (cancel at period end)
   */
  app.delete("/api/client/subscription", requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const clientId = req.clientId!;
      await db
        .update(clientSubscriptions)
        .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
        .where(and(eq(clientSubscriptions.clientId, clientId), eq(clientSubscriptions.status, "active")));
      res.json({ success: true, message: "Résiliation programmée en fin de période" });
    } catch (error) {
      console.error("[DELETE /api/client/subscription]", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ================================================================
  // DEVIS (Type 1 — analyse scoring + plan d'action)
  // ================================================================

  /**
   * GET /api/client/devis
   * Liste des devis du client connecté
   */
  app.get("/api/client/devis", requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const clientId = req.clientId!;
      const list = await db
        .select()
        .from(devis)
        .where(eq(devis.clientId, clientId))
        .orderBy(desc(devis.createdAt));
      res.json(list);
    } catch (error) {
      console.error("[GET /api/client/devis]", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * GET /api/devis/:reference
   * Récupérer un devis par référence (public — lien email)
   */
  app.get("/api/devis/:reference", async (req: Request, res: Response) => {
    try {
      const { sig } = req.query as { sig?: string };
      if (!sig) return res.status(401).json({ error: "Signature requise" });

      const [d] = await db
        .select()
        .from(devis)
        .where(eq(devis.reference, req.params.reference))
        .limit(1);

      if (!d) return res.status(404).json({ error: "Devis introuvable" });

      if (!verifyDevisSignature(d.id, d.reference, sig)) {
        return res.status(401).json({ error: "Signature invalide" });
      }

      // Marquer comme consulté
      if (d.status === "sent") {
        await db.update(devis).set({ status: "viewed", updatedAt: new Date() }).where(eq(devis.id, d.id));
      }

      res.json(d);
    } catch (error) {
      console.error("[GET /api/devis/:ref]", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * POST /api/devis/:reference/accept
   * Client accepte le devis
   */
  app.post("/api/devis/:reference/accept", paymentLimiter, async (req: Request, res: Response) => {
    try {
      const { sig } = req.query as { sig?: string };
      if (!sig) return res.status(401).json({ error: "Signature requise" });

      const [d] = await db.select().from(devis).where(eq(devis.reference, req.params.reference)).limit(1);
      if (!d) return res.status(404).json({ error: "Devis introuvable" });

      if (!verifyDevisSignature(d.id, d.reference, sig)) {
        return res.status(401).json({ error: "Signature invalide" });
      }

      if (!["sent", "viewed"].includes(d.status ?? "")) {
        return res.status(400).json({ error: "Ce devis ne peut plus être accepté" });
      }

      await db.update(devis).set({ status: "accepted", updatedAt: new Date() }).where(eq(devis.id, d.id));

      // Créer un paiement pending
      const [payment] = await db.insert(payments).values({
        clientId: d.clientId ?? undefined,
        devisId: d.id,
        type: "devis",
        amount: d.total,
        currency: d.currency ?? "MAD",
        status: "pending",
        paymentMethod: "card",
      }).returning();

      // En prod : ici on déclencherait Stripe PaymentIntent
      // const paymentIntent = await stripe.paymentIntents.create({ amount: d.total, currency: "mad" });

      res.json({ success: true, paymentId: payment.id, amount: d.total, currency: d.currency });
    } catch (error) {
      console.error("[POST /api/devis/:ref/accept]", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * POST /api/devis/:reference/refuse
   * Client refuse le devis
   */
  app.post("/api/devis/:reference/refuse", paymentLimiter, async (req: Request, res: Response) => {
    try {
      const { sig } = req.query as { sig?: string };
      if (!sig) return res.status(401).json({ error: "Signature requise" });

      const [d] = await db.select().from(devis).where(eq(devis.reference, req.params.reference)).limit(1);
      if (!d) return res.status(404).json({ error: "Devis introuvable" });

      if (!verifyDevisSignature(d.id, d.reference, sig)) {
        return res.status(401).json({ error: "Signature invalide" });
      }

      await db.update(devis).set({ status: "refused", updatedAt: new Date() }).where(eq(devis.id, d.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ================================================================
  // ADMIN — Devis (CRUD complet)
  // ================================================================

  /**
   * GET /api/admin/devis
   */
  app.get("/api/admin/devis", requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { status, limit = "50", offset = "0" } = req.query as Record<string, string>;
      let query = db.select().from(devis).orderBy(desc(devis.createdAt)).$dynamic();
      if (status) query = query.where(eq(devis.status, status));
      const rows = await query.limit(Number(limit)).offset(Number(offset));
      // Count total (with same filters)
      let countQ = db.select({ count: sql`count(*)` }).from(devis).$dynamic();
      if (status) countQ = countQ.where(eq(devis.status, status));
      const [{ count }] = await countQ;
      res.json({ data: rows, total: Number(count ?? 0) });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * POST /api/admin/devis
   * Créer un devis depuis le CMS admin
   */
  app.post("/api/admin/devis", requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const devisSchema = z.object({
        clientName: z.string().min(1).max(200),
        clientEmail: z.string().email().max(200),
        clientCompany: z.string().max(200).optional(),
        title: z.string().min(1).max(300),
        description: z.string().max(5000).optional(),
        items: z.array(z.object({
          label: z.string(),
          description: z.string().optional(),
          quantity: z.number().int().min(1),
          unitPrice: z.number().int().min(0),
          total: z.number().int().min(0),
        })).default([]),
        subtotal: z.number().int().min(0),
        taxRate: z.number().min(0).max(100).default(20),
        currency: z.string().max(10).default("MAD"),
        validUntil: z.string().optional().transform(v => v ? new Date(v) : undefined),
        clientId: z.number().int().optional(),
      });
      const validated = devisSchema.parse(req.body);
      const reference = await generateDevisRef();

      const taxAmount = Math.round(validated.subtotal * (validated.taxRate / 100));
      const total = validated.subtotal + taxAmount;

      const [d] = await db.insert(devis).values({
        reference,
        ...validated,
        taxAmount,
        total,
      }).returning();

      res.status(201).json(d);
    } catch (error) {
      console.error("[POST /api/admin/devis]", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * PUT /api/admin/devis/:id
   */
  app.put("/api/admin/devis/:id", requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id: _id, reference: _ref, createdAt: _c, ...updateData } = req.body;

      // Recalculer si items changent
      if (updateData.subtotal !== undefined) {
        const taxRate = updateData.taxRate ?? 20;
        updateData.taxAmount = Math.round(updateData.subtotal * (taxRate / 100));
        updateData.total = updateData.subtotal + updateData.taxAmount;
      }

      const [updated] = await db
        .update(devis)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(devis.id, Number(req.params.id)))
        .returning();

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * POST /api/admin/devis/:id/send
   * Envoyer le devis au client par email
   */
  app.post("/api/admin/devis/:id/send", requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const [d] = await db.select().from(devis).where(eq(devis.id, Number(req.params.id))).limit(1);
      if (!d) return res.status(404).json({ error: "Devis introuvable" });

      await db.update(devis).set({ status: "sent", updatedAt: new Date() }).where(eq(devis.id, d.id));

      const baseDomain = process.env.SITE_URL || (process.env.NODE_ENV === "production" ? "https://epitaphe360.ma" : "http://localhost:5000");
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) return res.status(500).json({ error: "Configuration serveur manquante" });
      const sig = crypto.createHmac("sha256", jwtSecret)
        .update(`${d.id}:${d.reference}`)
        .digest("hex");
      const devisUrl = `${baseDomain}/devis/${d.reference}?sig=${sig}`;

      sendDevisEmail(d.clientEmail, d.clientName, {
        reference: d.reference,
        title: d.title,
        total: d.total,
        currency: d.currency ?? "MAD",
        validUntil: d.validUntil ? new Date(d.validUntil).toLocaleDateString("fr-MA") : undefined,
        devisUrl,
      }).catch(e => console.error("[email] devis:", e));

      res.json({ success: true, devisUrl });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * DELETE /api/admin/devis/:id
   */
  app.delete("/api/admin/devis/:id", requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      await db.delete(devis).where(eq(devis.id, Number(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ================================================================
  // ADMIN — Plans d'abonnement (CRUD)
  // ================================================================

  app.get("/api/admin/plans", requireAuth, requireAdmin, async (_req: Request, res: Response) => {
    try {
      const plans = await db.select().from(subscriptionPlans).orderBy(subscriptionPlans.sortOrder);
      res.json({ data: plans, total: plans.length });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.post("/api/admin/plans", requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const planSchema = z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        priceMonthly: z.number().int().min(0),
        priceAnnual: z.number().int().min(0),
        currency: z.string().max(10).default("MAD"),
        features: z.any().optional(),
        maxProjects: z.number().int().min(0).optional(),
        isActive: z.boolean().default(true),
        sortOrder: z.number().int().default(0),
      });
      const data = planSchema.parse(req.body);
      const [plan] = await db.insert(subscriptionPlans).values(data).returning();
      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.put("/api/admin/plans/:id", requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { id: _id, createdAt: _c, ...rawData } = req.body;
      const updatePlanSchema = z.object({
        name: z.string().min(1).max(100).optional(),
        slug: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        priceMonthly: z.number().int().min(0).optional(),
        priceAnnual: z.number().int().min(0).optional(),
        currency: z.string().max(10).optional(),
        features: z.any().optional(),
        maxProjects: z.number().int().min(0).optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().int().optional(),
      });
      const updateData = updatePlanSchema.parse(rawData);
      const [updated] = await db.update(subscriptionPlans).set(updateData)
        .where(eq(subscriptionPlans.id, Number(req.params.id))).returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ================================================================
  // ADMIN — Paiements (lecture seule)
  // ================================================================

  app.get("/api/admin/payments", requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { type, status, limit = "50", offset = "0" } = req.query as Record<string, string>;
      let q = db.select().from(payments).orderBy(desc(payments.createdAt)).$dynamic();
      if (type) q = q.where(eq(payments.type, type));
      if (status) q = q.where(eq(payments.status, status));
      const rows = await q.limit(Number(limit)).offset(Number(offset));
      // Count total (with same filters)
      const countConditions: any[] = [];
      if (type) countConditions.push(eq(payments.type, type));
      if (status) countConditions.push(eq(payments.status, status));
      let cq = db.select({ count: sql`count(*)` }).from(payments).$dynamic();
      if (countConditions.length > 0) cq = cq.where(and(...countConditions));
      const [{ count }] = await cq;
      res.json({ data: rows, total: Number(count ?? 0) });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ================================================================
  // PAYPAL — Callbacks de retour (success + cancel)
  // ================================================================

  /**
   * GET /api/payments/paypal/success?token=ORDER_ID&PayerID=PAYER_ID
   * PayPal redirige ici après approbation. On capture le paiement et génère la facture.
   */
  app.get("/api/payments/paypal/success", async (req: Request, res: Response) => {
    try {
      const { token: orderId, PayerID } = req.query as Record<string, string>;
      if (!orderId) return res.redirect(`${process.env.APP_URL ?? ''}/paiement/echec?reason=missing_token`);

      // Retrouver le paiement en base via paypalOrderId
      const [payment] = await db.select().from(payments)
        .where(eq(payments.paypalOrderId, orderId))
        .limit(1);

      if (!payment) return res.redirect(`${process.env.APP_URL ?? ''}/paiement/echec?reason=not_found`);
      if (payment.status === 'paid') return res.redirect(`${process.env.APP_URL ?? ''}/paiement/succes?invoice=${payment.invoiceId ?? ''}`);

      // Capturer le paiement
      const capture = await capturePayPalOrder(orderId);

      if (capture.status !== 'COMPLETED') {
        await db.update(payments).set({ status: 'failed' }).where(eq(payments.id, payment.id));
        return res.redirect(`${process.env.APP_URL ?? ''}/paiement/echec?reason=capture_failed`);
      }

      // Marquer comme payé
      await db.update(payments)
        .set({ status: 'paid', paypalCaptureId: capture.captureId, updatedAt: new Date() })
        .where(eq(payments.id, payment.id));

      // Générer et envoyer la facture
      const meta = (payment.metadata as Record<string, string>) ?? {};
      const toolId = meta.toolId ?? 'inconnu';
      const email  = meta.email  ?? capture.payerEmail;
      const clientName = capture.payerName || meta.companyName || email;
      const invoiceNumber = await generateInvoiceNumber();

      const invoiceResult = await createAndSendInvoice({
        invoiceNumber,
        paymentId:        payment.id,
        scoringResultId:  payment.scoringResultId ?? undefined,
        clientEmail:      email,
        clientName:       clientName,
        clientCompany:    meta.companyName,
        toolId,
        description:      `Rapport Intelligence BMI 360™ — ${toolId.charAt(0).toUpperCase() + toolId.slice(1)}`,
        amountHT:         Math.round(payment.amount / 1.20),
        currency:         payment.currency ?? 'MAD',
      });

      // Générer le rapport IA si le paiement est lié à un scoring
      if (payment.scoringResultId) {
        try {
          const [result] = await db.select().from(scoringResults)
            .where(eq(scoringResults.id, payment.scoringResultId)).limit(1);
          if (result && result.tier !== 'intelligence') {
            const aiReport = await generateAIReport({
              toolId: result.toolId,
              companyName: result.companyName ?? undefined,
              sector: result.sector ?? undefined,
              companySize: result.companySize ?? undefined,
              globalScore: result.globalScore,
              maturityLevel: result.maturityLevel,
              pillarScores: result.pillarScores as Record<string, number>,
            });
            await db.update(scoringResults)
              .set({ tier: 'intelligence', aiReport, intelligenceUnlockedAt: new Date() })
              .where(eq(scoringResults.id, payment.scoringResultId!));
          }
        } catch (aiError) {
          console.error('[PayPal/Success] Rapport IA échoué:', aiError);
        }
      } else if (meta.plan === 'bmi360-full-annual') {
        // Plan annuel — envoyer email de confirmation
        sendMail({
          to: email,
          subject: 'Confirmation — BMI 360™ Full Annuel activé',
          html: `<h2>Votre accès BMI 360™ Full Annuel est activé !</h2><p>Bonjour,</p><p>Votre paiement de <strong>${payment.amount.toLocaleString('fr-MA')} MAD TTC</strong> a bien été reçu.</p><p>Vous avez désormais accès à l'ensemble des 7 outils Intelligence BMI 360™ pendant 12 mois.</p><p><a href="${process.env.APP_URL ?? 'https://epitaphe360.ma'}/outils">Accéder aux outils</a></p><p>Référence : <code>${meta.paymentRef ?? payment.id}</code></p><p>— L'équipe Epitaphe360</p>`,
        }).catch(e => console.error('[PayPal/Annual] Email failed:', e));
      }

      const appUrl = process.env.APP_URL ?? '';
      const returnPath = payment.scoringResultId
        ? `/paiement/succes?result=${payment.scoringResultId}&tool=${toolId}&method=paypal`
        : `/paiement/succes?invoice=${invoiceResult.invoiceId}&method=paypal`;
      return res.redirect(`${appUrl}${returnPath}`);
    } catch (error) {
      console.error('[PayPal/Success]', error);
      return res.redirect(`${process.env.APP_URL ?? ''}/paiement/echec?reason=server_error`);
    }
  });

  /**
   * GET /api/payments/paypal/cancel?token=ORDER_ID
   * PayPal redirige ici si le client annule.
   */
  app.get("/api/payments/paypal/cancel", async (req: Request, res: Response) => {
    try {
      const { token: orderId } = req.query as Record<string, string>;
      if (orderId) {
        await db.update(payments)
          .set({ status: 'cancelled', updatedAt: new Date() })
          .where(eq(payments.paypalOrderId, orderId));
      }
      return res.redirect(`${process.env.APP_URL ?? ''}/paiement/annule`);
    } catch (error) {
      console.error('[PayPal/Cancel]', error);
      return res.redirect(`${process.env.APP_URL ?? ''}/paiement/annule`);
    }
  });

  // ================================================================
  // CMI — Callback POST depuis la passerelle
  // ================================================================

  /**
   * POST /api/payments/cmi/callback
   * CMI envoie un POST avec le résultat du paiement + signature HMAC.
   */
  app.post("/api/payments/cmi/callback", async (req: Request, res: Response) => {
    try {
      const body = req.body as Record<string, string>;
      const { valid, approved, orderId: cmiOrderId, transactionId } = verifyCMICallback(body);

      if (!valid) {
        console.warn('[CMI/Callback] Signature invalide:', body);
        return res.status(400).send('FAILURE');
      }

      const [payment] = await db.select().from(payments)
        .where(eq(payments.cmiOrderId, cmiOrderId))
        .limit(1);

      if (!payment) return res.status(404).send('FAILURE');

      if (!approved) {
        await db.update(payments)
          .set({ status: 'failed', cmiTransactionId: transactionId, updatedAt: new Date() })
          .where(eq(payments.id, payment.id));
        return res.send('ACTION=POSTAUTH\nPROCCODE=1');
      }

      // Marquer comme payé
      await db.update(payments)
        .set({ status: 'paid', cmiTransactionId: transactionId, updatedAt: new Date() })
        .where(eq(payments.id, payment.id));

      // Générer et envoyer la facture
      const meta      = (payment.metadata as Record<string, string>) ?? {};
      const toolId    = meta.toolId ?? 'inconnu';
      const email     = meta.email  ?? body['BillToEmailAddress'] ?? '';
      const clientName = meta.companyName || body['BillToName'] || email;
      const invoiceNumber = await generateInvoiceNumber();

      await createAndSendInvoice({
        invoiceNumber,
        paymentId:        payment.id,
        scoringResultId:  payment.scoringResultId ?? undefined,
        clientEmail:      email,
        clientName:       clientName,
        clientCompany:    meta.companyName,
        toolId,
        description:      `Rapport Intelligence BMI 360™ — ${toolId.charAt(0).toUpperCase() + toolId.slice(1)}`,
        amountHT:         Math.round(payment.amount / 1.20),
        currency:         payment.currency ?? 'MAD',
      });

      // Générer le rapport IA si le paiement est lié à un scoring
      if (payment.scoringResultId) {
        try {
          const [result] = await db.select().from(scoringResults)
            .where(eq(scoringResults.id, payment.scoringResultId)).limit(1);
          if (result && result.tier !== 'intelligence') {
            const aiReport = await generateAIReport({
              toolId: result.toolId,
              companyName: result.companyName ?? undefined,
              sector: result.sector ?? undefined,
              companySize: result.companySize ?? undefined,
              globalScore: result.globalScore,
              maturityLevel: result.maturityLevel,
              pillarScores: result.pillarScores as Record<string, number>,
            });
            await db.update(scoringResults)
              .set({ tier: 'intelligence', aiReport, intelligenceUnlockedAt: new Date() })
              .where(eq(scoringResults.id, payment.scoringResultId!));
          }
        } catch (aiError) {
          console.error('[CMI/Callback] Rapport IA échoué:', aiError);
        }
      } else if (meta.plan === 'bmi360-full-annual') {
        // Plan annuel — envoyer email de confirmation
        sendMail({
          to: email,
          subject: 'Confirmation — BMI 360™ Full Annuel activé',
          html: `<h2>Votre accès BMI 360™ Full Annuel est activé !</h2><p>Votre paiement a bien été reçu. Vous avez désormais accès aux 7 outils Intelligence pendant 12 mois.</p><p><a href="${process.env.APP_URL ?? 'https://epitaphe360.ma'}/outils">Accéder aux outils</a></p><p>Réf : <code>${meta.paymentRef ?? payment.id}</code></p><p>— L'équipe Epitaphe360</p>`,
        }).catch(e => console.error('[CMI/Annual] Email failed:', e));
      }

      // CMI attend cette réponse spécifique pour confirmer la réception
      return res.send('ACTION=POSTAUTH\nPROCCODE=0');
    } catch (error) {
      console.error('[CMI/Callback]', error);
      return res.status(500).send('FAILURE');
    }
  });

  // ================================================================
  // ADMIN — Factures (invoices)
  // ================================================================

  /**
   * GET /api/admin/invoices — Liste toutes les factures
   */
  app.get("/api/admin/invoices", requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { status, toolId, limit = "50", offset = "0" } = req.query as Record<string, string>;
      let q = db.select({
        id:            invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        clientEmail:   invoices.clientEmail,
        clientName:    invoices.clientName,
        clientCompany: invoices.clientCompany,
        toolId:        invoices.toolId,
        description:   invoices.description,
        amountHT:      invoices.amountHT,
        tvaRate:       invoices.tvaRate,
        amountTVA:     invoices.amountTVA,
        amountTTC:     invoices.amountTTC,
        currency:      invoices.currency,
        status:        invoices.status,
        issuedAt:      invoices.issuedAt,
        paidAt:        invoices.paidAt,
        sentAt:        invoices.sentAt,
        createdAt:     invoices.createdAt,
      }).from(invoices).orderBy(desc(invoices.createdAt)).$dynamic();

      if (status) q = q.where(eq(invoices.status, status));
      if (toolId) q = q.where(eq(invoices.toolId, toolId));

      const rows = await q.limit(Number(limit)).offset(Number(offset));
      const [{ count }] = await db.select({ count: sql`count(*)` }).from(invoices);
      return res.json({ data: rows, total: Number(count ?? 0) });
    } catch (error) {
      console.error('[Admin/Invoices]', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * GET /api/admin/invoices/:id/pdf — Télécharger le PDF d'une facture
   */
  app.get("/api/admin/invoices/:id/pdf", requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

      const [invoice] = await db.select({ pdfBase64: invoices.pdfBase64, invoiceNumber: invoices.invoiceNumber })
        .from(invoices)
        .where(eq(invoices.id, id))
        .limit(1);

      if (!invoice?.pdfBase64) return res.status(404).json({ error: "PDF non trouvé" });

      const pdfBuffer = Buffer.from(invoice.pdfBase64, 'base64');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="facture-${invoice.invoiceNumber}.pdf"`);
      return res.send(pdfBuffer);
    } catch (error) {
      console.error('[Admin/Invoice/PDF]', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * PATCH /api/admin/invoices/:id/status — Mettre à jour le statut d'une facture
   */
  app.patch("/api/admin/invoices/:id/status", requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

      const parsed = z.object({ status: z.enum(['draft', 'sent', 'paid', 'cancelled']) }).safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Statut invalide" });

      const updateData: Record<string, unknown> = { status: parsed.data.status };
      if (parsed.data.status === 'paid') updateData.paidAt = new Date();

      const [updated] = await db.update(invoices).set(updateData).where(eq(invoices.id, id)).returning();
      if (!updated) return res.status(404).json({ error: "Facture non trouvée" });

      return res.json(updated);
    } catch (error) {
      console.error('[Admin/Invoice/Status]', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * GET /api/admin/invoices/stats — Statistiques de facturation
   */
  app.get("/api/admin/invoices/stats", requireAuth, requireAdmin, async (_req: Request, res: Response) => {
    try {
      const allInvoices = await db.select({
        amountHT:  invoices.amountHT,
        amountTVA: invoices.amountTVA,
        amountTTC: invoices.amountTTC,
        status:    invoices.status,
        toolId:    invoices.toolId,
        issuedAt:  invoices.issuedAt,
      }).from(invoices);

      const paid    = allInvoices.filter(i => i.status === 'paid');
      const pending = allInvoices.filter(i => i.status === 'sent');

      const sum = (arr: typeof allInvoices, key: 'amountHT' | 'amountTVA' | 'amountTTC') =>
        arr.reduce((acc, i) => acc + (i[key] ?? 0), 0);

      // Stats du mois courant
      const now     = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonth  = paid.filter(i => i.issuedAt && new Date(i.issuedAt) >= monthStart);

      return res.json({
        total:        allInvoices.length,
        paid:         paid.length,
        pending:      pending.length,
        totalHT:      sum(paid, 'amountHT'),
        totalTVA:     sum(paid, 'amountTVA'),
        totalTTC:     sum(paid, 'amountTTC'),
        monthHT:      sum(thisMonth, 'amountHT'),
        monthTVA:     sum(thisMonth, 'amountTVA'),
        monthTTC:     sum(thisMonth, 'amountTTC'),
        currency:     'MAD',
      });
    } catch (error) {
      console.error('[Admin/Invoice/Stats]', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });
}

// ─── Email helpers locaux ─────────────────────────────────────────────────────

async function sendDevisEmail(email: string, name: string, data: {
  reference: string;
  title: string;
  total: number;
  currency: string;
  validUntil?: string;
  devisUrl: string;
}) {
  const totalFormatted = (data.total / 100).toLocaleString("fr-MA") + " " + data.currency;
  await sendMail({
    to: email,
    subject: `Votre devis ${data.reference} — Epitaphe360`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:540px;margin:auto;padding:32px 24px;background:#fff;border-radius:16px;border:1px solid #e5e7eb">
        <img src="https://epitaphe360.ma/logo.png" alt="Epitaphe360" style="height:36px;margin-bottom:24px" />
        <h2 style="color:#111;font-size:20px;font-weight:700;margin-bottom:8px">Bonjour ${name},</h2>
        <p style="color:#555;line-height:1.6">Votre devis <strong>${data.reference}</strong> pour <em>${data.title}</em> est prêt.</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:24px 0;text-align:center">
          <p style="font-size:13px;color:#888;margin-bottom:4px">Montant total TTC</p>
          <p style="font-size:32px;font-weight:800;color:#d1295a;margin:0">${totalFormatted}</p>
          ${data.validUntil ? `<p style="font-size:12px;color:#999;margin-top:8px">Valable jusqu'au ${data.validUntil}</p>` : ""}
        </div>
        <div style="text-align:center;margin:28px 0">
          <a href="${data.devisUrl}" style="background:#d1295a;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
            Consulter et accepter mon devis →
          </a>
        </div>
        <p style="font-size:12px;color:#aaa;margin-top:24px;text-align:center">Epitaphe360 · <a href="https://epitaphe360.ma" style="color:#aaa">epitaphe360.ma</a></p>
      </div>
    `,
  });
}
