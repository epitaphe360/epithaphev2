import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Hammer, Package, Sofa, Wrench } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Menuiserie & Décor",
  heroSubtitle: "Stands sur mesure, mobilier d'ambiance, podiums et structures architecturales éphémères conçus et fabriqués dans notre atelier.",
  heroTag: "Pôle Menuiserie",
  heroImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1400&q=80",
  heroCta: { label: "Commander une structure", href: "/contact/brief" },

  pitchTitle: "Du concept au chantier, tout sous le même toit",
  pitchBody: "Nos menuisiers et décorateurs collaborent avec nos designers pour créer des structures qui allient esthétique, solidité et facilité de montage. Du croquis à la livraison, vous validez chaque étape.",
  pitchStats: [
    { value: "30+", label: "Menuisiers & techniciens" },
    { value: "CNC", label: "Découpe numérique précision 0.1mm" },
    { value: "72h", label: "Délai mini pour structure légère" },
    { value: "100%", label: "Conçu & fabriqué à Casablanca" },
  ],

  serviceBlocks: [
    {
      icon: <Hammer className="w-5 h-5" />,
      title: "Stands événementiels",
      description: "Stands modulables ou sur mesure pour salons, showrooms et espaces de démonstration.",
      features: ["Plans 3D validés avec vous", "Montage & démontage inclus", "Stockage entre 2 événements"],
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: "Podiums & scènes",
      description: "Podiums discours, scènes de spectacle, estrades et passerelles — tout conçu pour votre sécurité et votre image.",
      features: ["Calcul de charge", "Habillage tissu ou bois", "Rampes d'accès"],
    },
    {
      icon: <Sofa className="w-5 h-5" />,
      title: "Mobilier d'ambiance",
      description: "Tables, comptoirs, présentoirs, îlots, bar d'accueil — tout le mobilier qui donne du caractère à votre espace.",
      features: ["Design exclusif", "Finish laque ou bois", "Locations disponibles"],
    },
    {
      icon: <Wrench className="w-5 h-5" />,
      title: "Décors & accessoires",
      description: "Éléments décoratifs, cloisons graphiques, lettrages volumiques, enseignes et totems.",
      features: ["Peinture & patines", "Dorure & chromage", "Néon LED"],
    },
  ],

  references: [
    { name: "OCP Group" },
    { name: "Maroc Telecom" },
    { name: "BCP" },
    { name: "Huawei Maroc" },
  ],

  ctaTitle: "Votre structure livrée clé en main",
  ctaBody: "Partagez vos dimensions, votre identité et vos contraintes — nous fabriquons le reste.",
  ctaLabel: "Demander un devis menuiserie",
};

export default function Menuiserie() {
  const { data, seoTitle, seoDescription, seoImage } = useServicePage("la-fabrique/menuiserie", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title={seoTitle || "Menuiserie & Décor — La Fabrique | Epitaphe 360"}
        description={seoDescription || "Stands sur mesure, mobilier d'ambiance, podiums et structures architecturales temporaires. Fabrication atelier propre, délai express."}
        canonicalPath="/la-fabrique/menuiserie"
        ogImage={seoImage}
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <ContextualCta pageKey="la-fabrique/menuiserie" />
      <Footer />
    </div>
  );
}
