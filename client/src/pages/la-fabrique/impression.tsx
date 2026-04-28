import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Printer, Layers, Image, Zap } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Impression Grand Format",
  heroSubtitle: "Bâches, adhésifs, kakemonos, toiles rétroéclairées — une impression haute définition sur tous supports, dans tous les formats.",
  heroTag: "Pôle Impression",
  heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
  heroCta: { label: "Demander un devis", href: "/contact/brief" },

  pitchTitle: "Jusqu'à 5m de large, résolution 1440 dpi",
  pitchBody: "Notre parc de machines d'impression grand format de dernière génération produit des visuels haute fidélité pour vos événements, vos campagnes publicitaires et votre signalétique.",
  pitchStats: [
    { value: "5m", label: "Largeur maximale d'impression" },
    { value: "1440 dpi", label: "Résolution maximale" },
    { value: "48h", label: "Délai express" },
    { value: "10+", label: "Types de supports" },
  ],

  serviceBlocks: [
    {
      icon: <Printer className="w-5 h-5" />,
      title: "Bâches & banderoles",
      description: "Bâches PVC frontlit/backlit, banderoles outdoor haute résistance UV, oriflammes et drapeaux.",
      features: ["PVC 440g–550g", "Résistance UV 3-5 ans", "Œillets toutes les 50cm"],
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "Adhésifs & vinyls",
      description: "Covering vitrine, adhésif repositionnable, stickers découpe, covering voitures et mobiliers.",
      features: ["Repositionnable", "Anti-UV", "Prédécoupe à la forme"],
    },
    {
      icon: <Image className="w-5 h-5" />,
      title: "Toiles & kakémonos",
      description: "Toiles tendues, kakémonos enrouleurs, roll-ups, toiles photo pour décors intérieurs.",
      features: ["Tissu polyester", "Enrouleur inclus", "Format : 0.6m × 2m → 2m × 4m"],
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Impression express",
      description: "Délai 24h–48h pour toutes vos urgences événementielles, avec livraison sur Casablanca.",
      features: ["Livraison Casablanca", "Confirmation J-1", "Prix compétitif"],
    },
  ],

  references: [
    { name: "Maroc Telecom" },
    { name: "Hitex Casablanca" },
    { name: "CGEM" },
    { name: "OCP Group" },
  ],

  ctaTitle: "Un fichier prêt ? Envoyez-le nous",
  ctaBody: "Format PDF haute résolution, EPS ou AI. Nous vérifions votre fichier et vous envoyons un BAT sous 4h.",
  ctaLabel: "Demander un devis impression",
};

export default function Impression() {
  const { data, seoTitle, seoDescription, seoImage } = useServicePage("la-fabrique/impression", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title={seoTitle || "Impression Grand Format — La Fabrique | Epitaphe 360"}
        description={seoDescription || "Bâches, adhésifs, kakemonos, toiles rétroclaireées. Impression haute définition 1440 dpi jusqu'à 5m de large, délai express 24h."}
        canonicalPath="/la-fabrique/impression"
        ogImage={seoImage}
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <ContextualCta pageKey="la-fabrique/impression" />
      <Footer />
    </div>
  );
}
