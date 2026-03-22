import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { registerAdminRoutes } from "./admin-routes";
import { registerPublicApiRoutes } from "./public-api-routes";
import { db } from "./db";
import { pages, articles, events, categories, media, services, settings, clientReferences } from "@shared/schema";
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

  // Articles
  app.get("/api/articles", async (req, res) => {
    try {
      const result = await db.select().from(articles);
      res.json({ data: result, total: result.length });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
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

  // Register CMS admin routes
  registerAdminRoutes(app);

  // Register public API routes (newsletter, project-brief, sitemap, robots, rss)
  registerPublicApiRoutes(app);

  return httpServer;
}
