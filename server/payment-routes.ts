/**
 * Routes paiement Epitaphe360
 * - Type 1 : Devis (analyse + plan d'action) → paiement à la carte
 * - Type 2 : Abonnements plateforme (Starter / Pro / Expert)
 *
 * Architecture Stripe-ready : toutes les routes sont préparées pour
 * l'intégration Stripe. En attendant la clé Stripe, elles fonctionnent
 * en mode "local" (mise à jour BDD directe, email confirmation).
 */
import type { Express, Request, Response } from "express";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import {
  subscriptionPlans,
  clientSubscriptions,
  devis,
  payments,
  clientAccounts,
} from "@shared/schema";
import { requireClientAuth } from "./public-api-routes";
import type { ClientAuthRequest } from "./public-api-routes";
import { sendMail } from "./lib/email";
import { requireAuth, requireAdmin } from "./lib/auth";
import rateLimit from "express-rate-limit";
import crypto from "crypto";

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
      const clientId = (req as any).clientId as number;
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
      const clientId = (req as any).clientId as number;
      const { planSlug, billingCycle = "monthly" } = req.body as { planSlug: string; billingCycle?: string };

      if (!planSlug) {
        return res.status(400).json({ error: "planSlug requis" });
      }

      const [plan] = await db
        .select()
        .from(subscriptionPlans)
        .where(and(eq(subscriptionPlans.slug, planSlug), eq(subscriptionPlans.isActive, true)))
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
      if (billingCycle === "annual") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      const amount = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;

      // Créer le nouvel abonnement
      const [newSub] = await db
        .insert(clientSubscriptions)
        .values({
          clientId,
          planId: plan.id,
          status: "active",
          billingCycle,
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
          html: `<p>Bonjour ${account.name},</p><p>Votre abonnement <strong>${plan.name}</strong> (${amount / 100} ${plan.currency ?? "MAD"}/${billingCycle}) a bien été activé.</p><p>Merci de votre confiance !</p>`,
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
      const clientId = (req as any).clientId as number;
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
      const clientId = (req as any).clientId as number;
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

      // Vérifier la signature HMAC
      const secret = process.env.JWT_SECRET || "dev-secret";
      const expectedSig = crypto.createHmac("sha256", secret)
        .update(`${d.id}:${d.reference}`)
        .digest("hex");
      if (sig.length !== expectedSig.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
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
      const [d] = await db.select().from(devis).where(eq(devis.reference, req.params.reference)).limit(1);
      if (!d) return res.status(404).json({ error: "Devis introuvable" });
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
  app.post("/api/devis/:reference/refuse", async (req: Request, res: Response) => {
    try {
      const [d] = await db.select().from(devis).where(eq(devis.reference, req.params.reference)).limit(1);
      if (!d) return res.status(404).json({ error: "Devis introuvable" });
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
  app.get("/api/admin/devis", requireAuth as any, requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const { status, limit = "50", offset = "0" } = req.query as Record<string, string>;
      let query = db.select().from(devis).orderBy(desc(devis.createdAt)).$dynamic();
      if (status) query = query.where(eq(devis.status, status));
      const rows = await query.limit(Number(limit)).offset(Number(offset));
      res.json({ data: rows, total: rows.length });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * POST /api/admin/devis
   * Créer un devis depuis le CMS admin
   */
  app.post("/api/admin/devis", requireAuth as any, requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const reference = await generateDevisRef();
      const { items = [], subtotal, taxRate = 20, ...rest } = req.body;

      const taxAmount = Math.round(subtotal * (taxRate / 100));
      const total = subtotal + taxAmount;

      const [d] = await db.insert(devis).values({
        reference,
        ...rest,
        items,
        subtotal,
        taxRate,
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
  app.put("/api/admin/devis/:id", requireAuth as any, requireAdmin as any, async (req: Request, res: Response) => {
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
  app.post("/api/admin/devis/:id/send", requireAuth as any, requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const [d] = await db.select().from(devis).where(eq(devis.id, Number(req.params.id))).limit(1);
      if (!d) return res.status(404).json({ error: "Devis introuvable" });

      await db.update(devis).set({ status: "sent", updatedAt: new Date() }).where(eq(devis.id, d.id));

      const baseDomain = process.env.SITE_URL || (process.env.NODE_ENV === "production" ? "https://epitaphe360.ma" : "http://localhost:5000");
      const sig = crypto.createHmac("sha256", process.env.JWT_SECRET || "dev-secret")
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
  app.delete("/api/admin/devis/:id", requireAuth as any, requireAdmin as any, async (req: Request, res: Response) => {
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

  app.get("/api/admin/plans", requireAuth as any, requireAdmin as any, async (_req: Request, res: Response) => {
    try {
      const plans = await db.select().from(subscriptionPlans).orderBy(subscriptionPlans.sortOrder);
      res.json({ data: plans, total: plans.length });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.post("/api/admin/plans", requireAuth as any, requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const [plan] = await db.insert(subscriptionPlans).values(req.body).returning();
      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.put("/api/admin/plans/:id", requireAuth as any, requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const { id: _id, createdAt: _c, ...updateData } = req.body;
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

  app.get("/api/admin/payments", requireAuth as any, requireAdmin as any, async (req: Request, res: Response) => {
    try {
      const { type, status, limit = "50", offset = "0" } = req.query as Record<string, string>;
      let q = db.select().from(payments).orderBy(desc(payments.createdAt)).$dynamic();
      if (type) q = q.where(eq(payments.type, type));
      if (status) q = q.where(eq(payments.status, status));
      const rows = await q.limit(Number(limit)).offset(Number(offset));
      res.json({ data: rows, total: rows.length });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
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
