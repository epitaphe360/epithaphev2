import { db } from "./db";
import { articles, pages, events, caseStudies } from "@shared/schema";
import { eq } from "drizzle-orm";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

/**
 * Génère le sitemap.xml pour le référencement SEO
 */
export async function generateSitemap(baseUrl: string = "https://epitaphe360.com"): Promise<string> {
  const urls: SitemapUrl[] = [];

  // Pages statiques
  const staticPages = [
    { loc: "/", priority: 1.0, changefreq: "weekly" as const },
    { loc: "/nos-references", priority: 0.9, changefreq: "monthly" as const },
    { loc: "/blog", priority: 0.9, changefreq: "daily" as const },
    { loc: "/contact", priority: 0.8, changefreq: "monthly" as const },
    { loc: "/configurateur-projet", priority: 0.8, changefreq: "monthly" as const },
  ];

  urls.push(...staticPages);

  // Articles de blog (publiés uniquement)
  try {
    const publishedArticles = await db
      .select({
        slug: articles.slug,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .where(eq(articles.status, "PUBLISHED"));

    publishedArticles.forEach((article) => {
      urls.push({
        loc: `/blog/${article.slug}`,
        lastmod: article.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Error fetching articles for sitemap:", error);
  }

  // Pages dynamiques (publiées uniquement)
  try {
    const publishedPages = await db
      .select({
        slug: pages.slug,
        updatedAt: pages.updatedAt,
      })
      .from(pages)
      .where(eq(pages.status, "PUBLISHED"));

    publishedPages.forEach((page) => {
      urls.push({
        loc: `/page/${page.slug}`,
        lastmod: page.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error("Error fetching pages for sitemap:", error);
  }

  // Événements (publiés uniquement)
  try {
    const publishedEvents = await db
      .select({
        slug: events.slug,
        updatedAt: events.updatedAt,
      })
      .from(events)
      .where(eq(events.status, "PUBLISHED"));

    publishedEvents.forEach((event) => {
      urls.push({
        loc: `/evenements/${event.slug}`,
        lastmod: event.updatedAt.toISOString(),
        changefreq: "weekly",
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Error fetching events for sitemap:", error);
  }

  // Études de cas (publiées uniquement)
  try {
    const publishedCaseStudies = await db
      .select({
        slug: caseStudies.slug,
        updatedAt: caseStudies.updatedAt,
      })
      .from(caseStudies)
      .where(eq(caseStudies.status, "PUBLISHED"));

    publishedCaseStudies.forEach((cs) => {
      urls.push({
        loc: `/nos-references/${cs.slug}`,
        lastmod: cs.updatedAt.toISOString(),
        changefreq: "monthly",
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error("Error fetching case studies for sitemap:", error);
  }

  // Construire le XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ""}${
      url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : ""
    }${url.priority ? `\n    <priority>${url.priority}</priority>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

  return xml;
}

/**
 * Génère le robots.txt optimisé pour le SEO
 */
export function generateRobotsTxt(baseUrl: string = "https://epitaphe360.com"): string {
  return `# Robots.txt pour Epitaphe 360
# Généré automatiquement

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay pour les bots (éviter la surcharge)
User-agent: *
Crawl-delay: 1

# Google bots spécifiques
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

# Bing
User-agent: Bingbot
Allow: /

# Yandex
User-agent: Yandex
Allow: /

# Baidu
User-agent: Baiduspider
Allow: /
`;
}

/**
 * Génère un RSS feed pour le blog
 */
export async function generateRSSFeed(baseUrl: string = "https://epitaphe360.com"): Promise<string> {
  try {
    const publishedArticles = await db
      .select({
        title: articles.title,
        slug: articles.slug,
        excerpt: articles.excerpt,
        publishedAt: articles.publishedAt,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .where(eq(articles.status, "PUBLISHED"))
      .orderBy(articles.publishedAt)
      .limit(50);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Epitaphe 360 - Blog Communication</title>
    <link>${baseUrl}/blog</link>
    <description>Blog de l'agence de communication 360° Epitaphe 360. Conseils, actualités et tendances en communication, marketing et branding.</description>
    <language>fr-MA</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Epitaphe 360</title>
      <link>${baseUrl}</link>
    </image>
${publishedArticles
  .map(
    (article) => `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/blog/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${article.slug}</guid>
      <description><![CDATA[${article.excerpt || ""}]]></description>
      <pubDate>${article.publishedAt?.toUTCString() || new Date().toUTCString()}</pubDate>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

    return xml;
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    throw error;
  }
}
