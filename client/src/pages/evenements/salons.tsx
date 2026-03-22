import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Store, TrendingUp, Eye, Users } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Salons & Expositions professionnelles",
  heroSubtitle: "Maximisez votre visibilité et générez des leads qualifiés lors des salons B2B les plus importants.",
  heroTag: "B2B & Networkin",
  heroImage: "https://images.unsplash.com/photo-1561489396-888724a1543d?w=1400&q=80",
  heroCta: { label: "Concevoir mon stand", href: "/contact/brief" },

  pitchTitle: "Votre stand, votre ambassade commerciale",
  pitchBody: "Sur un salon professionnel, votre stand est le reflet de votre sérieux et de votre ambition. Epitaphe 360 conçoit des espaces qui captent l'attention, facilitent la conversation commerciale et génèrent des résultats mesurables.",
  pitchStats: [
    { value: "+300", label: "Stands réalisés" },
    { value: "9 m²–500 m²", label: "Toutes dimensions" },
    { value: "+2M", label: "Visiteurs exposés" },
    { value: "40+", label: "Salons couverts / an" },
  ],

  serviceBlocks: [
    {
      icon: <Store className="w-5 h-5" />,
      title: "Stands modulables",
      description: "Structures réutilisables et reconfigurables selon les dimensions de chaque salon, pour optimiser votre budget.",
      features: ["Réutilisable 5+ fois", "Montage rapide", "Stockage inclus"],
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Stands sur mesure",
      description: "Design architectural unique, matériaux premium, expérience visiteur pensée pour maximiser l'engagement.",
      features: ["Conception 3D", "Matériaux haut de gamme", "Expérience immersive"],
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Habillage & signalétique",
      description: "Impression grand format, totems, kakemonos, roll-ups et toute la signalétique de guidage sur site.",
      features: ["Grand format HD", "Pose sur site", "Retrait & stockage"],
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Animation & lead capture",
      description: "Jeux concours, démonstrations produit, badges connectés et capture de leads intégrée au CRM.",
      features: ["Badge scanning", "Intégration CRM", "Rapport visiteurs"],
    },
  ],

  fabriqueCta: {
    title: "Stands fabriqués dans notre atelier 3000 m²",
    body: "Du mobilier en chêne massif aux structures métal brossé, chaque élément est conçu et construit dans nos ateliers pour une qualité de finition irréprochable.",
  },

  references: [
    { name: "Hitex" },
    { name: "SIHAM" },
    { name: "Forum de l'Étudiant" },
    { name: "Pollutec Maroc" },
  ],

  ctaTitle: "Votre prochain salon, un succès commercial",
  ctaBody: "Partagez votre prochain salon et nous vous proposerons un stand qui convertit.",
  ctaLabel: "Concevoir mon stand",
};

export default function Salons() {
  const { data } = useServicePage("evenements/salons", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Salons & Expositions Professionnelles — Epitaphe 360"
        description="Maximisez votre visibilité et générez des leads qualifiés lors des salons B2B. Stands sur mesure, signalétique, animation commerciale."
        canonicalPath="/evenements/salons"
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <Footer />
    </div>
  );
}
