import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Users, Mic, Monitor, Music } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Conventions & Kickoffs",
  heroSubtitle: "Fédérez vos équipes autour de vos ambitions stratégiques et créez un élan collectif durable.",
  heroTag: "Événements Internes",
  heroImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80",
  heroCta: { label: "Obtenir une offre", href: "/contact/brief" },

  pitchTitle: "La convention, levier de performance collective",
  pitchBody: "Un moment fort qui aligne toutes vos équipes sur une même vision. Epitaphe 360 transforme vos conventions en expériences immersives qui inspirent, motivent et engagent durablement vos collaborateurs.",
  pitchStats: [
    { value: "+200", label: "Conventions organisées" },
    { value: "5 000+", label: "Participants en simultané" },
    { value: "98%", label: "Taux de satisfaction" },
    { value: "72h", label: "Délai de brief créatif" },
  ],

  serviceBlocks: [
    {
      icon: <Mic className="w-5 h-5" />,
      title: "Conférences plénières",
      description: "Ambiance scénique professionnelle, régie son & lumière, diffusion live streaming pour vos équipes à distance.",
      features: ["Scénographie LED", "Sonorisation & visuel HD", "Streaming simultané"],
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Ateliers participatifs",
      description: "Sessions de co-construction, design thinking, hackathon interne pour stimuler l'intelligence collective.",
      features: ["Facilitation experte", "Outils collaboratifs", "Synthèse livrée J+1"],
    },
    {
      icon: <Monitor className="w-5 h-5" />,
      title: "Production AV",
      description: "Captation, montage, habillage graphique de vos temps forts pour une diffusion interne ou externe.",
      features: ["Captation multi-caméras", "Habillage motion design", "Durée 2–5 min"],
    },
    {
      icon: <Music className="w-5 h-5" />,
      title: "Team-building & entertainment",
      description: "Activités ludiques et fédératrices qui renforcent les liens entre collaborateurs.",
      features: ["50+ activités disponibles", "Adapté à toutes tailles", "Indoor & outdoor"],
    },
  ],

  fabriqueCta: {
    title: "Des décors produits dans notre fabrique",
    body: "Toutes nos structures, stands et éléments scénographiques sont fabriqués en interne dans notre atelier de 3 000 m². Qualité maîtrisée, délais raccourcis, coûts optimisés.",
  },

  references: [
    { name: "OCP Group" },
    { name: "Maroc Telecom" },
    { name: "Attijariwafa Bank" },
    { name: "BMCE Bank" },
    { name: "Royal Air Maroc" },
    { name: "Lydec" },
  ],

  testimonials: [
    {
      author: "Directeur Marketing",
      company: "Groupe OCP",
      content: "Epitaphe 360 a transformé notre convention annuelle en un moment de rassemblement exceptionnel. La scénographie, la logistique, tout était parfait.",
      rating: 5,
    },
  ],

  ctaTitle: "Votre prochaine convention mérite le meilleur",
  ctaBody: "Parlez-nous de votre projet et recevez une proposition créative personnalisée sous 48h.",
  ctaLabel: "Déposer mon brief",
};

export default function ConventionsKickoffs() {
  const { data } = useServicePage("evenements/conventions-kickoffs", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Conventions & Kickoffs — Epitaphe 360"
        description="Fédérez vos équipes autour de vos ambitions stratégiques. Conférences plénières, ateliers participatifs, team-building à fort impact."
        canonicalPath="/evenements/conventions-kickoffs"
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <ContextualCta pageKey="evenements/conventions-kickoffs" />
      <Footer />
    </div>
  );
}
