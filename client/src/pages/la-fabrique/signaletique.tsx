import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Signpost, Lightbulb, Map, ShieldCheck } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Signalétique professionnelle",
  heroSubtitle: "Totems lumineux, enseignes, wayfinding et signalétique directionnelle — votre identité déployée dans tous vos espaces.",
  heroTag: "Pôle Signalétique",
  heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80",
  heroCta: { label: "Étudier mon projet", href: "/contact/brief" },

  pitchTitle: "La signalétique, votre marque au quotidien",
  pitchBody: "Vos collaborateurs, clients et visiteurs voient votre signalétique chaque jour. Elle doit être lisible, esthétique et cohérente avec votre identité. Epitaphe 360 conçoit et produit l'ensemble de votre système de signalétique.",
  pitchStats: [
    { value: "+500", label: "Chantiers de signalétique réalisés" },
    { value: "10 ans", label: "Durée de vie garantie" },
    { value: "IP65", label: "Protection outdoor" },
    { value: "LED", label: "Éclairage basse consommation" },
  ],

  serviceBlocks: [
    {
      icon: <Signpost className="w-5 h-5" />,
      title: "Signalétique directionnelle",
      description: "Panneaux fléchés, bornes de wayfinding, cartographie d'espaces et systèmes de guidage pour bâtiments et campus.",
      features: ["Design système cohérent", "Pictogrammes inclus", "Multilingue possible"],
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Enseignes & totems",
      description: "Enseignes lumineuses LED, totems double-face, caissons lumineux et lettres découpées en relief.",
      features: ["Caissons aluminium", "LED longue durée 50 000h", "Dimmer programmable"],
    },
    {
      icon: <Map className="w-5 h-5" />,
      title: "Plaques & mobilier",
      description: "Plaques de porte, numérotations, plaques de salles de réunion, boîtes aux lettres et mobilier de hall.",
      features: ["Acier inox brossé", "Aluminium anodisé", "Gravure laser"],
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Signalétique QHSE",
      description: "Signalétique de sécurité incendie, évacuation, EPI obligatoires et zones réglementées conformes aux normes.",
      features: ["Conformité norme NF", "Photoluminescent", "Pose & installation"],
    },
  ],

  references: [
    { name: "CDG" },
    { name: "ONCF" },
    { name: "Lydec" },
    { name: "STEF Maroc" },
  ],

  ctaTitle: "Donnez une identité forte à tous vos espaces",
  ctaBody: "Plan de votre bâtiment ou liste de besoins — nos consultants signalétique vous accompagnent.",
  ctaLabel: "Demander un audit signalétique",
};

export default function Signaletique() {
  const { data } = useServicePage("la-fabrique/signaletique", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Signalétique Professionnelle — La Fabrique | Epitaphe 360"
        description="Totéms lumineux, enseignes, wayfinding et signalétique directionnelle. Déployez votre identité de marque dans tous vos espaces."
        canonicalPath="/la-fabrique/signaletique"
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <ContextualCta pageKey="la-fabrique/signaletique" />
      <Footer />
    </div>
  );
}
