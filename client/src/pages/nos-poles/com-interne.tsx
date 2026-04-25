import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MessageSquare, Users, Newspaper, BarChart2 } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Communication Interne",
  heroSubtitle: "Fédérez vos collaborateurs autour d'une vision commune et transformez votre culture d'entreprise en levier de performance.",
  heroTag: "COM' Interne",
  heroImage: "https://epitaphe.ma/wp-content/uploads/2020/05/conventions.jpg",
  heroCta: { label: "Booster ma com' interne", href: "/contact/brief" },

  pitchTitle: "87% des collaborateurs se sentent désengagés faute d'une communication interne efficace",
  pitchBody: "Une communication interne forte, c'est moins de turnover, plus de productivité et une culture d'entreprise qui attire les talents. Epitaphe 360 conçoit des dispositifs sur mesure qui donnent du sens au quotidien de vos équipes.",
  pitchStats: [
    { value: "87%", label: "Des employés se sentent peu informés par leur management" },
    { value: "4x", label: "Plus de productivité dans les entreprises à fort engagement" },
    { value: "-41%", label: "De turnover avec une com' interne structurée" },
    { value: "20+", label: "Ans d'expérience en communication B2B" },
  ],

  serviceBlocks: [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Stratégie & audit de communication",
      description: "Diagnostic de vos flux d'information, cartographie des parties prenantes internes, définition du plan de communication.",
      features: ["Audit communicationnel", "Plan de com' annuel", "Charte éditoriale interne"],
    },
    {
      icon: <Newspaper className="w-5 h-5" />,
      title: "Supports & contenus",
      description: "Journaux internes, newsletters, affiches, kakémonos, kits d'onboarding et livrets d'accueil.",
      features: ["Journal d'entreprise", "Newsletter mensuelle", "Kit onboarding"],
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Événements internes",
      description: "Conventions, séminaires, kick-offs, team buildings : des moments de cohésion qui marquent les esprits.",
      features: ["Conventions annuelles", "Séminaires motivation", "Célébrations RH"],
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      title: "Mesure & scoring CommPulse™",
      description: "Mesurez l'efficacité de votre communication interne avec notre outil propriétaire CommPulse™.",
      features: ["Score COM' Interne", "Tableau de bord KPI", "Plan d'amélioration"],
    },
  ],

  fabriqueCta: {
    title: "Tous vos supports produits en interne",
    body: "Affiches grand format, kakémonos, roll-ups, PLV — notre fabrique produit l'ensemble de vos supports de communication interne pour une réactivité maximale.",
  },

  references: [
    { name: "OCP Group" },
    { name: "Maroc Telecom" },
    { name: "BMCE Bank" },
    { name: "Schneider Electric" },
    { name: "Dell" },
  ],

  testimonials: [
    {
      author: "Directeur de la Communication",
      company: "Groupe industriel",
      content: "Epitaphe 360 a complètement transformé notre façon de communiquer en interne. Les résultats sur l'engagement des équipes sont mesurables.",
      rating: 5,
    },
  ],

  ctaTitle: "Construisez une culture d'entreprise forte",
  ctaBody: "Parlez-nous de vos enjeux RH et de communication. Nous vous proposerons un plan d'action adapté.",
  ctaLabel: "Démarrer mon projet",
};

export default function ComInterne() {
  const { data } = useServicePage("nos-poles/com-interne", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Communication Interne — COM' Interne | Epitaphe 360"
        description="Fédérez vos collaborateurs avec une stratégie de communication interne sur mesure. Supports, événements, scoring CommPulse™ et plan de communication annuel."
        canonicalPath="/nos-poles/com-interne"
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <ContextualCta pageKey="nos-poles/com-interne" />
      <Footer />
    </div>
  );
}
