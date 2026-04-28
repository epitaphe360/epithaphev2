import type { Express } from "express";
import crypto from "crypto";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertScoringResultSchema, scoringResults } from "@shared/schema";
import { sendContactNotification, sendMail } from "./lib/email";
import { registerAdminRoutes } from "./admin-routes";
import { registerScoringRoutes } from './scoring-routes';
import { registerClientPortalRoutes } from './client-portal-routes';
import { registerDevRoutes } from './dev-routes';
import { registerPublicApiRoutes } from "./public-api-routes";
import { registerPaymentRoutes } from "./payment-routes";
import { db } from "./db";
import { pages, articles, events, categories, media, services, settings, clientReferences, caseStudies, testimonials, resources, clientAccounts, clientProjects, passwordResetTokens } from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { requireAuth, requireAdmin } from "./lib/auth";
import rateLimit from "express-rate-limit";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de messages envoyés. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// CDC — Rate limiters pour endpoints sensibles
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const briefLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de briefs envoyés. Réessayez dans 1 heure.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const toolsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Trop de requêtes. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const leadMagnetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de téléchargements. Réessayez dans 1 heure.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Helpers pagination ──────────────────────────────────────────────────────
function parsePagination(query: Record<string, unknown>) {
  const page     = Math.max(1, parseInt(query.page as string || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(query.limit as string || '20', 10)));
  const offset   = (page - 1) * pageSize;
  return { page, pageSize, offset };
}

function paginatedResponse<T>(data: T[], total: number, page: number, pageSize: number) {
  return {
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: page * pageSize < total,
      hasPrevPage: page > 1,
    },
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ─── Redirections 301 — URLs anciennes epitaphe.ma vers nouvelles URLs v2 ──
  const REDIRECTS_301: Record<string, string> = {
    "/agence-de-communication-360":        "/a-propos",
    "/agence-de-communication-360/":       "/a-propos",
    "/communication-interne":              "/nos-poles/com-interne",
    "/communication-interne/":             "/nos-poles/com-interne",
    "/communication-evenementielle":       "/evenements",
    "/communication-evenementielle/":      "/evenements",
    "/evenementiel":                       "/evenements",
    "/evenementiel/":                      "/evenements",
    "/communication-corporate":            "/architecture-de-marque",
    "/communication-corporate/":          "/architecture-de-marque",
    "/communication-globale":             "/architecture-de-marque",
    "/communication-globale/":            "/architecture-de-marque",
    "/communication-financiere":          "/nos-poles/com-rse",
    "/communication-financiere/":         "/nos-poles/com-rse",
    "/communication-produits":            "/architecture-de-marque",
    "/communication-produits/":           "/architecture-de-marque",
    "/communication-digitale":            "/architecture-de-marque",
    "/communication-digitale/":           "/architecture-de-marque",
    "/digital":                           "/architecture-de-marque",
    "/digital/":                          "/architecture-de-marque",
    "/contents":                          "/ressources",
    "/contents/":                         "/ressources",
    "/industrie-publicitaire":            "/la-fabrique",
    "/industrie-publicitaire/":           "/la-fabrique",
    "/nos-metiers":                       "/",
    "/nos-metiers/":                      "/",
    "/nos-solutions":                     "/outils",
    "/nos-solutions/":                    "/outils",
    "/nos-references":                    "/nos-references",
    "/politique-de-confidentialite":      "/politique-confidentialite",
    "/politique-de-confidentialite/":     "/politique-confidentialite",
    "/conditions-generales-de-vente":     "/mentions-legales",
    "/conditions-generales-de-vente/":    "/mentions-legales",
  };

  app.use((req, res, next) => {
    const target = REDIRECTS_301[req.path];
    if (target) return res.redirect(301, target);
    next();
  });

  // ─── Contact ────────────────────────────────────────────────────────────────
  app.post("/api/contact", contactLimiter, async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json({ success: true, id: message.id });
      sendContactNotification({
        adminEmail: process.env.SMTP_USER ?? "admin@epitaph.ma",
        fromName: `${validatedData.firstName} ${validatedData.lastName}`,
        fromEmail: validatedData.email,
        company: validatedData.company,
        message: validatedData.message,
      }).catch(e => console.error("[EMAIL] Contact notification error:", e));
    } catch (error) {
      console.error("[POST /api/contact]", error);
      res.status(400).json({ error: "Données de formulaire invalides" });
    }
  });

  app.get("/api/contact", requireAuth, requireAdmin, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("[GET /api/contact]", error);
      res.status(500).json({ error: "Erreur lors de la récupération des messages" });
    }
  });

  // ─── Pages (publiques — PUBLISHED uniquement) ──────────────────────────────
  app.get("/api/pages", async (req, res) => {
    try {
      const { page, pageSize, offset } = parsePagination(req.query as Record<string, unknown>);

      const [rows, countResult] = await Promise.all([
        db.select().from(pages)
          .where(eq(pages.status, 'PUBLISHED'))
          .limit(pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(pages)
          .where(eq(pages.status, 'PUBLISHED')),
      ]);

      const total = Number(countResult[0]?.count ?? 0);
      res.json(paginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      console.error("[GET /api/pages]", error);
      res.status(500).json({ error: 'Erreur lors de la récupération des pages' });
    }
  });

  app.get("/api/pages/slug/:slug", async (req, res) => {
    try {
      const result = await db.select().from(pages)
        .where(and(eq(pages.slug, req.params.slug), eq(pages.status, 'PUBLISHED')))
        .limit(1);
      if (result.length === 0) return res.status(404).json({ error: 'Page non trouvée' });
      res.json(result[0]);
    } catch (error) {
      console.error("[GET /api/pages/slug/:slug]", error);
      res.status(500).json({ error: 'Erreur lors de la récupération de la page' });
    }
  });

  // Support slugs with slashes (e.g. "evenements/conventions-kickoffs")
  app.get("/api/pages/by-slug", async (req, res) => {
    try {
      const slug = req.query.slug as string;
      if (!slug) return res.status(400).json({ error: 'Paramètre slug requis' });
      const result = await db.select().from(pages)
        .where(and(eq(pages.slug, slug), eq(pages.status, 'PUBLISHED')))
        .limit(1);
      if (result.length === 0) return res.status(404).json({ error: 'Page non trouvée' });
      res.json(result[0]);
    } catch (error) {
      console.error("[GET /api/pages/by-slug]", error);
      res.status(500).json({ error: 'Erreur lors de la récupération de la page' });
    }
  });

  // ─── Articles (publics — PUBLISHED uniquement par défaut) ───────────────────
  app.get("/api/articles", async (req, res) => {
    try {
      const { status } = req.query;
      const { page, pageSize, offset } = parsePagination(req.query as Record<string, unknown>);
      const effectiveStatus = (status as string) || 'PUBLISHED';

      const [rows, countResult] = await Promise.all([
        db.select().from(articles)
          .where(eq(articles.status, effectiveStatus))
          .orderBy(desc(articles.publishedAt))
          .limit(pageSize)
          .offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(articles)
          .where(eq(articles.status, effectiveStatus)),
      ]);

      const total = Number(countResult[0]?.count ?? 0);
      res.json(paginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      console.error("[GET /api/articles]", error);
      res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
    }
  });

  app.get("/api/articles/slug/:slug", async (req, res) => {
    try {
      const [article] = await db.select().from(articles)
        .where(and(eq(articles.slug, req.params.slug), eq(articles.status, 'PUBLISHED')))
        .limit(1);
      if (!article) return res.status(404).json({ error: 'Article non trouvé' });
      res.json(article);
    } catch (error) {
      console.error("[GET /api/articles/slug/:slug]", error);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' });
    }
  });

  // ─── Events (publics — PUBLISHED uniquement) ───────────────────────────────
  app.get("/api/events", async (req, res) => {
    try {
      const { page, pageSize, offset } = parsePagination(req.query as Record<string, unknown>);

      const [rows, countResult] = await Promise.all([
        db.select().from(events)
          .where(eq(events.status, 'PUBLISHED'))
          .orderBy(desc(events.startDate))
          .limit(pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(events)
          .where(eq(events.status, 'PUBLISHED')),
      ]);

      const total = Number(countResult[0]?.count ?? 0);
      res.json(paginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      console.error("[GET /api/events]", error);
      res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
    }
  });

  // ─── Categories ─────────────────────────────────────────────────────────────
  app.get("/api/categories", async (req, res) => {
    try {
      const result = await db.select().from(categories);
      res.json({ data: result, total: result.length });
    } catch (error) {
      console.error("[GET /api/categories]", error);
      res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    }
  });

  // ─── Media (protégé — admin uniquement) ────────────────────────────────────
  app.get("/api/media", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { page, pageSize, offset } = parsePagination(req.query as Record<string, unknown>);

      const [rows, countResult] = await Promise.all([
        db.select().from(media).limit(pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(media),
      ]);

      const total = Number(countResult[0]?.count ?? 0);
      res.json(paginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      console.error("[GET /api/media]", error);
      res.status(500).json({ error: 'Erreur lors de la récupération des fichiers média' });
    }
  });

  // ─── Services (publics — PUBLISHED uniquement) ──────────────────────────────
  app.get("/api/services", async (req, res) => {
    try {
      const { page, pageSize, offset } = parsePagination(req.query as Record<string, unknown>);

      const [rows, countResult] = await Promise.all([
        db.select().from(services)
          .where(eq(services.status, 'PUBLISHED'))
          .limit(pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(services)
          .where(eq(services.status, 'PUBLISHED')),
      ]);

      const total = Number(countResult[0]?.count ?? 0);
      res.json(paginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      console.error("[GET /api/services]", error);
      res.status(500).json({ error: 'Erreur lors de la récupération des services' });
    }
  });

  app.get("/api/services/slug/:slug", async (req, res) => {
    try {
      const result = await db.select().from(services)
        .where(and(eq(services.slug, req.params.slug), eq(services.status, 'PUBLISHED')))
        .limit(1);
      if (result.length === 0) return res.status(404).json({ error: 'Service non trouvé' });
      res.json(result[0]);
    } catch (error) {
      console.error("[GET /api/services/slug/:slug]", error);
      res.status(500).json({ error: 'Erreur lors de la récupération du service' });
    }
  });

  // ─── Settings publics ───────────────────────────────────────────────────────
  app.get("/api/settings", async (req, res) => {
    try {
      const { group } = req.query;
      let query = db.select().from(settings).where(eq(settings.isPublic, true));
      if (group) {
        query = db.select().from(settings).where(
          and(eq(settings.isPublic, true), eq(settings.group, group as string))
        );
      }
      const result = await query;
      const obj: Record<string, any> = {};
      for (const row of result) { obj[row.key] = row.value; }
      res.json(obj);
    } catch (error) {
      const err = error as any;
      const code = err?.code;
      const msg = err?.message || '';
      // Détection robuste des erreurs réseau/DB
      if (code === 'ENOTFOUND' || code === 'ECONNREFUSED' || msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED')) {
        // DB inaccessible en dev local — retourner des paramètres par défaut
        return res.status(200).json({ siteName: 'Epitaphe 360', mode: 'dev' });
      }
      // Autres erreurs
      return res.status(200).json({ siteName: 'Epitaphe 360', mode: 'dev' });
    }
  });

  // ─── Références publiques ───────────────────────────────────────────────────
  app.get("/api/references/public", async (req, res) => {
    try {
      const { page, pageSize, offset } = parsePagination(req.query as Record<string, unknown>);

      const [rows, countResult] = await Promise.all([
        db.select().from(clientReferences)
          .where(eq(clientReferences.isPublished, true))
          .orderBy(clientReferences.order)
          .limit(pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(clientReferences)
          .where(eq(clientReferences.isPublished, true)),
      ]);

      const total = Number(countResult[0]?.count ?? 0);
      res.status(200).json(paginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      const err = error as any;
      const code = err?.code;
      const msg = err?.message || '';
      if (code === 'ENOTFOUND' || code === 'ECONNREFUSED' || msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED')) {
        return res.status(200).json(paginatedResponse([], 0, 1, 10));
      }
      // Toujours retourner 200 même en cas d'erreur
      return res.status(200).json(paginatedResponse([], 0, 1, 10));
    }
  });

  // ─── Études de cas publiques ────────────────────────────────────────────────
  app.get("/api/case-studies/public", async (req, res) => {
    try {
      const { page, pageSize, offset } = parsePagination(req.query as Record<string, unknown>);

      const [rows, countResult] = await Promise.all([
        db.select().from(caseStudies)
          .where(eq(caseStudies.status, 'PUBLISHED'))
          .orderBy(desc(caseStudies.publishedAt))
          .limit(pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(caseStudies)
          .where(eq(caseStudies.status, 'PUBLISHED')),
      ]);

      const total = Number(countResult[0]?.count ?? 0);
      res.status(200).json(paginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      const err = error as any;
      const code = err?.code;
      const msg = err?.message || '';
      if (code === 'ENOTFOUND' || code === 'ECONNREFUSED' || msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED')) {
        return res.status(200).json(paginatedResponse([], 0, 1, 10));
      }
      return res.status(200).json(paginatedResponse([], 0, 1, 10));
    }
  });

  app.get("/api/case-studies/:slug", async (req, res) => {
    try {
      const result = await db.select().from(caseStudies)
        .where(and(eq(caseStudies.slug, req.params.slug), eq(caseStudies.status, 'PUBLISHED')))
        .limit(1);
      if (result.length === 0) return res.status(404).json({ error: 'Étude de cas non trouvée' });
      const testimonialResult = await db.select().from(testimonials)
        .where(eq(testimonials.caseStudyId, result[0].id))
        .limit(1);
      res.status(200).json({ ...result[0], testimonial: testimonialResult[0] || null });
    } catch (error) {
      const err = error as any;
      const code = err?.code;
      const msg = err?.message || '';
      if (code === 'ENOTFOUND' || code === 'ECONNREFUSED' || msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED')) {
        return res.status(404).json({ error: 'Étude de cas non trouvée' });
      }
      return res.status(404).json({ error: 'Étude de cas non trouvée' });
    }
  });

  // ─── Ressources publiques ───────────────────────────────────────────────────
  app.get("/api/resources/public", async (req, res) => {
    try {
      const result = await db.select().from(resources)
        .where(and(eq(resources.isPublished, true)))
        .orderBy(resources.sortOrder, desc(resources.createdAt));
      res.status(200).json({ data: result, total: result.length });
    } catch (error) {
      const err = error as any;
      const code = err?.code;
      const msg = err?.message || '';
      if (code === 'ENOTFOUND' || code === 'ECONNREFUSED' || msg.includes('ENOTFOUND') || msg.includes('ECONNREFUSED')) {
        return res.status(200).json({ data: [], total: 0 });
      }
      return res.status(200).json({ data: [], total: 0 });
    }
  });

  // ─── BMI 360™ Scoring — persistance résultats ──────────────────────────────

  /** POST /api/leads/capture - Capture un lead depuis l'Email Gate et crée un compe client */
  app.post("/api/leads/capture", toolsLimiter, async (req, res) => {
    try {
      const { email, name, sourceTool, companyName } = req.body;
      if (!email || !name) {
        return res.status(400).json({ error: "Email et Nom requis" });
      }

      // 1. Check if client account exists
      const [existing] = await db.select().from(clientAccounts).where(eq(clientAccounts.email, email)).limit(1);

      let clientId;
      
      if (!existing) {
        // Create new client account (Lead status essentially)
        const [newClient] = await db.insert(clientAccounts).values({
          email,
          name,
          company: companyName || "À définir",
          passwordHash: "pending_invite", // Not usable until they set it via magic link
          isActive: false // Will be activated when they confirm email
        }).returning({ id: clientAccounts.id });
        clientId = newClient.id;

        // Auto-create a project stub to show in their dashboard
        await db.insert(clientProjects).values({
          clientId,
          title: `Diagnostic ${sourceTool || 'Epitaphe360'}`, // e.g. "Diagnostic CommPulse"
          type: 'Audit',
          status: 'en_cours',
          progress: 10,
          description: `Analyse initiale et restitution du diagnostic en ligne.`
        });
      } else {
        clientId = existing.id;
      }

      // Generate secure magic link token — random nonce stored in DB with 24h expiry
      const baseDomain = process.env.SITE_URL || (process.env.NODE_ENV === "production" ? "https://epitaphe360.ma" : "http://localhost:5000");
      const magicToken = crypto.randomBytes(48).toString("hex");
      const magicExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

      // Invalider les anciens magic tokens pour cet email
      await db.delete(passwordResetTokens)
        .where(and(eq(passwordResetTokens.email, email.toLowerCase()), eq(passwordResetTokens.accountType, "magic")));

      await db.insert(passwordResetTokens).values({
        token: magicToken, email: email.toLowerCase(), accountType: "magic", expiresAt: magicExpiry,
      });

      const magicLinkUrl = `${baseDomain}/espace-client?login_hint=${encodeURIComponent(email)}&magic_token=${magicToken}`;

      // Background Email Sending
      sendMail({
        to: email,
        subject: `Votre score ${sourceTool} — Epitaphe 360`,
        html: `<p>Bonjour ${name},</p><p>Merci d'avoir utilisé notre outil <strong>${sourceTool}</strong>.</p><p><a href="${magicLinkUrl}">Accéder à votre espace client</a></p>`,
      }).catch(e => console.error("Erreur envoi email scoring:", e));

      res.status(200).json({ success: true, clientId, message: "Lead capturé et compte préparé" });
    } catch (error) {
      console.error("[POST /api/leads/capture]", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /** POST /api/scoring/save — Sauvegarder un résultat de scoring */
  app.post("/api/scoring/save", toolsLimiter, async (req, res) => {
    try {
      const parsed = insertScoringResultSchema.safeParse({
        ...req.body,
        userAgent: req.headers["user-agent"]?.slice(0, 500) ?? null,
      });

      if (!parsed.success) {
        return res.status(400).json({ error: "Données invalides", details: parsed.error.flatten() });
      }

      const [saved] = await db.insert(scoringResults).values(parsed.data as any).returning({ id: scoringResults.id });
      res.status(201).json({ id: saved.id });
    } catch (error) {
      console.error("[POST /api/scoring/save]", error);
      res.status(500).json({ error: "Erreur lors de la sauvegarde" });
    }
  });

  /** GET /api/scoring/stats — Statistiques publiques anonymisées par outil */
  app.get("/api/scoring/stats/:toolId", toolsLimiter, async (req, res) => {
    try {
      const { toolId } = req.params;
      const allowed = ["commpulse", "talentprint", "impacttrace", "safesignal", "eventimpact", "spacescore", "finnarrative"];
      if (!allowed.includes(toolId)) {
        return res.status(400).json({ error: "toolId invalide" });
      }

      const rows = await db
        .select({
          avgScore: sql<number>`round(avg(${scoringResults.globalScore}), 0)`,
          count: sql<number>`count(*)`,
        })
        .from(scoringResults)
        .where(eq(scoringResults.toolId, toolId));

      res.json({ toolId, avgScore: rows[0]?.avgScore ?? 0, count: rows[0]?.count ?? 0 });
    } catch (error) {
      console.error("[GET /api/scoring/stats]", error);
      res.status(500).json({ error: "Erreur stats" });
    }
  });

  // Register CMS admin routes
  registerAdminRoutes(app);

  // Register public API routes (newsletter, project-brief, sitemap, robots, rss)
  registerPublicApiRoutes(app);
  registerScoringRoutes(app);
  registerClientPortalRoutes(app);
  registerDevRoutes(app);
  registerPaymentRoutes(app);
  return httpServer;
}



