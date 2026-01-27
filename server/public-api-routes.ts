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
} from "@shared/schema";
import { eq, desc, and, isNotNull } from "drizzle-orm";

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
        { loc: "/about", priority: "0.8", changefreq: "monthly" },
        { loc: "/services", priority: "0.8", changefreq: "monthly" },
        { loc: "/contact", priority: "0.7", changefreq: "monthly" },
        { loc: "/blog", priority: "0.9", changefreq: "daily" },
        { loc: "/events", priority: "0.8", changefreq: "weekly" },
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
   * GET /atom.xml (Atom feed - redirect to RSS for now)
   */
  app.get("/atom.xml", (req: Request, res: Response) => {
    res.redirect(301, "/rss.xml");
  });
}
