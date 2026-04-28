import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Users, Map, Store, Smartphone } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Expérience Clients",
  heroSubtitle: "Concevez chaque point de contact pour délivrer une expérience de marque cohérente, mémorable et différenciante.",
  heroTag: "CX & Brand Experience",
  heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80",
  heroCta: { label: "Améliorer mon expérience client", href: "/contact/brief" },

  pitchTitle: "86% des clients paieraient plus pour une meilleure expérience",
  pitchBody: "L'expérience client n'est plus un différenciateur — c'est une obligation. Epitaphe 360 vous aide à cartographier, concevoir et déployer chaque touchpoint pour créer une expérience cohérente qui fidélise et génère des recommandations.",
  pitchStats: [
    { value: "86%", label: "Des clients prêts à payer plus pour une meilleure CX" },
    { value: "5x", label: "Plus rentable de fidéliser que d'acquérir" },
    { value: "NPS+", label: "Impact mesuré sur le Net Promoter Score" },
    { value: "360°", label: "Couverture de tous vos points de contact" },
  ],

  serviceBlocks: [
    {
      icon: <Map className="w-5 h-5" />,
      title: "Customer Journey Mapping",
      description: "Modélisation de tous vos points de contact client, identification des friction points et opportunités d'amélioration.",
      features: ["Ateliers discovery", "Cartographie visuelle", "Feuille de route priorisée"],
    },
    {
      icon: <Store className="w-5 h-5" />,
      title: "Design d'espace client",
      description: "Scénographie de vos agences, showrooms et espaces d'accueil pour une expérience immersive et mémorable.",
      features: ["Concept store", "Mobilier sur mesure", "Signalétique intégrée"],
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Supports commerciaux",
      description: "Catalogues, brochures, PLV et outils d'aide à la vente qui valorisent votre offre et facilitent la décision d'achat.",
      features: ["Catalogue print & digital", "PLV conçue & produite", "Kit vendeurs"],
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Activation digitale",
      description: "QR codes intelligents, bornes interactives et expériences phygitales qui connectent vos espaces physiques au digital.",
      features: ["QR codes trackés", "Bornes tactiles", "Analytics visiteurs"],
    },
  ],

  fabriqueCta: {
    title: "Votre espace client fabriqué sur mesure",
    body: "Mobilier, comptoirs d'accueil, cloisons décoratives, totems interactifs — notre atelier conçoit et produit chaque élément de votre espace client.",
  },

  references: [
    { name: "Maroc Telecom" },
    { name: "Banque Populaire" },
    { name: "Renault Maroc" },
    { name: "BMCE Bank" },
    { name: "Canal+" },
  ],

  testimonials: [
    {
      author: "Directeur Commercial",
      company: "Groupe télécom",
      content: "La refonte de nos points de vente avec Epitaphe 360 a augmenté notre NPS de 18 points. Chaque détail a été pensé pour notre client.",
      rating: 5,
    },
  ],

  ctaTitle: "Placez le client au cœur de chaque décision",
  ctaBody: "Parlez-nous de votre parcours client actuel et nous identifierons ensemble les leviers d'amélioration prioritaires.",
  ctaLabel: "Analyser mon expérience client",
};

export default function ExperienceClients() {
  const { data, seoTitle, seoDescription, seoImage } = useServicePage("architecture-de-marque/experience-clients", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title={seoTitle || "Expérience Clients — Architecture de Marque | Epitaphe 360"}
        description={seoDescription || "Concevez chaque point de contact pour une expérience de marque cohérente et mémorable. Journey mapping, design sensoriel, digitalisation."}
        canonicalPath="/architecture-de-marque/experience-clients"
        ogImage={seoImage}
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <ContextualCta pageKey="architecture-de-marque/experience-clients" />
      <Footer />
    </div>
  );
}
