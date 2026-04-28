/**
 * PageMeta — composant SEO réutilisable
 * Utilise react-helmet-async pour injecter title/meta/og/schema.org
 * dans chaque page publique.
 */
import { Helmet } from "react-helmet-async";

interface PageMetaProps {
  title: string;
  description: string;
  canonicalPath?: string;           // ex: "/evenements/conventions-kickoffs"
  ogImage?: string;                 // URL absolue
  ogImageAlt?: string;              // texte alternatif pour l'image OG
  type?: "website" | "article" | "product";
  schemaType?: "WebPage" | "Service" | "Article" | "Organization";
  noIndex?: boolean;
  keywords?: string;
  /** Article metadata pour og:article */
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

const SITE_NAME  = "Epitaphe 360";
const BASE_URL   = "https://www.epitaphe360.ma";
const DEFAULT_OG = `${BASE_URL}/og-image.svg`;
const TWITTER_HANDLE = "@epitaphe360";

export function PageMeta({
  title,
  description,
  canonicalPath = "/",
  ogImage = DEFAULT_OG,
  ogImageAlt,
  type = "website",
  schemaType = "WebPage",
  noIndex = false,
  keywords,
  publishedTime,
  modifiedTime,
  author,
}: PageMetaProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonical = `${BASE_URL}${canonicalPath}`;
  const imageAlt  = ogImageAlt ?? `${title} — ${SITE_NAME}`;

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: title,
    description,
    url: canonical,
    image: ogImage,
    ...(schemaType === "Organization" && {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rez de chaussée, Immeuble 7-9, Rue Bussang",
        addressLocality: "Casablanca",
        addressRegion: "Grand Casablanca",
        postalCode: "20000",
        addressCountry: "MA",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+212662744741",
        contactType: "customer service",
        availableLanguage: ["French", "Arabic"],
      },
    }),
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author ?? SITE_NAME} />
      <link rel="canonical" href={canonical} />

      {/* Robots */}
      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      }

      {/* Open Graph */}
      <meta property="og:title"        content={fullTitle} />
      <meta property="og:description"  content={description} />
      <meta property="og:type"         content={type} />
      <meta property="og:url"          content={canonical} />
      <meta property="og:image"        content={ogImage} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"    content={imageAlt} />
      <meta property="og:site_name"    content={SITE_NAME} />
      <meta property="og:locale"       content="fr_MA" />

      {/* Article-specific OG tags */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={TWITTER_HANDLE} />
      <meta name="twitter:creator"     content={TWITTER_HANDLE} />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />
      <meta name="twitter:image:alt"   content={imageAlt} />

      {/* Géolocalisation SEO local Casablanca */}
      <meta name="geo.region"    content="MA-06" />
      <meta name="geo.placename" content="Casablanca" />
      <meta name="geo.position"  content="33.5731;-7.5898" />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrg)}
      </script>
    </Helmet>
  );
}
