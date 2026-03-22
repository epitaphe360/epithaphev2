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
  type?: "website" | "article" | "product";
  schemaType?: "WebPage" | "Service" | "Article" | "Organization";
  noIndex?: boolean;
  keywords?: string;
}

const SITE_NAME = "Epitaphe360";
const BASE_URL  = "https://www.epitaphe360.ma";
const DEFAULT_OG = `${BASE_URL}/og-default.jpg`;

export function PageMeta({
  title,
  description,
  canonicalPath = "/",
  ogImage = DEFAULT_OG,
  type = "website",
  schemaType = "WebPage",
  noIndex = false,
  keywords,
}: PageMetaProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonical = `${BASE_URL}${canonicalPath}`;

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: title,
    description,
    url: canonical,
    ...(schemaType === "Organization" && {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "123 Boulevard Mohammed V",
        addressLocality: "Casablanca",
        addressCountry: "MA",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+212-5-22-xx-xx-xx",
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
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type"        content={type} />
      <meta property="og:url"         content={canonical} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:locale"      content="fr_MA" />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrg)}
      </script>
    </Helmet>
  );
}
