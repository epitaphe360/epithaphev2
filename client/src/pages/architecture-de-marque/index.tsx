import { Link } from "wouter";
import { motion } from "framer-motion";
import { Briefcase, ShieldCheck, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageMeta } from "@/components/seo/page-meta";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { RevealSection } from "@/components/reveal-section";
import { Breadcrumbs } from "@/components/breadcrumbs";

const services = [
  {
    icon: <Briefcase className="w-7 h-7" />,
    label: "Marque Employeur",
    description: "Positionnez votre entreprise comme employeur de référence pour attirer et fidéliser les talents dans un marché compétitif.",
    href: "/architecture-de-marque/marque-employeur",
    color: "from-blue-500/20 to-blue-600/5",
    features: ["Charte visuels RH", "Supports d'attraction", "Communication interne"],
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    label: "Communication QHSE",
    description: "Transformez vos obligations de sécurité en leviers de culture d'entreprise positifs et engageants.",
    href: "/architecture-de-marque/communication-qhse",
    color: "from-green-500/20 to-green-600/5",
    features: ["Signalétique sécurité", "Affiches & kakémonos", "Outil Vigilance-Score"],
  },
  {
    icon: <Users className="w-7 h-7" />,
    label: "Expérience Clients",
    description: "Concevez chaque point de contact avec vos clients pour délivrer une expérience cohérente et différenciante.",
    href: "/architecture-de-marque/experience-clients",
    color: "from-pink-500/20 to-pink-600/5",
    features: ["Customer journey", "Design d'espace", "Supports vente"],
  },
];

const differentiators = [
  "Approche 360° — création, production & déploiement",
  "Studio de création intégré (DA, motion, print)",
  "Fabrication propre (impression, menuiserie, signalétique)",
  "Conseil stratégique + exécution opérationnelle",
  "Interlocuteur unique du brief à la livraison",
];

export default function ArchitectureDeMarqueHub() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Architecture de Marque — Marque Employeur, QHSE & Expérience Client | Epitaphe 360"
        description="Construisez une marque forte et différenciante. Marque employeur, communication QHSE et expérience client repensée de A à Z."
        canonicalPath="/architecture-de-marque"
      />
      <Navigation />
      <Breadcrumbs />
      <main>
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
                  Architecture de Marque
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-5 leading-tight">
                  Construisez une marque qui <span className="text-primary">inspire la confiance</span>
                </h1>
                <p className="text-muted-foreground text-lg mb-8">
                  De votre identité employeur à vos espaces client, Epitaphe 360 déploie votre marque avec cohérence, impact et authenticité.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact/brief">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm">
                      Déposer un brief <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                  <Link href="/outils/vigilance-score">
                    <button className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:border-primary hover:text-primary transition-colors">
                      Tester mon score QHSE
                    </button>
                  </Link>
                </div>
              </motion.div>
              <RevealSection direction="left" className="hidden md:block">
                <div className="grid grid-cols-2 gap-3">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" alt="Espace de travail moderne" className="rounded-2xl object-cover h-48 w-full" />
                  <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80" alt="Bureau collaboratif" className="rounded-2xl object-cover h-48 w-full mt-6" />
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RevealSection className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Nos expertises en architecture de marque</h2>
              <div className="h-px w-16 bg-primary mx-auto" />
            </RevealSection>
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((svc, i) => (
                <RevealSection key={i} delay={i * 0.1}>
                  <Link href={svc.href}>
                    <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ duration: 0.2 }}
                      className={`group bg-gradient-to-br ${svc.color} border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer h-full`}>
                      <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                        {svc.icon}
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{svc.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{svc.description}</p>
                      <ul className="space-y-1.5">
                        {svc.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
                        Découvrir <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* Différenciateurs */}
        <section className="py-14 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <RevealSection>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Pourquoi Epitaphe 360 ?</h2>
                <ul className="space-y-3">
                  {differentiators.map((d, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /> {d}
                    </li>
                  ))}
                </ul>
              </RevealSection>
              <RevealSection direction="left">
                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80" alt="Équipe Epitaphe 360" className="rounded-2xl w-full object-cover max-h-72" />
              </RevealSection>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <RevealSection>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Votre marque mérite d'être vue</h2>
              <p className="text-muted-foreground mb-6">Partagez votre défi et nous vous proposerons une stratégie créative adaptée.</p>
              <Link href="/contact/brief">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-sm">
                  Déposer mon brief <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </RevealSection>
          </div>
        </section>
      </main>
      <ContextualCta pageKey="architecture-de-marque" />
      <Footer />
    </div>
  );
}
