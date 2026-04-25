import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { ServicePageTemplate, type ServicePageData } from "@/components/service-page-template";
import { PageMeta } from "@/components/seo/page-meta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Leaf, Globe, FileText, BarChart2 } from "lucide-react";
import { useServicePage } from "@/hooks/useServicePage";

const fallbackData: ServicePageData = {
  heroTitle: "Communication RSE",
  heroSubtitle: "Transformez vos engagements sociétaux en avantage compétitif et renforcez la confiance de vos parties prenantes.",
  heroTag: "COM'RSE",
  heroImage: "https://epitaphe.ma/wp-content/uploads/2020/05/marque-employeur.jpg",
  heroCta: { label: "Valoriser ma démarche RSE", href: "/contact/brief" },

  pitchTitle: "76% des consommateurs préfèrent les marques engagées dans une démarche RSE",
  pitchBody: "La RSE n'est plus un accessoire — c'est un facteur de différenciation majeur. Nous vous aidons à structurer, visualiser et communiquer vos engagements RSE de manière authentique et impactante.",
  pitchStats: [
    { value: "76%", label: "Des consommateurs favorisent les entreprises engagées" },
    { value: "3x", label: "Plus d'attractivité pour les talents avec une RSE visible" },
    { value: "68%", label: "Des investisseurs intègrent la RSE dans leurs critères" },
    { value: "20+", label: "Ans d'expérience en communication d'impact" },
  ],

  serviceBlocks: [
    {
      icon: <Leaf className="w-5 h-5" />,
      title: "Rapport RSE & Impact",
      description: "Conception et mise en page de vos rapports annuels RSE, rapports d'impact, bilans carbones et livrets de durabilité.",
      features: ["Rapport RSE annuel", "Rapport d'impact", "Bilan carbone visuel"],
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Campagnes de communication",
      description: "Campagnes de sensibilisation interne et externe, affichage, supports numériques et événements RSE.",
      features: ["Campagnes visuelles", "Sensibilisation interne", "Actions terrain"],
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Supports & identité RSE",
      description: "Charte graphique RSE, infographies de données d'impact, livrets collaborateurs, kits communication.",
      features: ["Charte RSE", "Infographies impact", "Kit collaborateurs"],
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      title: "Scoring ImpactTrace™",
      description: "Évaluez et suivez l'impact de votre communication RSE avec notre outil propriétaire ImpactTrace™.",
      features: ["Score RSE & Impact", "Tableau de bord", "Plan de progrès"],
    },
  ],

  fabriqueCta: {
    title: "Des supports RSE imprimés et fabriqués en interne",
    body: "Brochures, affiches, kakémonos RSE, stands pour vos forums — notre fabrique produit vos supports dans des délais courts avec des matériaux éco-responsables.",
  },

  references: [
    { name: "OCP Group" },
    { name: "SNEP" },
    { name: "BMCE Bank" },
    { name: "Lydec" },
    { name: "Maroc Telecom" },
  ],

  testimonials: [
    {
      author: "Responsable RSE",
      company: "Groupe industriel coté",
      content: "Notre rapport RSE a reçu des retours très positifs de nos actionnaires et partenaires. La mise en page et l'infographie de nos données ont vraiment fait la différence.",
      rating: 5,
    },
  ],

  ctaTitle: "Faites rayonner votre engagement RSE",
  ctaBody: "Dites-nous où vous en êtes dans votre démarche RSE. Nous vous proposerons un dispositif de communication adapté.",
  ctaLabel: "Lancer mon projet RSE",
};

export default function ComRse() {
  const { data } = useServicePage("nos-poles/com-rse", fallbackData);
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Communication RSE — COM'RSE | Epitaphe 360"
        description="Valorisez vos engagements RSE avec des rapports d'impact, campagnes de sensibilisation et supports visuels sur mesure. Scoring ImpactTrace™ inclus."
        canonicalPath="/nos-poles/com-rse"
      />
      <Navigation />
      <Breadcrumbs />
      <ServicePageTemplate data={data} />
      <ContextualCta pageKey="nos-poles/com-rse" />
      <Footer />
    </div>
  );
}
