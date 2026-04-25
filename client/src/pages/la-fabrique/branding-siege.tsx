import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Building2, Palette, Layers, LayoutGrid } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Branding de Siège",
  heroSubtitle: "Transformez votre siège social en manifeste de marque — un espace qui inspire, engage et reflète votre identité à chaque coin de couloir.",
  heroTag: "La Fabrique 360",
  heroImage: "https://epitaphe.ma/wp-content/uploads/2020/05/menuiserie.jpg",
  heroCta: { label: "Transformer mon siège", href: "/contact/brief" },

  pitchTitle: "Votre siège social est votre première publicité",
  pitchBody: "Dès les premières secondes, votre espace de travail communique votre culture, vos valeurs et votre positionnement. Epitaphe 360 conçoit et réalise des environnements de marque qui font impression — sur vos clients, vos partenaires et vos collaborateurs.",
  pitchStats: [
    { value: "89%", label: "Des visiteurs forment une opinion sur votre marque dès l'entrée" },
    { value: "2x", label: "Plus d'attractivité pour les talents avec un espace inspirant" },
    { value: "500+", label: "Projets de branding réalisés depuis 20 ans" },
    { value: "48h", label: "Délai de réponse sur devis" },
  ],

  serviceBlocks: [
    {
      icon: <Building2 className="w-5 h-5" />,
      title: "Habillage entrée & réception",
      description: "Hall d'accueil, murs identitaires, lettres découpées rétroéclairées, totems et signalétique directionnelle.",
      features: ["Mur logo rétroéclairé", "Totem d'accueil", "Signalétique directionnelle"],
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Décoration & identité visuelle",
      description: "Frises chronologiques, murs de valeurs, vitraux brandés, adhésifs décoratifs et impressions grand format.",
      features: ["Frise chronologique", "Mur de valeurs", "Adhésifs grand format"],
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "Espaces collaboratifs",
      description: "Salles de réunion brandées, espaces détente aux couleurs de la marque, cabines acoustiques personnalisées.",
      features: ["Salles de réunion", "Espace détente", "Cabines acoustiques"],
    },
    {
      icon: <LayoutGrid className="w-5 h-5" />,
      title: "Signalétique & wayfinding",
      description: "Plan de circulation, plaques de portes, numérotation d'étages, panneaux directionnels intérieurs et extérieurs.",
      features: ["Plan de circulation", "Plaques de porte", "Numérotation étages"],
    },
  ],

  fabriqueCta: {
    title: "Tout fabriqué dans notre atelier à Casablanca",
    body: "Lettres découpées, caissons lumineux, plaques sérigraphiées, habillages sur mesure — tout est produit en interne pour garantir qualité, délais et cohérence de marque.",
  },

  references: [
    { name: "Qatar Airways" },
    { name: "Schneider Electric" },
    { name: "Dell" },
    { name: "OCP Group" },
    { name: "Ajial" },
  ],

  testimonials: [
    {
      author: "Directeur Général",
      company: "Entreprise multinationale",
      content: "Notre nouveau siège à Casablanca reflète parfaitement notre identité de marque. L'accueil de nos clients a complètement changé depuis la rénovation.",
      rating: 5,
    },
  ],

  ctaTitle: "Donnez à votre siège l'image qu'il mérite",
  ctaBody: "Partagez votre projet avec nous — superficie, délais, budget. Nous vous proposerons un devis détaillé sous 48h.",
  ctaLabel: "Demander un devis",
};

export default function BrandingSiege() {
  const { data } = useServicePage("la-fabrique/branding-siege", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Branding de Siège — La Fabrique 360 | Epitaphe 360"
        description="Transformez votre siège social en manifeste de marque. Habillage entrée, murs identitaires, signalétique, salles de réunion brandées — fabriqué à Casablanca."
        canonicalPath="/la-fabrique/branding-siege"
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <ContextualCta pageKey="la-fabrique/branding-siege" />
      <Footer />
    </div>
  );
}
