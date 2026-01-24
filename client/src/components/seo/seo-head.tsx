import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  schema?: Record<string, any>;
}

export function SEOHead({
  title = "Epitaphe 360 - Agence de Communication 360° | Casablanca, Maroc",
  description = "Leader de la communication 360° au Maroc. Stratégie, branding, digital, événementiel. 20 ans d'expérience. Casablanca.",
  keywords = [
    "agence communication Casablanca",
    "communication 360 Maroc",
    "branding Maroc",
    "événementiel Maroc",
    "marketing digital Casablanca",
  ],
  image = "https://epitaphe360.com/og-image.jpg",
  url = "https://epitaphe360.com",
  type = "website",
  article,
  schema,
}: SEOHeadProps) {
  const siteUrl = "https://epitaphe360.com";
  const fullUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;

  // Schema.org Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Epitaphe 360",
    alternateName: "Epitaphe360",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "Agence de communication 360° basée à Casablanca, Maroc. Spécialisée en branding, digital, événementiel et communication corporate.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Boulevard Mohammed V",
      addressLocality: "Casablanca",
      postalCode: "20000",
      addressCountry: "MA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+212-5XX-XXXXXX",
      contactType: "customer service",
      areaServed: "MA",
      availableLanguage: ["fr", "ar", "en"],
    },
    sameAs: [
      "https://www.facebook.com/epitaphe360",
      "https://www.linkedin.com/company/epitaphe360",
      "https://www.instagram.com/epitaphe360",
      "https://twitter.com/epitaphe360",
    ],
    foundingDate: "2004",
    founders: [
      {
        "@type": "Person",
        name: "Fondateur Epitaphe 360",
      },
    ],
  };

  // Schema.org LocalBusiness
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Epitaphe 360",
    image: `${siteUrl}/logo.png`,
    "@id": siteUrl,
    url: siteUrl,
    telephone: "+212-5XX-XXXXXX",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Boulevard Mohammed V",
      addressLocality: "Casablanca",
      addressRegion: "Casablanca-Settat",
      postalCode: "20000",
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
  };

  const schemaMarkup = schema || {
    "@graph": [organizationSchema, localBusinessSchema],
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Epitaphe 360" />
      <meta property="og:locale" content="fr_MA" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:locale:alternate" content="ar_MA" />

      {/* Article specific Open Graph */}
      {type === "article" && article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@epitaphe360" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@epitaphe360" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="author" content="Epitaphe 360" />
      <meta name="publisher" content="Epitaphe 360" />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
    </Helmet>
  );
}

// Hook pour créer facilement des schemas d'articles
export function useArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  publishedDate: string;
  modifiedDate?: string;
  author: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Epitaphe 360",
      logo: {
        "@type": "ImageObject",
        url: "https://epitaphe360.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  };
}

// Hook pour créer des schemas d'événements
export function useEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address: string;
  };
  image?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.location.address,
        addressLocality: "Casablanca",
        addressCountry: "MA",
      },
    },
    image: event.image ? [event.image] : undefined,
    organizer: {
      "@type": "Organization",
      name: "Epitaphe 360",
      url: "https://epitaphe360.com",
    },
    url: event.url,
  };
}
