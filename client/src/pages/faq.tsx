import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";
import { StatsSection } from "@/components/stats-section";
import { RevealSection } from "@/components/reveal-section";
import { ContextualCta } from "@/components/contextual-cta";
import { ChevronDown } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

const faqItems = [
  {
    category: "Général",
    questions: [
      {
        q: "Qu'est-ce qu'une agence de communication 360° ?",
        a: "Une agence 360° gère l'ensemble des aspects de votre communication : stratégie, création graphique, production (impression, signalétique, stands), événementiel et digital. Epitaphe 360 maîtrise toute la chaîne de valeur, de l'idée à l'exécution, avec un atelier de production interne à Casablanca.",
      },
      {
        q: "Dans quels secteurs intervenez-vous ?",
        a: "Nous intervenons dans tous les secteurs : banque & finance, industrie, énergie, télécommunications, grande distribution, immobilier, pharma, et associations. Nos clients incluent des multinationales, des grands groupes marocains et des PME ambitieuses.",
      },
      {
        q: "Êtes-vous basés uniquement à Casablanca ?",
        a: "Notre siège est à Casablanca (Rez-de-chaussée, 7-9 Rue Bussang, Maarif). Nous intervenons sur tout le Maroc et pouvons accompagner des projets à l'international selon les besoins.",
      },
    ],
  },
  {
    category: "La Fabrique 360",
    questions: [
      {
        q: "Quels sont vos délais de production habituels ?",
        a: "Les délais varient selon le type de projet : de 48h pour des impressions simples à 4-6 semaines pour un stand sur mesure ou un habillage complet de siège. Nous nous engageons toujours sur des délais réalistes et les respectons.",
      },
      {
        q: "Proposez-vous des devis gratuits ?",
        a: "Oui, tous nos devis sont gratuits et détaillés. Utilisez notre formulaire de contact ou le module de demande de brief pour nous transmettre votre projet. Nous vous répondons sous 24 à 48h ouvrées.",
      },
      {
        q: "Faites-vous de la pose et installation ?",
        a: "Oui, notre équipe assure la pose et l'installation sur site pour toutes nos productions : enseignes, signalétiques, habillage de siège, stands et décors événementiels.",
      },
    ],
  },
  {
    category: "Scoring BMI 360™",
    questions: [
      {
        q: "Qu'est-ce que le scoring BMI 360™ ?",
        a: "BMI 360™ (Brand Marketing Intelligence) est notre suite d'outils propriétaires d'évaluation communicationnelle. Elle comprend 8 scores thématiques (CommPulse™, TalentPrint™, SafeSignal™, ImpactTrace™, EventImpact™, SpaceScore™, FinNarrative™, Tableau BMI 360™) qui mesurent l'efficacité de votre communication par axe.",
      },
      {
        q: "Les outils de scoring sont-ils gratuits ?",
        a: "Les outils de scoring sont accessibles depuis votre espace client. Une version de démonstration gratuite est disponible pour CommPulse™ et TalentPrint™. Pour un accès complet et l'accompagnement d'un consultant, contactez-nous.",
      },
      {
        q: "Comment interpréter les résultats du scoring ?",
        a: "Chaque outil génère un score de 0 à 100, accompagné d'une analyse par dimension et d'un plan d'action personnalisé. Nos consultants peuvent vous accompagner dans la lecture et la mise en œuvre des recommandations.",
      },
    ],
  },
  {
    category: "Espace Client",
    questions: [
      {
        q: "Comment accéder à mon espace client ?",
        a: "Votre espace client est accessible à l'adresse /espace-client. Si vous n'avez pas encore de compte, contactez-nous pour l'activation. Vous y trouverez le suivi de vos projets, vos documents et vos factures.",
      },
      {
        q: "Puis-je suivre l'avancement de mon projet en temps réel ?",
        a: "Oui, votre espace client inclut un module de suivi de projet avec timeline, statuts d'avancement, livrables et commentaires. Vous êtes notifié à chaque étape clé de votre projet.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-medium leading-snug">{q}</span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 text-primary mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/pages/slug/faq')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.content) setHtmlContent(d.content); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="FAQ — Questions fréquentes | Epitaphe 360"
        description="Toutes les réponses à vos questions sur Epitaphe 360 : délais, devis, scoring BMI 360™, espace client, production et expertises communication."
        canonicalPath="/faq"
      />
      <Navigation />

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 min-h-[45vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            <span className="inline-block bg-primary px-4 py-2">Questions</span>
            <br />
            <span className="inline-block bg-primary px-4 py-2 mt-2">fréquentes</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg"
          >
            Vous avez une question ? Trouvez la réponse ici.
          </motion.p>
        </div>
      </section>

      {/* ─── FAQ content : CMS ou fallback hardcodé ────────────────────────── */}
      {htmlContent ? (
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-3xl mx-auto prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }} />
          </div>
        </section>
      ) : (
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <RevealSection>
              {faqItems.map((cat) => (
                <section key={cat.category} className="mb-10">
                  <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">
                    {cat.category}
                  </h2>
                  <div className="rounded-2xl border border-border px-6 bg-card">
                    {cat.questions.map((item) => (
                      <FaqItem key={item.q} q={item.q} a={item.a} />
                    ))}
                  </div>
                </section>
              ))}
            </RevealSection>
          </div>
        </section>
      )}

      <StatsSection />
      <ContextualCta pageKey="evenements" />
      <Footer />
    </div>
  );
}
