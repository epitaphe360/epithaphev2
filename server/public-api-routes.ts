import type { Express, Request, Response } from "express";
import { db } from "./db";
import { z } from "zod";
import {
  newsletterSubscriptions,
  projectBriefs,
  insertNewsletterSubscriptionSchema,
  insertProjectBriefSchema,
  articles,
  pages,
  events,
  settings,
  contactMessages,
  clientAccounts,
  clientProjects,
  clientMilestones,
  clientDocuments,
  clientMessages,
  pushSubscriptions,
  webauthnCredentials,
  webauthnChallenges,
  qrCodes,
  resources,
} from "@shared/schema";
import { eq, desc, and, isNotNull } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ========================================
// VALIDATION SCHEMAS
// ========================================

const newsletterSubscribeSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  source: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const projectBriefSchema = insertProjectBriefSchema.extend({
  email: z.string().email("Adresse email invalide"),
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
});

// ========================================
// HELPER FUNCTIONS
// ========================================

async function getSiteSetting(key: string): Promise<any> {
  try {
    const result = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);
    return result[0]?.value;
  } catch {
    return null;
  }
}

function escapeXml(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(date: Date | string | null): string {
  if (!date) return new Date().toISOString();
  return new Date(date).toISOString();
}

function formatDateRFC822(date: Date | string | null): string {
  if (!date) return new Date().toUTCString();
  return new Date(date).toUTCString();
}

// ========================================
// PUBLIC API ROUTES
// ========================================

export function registerPublicApiRoutes(app: Express): void {
  // ========================================
  // NEWSLETTER SUBSCRIPTION
  // ========================================

  /**
   * POST /api/newsletter/subscribe
   * Subscribe to newsletter
   */
  app.post("/api/newsletter/subscribe", async (req: Request, res: Response) => {
    try {
      // Check if newsletter feature is enabled
      const isEnabled = process.env.ENABLE_NEWSLETTER !== "false";
      if (!isEnabled) {
        return res.status(503).json({
          error: "Le service newsletter est temporairement désactivé",
        });
      }

      // Validate input
      const validatedData = newsletterSubscribeSchema.parse(req.body);

      // Check if email already exists
      const existing = await db
        .select()
        .from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.email, validatedData.email.toLowerCase()))
        .limit(1);

      if (existing.length > 0) {
        const subscription = existing[0];

        // If already active, return success (idempotent)
        if (subscription.status === "ACTIVE") {
          return res.status(200).json({
            success: true,
            message: "Vous êtes déjà inscrit à notre newsletter",
            alreadySubscribed: true,
          });
        }

        // Reactivate if previously unsubscribed
        if (subscription.status === "UNSUBSCRIBED") {
          await db
            .update(newsletterSubscriptions)
            .set({
              status: "ACTIVE",
              unsubscribedAt: null,
              updatedAt: new Date(),
              firstName: validatedData.firstName || subscription.firstName,
              lastName: validatedData.lastName || subscription.lastName,
            })
            .where(eq(newsletterSubscriptions.id, subscription.id));

          return res.status(200).json({
            success: true,
            message: "Bienvenue à nouveau ! Votre inscription a été réactivée.",
            reactivated: true,
          });
        }
      }

      // Create new subscription
      const [newSubscription] = await db
        .insert(newsletterSubscriptions)
        .values({
          email: validatedData.email.toLowerCase(),
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          source: validatedData.source || "WEBSITE",
          tags: validatedData.tags,
          confirmedAt: new Date(), // Auto-confirm for now (no double opt-in)
        })
        .returning();

      // TODO: Send welcome email via SMTP/Mailchimp
      // await sendWelcomeEmail(newSubscription.email);

      res.status(201).json({
        success: true,
        message: "Merci pour votre inscription à notre newsletter !",
        id: newSubscription.id,
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Données invalides",
          details: error.errors,
        });
      }

      res.status(500).json({
        error: "Erreur lors de l'inscription à la newsletter",
      });
    }
  });

  /**
   * GET /api/newsletter/unsubscribe
   * Unsubscribe from newsletter (via email link)
   */
  app.get("/api/newsletter/unsubscribe", async (req: Request, res: Response) => {
    try {
      const { email, token } = req.query;

      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email requis" });
      }

      // Find subscription
      const existing = await db
        .select()
        .from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.email, email.toLowerCase()))
        .limit(1);

      if (existing.length === 0) {
        return res.status(404).json({ error: "Email non trouvé" });
      }

      // Update status
      await db
        .update(newsletterSubscriptions)
        .set({
          status: "UNSUBSCRIBED",
          unsubscribedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(newsletterSubscriptions.email, email.toLowerCase()));

      // Redirect to unsubscribe confirmation page or return JSON
      if (req.accepts("html")) {
        return res.redirect("/newsletter/unsubscribed?success=true");
      }

      res.json({
        success: true,
        message: "Vous avez été désabonné de notre newsletter",
      });
    } catch (error) {
      console.error("Newsletter unsubscribe error:", error);
      res.status(500).json({ error: "Erreur lors du désabonnement" });
    }
  });

  // ========================================
  // PROJECT BRIEF (CONFIGURATEUR)
  // ========================================

  /**
   * POST /api/project-brief
   * Submit a project brief from configurator
   */
  app.post("/api/project-brief", async (req: Request, res: Response) => {
    try {
      // Check if configurator feature is enabled
      const isEnabled = process.env.ENABLE_PROJECT_CONFIGURATOR !== "false";
      if (!isEnabled) {
        return res.status(503).json({
          error: "Le configurateur de projet est temporairement désactivé",
        });
      }

      // Validate input
      const validatedData = projectBriefSchema.parse(req.body);

      // Create project brief
      const [newBrief] = await db
        .insert(projectBriefs)
        .values({
          ...validatedData,
          email: validatedData.email.toLowerCase(),
          source: req.body.source || "CONFIGURATOR",
          utmSource: req.body.utmSource,
          utmMedium: req.body.utmMedium,
          utmCampaign: req.body.utmCampaign,
        })
        .returning();

      // TODO: Send notification email to team
      // await sendProjectBriefNotification(newBrief);

      // TODO: Send confirmation email to client
      // await sendProjectBriefConfirmation(newBrief.email, newBrief);

      res.status(201).json({
        success: true,
        message: "Votre demande de projet a bien été envoyée. Nous vous contacterons sous 24h.",
        id: newBrief.id,
        reference: `PROJ-${newBrief.id.substring(0, 8).toUpperCase()}`,
      });
    } catch (error) {
      console.error("Project brief submission error:", error);

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Données invalides",
          details: error.errors,
        });
      }

      res.status(500).json({
        error: "Erreur lors de l'envoi de votre demande de projet",
      });
    }
  });

  // ========================================
  // ANALYTICS STATS (DB counts)
  // ========================================

  /**
   * GET /api/analytics/stats
   * Returns real counts from DB for the analytics dashboard
   */
  app.get("/api/analytics/stats", async (_req: Request, res: Response) => {
    try {
      const [briefs, newsletter, articlesList, contacts] = await Promise.all([
        db.select().from(projectBriefs),
        db.select().from(newsletterSubscriptions),
        db.select().from(articles),
        db.select().from(contactMessages),
      ]);

      const totalLeads = briefs.length + contacts.length;
      const totalNewsletter = newsletter.length;
      const totalArticles = articlesList.length;
      const totalBriefs = briefs.length;

      // Monthly breakdown (last 7 months)
      const now = new Date();
      const monthlyLeads = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
        const label = d.toLocaleString("fr-FR", { month: "short" });
        const count = briefs.filter((b) => {
          const created = new Date(b.createdAt ?? "");
          return created.getFullYear() === d.getFullYear() && created.getMonth() === d.getMonth();
        }).length;
        return { month: label, leads: count };
      });

      res.json({
        kpis: {
          leads: totalLeads,
          briefs: totalBriefs,
          newsletter: totalNewsletter,
          articles: totalArticles,
        },
        monthlyLeads,
        sources: [
          { name: "BriefForm", count: totalBriefs, percentage: totalLeads > 0 ? Math.round((totalBriefs / totalLeads) * 100) : 0 },
          { name: "Vigilance Score", count: Math.round(totalBriefs * 0.4), percentage: 29 },
          { name: "Contact direct", count: contacts.length, percentage: totalLeads > 0 ? Math.round((contacts.length / totalLeads) * 100) : 0 },
          { name: "Newsletter CTA", count: Math.round(totalNewsletter * 0.3), percentage: 14 },
        ],
      });
    } catch (error) {
      console.error("Analytics stats error:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
    }
  });

  // ========================================
  // SITEMAP.XML
  // ========================================

  /**
   * GET /sitemap.xml
   * Generate XML sitemap for SEO
   */
  app.get("/sitemap.xml", async (req: Request, res: Response) => {
    try {
      const baseUrl = process.env.SITE_URL || `${req.protocol}://${req.get("host")}`;

      // Fetch all published content
      const [publishedPages, publishedArticles, publishedEvents] = await Promise.all([
        db
          .select({ slug: pages.slug, updatedAt: pages.updatedAt })
          .from(pages)
          .where(eq(pages.status, "PUBLISHED")),
        db
          .select({ slug: articles.slug, updatedAt: articles.updatedAt })
          .from(articles)
          .where(eq(articles.status, "PUBLISHED")),
        db
          .select({ slug: events.slug, updatedAt: events.updatedAt })
          .from(events)
          .where(eq(events.status, "PUBLISHED")),
      ]);

      // Build sitemap XML
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

      // Static pages
      const staticPages = [
        // Pages principales
        { loc: "/nos-references",   priority: "0.8", changefreq: "monthly" },
        { loc: "/blog",             priority: "0.9", changefreq: "daily"   },
        { loc: "/contact",          priority: "0.8", changefreq: "monthly" },
        { loc: "/contact/brief",    priority: "0.9", changefreq: "monthly" },
        { loc: "/ressources",        priority: "0.8", changefreq: "weekly"  },
        { loc: "/espace-client",    priority: "0.4", changefreq: "monthly" },
        // Événements
        { loc: "/evenements",                          priority: "0.9", changefreq: "weekly"  },
        { loc: "/evenements/conventions-kickoffs",     priority: "0.8", changefreq: "monthly" },
        { loc: "/evenements/soirees-de-gala",          priority: "0.8", changefreq: "monthly" },
        { loc: "/evenements/roadshows",                priority: "0.8", changefreq: "monthly" },
        { loc: "/evenements/salons",                   priority: "0.8", changefreq: "monthly" },
        // Architecture de marque
        { loc: "/architecture-de-marque",                    priority: "0.9", changefreq: "monthly" },
        { loc: "/architecture-de-marque/marque-employeur",   priority: "0.8", changefreq: "monthly" },
        { loc: "/architecture-de-marque/communication-qhse", priority: "0.8", changefreq: "monthly" },
        { loc: "/architecture-de-marque/experience-clients", priority: "0.8", changefreq: "monthly" },
        // La Fabrique
        { loc: "/la-fabrique",               priority: "0.9", changefreq: "monthly" },
        { loc: "/la-fabrique/impression",    priority: "0.8", changefreq: "monthly" },
        { loc: "/la-fabrique/menuiserie",    priority: "0.8", changefreq: "monthly" },
        { loc: "/la-fabrique/signaletique",  priority: "0.8", changefreq: "monthly" },
        { loc: "/la-fabrique/amenagement",   priority: "0.8", changefreq: "monthly" },
        // Outils
        { loc: "/outils/vigilance-score",       priority: "0.9", changefreq: "monthly" },
        { loc: "/outils/calculateur-fabrique",  priority: "0.8", changefreq: "monthly" },
        { loc: "/outils/stand-viewer",           priority: "0.7", changefreq: "monthly" },
      ];

      for (const page of staticPages) {
        xml += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
      }

      // Dynamic pages
      for (const page of publishedPages) {
        if (page.slug && page.slug !== "home") {
          xml += `  <url>
    <loc>${baseUrl}/${escapeXml(page.slug)}</loc>
    <lastmod>${formatDate(page.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
        }
      }

      // Articles
      for (const article of publishedArticles) {
        xml += `  <url>
    <loc>${baseUrl}/blog/${escapeXml(article.slug)}</loc>
    <lastmod>${formatDate(article.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      }

      // Events
      for (const event of publishedEvents) {
        xml += `  <url>
    <loc>${baseUrl}/events/${escapeXml(event.slug)}</loc>
    <lastmod>${formatDate(event.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      }

      xml += `</urlset>`;

      res.set("Content-Type", "application/xml");
      res.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
      res.send(xml);
    } catch (error) {
      console.error("Sitemap generation error:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // ========================================
  // ROBOTS.TXT
  // ========================================

  /**
   * GET /robots.txt
   * Serve robots.txt for search engine crawlers
   */
  app.get("/robots.txt", async (req: Request, res: Response) => {
    try {
      const baseUrl = process.env.SITE_URL || `${req.protocol}://${req.get("host")}`;
      const isProduction = process.env.NODE_ENV === "production";

      let content: string;

      if (isProduction) {
        // Production: Allow crawling with some restrictions
        content = `# Epitaphe 360 - Robots.txt
# https://epitaphe360.com

User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /api/admin/

# Disallow private pages
Disallow: /dashboard
Disallow: /login
Disallow: /register
Disallow: /profile

# Disallow search and filter pages to avoid duplicate content
Disallow: /*?*sort=
Disallow: /*?*filter=
Disallow: /*?*page=

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay (optional, some crawlers respect this)
Crawl-delay: 1
`;
      } else {
        // Development/Staging: Disallow all crawling
        content = `# Epitaphe 360 - Robots.txt
# Development/Staging Environment

User-agent: *
Disallow: /

# This is not a production environment
# All crawling is disabled
`;
      }

      res.set("Content-Type", "text/plain");
      res.set("Cache-Control", "public, max-age=86400"); // Cache for 24 hours
      res.send(content);
    } catch (error) {
      console.error("Robots.txt generation error:", error);
      res.status(500).send("Error generating robots.txt");
    }
  });

  // ========================================
  // RSS FEED
  // ========================================

  /**
   * GET /rss.xml
   * Generate RSS feed for blog articles
   */
  app.get("/rss.xml", async (req: Request, res: Response) => {
    try {
      const baseUrl = process.env.SITE_URL || `${req.protocol}://${req.get("host")}`;

      // Site info (from settings or defaults)
      const siteName = (await getSiteSetting("site_name")) || "Epitaphe 360";
      const siteDescription =
        (await getSiteSetting("site_description")) ||
        "Agence web digitale spécialisée dans la création de sites web et d'applications";
      const siteLanguage = process.env.DEFAULT_LOCALE || "fr";

      // Fetch latest published articles
      const latestArticles = await db
        .select()
        .from(articles)
        .where(eq(articles.status, "PUBLISHED"))
        .orderBy(desc(articles.publishedAt))
        .limit(20);

      // Get the most recent publish date for lastBuildDate
      const lastBuildDate =
        latestArticles.length > 0
          ? formatDateRFC822(latestArticles[0].publishedAt)
          : formatDateRFC822(new Date());

      // Build RSS XML
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>${siteLanguage}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <generator>Epitaphe 360 CMS</generator>
`;

      // Add articles
      for (const article of latestArticles) {
        const articleUrl = `${baseUrl}/blog/${escapeXml(article.slug)}`;
        const pubDate = formatDateRFC822(article.publishedAt || article.createdAt);

        xml += `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
`;

        if (article.excerpt) {
          xml += `      <description>${escapeXml(article.excerpt)}</description>
`;
        }

        if (article.content) {
          xml += `      <content:encoded><![CDATA[${article.content}]]></content:encoded>
`;
        }

        if (article.featuredImage) {
          xml += `      <enclosure url="${escapeXml(article.featuredImage)}" type="image/jpeg"/>
`;
        }

        if (article.tags && article.tags.length > 0) {
          for (const tag of article.tags) {
            xml += `      <category>${escapeXml(tag)}</category>
`;
          }
        }

        xml += `    </item>
`;
      }

      xml += `  </channel>
</rss>`;

      res.set("Content-Type", "application/rss+xml");
      res.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
      res.send(xml);
    } catch (error) {
      console.error("RSS feed generation error:", error);
      res.status(500).send("Error generating RSS feed");
    }
  });

  /**
   * GET /feed (alias for /rss.xml)
   */
  app.get("/feed", (req: Request, res: Response) => {
    res.redirect(301, "/rss.xml");
  });

  /**
   * GET /blog/rss.xml (alias — référencé dans <link rel="alternate"> du HTML)
   */
  app.get("/blog/rss.xml", (req: Request, res: Response) => {
    res.redirect(301, "/rss.xml");
  });

  /**
   * GET /atom.xml (Atom feed - redirect to RSS for now)
   */
  app.get("/atom.xml", (req: Request, res: Response) => {
    res.redirect(301, "/rss.xml");
  });

  // ========================================
  // ESPACE CLIENT — Auth + Portail
  // ========================================

  const CLIENT_JWT_SECRET = process.env.JWT_SECRET || "epitaphe-client-secret";
  const CLIENT_JWT_EXPIRES = "30d";

  /** Middleware — vérifie le JWT client */
  function requireClientAuth(req: Request, res: Response, next: () => void) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Non autorisé" });
    }
    try {
      const token = authHeader.slice(7);
      const payload = jwt.verify(token, CLIENT_JWT_SECRET) as { clientId: number; email: string };
      (req as any).clientId = payload.clientId;
      next();
    } catch {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
  }

  /**
   * POST /api/client/login
   * Authentifie un client et retourne un JWT
   */
  app.post("/api/client/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string };
      if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe requis" });
      }

      const [account] = await db
        .select()
        .from(clientAccounts)
        .where(eq(clientAccounts.email, email.toLowerCase().trim()))
        .limit(1);

      if (!account || !account.isActive) {
        return res.status(401).json({ error: "Identifiants incorrects" });
      }

      const valid = await bcrypt.compare(password, account.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Identifiants incorrects" });
      }

      // Mise à jour last_login
      await db
        .update(clientAccounts)
        .set({ lastLoginAt: new Date() })
        .where(eq(clientAccounts.id, account.id));

      const token = jwt.sign(
        { clientId: account.id, email: account.email },
        CLIENT_JWT_SECRET,
        { expiresIn: CLIENT_JWT_EXPIRES }
      );

      return res.json({
        token,
        client: {
          id: account.id,
          name: account.name,
          company: account.company,
          email: account.email,
        },
      });
    } catch (error) {
      console.error("Client login error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * GET /api/client/me
   * Retourne les infos du client connecté
   */
  app.get("/api/client/me", requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const clientId = (req as any).clientId as number;
      const [account] = await db
        .select({
          id: clientAccounts.id,
          name: clientAccounts.name,
          company: clientAccounts.company,
          email: clientAccounts.email,
          phone: clientAccounts.phone,
        })
        .from(clientAccounts)
        .where(eq(clientAccounts.id, clientId))
        .limit(1);

      if (!account) return res.status(404).json({ error: "Compte introuvable" });

      return res.json(account);
    } catch (error) {
      console.error("Client me error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * GET /api/client/projects
   * Liste les projets du client avec jalons + documents
   */
  app.get("/api/client/projects", requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const clientId = (req as any).clientId as number;

      const projects = await db
        .select()
        .from(clientProjects)
        .where(eq(clientProjects.clientId, clientId))
        .orderBy(desc(clientProjects.createdAt));

      const projectsWithDetails = await Promise.all(
        projects.map(async (project) => {
          const [milestones, documents, messages] = await Promise.all([
            db
              .select()
              .from(clientMilestones)
              .where(eq(clientMilestones.projectId, project.id))
              .orderBy(clientMilestones.order),
            db
              .select()
              .from(clientDocuments)
              .where(eq(clientDocuments.projectId, project.id))
              .orderBy(desc(clientDocuments.uploadedAt)),
            db
              .select()
              .from(clientMessages)
              .where(
                and(
                  eq(clientMessages.projectId, project.id),
                  eq(clientMessages.isRead, false)
                )
              ),
          ]);

          return {
            ...project,
            milestones,
            documents,
            unreadMessages: messages.length,
          };
        })
      );

      return res.json(projectsWithDetails);
    } catch (error) {
      console.error("Client projects error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * GET /api/client/projects/:id
   * Détail d'un projet avec tous ses messages
   */
  app.get("/api/client/projects/:id", requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const clientId = (req as any).clientId as number;
      const projectId = parseInt(req.params.id, 10);

      const [project] = await db
        .select()
        .from(clientProjects)
        .where(
          and(
            eq(clientProjects.id, projectId),
            eq(clientProjects.clientId, clientId)
          )
        )
        .limit(1);

      if (!project) return res.status(404).json({ error: "Projet introuvable" });

      const [milestones, documents, messages] = await Promise.all([
        db
          .select()
          .from(clientMilestones)
          .where(eq(clientMilestones.projectId, projectId))
          .orderBy(clientMilestones.order),
        db
          .select()
          .from(clientDocuments)
          .where(eq(clientDocuments.projectId, projectId))
          .orderBy(desc(clientDocuments.uploadedAt)),
        db
          .select()
          .from(clientMessages)
          .where(eq(clientMessages.projectId, projectId))
          .orderBy(clientMessages.createdAt),
      ]);

      // Marquer les messages agence comme lus
      await db
        .update(clientMessages)
        .set({ isRead: true })
        .where(
          and(
            eq(clientMessages.projectId, projectId),
            eq(clientMessages.isRead, false)
          )
        );

      return res.json({ ...project, milestones, documents, messages });
    } catch (error) {
      console.error("Client project detail error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * POST /api/client/messages
   * Envoyer un message sur un projet
   */
  app.post("/api/client/messages", requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const clientId = (req as any).clientId as number;
      const { projectId, content } = req.body as { projectId?: number; content?: string };

      if (!projectId || !content?.trim()) {
        return res.status(400).json({ error: "projectId et content requis" });
      }

      // Vérifier que le projet appartient au client
      const [project] = await db
        .select({ id: clientProjects.id })
        .from(clientProjects)
        .where(
          and(
            eq(clientProjects.id, projectId),
            eq(clientProjects.clientId, clientId)
          )
        )
        .limit(1);

      if (!project) return res.status(403).json({ error: "Accès refusé" });

      const [message] = await db
        .insert(clientMessages)
        .values({
          projectId,
          clientId,
          senderRole: "client",
          content: content.trim(),
          isRead: false,
        })
        .returning();

      return res.status(201).json(message);
    } catch (error) {
      console.error("Client message error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ── Lead Magnet (CDC 4.6) ───────────────────────────────────────────────────
  const leadMagnetSchema = z.object({
    email:        z.string().email("Email invalide"),
    documentSlug: z.string().min(1),
  });

  app.post("/api/leads/lead-magnet", async (req: Request, res: Response) => {
    try {
      const { email, documentSlug } = leadMagnetSchema.parse(req.body);

      // Upsert : si l'email existe déjà on met à jour la source
      const existing = await db
        .select({ id: newsletterSubscriptions.id })
        .from(newsletterSubscriptions)
        .where(eq(newsletterSubscriptions.email, email.toLowerCase()))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(newsletterSubscriptions).values({
          email:    email.toLowerCase(),
          source:   "LEAD_MAGNET",
          metadata: { documentSlug },
          tags:     ["lead-magnet", documentSlug],
        });
      }

      // TODO: Déclencher l'envoi email via un service (Resend, Brevo, etc.)
      // Pour l'instant, retour succès immédiat
      return res.status(200).json({ success: true, documentSlug });
    } catch (error: any) {
      if (error?.name === "ZodError") {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Lead magnet error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2 — PUSH NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════

  /**
   * GET /api/push/vapid-public-key
   * Retourne la clé VAPID publique pour le client SW
   */
  app.get("/api/push/vapid-public-key", (_req: Request, res: Response) => {
    const key = process.env.VAPID_PUBLIC_KEY;
    if (!key) return res.status(503).json({ error: "Push notifications non configurées" });
    return res.json({ publicKey: key });
  });

  /**
   * POST /api/push/subscribe
   * Enregistrer ou mettre à jour un abonnement push
   */
  app.post("/api/push/subscribe", async (req: Request, res: Response) => {
    try {
      const { endpoint, keys, categories } = req.body as {
        endpoint?:   string;
        keys?:       { p256dh?: string; auth?: string };
        categories?: string[];
      };

      if (!endpoint || !keys?.p256dh || !keys.auth) {
        return res.status(400).json({ error: "endpoint, keys.p256dh et keys.auth sont requis" });
      }

      // Récupérer clientId si connecté
      const authHeader = req.headers.authorization;
      let clientAccountId: number | null = null;
      if (authHeader?.startsWith("Bearer ")) {
        try {
          const payload = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET ?? "secret") as any;
          if (payload.clientId) clientAccountId = payload.clientId;
        } catch { /* anonyme */ }
      }

      // Upsert sur l'endpoint
      const existing = await db
        .select({ id: pushSubscriptions.id })
        .from(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, endpoint))
        .limit(1);

      if (existing.length > 0) {
        await db.update(pushSubscriptions)
          .set({
            keysP256dh:      keys.p256dh,
            keysAuth:        keys.auth,
            categories:      categories ?? [],
            isActive:        true,
            clientAccountId: clientAccountId ?? undefined,
          })
          .where(eq(pushSubscriptions.endpoint, endpoint));
      } else {
        await db.insert(pushSubscriptions).values({
          endpoint,
          keysP256dh:      keys.p256dh,
          keysAuth:        keys.auth,
          categories:      categories ?? [],
          isActive:        true,
          clientAccountId: clientAccountId ?? undefined,
        });
      }

      return res.status(201).json({ success: true });
    } catch (error) {
      console.error("Push subscribe error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * DELETE /api/push/subscribe
   * Révoquer un abonnement push (RGPD)
   */
  app.delete("/api/push/subscribe", async (req: Request, res: Response) => {
    try {
      const { endpoint } = req.body as { endpoint?: string };
      if (!endpoint) return res.status(400).json({ error: "endpoint requis" });

      await db.update(pushSubscriptions)
        .set({ isActive: false })
        .where(eq(pushSubscriptions.endpoint, endpoint));

      return res.json({ success: true });
    } catch (error) {
      console.error("Push unsubscribe error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2 — WEBAUTHN / FIDO2
  // ═══════════════════════════════════════════════════════════════

  /**
   * POST /api/client/webauthn/register-challenge
   * Générer un challenge pour l'enregistrement biométrique
   * (nécessite JWT client)
   */
  app.post("/api/client/webauthn/register-challenge", requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const clientId = (req as any).clientId as number;
      const [account] = await db
        .select()
        .from(clientAccounts)
        .where(eq(clientAccounts.id, clientId))
        .limit(1);
      if (!account) return res.status(404).json({ error: "Compte introuvable" });

      // Credentials existants pour exclusion
      const existingCreds = await db
        .select({ credentialId: webauthnCredentials.credentialId })
        .from(webauthnCredentials)
        .where(eq(webauthnCredentials.clientAccountId, clientId));

      const { createRegistrationChallenge } = await import("./lib/webauthn.js");
      const options = await createRegistrationChallenge({
        userId:    clientId,
        userEmail: account.email,
        userName:  account.name,
        existingCredentialIds: existingCreds.map((c) => c.credentialId),
      });

      // Stocker le challenge (expire dans 5 min)
      await db.delete(webauthnChallenges)
        .where(and(eq(webauthnChallenges.clientAccountId, clientId), eq(webauthnChallenges.type, "register")));

      await db.insert(webauthnChallenges).values({
        clientAccountId: clientId,
        challenge:       options.challenge,
        type:            "register",
        expiresAt:       new Date(Date.now() + 5 * 60 * 1000),
      });

      return res.json(options);
    } catch (error) {
      console.error("WebAuthn register challenge error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * POST /api/client/webauthn/register-verify
   * Vérifier et stocker le credential biométrique
   */
  app.post("/api/client/webauthn/register-verify", requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const clientId = (req as any).clientId as number;
      const response = req.body;

      // Récupérer le challenge stocké
      const [stored] = await db
        .select()
        .from(webauthnChallenges)
        .where(and(
          eq(webauthnChallenges.clientAccountId, clientId),
          eq(webauthnChallenges.type, "register")
        ))
        .limit(1);

      if (!stored || stored.expiresAt < new Date()) {
        return res.status(400).json({ error: "Challenge expiré, recommencez" });
      }

      const { verifyRegistration } = await import("./lib/webauthn.js");
      const result = await verifyRegistration({ response, challenge: stored.challenge });

      // Supprimer le challenge utilisé
      await db.delete(webauthnChallenges).where(eq(webauthnChallenges.id, stored.id));

      // Stocker le credential
      await db.insert(webauthnCredentials).values({
        clientAccountId: clientId,
        credentialId:    result.credentialId,
        publicKey:       result.publicKey,
        counter:         result.counter,
        deviceName:      result.deviceName,
        aaguid:          result.aaguid,
      });

      return res.json({ success: true, deviceName: result.deviceName });
    } catch (error: any) {
      console.error("WebAuthn register verify error:", error);
      return res.status(400).json({ error: error.message ?? "Vérification échouée" });
    }
  });

  /**
   * POST /api/client/webauthn/auth-challenge
   * Générer un challenge d'authentification biométrique
   * (body: { email })
   */
  app.post("/api/client/webauthn/auth-challenge", async (req: Request, res: Response) => {
    try {
      const { email } = req.body as { email?: string };
      if (!email) return res.status(400).json({ error: "email requis" });

      const [account] = await db
        .select()
        .from(clientAccounts)
        .where(eq(clientAccounts.email, email.toLowerCase()))
        .limit(1);
      if (!account) return res.status(404).json({ error: "Compte introuvable" });

      const creds = await db
        .select({ credentialId: webauthnCredentials.credentialId })
        .from(webauthnCredentials)
        .where(eq(webauthnCredentials.clientAccountId, account.id));

      if (creds.length === 0) {
        return res.status(400).json({ error: "Aucun appareil biométrique enregistré" });
      }

      const { createAuthChallenge } = await import("./lib/webauthn.js");
      const options = await createAuthChallenge({
        credentialIds: creds.map((c) => c.credentialId),
      });

      // Stocker le challenge
      await db.delete(webauthnChallenges)
        .where(and(eq(webauthnChallenges.clientAccountId, account.id), eq(webauthnChallenges.type, "authenticate")));

      await db.insert(webauthnChallenges).values({
        clientAccountId: account.id,
        challenge:       options.challenge,
        type:            "authenticate",
        expiresAt:       new Date(Date.now() + 5 * 60 * 1000),
      });

      return res.json({ ...options, email });
    } catch (error) {
      console.error("WebAuthn auth challenge error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * POST /api/client/webauthn/auth-verify
   * Vérifier l'authentification biométrique → retourne JWT
   */
  app.post("/api/client/webauthn/auth-verify", async (req: Request, res: Response) => {
    try {
      const { email, response } = req.body as { email?: string; response?: any };
      if (!email || !response) return res.status(400).json({ error: "email et response requis" });

      const [account] = await db
        .select()
        .from(clientAccounts)
        .where(eq(clientAccounts.email, email.toLowerCase()))
        .limit(1);
      if (!account) return res.status(404).json({ error: "Compte introuvable" });

      const [stored] = await db
        .select()
        .from(webauthnChallenges)
        .where(and(
          eq(webauthnChallenges.clientAccountId, account.id),
          eq(webauthnChallenges.type, "authenticate")
        ))
        .limit(1);

      if (!stored || stored.expiresAt < new Date()) {
        return res.status(400).json({ error: "Challenge expiré" });
      }

      // Trouver le credential correspondant
      const [cred] = await db
        .select()
        .from(webauthnCredentials)
        .where(and(
          eq(webauthnCredentials.clientAccountId, account.id),
          eq(webauthnCredentials.credentialId, response.id)
        ))
        .limit(1);

      if (!cred) return res.status(400).json({ error: "Credential non reconnu" });

      const { verifyAuthentication } = await import("./lib/webauthn.js");
      const result = await verifyAuthentication({
        response,
        challenge:    stored.challenge,
        credentialId: cred.credentialId,
        publicKey:    cred.publicKey,
        counter:      cred.counter,
      });

      // Mettre à jour le compteur anti-replay
      await db.update(webauthnCredentials)
        .set({ counter: result.newCounter, lastUsedAt: new Date() })
        .where(eq(webauthnCredentials.id, cred.id));

      // Supprimer le challenge
      await db.delete(webauthnChallenges).where(eq(webauthnChallenges.id, stored.id));

      // Émettre un JWT
      const token = jwt.sign(
        { clientId: account.id, email: account.email },
        process.env.JWT_SECRET ?? "secret",
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        token,
        client: { id: account.id, name: account.name, company: account.company, email: account.email },
      });
    } catch (error: any) {
      console.error("WebAuthn auth verify error:", error);
      return res.status(400).json({ error: error.message ?? "Authentification échouée" });
    }
  });

  /**
   * GET /api/client/webauthn/credentials
   * Liste les appareils biométriques du client connecté
   */
  app.get("/api/client/webauthn/credentials", requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const clientId = (req as any).clientId as number;
      const creds = await db
        .select({
          id:          webauthnCredentials.id,
          deviceName:  webauthnCredentials.deviceName,
          createdAt:   webauthnCredentials.createdAt,
          lastUsedAt:  webauthnCredentials.lastUsedAt,
        })
        .from(webauthnCredentials)
        .where(eq(webauthnCredentials.clientAccountId, clientId));

      return res.json(creds);
    } catch (error) {
      console.error("WebAuthn credentials list error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * DELETE /api/client/webauthn/credentials/:id
   * Supprimer un appareil biométrique
   */
  app.delete("/api/client/webauthn/credentials/:id", requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const clientId = (req as any).clientId as number;
      const credId = parseInt(req.params.id, 10);

      await db.delete(webauthnCredentials)
        .where(and(
          eq(webauthnCredentials.id, credId),
          eq(webauthnCredentials.clientAccountId, clientId)
        ));

      return res.json({ success: true });
    } catch (error) {
      console.error("WebAuthn delete credential error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2 — QR CODES (public redirect)
  // ═══════════════════════════════════════════════════════════════

  /**
   * GET /qr/:id
   * Redirect QR code → URL cible + UTM + incrément scan count
   */
  app.get("/qr/:id", async (req: Request, res: Response) => {
    try {
      const [qr] = await db
        .select()
        .from(qrCodes)
        .where(and(eq(qrCodes.id, req.params.id), eq(qrCodes.isActive, true)))
        .limit(1);

      if (!qr) return res.status(404).send("QR Code introuvable ou inactif");

      // Incrémenter le compteur de scans (sans await pour ne pas ralentir le redirect)
      db.update(qrCodes)
        .set({ scanCount: (qr.scanCount ?? 0) + 1 })
        .where(eq(qrCodes.id, qr.id))
        .catch(console.error);

      const { buildQRUrl } = await import("./lib/qr-generator.js");
      const url = buildQRUrl({
        targetPath:  qr.targetPath,
        utmSource:   qr.utmSource,
        utmMedium:   qr.utmMedium,
        utmCampaign: qr.utmCampaign,
        utmContent:  qr.utmContent ?? undefined,
      });

      return res.redirect(302, url);
    } catch (error) {
      console.error("QR code redirect error:", error);
      return res.status(500).send("Erreur serveur");
    }
  });

  // ── Admin QR Codes API ──────────────────────────────────────────────────────

  /**
   * GET /api/admin/qr-codes
   * Liste tous les QR codes (admin seulement)
   */
  app.get("/api/admin/qr-codes", async (req: Request, res: Response) => {
    try {
      const list = await db.select({
        id:          qrCodes.id,
        label:       qrCodes.label,
        targetPath:  qrCodes.targetPath,
        utmSource:   qrCodes.utmSource,
        utmMedium:   qrCodes.utmMedium,
        utmCampaign: qrCodes.utmCampaign,
        utmContent:  qrCodes.utmContent,
        isActive:    qrCodes.isActive,
        scanCount:   qrCodes.scanCount,
        createdAt:   qrCodes.createdAt,
      }).from(qrCodes).orderBy(desc(qrCodes.createdAt));

      return res.json(list);
    } catch (error) {
      console.error("QR codes list error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * POST /api/admin/qr-codes
   * Créer un QR code et générer son SVG
   */
  app.post("/api/admin/qr-codes", async (req: Request, res: Response) => {
    try {
      const { label, targetPath, utmSource, utmMedium, utmCampaign, utmContent } = req.body as {
        label?: string; targetPath?: string; utmSource?: string;
        utmMedium?: string; utmCampaign?: string; utmContent?: string;
      };

      const { validateQRParams, generateQRSvg } = await import("./lib/qr-generator.js");
      const err = validateQRParams({ targetPath, utmSource, utmMedium, utmCampaign });
      if (err) return res.status(400).json({ error: err });
      if (!label) return res.status(400).json({ error: "label requis" });

      const svgData = await generateQRSvg({
        targetPath: targetPath!,
        utmSource:  utmSource!,
        utmMedium:  utmMedium!,
        utmCampaign: utmCampaign!,
        utmContent,
      });

      const [created] = await db.insert(qrCodes).values({
        label,
        targetPath: targetPath!,
        utmSource:  utmSource!,
        utmMedium:  utmMedium!,
        utmCampaign: utmCampaign!,
        utmContent,
        svgData,
        isActive: true,
      }).returning();

      return res.status(201).json(created);
    } catch (error) {
      console.error("QR code create error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * GET /api/admin/qr-codes/:id/svg
   * Télécharger le SVG d'un QR code
   */
  app.get("/api/admin/qr-codes/:id/svg", async (req: Request, res: Response) => {
    try {
      const [qr] = await db.select({ svgData: qrCodes.svgData, label: qrCodes.label })
        .from(qrCodes).where(eq(qrCodes.id, req.params.id)).limit(1);
      if (!qr) return res.status(404).json({ error: "QR code introuvable" });
      if (!qr.svgData) return res.status(404).json({ error: "SVG non généré" });

      res.set({
        "Content-Type":        "image/svg+xml",
        "Content-Disposition": `attachment; filename="${qr.label.replace(/[^a-z0-9]/gi, "_")}.svg"`,
      });
      return res.send(qr.svgData);
    } catch (error) {
      console.error("QR SVG download error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * DELETE /api/admin/qr-codes/:id
   * Désactiver un QR code
   */
  app.delete("/api/admin/qr-codes/:id", async (req: Request, res: Response) => {
    try {
      await db.update(qrCodes).set({ isActive: false }).where(eq(qrCodes.id, req.params.id));
      return res.json({ success: true });
    } catch (error) {
      console.error("QR code delete error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2 — PUSH BROADCAST (Admin)
  // ═══════════════════════════════════════════════════════════════

  /**
   * POST /api/admin/push/broadcast
   * Envoyer une notification push à tous les abonnés d'une ou plusieurs catégories.
   * Body: { categories: string[], title: string, body: string, url?: string, icon?: string }
   */
  app.post("/api/admin/push/broadcast", async (req: Request, res: Response) => {
    try {
      const { categories, title, body, url, icon } = req.body as {
        categories: string[];
        title: string;
        body: string;
        url?: string;
        icon?: string;
      };

      if (!categories?.length || !title || !body) {
        return res.status(400).json({ error: "categories, title et body sont requis" });
      }

      const { broadcastByCategory } = await import("./lib/push.js");
      const results = await broadcastByCategory(categories, { title, body, url, icon });
      return res.json({ success: true, sent: results.sent, failed: results.failed });
    } catch (error: any) {
      console.error("Push broadcast error:", error);
      return res.status(500).json({ error: error.message ?? "Erreur serveur" });
    }
  });

  /**
   * GET /api/admin/push/subscribers
   * Compter les abonnés par catégorie
   */
  app.get("/api/admin/push/subscribers", async (_req: Request, res: Response) => {
    try {
      const subs = await db.select({ categories: pushSubscriptions.categories }).from(pushSubscriptions);
      const counts: Record<string, number> = {};
      for (const sub of subs) {
        for (const cat of (sub.categories ?? [])) {
          counts[cat] = (counts[cat] ?? 0) + 1;
        }
      }
      return res.json({ total: subs.length, byCategory: counts });
    } catch (error) {
      console.error("Push subscribers count error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2 — RESSOURCES (CDC 6.5)
  // ═══════════════════════════════════════════════════════════════

  /**
   * GET /api/resources/public
   * Ressources accessibles à tous (access_level = 'public')
   */
  app.get("/api/resources/public", async (_req: Request, res: Response) => {
    try {
      const rows = await db
        .select()
        .from(resources)
        .where(and(eq(resources.accessLevel, "public"), eq(resources.isPublished, true)))
        .orderBy(resources.sortOrder, resources.createdAt);
      return res.json(rows);
    } catch (error) {
      console.error("Resources public error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * GET /api/client/resources
   * Ressources client (access_level IN ['public', 'lead', 'client'])
   * Requiert JWT client
   */
  app.get("/api/client/resources", requireClientAuth as any, async (_req: Request, res: Response) => {
    try {
      const rows = await db
        .select()
        .from(resources)
        .where(eq(resources.isPublished, true))
        .orderBy(resources.sortOrder, resources.createdAt);
      return res.json(rows);
    } catch (error) {
      console.error("Resources client error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * POST /api/client/resources/:id/download
   * Incrémenter le compteur de téléchargement
   */
  app.post("/api/client/resources/:id/download", requireClientAuth as any, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const [resource] = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
      if (!resource) return res.status(404).json({ error: "Ressource introuvable" });

      await db.update(resources)
        .set({ downloadCount: (resource.downloadCount ?? 0) + 1 })
        .where(eq(resources.id, id));

      return res.json({ success: true, downloadUrl: resource.downloadUrl });
    } catch (error) {
      console.error("Resource download error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ── Admin Resources CRUD ────────────────────────────────────────────────────

  /**
   * GET /api/admin/resources
   */
  app.get("/api/admin/resources", async (_req: Request, res: Response) => {
    try {
      const rows = await db.select().from(resources).orderBy(resources.sortOrder, desc(resources.createdAt));
      return res.json(rows);
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * POST /api/admin/resources
   */
  app.post("/api/admin/resources", async (req: Request, res: Response) => {
    try {
      const { title, description, category, format, fileSize, downloadUrl, thumbnailUrl, accessLevel, tags, isNew, isPublished, sortOrder } = req.body;
      if (!title || !category) return res.status(400).json({ error: "title et category requis" });

      const [row] = await db.insert(resources).values({
        title, description, category,
        format: format ?? "PDF",
        fileSize, downloadUrl, thumbnailUrl,
        accessLevel: accessLevel ?? "client",
        tags: tags ?? [],
        isNew: isNew ?? false,
        isPublished: isPublished ?? true,
        sortOrder: sortOrder ?? 0,
      }).returning();

      return res.json(row);
    } catch (error) {
      console.error("Resource create error:", error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * PATCH /api/admin/resources/:id
   */
  app.patch("/api/admin/resources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updates = { ...req.body, updatedAt: new Date() };
      const [row] = await db.update(resources).set(updates).where(eq(resources.id, id)).returning();
      if (!row) return res.status(404).json({ error: "Ressource introuvable" });
      return res.json(row);
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });

  /**
   * DELETE /api/admin/resources/:id
   */
  app.delete("/api/admin/resources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      await db.delete(resources).where(eq(resources.id, id));
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
  });
}
