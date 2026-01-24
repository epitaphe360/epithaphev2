import { Router } from "express";
import type { Express } from "express";
import { db } from "./db";
import { pages } from "@shared/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "./lib/auth";

interface GrapesPage {
  id: string;
  name: string;
  path: string;
  html: string;
  css: string;
  status: "draft" | "published";
  lastModified: string;
}

/**
 * Convert database page to GrapesJS format
 */
function pageToGrapes(page: any): GrapesPage {
  const grapesData = (page.sections as any)?.grapesjs || {};

  return {
    id: page.id,
    name: page.title,
    path: page.slug,
    html: grapesData.html || page.content || "",
    css: grapesData.css || "",
    status: page.status === 'PUBLISHED' ? 'published' : 'draft',
    lastModified: page.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

/**
 * Convert GrapesJS format to database page
 */
function grapesToPage(grapesPage: Partial<GrapesPage>, existingSections?: any) {
  const sections = existingSections || {};

  return {
    id: grapesPage.id || '',
    title: grapesPage.name || '',
    slug: grapesPage.path || '',
    content: grapesPage.html || '',
    status: grapesPage.status === 'published' ? 'PUBLISHED' : 'DRAFT',
    template: 'GRAPES_JS',
    sections: {
      ...sections,
      grapesjs: {
        html: grapesPage.html || "",
        css: grapesPage.css || "",
        components: grapesPage.html || "",
      }
    },
    publishedAt: grapesPage.status === 'published' ? new Date() : null,
  };
}

export function registerGrapesRoutes(app: Express) {
  const router = Router();

  // Lister toutes les pages GrapesJS
  router.get("/pages", requireAuth, async (req, res) => {
    try {
      const allPages = await db
        .select()
        .from(pages)
        .where(eq(pages.template, 'GRAPES_JS'));

      const grapesPages = allPages.map(pageToGrapes);
      res.json(grapesPages);
    } catch (error) {
      console.error("Error loading GrapesJS pages:", error);
      res.status(500).json({ error: "Erreur lors du chargement des pages" });
    }
  });

  // Obtenir une page spécifique par ID
  router.get("/pages/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const [page] = await db
        .select()
        .from(pages)
        .where(eq(pages.id, id))
        .limit(1);

      if (!page) {
        return res.status(404).json({ error: "Page non trouvée" });
      }

      const grapesPage = pageToGrapes(page);
      res.json(grapesPage);
    } catch (error) {
      console.error("Error loading page:", error);
      res.status(500).json({ error: "Erreur lors du chargement de la page" });
    }
  });

  // Créer une nouvelle page
  router.post("/pages", requireAuth, async (req, res) => {
    try {
      const grapesData = req.body as Partial<GrapesPage>;
      const pageData = grapesToPage(grapesData);

      const [newPage] = await db
        .insert(pages)
        .values({
          id: pageData.id,
          title: pageData.title,
          slug: pageData.slug,
          content: pageData.content,
          status: pageData.status,
          template: pageData.template,
          sections: pageData.sections,
          publishedAt: pageData.publishedAt,
          showInMenu: false,
        })
        .returning();

      const grapesPage = pageToGrapes(newPage);
      res.status(201).json(grapesPage);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ error: "Erreur lors de la création de la page" });
    }
  });

  // Mettre à jour une page
  router.put("/pages/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const grapesData = req.body as Partial<GrapesPage>;

      // Récupérer la page existante pour conserver les sections
      const [existingPage] = await db
        .select()
        .from(pages)
        .where(eq(pages.id, id))
        .limit(1);

      if (!existingPage) {
        return res.status(404).json({ error: "Page non trouvée" });
      }

      const pageData = grapesToPage(grapesData, existingPage.sections);

      const [updatedPage] = await db
        .update(pages)
        .set({
          ...pageData,
          updatedAt: new Date(),
        })
        .where(eq(pages.id, id))
        .returning();

      const grapesPage = pageToGrapes(updatedPage);
      res.json(grapesPage);
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ error: "Erreur lors de la mise à jour de la page" });
    }
  });

  // Supprimer une page
  router.delete("/pages/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      const [existingPage] = await db
        .select()
        .from(pages)
        .where(eq(pages.id, id))
        .limit(1);

      if (!existingPage) {
        return res.status(404).json({ error: "Page non trouvée" });
      }

      await db.delete(pages).where(eq(pages.id, id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ error: "Erreur lors de la suppression de la page" });
    }
  });

  // Obtenir une page par son chemin (pour affichage public)
  router.get("/pages/by-path", async (req, res) => {
    try {
      const { path } = req.query;

      if (!path) {
        return res.status(400).json({ error: "Le paramètre path est requis" });
      }

      const [page] = await db
        .select()
        .from(pages)
        .where(eq(pages.slug, path as string))
        .limit(1);

      if (!page || page.status !== 'PUBLISHED') {
        return res.status(404).json({ error: "Page non trouvée" });
      }

      const grapesPage = pageToGrapes(page);
      res.json(grapesPage);
    } catch (error) {
      console.error("Error loading page by path:", error);
      res.status(500).json({ error: "Erreur lors du chargement de la page" });
    }
  });

  app.use("/api/grapes", router);
}
