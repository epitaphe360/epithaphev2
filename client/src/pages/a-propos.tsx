import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";
import { ContextualCta } from "@/components/contextual-cta";
import { StatsSection } from "@/components/stats-section";
import { RevealSection } from "@/components/reveal-section";
import { sanitizeHtml } from "@/lib/sanitize";

export default function APropos() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/pages/slug/a-propos')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.content) setHtmlContent(d.content); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="À propos — Epitaphe 360, agence de communication 360° à Casablanca"
        description="Depuis 20 ans, Epitaphe 360 accompagne les grandes entreprises et multinationales au Maroc dans leurs défis de communication : événementiel, branding, digital, QHSE, RSE et plus."
        canonicalPath="/a-propos"
      />
      <Navigation />

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 min-h-[55vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            <span className="inline-block bg-primary px-4 py-2">Inspirez. Connectez.</span>
            <br />
            <span className="inline-block bg-primary px-4 py-2 mt-2">Marquez durablement.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg"
          >
            Agence de communication 360° — Casablanca, Maroc — depuis 2005
          </motion.p>
        </div>
      </section>

      {/* ─── Contenu principal : CMS ou fallback hardcodé ─────────────────── */}
      {htmlContent ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }}
          />
        </div>
      ) : (
        <>
          {/* ─── Notre mission ─────────────────────────────────────────────── */}
          <section className="py-16 bg-muted/20 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <RevealSection>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Notre mission</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-10">
                  <div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Epitaphe 360 est une agence de communication globale qui conçoit et produit des
                      solutions créatives à fort impact. Notre force : une maîtrise totale de la chaîne de
                      valeur, de l'idée à l'exécution.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Nous comprenons vos contraintes en tant que CEO, Directeur marketing ou de
                      communication : des délais serrés, des attentes élevées, un besoin constant
                      d'innovation. C'est pour cela que nous avons choisi de faire autrement.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {[
                      "Maîtrise totale de A à Z — de l'idée à l'exécution",
                      "Approche personnalisée — solutions sur mesure",
                      "Atelier interne — rapidité et réactivité garanties",
                      "KPI et suivi — mesure de l'impact de vos solutions",
                      "Optimisation de votre temps et de vos budgets",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealSection>
            </div>
          </section>

          {/* ─── Nos expertises ──────────────────────────────────────────────── */}
          <section className="py-16 md:py-24 px-4">
            <div className="max-w-7xl mx-auto">
              <RevealSection>
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Nos expertises</h2>
                  <p className="text-muted-foreground text-sm">Six pôles d'excellence pour toute votre communication.</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Nos pôles d'expertise", desc: "COM' Interne, Marque Employeur, QHSE, RSE, Événementiel", href: "/nos-poles" },
                    { title: "La Fabrique 360", desc: "Branding de siège, stands, enseignes, impression, lettrage", href: "/la-fabrique" },
                    { title: "Architecture de Marque", desc: "Identité visuelle, expérience client, communication corporate", href: "/architecture-de-marque" },
                    { title: "Événementiel", desc: "Conventions, galas, roadshows, salons professionnels", href: "/evenements" },
                    { title: "Scoring BMI 360™", desc: "8 outils d'intelligence communicationnelle et d'aide à la décision", href: "/outils" },
                    { title: "Ressources", desc: "Articles, guides et études de cas pour booster votre communication", href: "/ressources" },
                  ].map((e) => (
                    <Link key={e.href} href={e.href}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer group p-6 h-full flex flex-col"
                      >
                        <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{e.title}</h3>
                        <p className="text-sm text-muted-foreground flex-1">{e.desc}</p>
                        <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-4">
                          En savoir plus <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </RevealSection>
            </div>
          </section>
        </>
      )}

      <StatsSection />
      <ContextualCta pageKey="a-propos" />
      <Footer />
    </div>
  );
}
