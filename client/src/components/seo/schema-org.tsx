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
