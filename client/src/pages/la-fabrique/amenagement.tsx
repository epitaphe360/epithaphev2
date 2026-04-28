import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LayoutGrid, Sofa, Lightbulb, Ruler } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Aménagement d'Espace",
  heroSubtitle: "Scénographie événementielle, architecture éphémère et design d'intérieur — chaque espace devient une expérience.",
  heroTag: "Pôle Aménagement",
  heroImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1400&q=80",
  heroCta: { label: "Déposer un projet", href: "/contact/brief" },

  pitchTitle: "Transformer n'importe quel espace en scène mémorable",
  pitchBody: "D'un hall de conférence vide à un espace de marque immersif — nos scénographes et architectes d'intérieur conçoivent des expériences visuelles complètes, en pensant chaque détail d'ambiance.",
  pitchStats: [
    { value: "+200", label: "Espaces aménagés" },
    { value: "48h", label: "Délai de montage record" },
    { value: "360°", label: "Couverture complète de l'espace" },
    { value: "100%", label: "Clé en main" },
  ],

  serviceBlocks: [
    {
      icon: <LayoutGrid className="w-5 h-5" />,
      title: "Scénographie événementielle",
      description: "Concept artistique global, décors immersifs, installations lumineuses et structures éphémères pour vos événements.",
      features: ["Moodboard exclusif", "Modélisation 3D", "Production & pose"],
    },
    {
      icon: <Sofa className="w-5 h-5" />,
      title: "Design d'intérieur corporate",
      description: "Espaces de travail, salles de réunion, réceptions et showrooms — une identité de marque cohérente dans chaque pièce.",
      features: ["Plans d'aménagement", "Mobilier sur mesure", "Zoning & circulation"],
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Éclairage & ambiance",
      description: "Scénographie lumineuse programmable, éclairage architectural, spots et guirlandes pour créer l'ambiance souhaitée.",
      features: ["DMX & RGBW", "Gradateurs", "Programmation scènes"],
    },
    {
      icon: <Ruler className="w-5 h-5" />,
      title: "Cloisons & séparations",
      description: "Cloisons amovibles, verrières, box acoustiques et séparations décoratives pour structurer vos espaces.",
      features: ["Acoustique renforcée", "Vitrage & tissu", "Démontage facile"],
    },
  ],

  references: [
    { name: "Maroc Telecom" },
    { name: "Accor Maroc" },
    { name: "OCP Group" },
    { name: "CFC Casablanca Finance City" },
  ],

  testimonials: [
    {
      author: "Directeur Immobilier",
      company: "Groupe financier",
      content: "Notre nouveau siège a été aménagé par Epitaphe 360 — l'ensemble de nos collaborateurs s'y sentent fiers et motivés. L'espace respire notre identité.",
      rating: 5,
    },
  ],

  ctaTitle: "Imaginez. Nous concrétisons.",
  ctaBody: "Surface, budget, objectif — partagez votre projet et laissez notre équipe de scénographes l'imaginer.",
  ctaLabel: "Lancer mon projet d'aménagement",
};

export default function Amenagement() {
  const { data, seoTitle, seoDescription, seoImage } = useServicePage("la-fabrique/amenagement", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title={seoTitle || "Aménagement d'Espace — La Fabrique | Epitaphe 360"}
        description={seoDescription || "Scénographie événementielle, architecture éphémère et design d'intérieur. Transformez chaque espace en une expérience de marque."}
        canonicalPath="/la-fabrique/amenagement"
        ogImage={seoImage}
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <ContextualCta pageKey="la-fabrique/amenagement" />
      <Footer />
    </div>
  );
}
