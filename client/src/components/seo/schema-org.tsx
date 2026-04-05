/**
 * Composants Schema.org JSON-LD pour le SEO structuré
 * Usage: <OrganizationSchema /> dans App.tsx (une fois)
 *        <ServiceSchema name="..." description="..." url="..." /> dans chaque page service
 */

const BASE_URL = "https://www.epitaphe360.ma";

/** Organisation — à inclure une fois dans App.tsx */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Epitaphe360",
    alternateName: "Epitaphe 360",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Agence de communication événementielle 360° au Maroc — Événements corporate, architecture de marque, signalétique & La Fabrique.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Boulevard Mohammed V",
      addressLocality: "Casablanca",
      postalCode: "20000",
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "33.5731",
      longitude: "-7.5898",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+212-5-22-xx-xx-xx",
        contactType: "customer service",
        availableLanguage: ["French", "Arabic"],
        areaServed: "MA",
      },
    ],
    sameAs: [
      "https://www.linkedin.com/company/epitaphe360",
      "https://www.instagram.com/epitaphe360",
      "https://www.facebook.com/epitaphe360",
    ],
    foundingDate: "2004",
    numberOfEmployees: { "@type": "QuantitativeValue", value: 80 },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Service générique */
export function ServiceSchema({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${BASE_URL}${url}`,
    provider: {
      "@type": "Organization",
      name: "Epitaphe360",
      url: BASE_URL,
    },
    areaServed: { "@type": "Country", name: "Maroc" },
    ...(image && { image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Article de blog */
export function ArticleSchema({
  title,
  description,
  url,
  publishedAt,
  author,
  image,
}: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  author?: string;
  image?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${BASE_URL}${url}`,
    datePublished: publishedAt,
    author: {
      "@type": "Person",
      name: author ?? "Équipe Epitaphe360",
    },
    publisher: {
      "@type": "Organization",
      name: "Epitaphe360",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    ...(image && { image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** FAQ */
export function FaqSchema({ items }: { items: { q: string; a: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * SoftwareApplicationSchema — pour les outils BMI 360™
 * Génère un riche snippet "SoftwareApplication" pour Google et les IA (SearchGPT, Perplexity…)
 */
export function SoftwareApplicationSchema({
  name,
  description,
  url,
  priceMad,
  operatingSystem = "Web",
  applicationCategory = "BusinessApplication",
  screenshotUrl,
  ratingValue,
  ratingCount,
}: {
  name: string;
  description: string;
  url: string;
  priceMad: number;
  operatingSystem?: string;
  applicationCategory?: string;
  screenshotUrl?: string;
  ratingValue?: number;
  ratingCount?: number;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${BASE_URL}${url}`,
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price: priceMad.toString(),
      priceCurrency: "MAD",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Epitaphe360" },
    },
    provider: { "@type": "Organization", name: "Epitaphe360", url: BASE_URL },
  };

  if (screenshotUrl) schema.screenshot = screenshotUrl;
  if (ratingValue && ratingCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue,
      ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * BreadcrumbSchema — fil d'Ariane pour Google rich snippets
 * items: [{ name: "Accueil", url: "/" }, { name: "Outils", url: "/outils" }, ...]
 */
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * LocalBusinessSchema — SEO local Casablanca
 * À inclure sur la page Contact et en complément de OrganizationSchema
 */
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#localbusiness`,
    name: "Epitaphe 360",
    image: `${BASE_URL}/og-image.png`,
    logo: `${BASE_URL}/logo.png`,
    url: BASE_URL,
    telephone: "+212-5-22-xx-xx-xx",
    email: "contact@epitaphe360.ma",
    description:
      "Agence de communication événementielle 360° à Casablanca — Événements corporate, marque employeur, RSE, QHSE et BMI 360™ Scoring Intelligence.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Boulevard Mohammed V",
      addressLocality: "Casablanca",
      postalCode: "20000",
      addressRegion: "Grand Casablanca",
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 33.5731,
      longitude: -7.5898,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "MAD MAD MAD",
    currenciesAccepted: "MAD",
    paymentAccepted: "Cash, Credit Card, Wire Transfer",
    areaServed: [
      { "@type": "City", name: "Casablanca" },
      { "@type": "Country", name: "Maroc" },
    ],
    sameAs: [
      "https://www.linkedin.com/company/epitaphe360",
      "https://www.instagram.com/epitaphe360",
      "https://www.facebook.com/epitaphe360",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebPageSchema — pour SEO AI-ready (chaque page reçoit ses métadonnées structurées)
 */
export function WebPageSchema({
  title,
  description,
  url,
  dateModified,
  breadcrumbs,
}: {
  title: string;
  description: string;
  url: string;
  dateModified?: string;
  breadcrumbs?: { name: string; url: string }[];
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${BASE_URL}${url}`,
    inLanguage: "fr-MA",
    isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Epitaphe 360" },
    ...(dateModified && { dateModified }),
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${BASE_URL}${item.url}`,
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
