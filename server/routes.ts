import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { sendContactConfirmation, sendContactNotificationToAdmin } from "./lib/email";
import { registerAdminRoutes } from "./admin-routes";
import { registerPublicApiRoutes } from "./public-api-routes";
import { db } from "./db";
import { pages, articles, events, categories, media, services, settings, clientReferences, caseStudies, testimonials, resources } from "@shared/schema";
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

  // ─── Contact ────────────────────────────────────────────────────────────────
  app.post("/api/contact", contactLimiter, async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      Promise.all([
        sendContactConfirmation(validatedData.email, validatedData.name ?? ""),
        sendContactNotificationToAdmin({
          name: validatedData.name ?? "",
          email: validatedData.email,
          subject: "Contact",
          message: validatedData.message,
        }),
      ]).catch((e) => console.error("[email] contact:", e));
      res.status(201).json({ success: true, id: message.id });
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

  // ─── Pages ──────────────────────────────────────────────────────────────────
  app.get("/api/pages", async (req, res) => {
    try {
      const result = await db.select().from(pages);
      res.json({ data: result, total: result.length });
    } catch (error) {
      console.error("[GET /api/pages]", error);
      res.status(500).json({ error: 'Erreur lors de la récupération des pages' });
    }
  });

  app.get("/api/pages/slug/:slug", async (req, res) => {
    try {
      const result = await db.select().from(pages).where(eq(pages.slug, req.params.slug)).limit(1);
      if (result.length === 0) return res.status(404).json({ error: 'Page non trouvée' });
      res.json(result[0]);
    } catch (error) {
      console.error("[GET /api/pages/slug/:slug]", error);
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

  // ─── Events ─────────────────────────────────────────────────────────────────
  app.get("/api/events", async (req, res) => {
    try {
      const { page, pageSize, offset } = parsePagination(req.query as Record<string, unknown>);

      const [rows, countResult] = await Promise.all([
        db.select().from(events).limit(pageSize).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(events),
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
      const obj: Record<string, string | null> = {};
      for (const row of result) { obj[row.key] = row.value; }
      res.json(obj);
    } catch (error) {
      console.error("[GET /api/settings]", error);
      res.status(500).json({ error: 'Erreur paramètres' });
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
      res.json(paginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      console.error("[GET /api/references/public]", error);
      res.status(500).json({ error: 'Erreur références' });
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
      res.json(paginatedResponse(rows, total, page, pageSize));
    } catch (error) {
      console.error("[GET /api/case-studies/public]", error);
      res.status(500).json({ error: 'Erreur études de cas' });
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
      res.json({ ...result[0], testimonial: testimonialResult[0] || null });
    } catch (error) {
      console.error("[GET /api/case-studies/:slug]", error);
      res.status(500).json({ error: 'Erreur étude de cas' });
    }
  });

  // ─── Ressources publiques ───────────────────────────────────────────────────
  app.get("/api/resources/public", async (req, res) => {
    try {
      const result = await db.select().from(resources)
        .where(and(eq(resources.isPublished, true)))
        .orderBy(resources.sortOrder, desc(resources.createdAt));
      res.json({ data: result, total: result.length });
    } catch (error) {
      console.error("[GET /api/resources/public]", error);
      res.status(500).json({ error: 'Erreur ressources' });
    }
  });

  // Register CMS admin routes
  registerAdminRoutes(app);

  // Register public API routes (newsletter, project-brief, sitemap, robots, rss)
  registerPublicApiRoutes(app);
  return httpServer;
}
