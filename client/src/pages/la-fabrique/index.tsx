import { Link } from "wouter";
import { motion } from "framer-motion";
import { Printer, Hammer, Signpost, LayoutGrid, ArrowRight, CheckCircle2, Factory } from "lucide-react";
import { PageMeta } from "@/components/seo/page-meta";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContextualCta } from "@/components/contextual-cta";
import { RevealSection } from "@/components/reveal-section";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { useSettings } from "@/hooks/useSettings";

// Map icône par slug de pôle (non sérialisable en JSON/DB → hardcodé)
const POLE_ICONS: Record<string, React.ReactNode> = {
  impression: <Printer className="w-7 h-7" />,
  menuiserie: <Hammer className="w-7 h-7" />,
  signaletique: <Signpost className="w-7 h-7" />,
  amenagement: <LayoutGrid className="w-7 h-7" />,
};

const FALLBACK_POLES = [
  {
    icon: "impression",
    label: "Impression Grand Format",
    description: "Bâches, adhésifs, toiles rétroéclairées, impressions haute définition pour tous supports.",
    href: "/la-fabrique/impression",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    specs: ["Résolution 1440 dpi", "Largeur max 5m", "Finitions : œillets, ourlets, enrouleur"],
  },
  {
    icon: "menuiserie",
    label: "Menuiserie & Décor",
    description: "Stands sur mesure, mobilier d'ambiance, structures d'exposition et éléments architecturaux.",
    href: "/la-fabrique/menuiserie",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80",
    specs: ["CNC & découpe laser", "Bois & métal", "Peinture & laque"],
  },
  {
    icon: "signaletique",
    label: "Signalétique",
    description: "Totems, enseignes lumineuses, wayfinding professionnel, plaques de bâtiment et signalétique directionnelle.",
    href: "/la-fabrique/signaletique",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    specs: ["LED intégrée", "Acier inox & aluminium", "Résistant UV & intempéries"],
  },
  {
    icon: "amenagement",
    label: "Aménagement d'Espace",
    description: "Scénographie, architecture éphémère, cloisons décoratives et aménagement d'espaces événementiels.",
    href: "/la-fabrique/amenagement",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80",
    specs: ["Structures modulables", "Éclairage intégré", "Poses & dépose incluses"],
  },
];

const FALLBACK_ATELIER = [
  { value: "3 000 m²", label: "Atelier de production" },
  { value: "25+", label: "Artisans & techniciens" },
  { value: "48h", label: "Délai express possible" },
  { value: "100%", label: "Made in Epitaphe" },
];

export default function LaFabriqueHub() {
  const { settings } = useSettings("fabrique", {});

  type PoleItem = { icon: string; label: string; description: string; href: string; image: string; specs: string[] };
  type AtelierItem = { value: string; label: string };

  const poles: PoleItem[] = (() => {
    try {
      const raw = settings.fabrique_poles;
      if (Array.isArray(raw) && raw.length > 0) return raw as PoleItem[];
      if (typeof raw === "string") {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as PoleItem[];
      }
    } catch {}
    return FALLBACK_POLES;
  })();

  const atelier: AtelierItem[] = (() => {
    try {
      const raw = settings.fabrique_atelier;
      if (Array.isArray(raw) && raw.length > 0) return raw as AtelierItem[];
      if (typeof raw === "string") {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as AtelierItem[];
      }
    } catch {}
    return FALLBACK_ATELIER;
  })();

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="La Fabrique — Impression, Menuiserie & Signalétique | Epitaphe 360"
        description="Atelier de fabrication intégré : impression grand format, menuiserie décorative, signalétique et aménagement d'espace. 100% Made in Epitaphe."
        canonicalPath="/la-fabrique"
      />
      <Navigation />
      <Breadcrumbs />
      <main>
        {/* Hero */}
        <section className="relative py-20 md:py-28 bg-foreground text-background overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&q=60')", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="flex items-center justify-center gap-2 mb-5">
                <Factory className="w-6 h-6 text-primary" />
                <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                  100% Made in Epitaphe
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 max-w-3xl mx-auto leading-tight">
                La Fabrique — <span className="text-primary">votre production, notre atelier</span>
              </h1>
              <p className="text-background/70 text-lg max-w-2xl mx-auto mb-8">
                3 000 m² d'ateliers spécialisés à Casablanca pour concevoir, produire et livrer tous vos éléments visuels avec précision et dans les délais.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/contact/brief">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm">
                    Demander un devis <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <Link href="/outils/calculateur-fabrique">
                  <button className="px-6 py-3 rounded-xl border border-background/30 text-background font-semibold text-sm hover:border-primary hover:text-primary transition-colors">
                    Calculer mes économies
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Chiffres atelier */}
        <section className="py-10 border-b border-border bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {atelier.map((fig, i) => (
              <RevealSection key={i} delay={i * 0.08} className="text-center">
                <p className="text-3xl font-bold text-primary">{fig.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{fig.label}</p>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* Pôles de production */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RevealSection className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Nos 4 pôles de production</h2>
              <div className="h-px w-16 bg-primary mx-auto" />
            </RevealSection>
            <div className="grid md:grid-cols-2 gap-6">
              {poles.map((pole, i) => (
                <RevealSection key={i} delay={i * 0.1}>
                  <Link href={pole.href}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                      className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <img src={pole.image} alt={pole.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="bg-primary/80 backdrop-blur-sm w-10 h-10 rounded-xl flex items-center justify-center mb-2">{POLE_ICONS[pole.icon] ?? POLE_ICONS["impression"]}</div>
                          <h3 className="text-xl font-bold">{pole.label}</h3>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-muted-foreground mb-4">{pole.description}</p>
                        <ul className="flex flex-wrap gap-2">
                          {pole.specs.map((s, j) => (
                            <li key={j} className="flex items-center gap-1.5 text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" /> {s}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                          Explorer le pôle <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* Calculateur teaser */}
        <section className="py-14 bg-primary/5 border-y border-primary/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <RevealSection>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Calculez vos économies avec La Fabrique</h2>
                <p className="text-muted-foreground mb-4">Combien gagneriez-vous en temps et en argent en centralisant votre production chez Epitaphe 360 ?</p>
                <Link href="/outils/calculateur-fabrique">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm">
                    Utiliser le calculateur <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </RevealSection>
              <RevealSection direction="left" className="grid grid-cols-2 gap-3 text-center">
                {[
                  { label: "Délai moyen réduit de", value: "40%" },
                  { label: "Économie ≈", value: "30%" },
                  { label: "Interlocuteur unique", value: "1" },
                  { label: "Projets gérés / an", value: "200+" },
                ].map((s, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4">
                    <p className="text-2xl font-bold text-primary">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </RevealSection>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/5">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <RevealSection>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Votre prochain projet de production commence ici</h2>
              <p className="text-muted-foreground mb-6">Fichiers prêts ou concept à développer — nous prenons tout en charge.</p>
              <Link href="/contact/brief">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-sm">
                  Demander un devis <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </RevealSection>
          </div>
        </section>
      </main>
      <ContextualCta pageKey="la-fabrique" />
      <Footer />
    </div>
  );
}
