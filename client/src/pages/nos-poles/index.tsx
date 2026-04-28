import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";
import { StatsSection } from "@/components/stats-section";
import { RevealSection } from "@/components/reveal-section";
import { ContextualCta } from "@/components/contextual-cta";
import { Link } from "wouter";
import { MessageSquare, Briefcase, ShieldCheck, Leaf, Calendar, ArrowRight } from "lucide-react";
import { useCmsPage } from "@/hooks/useCmsPage";

const poles = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "COM' Interne",
    desc: "Fédérez vos collaborateurs autour d'une vision commune. Stratégie, supports, événements internes et scoring CommPulse™.",
    href: "/nos-poles/com-interne",
    tag: "Engagement collaborateur",
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Marque Employeur",
    desc: "Attirez et retenez les meilleurs talents. EVP, identité visuelle RH, campagnes recrutement et scénographie RH.",
    href: "/architecture-de-marque/marque-employeur",
    tag: "RH & Attractivité",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "COM'SST-QHSE",
    desc: "Sécurité, santé au travail et conformité visuelle. Signalétique réglementaire, affichage obligatoire et campagnes prévention.",
    href: "/architecture-de-marque/communication-qhse",
    tag: "Sécurité & QHSE",
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "COM'RSE",
    desc: "Valorisez vos engagements sociétaux. Rapports d'impact, campagnes RSE, supports de sensibilisation et scoring ImpactTrace™.",
    href: "/nos-poles/com-rse",
    tag: "Responsabilité sociétale",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "COM' Événementiel",
    desc: "Conventions, galas, roadshows et salons B2B. Des moments qui marquent vos équipes et partenaires.",
    href: "/evenements",
    tag: "Événementiel B2B",
  },
];

export default function NosPolesHub() {
  const cmsContent = useCmsPage('nos-poles');
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Nos pôles d'expertise — Epitaphe 360"
        description="COM' Interne, Marque Employeur, COM'SST-QHSE, COM'RSE et Événementiel : découvrez les 5 pôles d'expertise de l'agence Epitaphe 360 à Casablanca."
        canonicalPath="/nos-poles"
      />
      <Navigation />

      {cmsContent ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16" dangerouslySetInnerHTML={{ __html: cmsContent }} />
      ) : (<>
      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 min-h-[55vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://version2.epitaphe.ma/wp-content/uploads/2025/11/Communication-interne-Industrie-Maroc-700x876.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            <span className="inline-block bg-primary px-4 py-2">Nos pôles</span>
            <br />
            <span className="inline-block bg-primary px-4 py-2 mt-2">d'expertise</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg"
          >
            5 pôles spécialisés pour tous vos enjeux de communication B2B
          </motion.p>
        </div>
      </section>

      {/* ─── Pôles cards ───────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Nos expertises</h2>
              <p className="text-muted-foreground text-sm">De l'engagement collaborateur à la responsabilité sociétale.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {poles.map((pole) => (
                <Link key={pole.href} href={pole.href}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group p-7 h-full flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                      {pole.icon}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mb-2">
                      {pole.tag}
                    </div>
                    <h2 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                      {pole.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{pole.desc}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-5">
                      Découvrir <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>
      </>)}

      <StatsSection />
      <ContextualCta pageKey="evenements" />
      <Footer />
    </div>
  );
}
