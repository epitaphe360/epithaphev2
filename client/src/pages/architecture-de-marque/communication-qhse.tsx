import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ShieldCheck, AlertTriangle, FileText, BarChart2 } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Communication QHSE",
  heroSubtitle: "Transformez vos obligations de sécurité en une culture d'entreprise positive qui protège et engage vos équipes.",
  heroTag: "Qualité · Hygiène · Sécurité · Environnement",
  heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80",
  heroCta: { label: "Évaluer mon niveau QHSE", href: "/outils/vigilance-score" },

  pitchTitle: "La conformité QHSE sous-estimée peut coûter cher",
  pitchBody: "Au-delà des obligations légales, une communication QHSE efficace réduit les accidents, améliore la motivation des équipes et renforce votre crédibilité auprès de vos clients et partenaires.",
  pitchStats: [
    { value: "60%", label: "Des accidents évitables grâce à une bonne signalétique" },
    { value: "Loi Sapin II", label: "Outil aligné sur les exigences légales" },
    { value: "RGAA 4.1", label: "Accessibilité garantie" },
    { value: "ISO 45001", label: "Aligné sur les normes internationales" },
  ],

  serviceBlocks: [
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Signalétique sécurité",
      description: "Panneaux d'évacuation, zones de danger, consignes d'hygiène — tout votre système de signalétique réglementaire et esthétique.",
      features: ["Conformité R418", "Matériaux durables", "Pose & installation"],
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Affiches & supports visuels",
      description: "Campagnes internes de sensibilisation, posters de sécurité, kakémonos et bâches pour vos espaces de travail.",
      features: ["Design engageant", "Messages clairs", "Impression résistante"],
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Livrets & guides QHSE",
      description: "Édition de vos documents de sécurité : livret d'accueil, procedures, fiches réflexes, rapports d'audit illustrés.",
      features: ["Mise en page pro", "Impression offset/numérique", "Version digitale"],
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      title: "Outil Vigilance-Score",
      description: "Évaluez votre niveau de conformité QHSE sur 5 dimensions clés et obtentez un rapport PDF personnalisé avec recommendations.",
      features: ["Auto-diagnostic 5 min", "Score 0-100", "Rapport PDF offert"],
    },
  ],

  fabriqueCta: {
    title: "Signalétique produite dans notre atelier",
    body: "Plaques gravées, enseignes lumineuses, panneaux acier ou PVC — toute votre signalétique QHSE est fabriquée en interne avec des matériaux certifiés.",
  },

  references: [
    { name: "ONEE" },
    { name: "Lafarge Maroc" },
    { name: "STAM" },
    { name: "Managem" },
  ],

  testimonials: [
    {
      author: "Responsable QHSE",
      company: "Groupe industriel",
      content: "La refonte de notre signalétique sécurité a réduit nos incidents de 40% en 6 mois. Epitaphe 360 a compris nos enjeux réglementaires dès le brief.",
      rating: 5,
    },
  ],

  ctaTitle: "Votre conformité QHSE commence ici",
  ctaBody: "Testez votre Vigilance-Score QHSE gratuitement ou demandez un audit de votre communication sécurité.",
  ctaLabel: "Tester mon Vigilance-Score",
  ctaHref: "/outils/vigilance-score",
};

export default function CommunicationQhse() {
  const { data } = useServicePage("architecture-de-marque/communication-qhse", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Communication QHSE — Architecture de Marque | Epitaphe 360"
        description="Transformez vos obligations sécurité en culture positive. Affichage réglementaire, procédures d'urgence, formation visuelle QHSE."
        canonicalPath="/architecture-de-marque/communication-qhse"
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <ContextualCta pageKey="architecture-de-marque/communication-qhse" />
      <Footer />
    </div>
  );
}
