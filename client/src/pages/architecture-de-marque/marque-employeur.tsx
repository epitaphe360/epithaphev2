import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Briefcase, Target, Megaphone, Star } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Marque Employeur",
  heroSubtitle: "Positionnez votre entreprise comme l'employeur de référence de votre secteur pour attirer et fidéliser les meilleurs talents.",
  heroTag: "RH & Attractivité",
  heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80",
  heroCta: { label: "Construire ma marque employeur", href: "/contact/brief" },

  pitchTitle: "73% des talents rejettent une offre à cause d'une image employeur floue",
  pitchBody: "Votre marque employeur n'est pas un luxe — c'est un avantage concurrentiel stratégique. Nous vous aidons à définir, formaliser et déployer une identité employeur cohérente qui attire les profils dont vous avez besoin.",
  pitchStats: [
    { value: "73%", label: "Des talents consultent votre image avant de postuler" },
    { value: "2x", label: "Plus de candidatures qualifiées avec une bonne marque employeur" },
    { value: "28%", label: "De turnover en moins selon Harvard" },
    { value: "1 an+", label: "D'accompagnement stratégique" },
  ],

  serviceBlocks: [
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: "Diagnostic & stratégie",
      description: "Audit de votre image employeur actuelle, benchmark concurrents, définition de votre EVP (Employee Value Proposition).",
      features: ["Enquête interne", "Benchmark sectoriel", "EVP formalisée"],
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Identité visuelle RH",
      description: "Charte graphique dédiée RH, gabarits de communication, templates LinkedIn et jobboards.",
      features: ["Charte RH complète", "Templates adaptés", "Guide d'utilisation"],
    },
    {
      icon: <Megaphone className="w-5 h-5" />,
      title: "Contenus & campagnes",
      description: "Vidéos témoignages collaborateurs, reportages en immersion, campagnes recrutement sur mesure.",
      features: ["Vidéos témoignages", "Campagnes LinkedIn", "Réseaux sociaux"],
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Espaces & scénographie RH",
      description: "Mise en valeur de vos locaux pour les journées portes ouvertes, forums étudiants et événements recrutement.",
      features: ["Habillage espace", "Décors événementiels", "Stands recrutement"],
    },
  ],

  fabriqueCta: {
    title: "Des supports RH fabriqués en interne",
    body: "Roll-ups, backdrop, totems, bornes interactives — tous vos supports de recrutement sont produits dans notre fabrique pour une cohérence de marque parfaite.",
  },

  references: [
    { name: "Maroc Telecom" },
    { name: "BCP" },
    { name: "OCP Group" },
    { name: "Lydec" },
    { name: "BMCE Bank" },
  ],

  testimonials: [
    {
      author: "Directrice RH",
      company: "Groupe minier",
      content: "Depuis la refonte de notre marque employeur avec Epitaphe 360, nos candidatures ont doublé en qualité. Notre image sur LinkedIn a totalement changé.",
      rating: 5,
    },
  ],

  ctaTitle: "Devenez l'employeur que les talents s'arrachent",
  ctaBody: "Dites-nous où vous en êtes et nous vous proposerons une feuille de route claire.",
  ctaLabel: "Lancer mon projet",
};

export default function MarqueEmployeur() {
  const { data } = useServicePage("architecture-de-marque/marque-employeur", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Marque Employeur — Architecture de Marque | Epitaphe 360"
        description="Positionnez votre entreprise comme l'employeur de référence. Stratégie, contenus, outils de recrutement et onboarding personnalisé."
        canonicalPath="/architecture-de-marque/marque-employeur"
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <Footer />
    </div>
  );
}
