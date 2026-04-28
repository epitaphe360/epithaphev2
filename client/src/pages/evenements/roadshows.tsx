import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Map, Truck, Radio, BarChart2 } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Roadshows & Tournées nationales",
  heroSubtitle: "Portez votre message dans toutes les villes avec une logistique maîtrisée et un impact uniforme sur chaque site.",
  heroTag: "Multisite & Logistique",
  heroImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1400&q=80",
  heroCta: { label: "Planifier mon roadshow", href: "/contact/brief" },

  pitchTitle: "Une présence cohérente dans tout le pays",
  pitchBody: "Un roadshow réussi repose sur une préparation minutieuse et une exécution impeccable répliquée sur chaque site. Epitaphe 360 assure la même qualité du premier au dernier arrêt.",
  pitchStats: [
    { value: "50+", label: "Tournées organisées" },
    { value: "20+", label: "Villes couvertes" },
    { value: "100%", label: "Cohérence de marque garantie" },
    { value: "48h", label: "Délai de montage/démontage" },
  ],

  serviceBlocks: [
    {
      icon: <Map className="w-5 h-5" />,
      title: "Planification itinéraire",
      description: "Définition du circuit optimal, identification des sites, gestion des autorisations et permis.",
      features: ["Route optimisée", "Permis locaux", "Planning JJ"],
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Transport & logistique",
      description: "Flotte de véhicules dédiée, suivi GPS en temps réel, équipes terrain mobilisées sur chaque ville.",
      features: ["Poids lourds & utilitaires", "Tracking temps réel", "Stock sécurisé"],
    },
    {
      icon: <Radio className="w-5 h-5" />,
      title: "Stands nomades",
      description: "Structures légères, rapides à monter et démontage, identiques sur chaque ville pour une cohérence visuelle totale.",
      features: ["Montage < 4h", "Modulable", "Marque unifiée"],
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      title: "Reporting & mesure",
      description: "Dashboard de suivi en temps réel, comptage visiteurs, rapports par ville et global.",
      features: ["KPIs par site", "Photos & vidéos", "Rapport final"],
    },
  ],

  fabriqueCta: {
    title: "Stands fabriqués pour résister aux tournées",
    body: "Nos ateliers conçoivent des structures légères, durables et pliables, spécialement pensées pour une utilisation intensive sur tournée.",
  },

  references: [
    { name: "Maroc Telecom" },
    { name: "Orange Maroc" },
    { name: "Wafa Assurance" },
    { name: "CIH Bank" },
  ],

  ctaTitle: "Lancez votre prochaine tournée nationale",
  ctaBody: "Envoyez-nous votre brief et recevez un plan opérationnel détaillé sous 72h.",
  ctaLabel: "Planifier ma tournée",
};

export default function Roadshows() {
  const { data, seoTitle, seoDescription, seoImage } = useServicePage("evenements/roadshows", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title={seoTitle || "Roadshows & Tournées Nationales — Epitaphe 360"}
        description={seoDescription || "Portez votre message dans toutes les villes du Maroc. Logistique maîtrisée, impact uniforme sur chaque site, coordination complète."}
        canonicalPath="/evenements/roadshows"
        ogImage={seoImage}
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <ContextualCta pageKey="evenements/roadshows" />
      <Footer />
    </div>
  );
}
