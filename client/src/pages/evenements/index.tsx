import { Link } from "wouter";
import { motion } from "framer-motion";
import { PageMeta } from "@/components/seo/page-meta";
import { Calendar, Trophy, Truck, Store, ArrowRight, CheckCircle2 } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { RevealSection } from "@/components/reveal-section";
import { Breadcrumbs } from "@/components/breadcrumbs";

const eventTypes = [
  {
    icon: <Calendar className="w-7 h-7" />,
    label: "Conventions & Kickoffs",
    description: "Fédérez vos équipes autour de vos ambitions stratégiques. Conférences plénières, ateliers participatifs, team-building à fort impact.",
    href: "/evenements/conventions-kickoffs",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    features: ["Scénographie immersive", "Production audiovisuelle live", "Animation & facilitation"],
  },
  {
    icon: <Trophy className="w-7 h-7" />,
    label: "Soirées de gala",
    description: "Des moments d'exception qui célèbrent vos succès et renforcent vos liens avec vos parties prenantes.",
    href: "/evenements/soirees-de-gala",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80",
    features: ["Décors sur mesure", "Traiteur premium", "Entertainment exclusif"],
  },
  {
    icon: <Truck className="w-7 h-7" />,
    label: "Roadshows & Tournées",
    description: "Portez votre message dans toutes les villes du Maroc et au-delà avec une logistique parfaitement maîtrisée.",
    href: "/evenements/roadshows",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
    features: ["Logistique multisite", "Stands nomades", "Coordination terrain"],
  },
  {
    icon: <Store className="w-7 h-7" />,
    label: "Salons & Expositions",
    description: "Maximisez votre visibilité et générez des leads qualifiés sur les salons professionnels B2B.",
    href: "/evenements/salons",
    image: "https://images.unsplash.com/photo-1561489396-888724a1543d?w=600&q=80",
    features: ["Stands modulables", "Habillage 360°", "Animations interactives"],
  },
];

const keyFigures = [
  { value: "+500", label: "Événements réalisés" },
  { value: "20 ans", label: "D'expertise" },
  { value: "+200", label: "Clients fidèles" },
  { value: "15", label: "Pays d'intervention" },
];

export default function EvenementsHub() {
  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Événements Corporate — Conventions, Galas & Salons | Epitaphe 360"
        description="Spécialiste des événements d'entreprise au Maroc : conventions, soirées de gala, roadshows et salons professionnels. Scénographie immersive, production audiovisuelle."
        canonicalPath="/evenements"
      />
      <Navigation />
      <Breadcrumbs />
      <main>
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
                Événements Corporate
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-5 max-w-3xl mx-auto leading-tight">
                Des événements qui <span className="text-primary">marquent les esprits</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Epitaphe 360 conçoit et orchestre vos événements d'entreprise de A à Z — de la conception créative jusqu'à la production sur le terrain.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/contact/brief">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm">
                    Déposer un brief <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <Link href="/nos-references">
                  <button className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:border-primary hover:text-primary transition-colors">
                    Voir nos références
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Chiffres clés */}
        <section className="py-10 border-y border-border bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {keyFigures.map((fig, i) => (
              <RevealSection key={i} delay={i * 0.08} className="text-center">
                <p className="text-3xl font-bold text-primary">{fig.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{fig.label}</p>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* Types d'événements */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RevealSection className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Nos expertises événementielles</h2>
              <div className="h-px w-16 bg-primary mx-auto" />
            </RevealSection>
            <div className="grid md:grid-cols-2 gap-6">
              {eventTypes.map((ev, i) => (
                <RevealSection key={i} delay={i * 0.1}>
                  <Link href={ev.href}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <div className="relative h-52 overflow-hidden">
                        <img src={ev.image} alt={ev.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="bg-primary/80 backdrop-blur-sm w-10 h-10 rounded-xl flex items-center justify-center mb-2">{ev.icon}</div>
                          <h3 className="text-xl font-bold">{ev.label}</h3>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-muted-foreground mb-4">{ev.description}</p>
                        <ul className="grid grid-cols-3 gap-2">
                          {ev.features.map((f, j) => (
                            <li key={j} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </Link>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <RevealSection>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Prêt à créer un événement mémorable ?</h2>
              <p className="text-muted-foreground mb-6">Parlez-nous de votre projet et recevez une proposition créative sous 48h.</p>
              <Link href="/contact/brief">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
                  Déposer mon brief <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </RevealSection>
          </div>
        </section>
      </main>
      <ContextualCta pageKey="evenements" />
      <Footer />
    </div>
  );
}
