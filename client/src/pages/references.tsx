/**
 * Page Références — /nos-references
 * - Études de cas dynamiques depuis DB
 * - Logos clients filtrables par secteur
 * - CDC 2.5 : maillage interne vers études de cas
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";
import { StatsSection } from "@/components/stats-section";
import { RevealSection } from "@/components/reveal-section";
import { ContextualCta } from "@/components/contextual-cta";
import { ArrowRight, Filter, Building2, TrendingUp, Calendar } from "lucide-react";

interface CaseStudy {
  id: string; title: string; slug: string; clientName?: string; problem?: string;
  featuredImage?: string; isFeatured?: boolean; publishedAt?: string;
  kpis?: { value: string; label: string }[];
}

const clientCategories = [
  { name: "Bâtiment et Travaux Publics (BTP)", sector: "BTP", clients: [
    { name: "LafargeHolcim", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/lafargeholcim.jpg" },
    { name: "Weber", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/weber.jpg" },
    { name: "AkzoNobel", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/akzonobel.jpg" },
    { name: "Saint-Gobain", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/saintgobain.jpg" },
    { name: "DLM", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/DLM.jpg" },
    { name: "Norton", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/norton.jpg" },
  ]},
  { name: "Industrie", sector: "Industrie", clients: [
    { name: "SNEP", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/SNEP.jpg" },
    { name: "Schneider Electric", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/schneiderelectric.jpg" },
    { name: "Vinci Energies", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/LOGO_VINCI_ENERGIES.png" },
    { name: "Air Liquide", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/airliquide.jpg" },
    { name: "Renault", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/renault.jpg" },
    { name: "Dacia", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/dacia.jpg" },
    { name: "Cosumar", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/cosumar.jpg" },
    { name: "Lesieur Cristal", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/lesieurcristal.jpg" },
  ]},
  { name: "IT & Télécoms", sector: "IT", clients: [
    { name: "Huawei", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/huawei.jpg" },
    { name: "Dell", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/dell.jpg" },
    { name: "Intel", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/intel.jpg" },
    { name: "Avaya", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/avaya.jpg" },
    { name: "Arrow", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/arrow.jpg" },
    { name: "Ingram", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/ingram.jpg" },
  ]},
  { name: "Transport & Logistique", sector: "Transport", clients: [
    { name: "Tanger Med", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/trangermed.jpg" },
    { name: "Qatar Airways", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/qatarairways.jpg" },
    { name: "FedEx", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/fedex.jpg" },
    { name: "Bolloré", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/bollore.jpg" },
    { name: "TMSA", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/TMSA.jpg" },
  ]},
  { name: "Finance & Assurance", sector: "Finance", clients: [
    { name: "AXA", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/axa.jpg" },
    { name: "Finea", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/finea.jpg" },
    { name: "Agma", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/agma.jpg" },
    { name: "HPS", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/logo_hps.png" },
    { name: "CMMB", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/logo-CMMB.png" },
  ]},
  { name: "Administration & Secteur Public", sector: "Public", clients: [
    { name: "Casa Tram", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/casa-tram.jpg" },
    { name: "Wilaya de Casablanca", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/wilayadecasa.jpg" },
    { name: "UITP", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/UITP.jpg" },
    { name: "CRI", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/CRI.jpg" },
    { name: "Entraide", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/entraide.jpg" },
  ]},
];

function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <Link href={`/nos-references/${cs.slug}`}>
      <motion.article whileHover={{ y: -4 }} className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col">
        <div className="relative h-48 bg-muted overflow-hidden">
          {cs.featuredImage ? (
            <img src={cs.featuredImage} alt={cs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-primary/30" />
            </div>
          )}
          {cs.isFeatured && <div className="absolute top-3 left-3 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">À la une</div>}
          {cs.clientName && <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">{cs.clientName}</div>}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-foreground text-base leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">{cs.title}</h3>
          {cs.problem && <p className="text-muted-foreground text-sm line-clamp-2 flex-1 mb-3">{cs.problem}</p>}
          {cs.kpis && cs.kpis.length > 0 && (
            <div className="flex gap-3 mb-4">
              {cs.kpis.slice(0, 2).map((kpi, i) => (
                <div key={i} className="bg-primary/8 rounded-lg px-3 py-1.5 text-center">
                  <p className="text-sm font-bold text-primary">{kpi.value}</p>
                  <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                </div>
              ))}
            </div>
          )}
          {cs.publishedAt && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <Calendar className="w-3 h-3" />
              {new Date(cs.publishedAt).toLocaleDateString("fr-FR", { year: "numeric", month: "short" })}
            </p>
          )}
          <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-auto">
            Voir l'étude de cas <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export default function ReferencesPage() {
  const [activeSector, setActiveSector] = useState("Tous");
  const ALL_SECTORS = ["Tous", ...clientCategories.map(c => c.sector)];

  const { data: caseStudiesData } = useQuery<{ data: CaseStudy[] }>({
    queryKey: ["case-studies-public"],
    queryFn: async () => {
      const res = await fetch("/api/case-studies/public");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });
  const caseStudies = caseStudiesData?.data ?? [];
  const filteredCategories = activeSector === "Tous" ? clientCategories : clientCategories.filter(c => c.sector === activeSector);

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Nos Références Clients — Epitaphe 360"
        description="Plus de 500 entreprises nous font confiance. Découvrez nos références et études de cas par secteur."
        canonicalPath="/nos-references"
      />
      <Navigation />

      <section className="relative pt-20 min-h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://epitaphe.ma/wp-content/uploads/2020/05/nos-references-clients.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-background" />
        <div className="relative z-10 text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="inline-block bg-primary px-4 py-2">Ils nous font</span>
            <br />
            <span className="inline-block bg-primary px-4 py-2 mt-2">confiance</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/80 text-lg">500+ entreprises au Maroc et à l'international</motion.p>
        </div>
      </section>

      {caseStudies.length > 0 && (
        <section className="py-16 bg-muted/20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RevealSection>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Études de cas</h2>
                  <p className="text-muted-foreground text-sm">Nos réalisations les plus marquantes</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary/30" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {caseStudies.map(cs => <CaseStudyCard key={cs.id} cs={cs} />)}
              </div>
            </RevealSection>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Nos clients par secteur</h2>
              <p className="text-muted-foreground text-sm mb-8">Depuis 2005, des entreprises de tous secteurs nous font confiance.</p>
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                <Filter className="w-4 h-4 text-muted-foreground self-center mr-1" />
                {ALL_SECTORS.map(sector => (
                  <motion.button key={sector} onClick={() => setActiveSector(sector)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSector === sector ? "bg-primary text-white shadow-sm" : "bg-card border border-border text-foreground/70 hover:border-primary/40 hover:text-primary"}`}>
                    {sector}
                  </motion.button>
                ))}
              </div>
            </div>
          </RevealSection>
          <AnimatePresence mode="wait">
            <motion.div key={activeSector} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              {filteredCategories.map((category) => (
                <div key={category.name} className="mb-14">
                  <h3 className="text-lg font-bold text-center mb-6 text-primary flex items-center justify-center gap-2">
                    <Building2 className="w-5 h-5" />{category.name}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {category.clients.map((client) => (
                      <motion.div key={client.name} whileHover={{ y: -3 }}
                        className="bg-white dark:bg-card rounded-xl p-4 flex items-center justify-center aspect-[3/2] border border-border/50 hover:border-primary/20 transition-all"
                        title={client.name}>
                        <img src={client.logo} alt={client.name} className="max-h-14 max-w-full object-contain grayscale hover:grayscale-0 transition-all" loading="lazy" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <StatsSection />
      <ContextualCta pageKey="evenements" />
      <Footer />
    </div>
  );
}