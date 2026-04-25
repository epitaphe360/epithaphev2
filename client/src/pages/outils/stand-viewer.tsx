import { Suspense, useState, lazy } from "react";
import { motion } from "framer-motion";
import { Box, RotateCcw, ZoomIn, Maximize2, Info, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { RevealSection } from "@/components/reveal-section";
import { PageMeta } from "@/components/seo/page-meta";
const StandViewer = lazy(() => import("@/components/stand-viewer").then(m => ({ default: m.StandViewer3D })));

const DEMO_STANDS = [
  {
    id: "island",
    label: "Stand Îlot 9×9m",
    description: "Stand double face avec espaces de présentation, comptoir d'accueil intégré et structure lumineuse.",
    surfaces: [
      { name: "Paroi principale", color: "#d1295a" },
      { name: "Comptoir", color: "#1a1a2e" },
      { name: "Sol", color: "#f5f5f5" },
    ],
    model: "/models/island-stand.glb", // placeholder — remplacer par un vrai GLB
  },
  {
    id: "linear",
    label: "Stand Linéaire 6×3m",
    description: "Stand compact idéal pour les allées de salon. Signalétique haute visibilité et espace de démonstration.",
    surfaces: [
      { name: "Fond de stand", color: "#ffffff" },
      { name: "Bandeau supérieur", color: "#d1295a" },
      { name: "Sol", color: "#333333" },
    ],
    model: "/models/linear-stand.glb",
  },
  {
    id: "corner",
    label: "Stand Angle 6×6m",
    description: "Stand d'angle à deux façades ouvertes. Configuration idéale pour maximiser le flux visiteurs.",
    surfaces: [
      { name: "Panneau A", color: "#0f172a" },
      { name: "Panneau B", color: "#d1295a" },
      { name: "Sol", color: "#e2e8f0" },
    ],
    model: "/models/corner-stand.glb",
  },
];

export default function StandViewerPage() {
  const [activeStand, setActiveStand] = useState(0);
  const stand = DEMO_STANDS[activeStand];

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Visualiseur 3D de Stand — Configurez votre stand | Epitaphe 360"
        description="Visualisez et configurez votre stand d'exposition en 3D temps réel. Personnalisez les couleurs, les matériaux et l'agencement avant fabrication."
        canonicalPath="/outils/stand-viewer"
      />
      <Navigation />

      <main>
        {/* Hero */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-foreground via-foreground to-primary/30 overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1400&q=40')", backgroundSize: "cover" }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="flex items-center justify-center gap-2 mb-5">
                <Box className="w-5 h-5 text-primary" />
                <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                  Technologie 3D
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-background mb-5">
                Visualiseur de Stand <span className="text-primary">3D</span>
              </h1>
              <p className="text-background/70 text-lg max-w-2xl mx-auto mb-8">
                Explorez vos futurs stands en temps réel. Tournez, zoomez, changez les couleurs — voyez votre marque prendre vie avant la fabrication.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <button onClick={() => document.getElementById('stand-configurator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-7 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Configurer mon stand →
                </button>
                <a href="/contact/brief" className="px-7 py-3 rounded-xl font-semibold text-sm text-background/80 border border-background/20 hover:border-background/40 transition-colors no-underline">
                  Demander un devis
                </a>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-background/60 mb-4">
                <span className="flex items-center gap-1.5"><RotateCcw className="w-4 h-4" /> Rotation libre 360°</span>
                <span className="flex items-center gap-1.5"><ZoomIn className="w-4 h-4" /> Zoom interactif</span>
                <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4" /> Plein écran</span>
                <span className="flex items-center gap-1.5"><Info className="w-4 h-4" /> Points d'info cliquables</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Avantages */}
        <section className="py-10 border-b border-border bg-muted/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '⚡', v: '24h', l: 'Rendu 3D livré en 24h après brief' },
                { icon: '🎨', v: '100%', l: 'Personnalisé aux couleurs de votre marque' },
                { icon: '🔧', v: '3 formats', l: 'Îlot, linéaire et angle disponibles' },
                { icon: '🏭', v: '1 fabricant', l: 'Conception & fabrication dans notre atelier' },
              ].map(s => (
                <div key={s.v} className="rounded-xl p-4 border border-border bg-card text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-xl font-extrabold text-primary mb-1">{s.v}</div>
                  <p className="text-xs text-muted-foreground leading-snug">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sélecteur de stand */}
        <section id="stand-configurator" className="py-8 border-b border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {DEMO_STANDS.map((s, i) => (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveStand(i)}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
                    activeStand === i
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {s.label}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Viewer principal */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Canvas 3D */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-muted to-background" style={{ height: "520px" }}>
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-muted-foreground text-sm">Chargement du modèle 3D…</p>
                        </div>
                      </div>
                    }
                  >
                    <StandViewer
                      modelUrl={stand.model}
                      environmentPreset="warehouse"
                    />
                  </Suspense>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Clic gauche : tourner · Scroll : zoomer · Clic droit : déplacer
                </p>
              </div>

              {/* Panneau de configuration */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">{stand.label}</h2>
                  <p className="text-muted-foreground text-sm">{stand.description}</p>
                </div>

                {/* Palette de couleurs */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Surfaces & couleurs</h3>
                  <div className="space-y-2">
                    {stand.surfaces.map((surface) => (
                      <div key={surface.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                        <span className="text-sm text-foreground">{surface.name}</span>
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-border cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: surface.color }}
                          title={surface.color}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    * La personnalisation complète des couleurs est réalisée avec notre équipe design.
                  </p>
                </div>

                {/* Spécifications */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Inclus dans ce stand</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      </div>
                      Conception & modélisation 3D
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      </div>
                      Fabrication atelier Epitaphe
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      </div>
                      Montage & démontage inclus
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      </div>
                      Éclairage LED intégré
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      </div>
                      Impression HD incluse
                    </li>
                  </ul>
                </div>

                <Link href="/contact/brief">
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors cursor-pointer text-sm"
                  >
                    Demander ce stand <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section technologie */}
        <RevealSection>
          <section className="py-16 bg-muted/20 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Technologie au service de votre vision
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-sm">
                Notre atelier de modélisation 3D vous permet de valider chaque détail avant la fabrication. Fini les mauvaises surprises : vous voyez exactement ce que vous recevez.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  { num: "48h", label: "Première maquette 3D livrée" },
                  { num: "100%", label: "Fabrication en propre" },
                  { num: "0", label: "Surprise à la livraison" },
                ].map((stat) => (
                  <div key={stat.num} className="bg-background border border-border rounded-2xl p-6">
                    <div className="text-3xl font-black text-primary mb-1">{stat.num}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealSection>
      </main>

      <Footer />
    </div>
  );
}
