import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { sendContactConfirmation, sendContactNotificationToAdmin } from "./lib/email";
import { registerAdminRoutes } from "./admin-routes";
import { registerPublicApiRoutes } from "./public-api-routes";
import { db } from "./db";
import { pages, articles, events, categories, media, services, settings, clientReferences, caseStudies, testimonials, resources } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { requireAuth, requireAdmin } from "./lib/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      // Emails asynchrones — on ne bloque pas la réponse
      Promise.all([
        sendContactConfirmation(validatedData.email, validatedData.name ?? ""),
        sendContactNotificationToAdmin({
          name: validatedData.name ?? "",
          email: validatedData.email,
          subject: (validatedData as any).subject ?? "Contact",
          message: (validatedData as any).message ?? "",
        }),
      ]).catch((e) => console.error("[email] contact:", e));
      res.status(201).json({ success: true, id: message.id });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ error: "Invalid form data" });
    }
  });

  app.get("/api/contact", requireAuth, requireAdmin, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Pages
  app.get("/api/pages", async (req, res) => {
    try {
      const result = await db.select().from(pages);
      res.json({ data: result, total: result.length });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des pages' });
    }
  });

  // Pages by slug
  app.get("/api/pages/slug/:slug", async (req, res) => {
    try {
      const result = await db.select().from(pages).where(eq(pages.slug, req.params.slug)).limit(1);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Page non trouvée' });
      }
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de la page' });
    }
  });

  // Articles (liste publique + filtre status)
  app.get("/api/articles", async (req, res) => {
    try {
      const { status, limit } = req.query;
      let query = db.select().from(articles).orderBy(desc(articles.publishedAt));
      if (status) {
        query = db.select().from(articles)
          .where(eq(articles.status, status as string))
          .orderBy(desc(articles.publishedAt)) as typeof query;
      }
      if (limit) query = query.limit(parseInt(limit as string, 10)) as typeof query;
      const result = await query;
      res.json({ data: result, total: result.length });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
    }
  });

  // Article par slug (public)
  app.get("/api/articles/slug/:slug", async (req, res) => {
    try {
      const [article] = await db.select().from(articles)
        .where(eq(articles.slug, req.params.slug))
        .limit(1);
      if (!article) return res.status(404).json({ error: 'Article non trouvé' });
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: 'Erreur article' });
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const result = await db.select().from(events);
      res.json({ data: result, total: result.length });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const result = await db.select().from(categories);
      res.json({ data: result, total: result.length });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    }
  });

  // Media
  app.get("/api/media", async (req, res) => {
    try {
      const result = await db.select().from(media);
      res.json({ data: result, total: result.length });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des fichiers média' });
    }
  });

  // Services (public)
  app.get("/api/services", async (req, res) => {
    try {
      const result = await db.select().from(services).where(eq(services.status, 'PUBLISHED'));
      res.json({ data: result, total: result.length });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des services' });
    }
  });

  app.get("/api/services/slug/:slug", async (req, res) => {
    try {
      const result = await db.select().from(services).where(eq(services.slug, req.params.slug)).limit(1);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Service non trouvé' });
      }
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération du service' });
    }
  });

  // Settings publics (isPublic = true)
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
      res.status(500).json({ error: 'Erreur paramètres' });
    }
  });

  // Références clients publiques (logos visibles sur le site)
  app.get("/api/references/public", async (req, res) => {
    try {
      const result = await db.select().from(clientReferences)
        .where(eq(clientReferences.isPublished, true))
        .orderBy(clientReferences.order);
      res.json({ data: result, total: result.length });
    } catch (error) {
      res.status(500).json({ error: 'Erreur références' });
    }
  });

  // Études de cas publiques (liste)
  app.get("/api/case-studies/public", async (req, res) => {
    try {
      const result = await db.select().from(caseStudies)
        .where(eq(caseStudies.status, 'PUBLISHED'))
        .orderBy(desc(caseStudies.publishedAt));
      res.json({ data: result, total: result.length });
    } catch (error) {
      res.status(500).json({ error: 'Erreur études de cas' });
    }
  });

  // Étude de cas par slug (detail)
  app.get("/api/case-studies/:slug", async (req, res) => {
    try {
      const result = await db.select().from(caseStudies)
        .where(eq(caseStudies.slug, req.params.slug))
        .limit(1);
      if (result.length === 0) {
        return res.status(404).json({ error: 'Étude de cas non trouvée' });
      }
      // Récupérer le témoignage associé si existant
      const testimonialResult = await db.select().from(testimonials)
        .where(eq(testimonials.caseStudyId, result[0].id))
        .limit(1);
      res.json({ ...result[0], testimonial: testimonialResult[0] || null });
    } catch (error) {
      res.status(500).json({ error: 'Erreur étude de cas' });
    }
  });

  // Ressources publiques (accessLevel: public ou lead)
  app.get("/api/resources/public", async (req, res) => {
    try {
      const result = await db.select().from(resources)
        .where(and(eq(resources.isPublished, true)))
        .orderBy(resources.sortOrder, desc(resources.createdAt));
      res.json({ data: result, total: result.length });
    } catch (error) {
      res.status(500).json({ error: 'Erreur ressources' });
    }
  });

  // Register CMS admin routes
  registerAdminRoutes(app);

  // Register public API routes (newsletter, project-brief, sitemap, robots, rss)
  registerPublicApiRoutes(app);
  return httpServer;
}
