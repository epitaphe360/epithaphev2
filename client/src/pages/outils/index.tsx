import { PageMeta } from "@/components/seo/page-meta";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useCmsPage } from "@/hooks/useCmsPage";
import {
  SoftwareApplicationSchema,
  BreadcrumbSchema,
  WebPageSchema,
} from "@/components/seo/schema-org";

// Plan annuel BMI 360™ Full — aligné sur server/scoring-routes.ts FULL_ANNUAL_PRICE_MAD
const FULL_ANNUAL_PRICE_MAD = 39000;
const FULL_INDIVIDUAL_TOTAL = 4900 + 7500 + 8400 + 7900 + 7900 + 6500 + 9900; // = 53 000 MAD

// ─── Catalogue des 8 outils BMI 360™ ─────────────────────────────────────────
const TOOLS = [
  {
    id: "commpulse",
    name: "CommPulse™",
    model: "CLARITY",
    tagline: "Scoring Communication Interne",
    description:
      "Évaluez la santé de votre communication interne : cohérence, écoute, transparence et impact sur la performance.",
    url: "/outils/commpulse",
    color: "#6366F1",
    priceMad: 4900,
    pillars: ["Cohérence", "Liens", "Attention", "Résultats", "Inclusion", "Transparence", "You"],
  },
  {
    id: "talentprint",
    name: "TalentPrint™",
    model: "ATTRACT",
    tagline: "Scoring Marque Employeur",
    description:
      "Mesurez l'attractivité de votre marque employeur et votre capacité à attirer, engager et retenir les talents.",
    url: "/outils/talentprint",
    color: "#EC4899",
    priceMad: 7500,
    pillars: ["Attractivité", "TCohérence", "RExpérience", "Ambassadeurs", "Culture", "Talents", "You"],
  },
  {
    id: "impacttrace",
    name: "ImpactTrace™",
    model: "PROOF",
    tagline: "Scoring RSE & Communication Responsable",
    description:
      "Diagnostiquez la maturité RSE de votre communication et son impact mesurable sur vos parties prenantes.",
    url: "/outils/impacttrace",
    color: "#10B981",
    priceMad: 8400,
    pillars: ["Intégrité", "Mesure", "Parties prenantes", "Actions", "Cohérence", "Transparence", "You"],
  },
  {
    id: "safesignal",
    name: "SafeSignal™",
    model: "SHIELD",
    tagline: "Scoring Communication QHSE",
    description:
      "Évaluez l'efficacité de votre communication sécurité et votre culture QHSE à travers 42 indicateurs clés.",
    url: "/outils/safesignal",
    color: "#F59E0B",
    priceMad: 7900,
    pillars: ["Sécurité", "Alertes", "Formation", "Engagement", "Signalétique", "Gestion crise", "You"],
  },
  {
    id: "eventimpact",
    name: "EventImpact™",
    model: "STAGE",
    tagline: "Scoring Événementiel Corporate",
    description:
      "Mesurez le ROI et l'impact réel de vos événements corporate sur l'engagement et la culture d'entreprise.",
    url: "/outils/eventimpact",
    color: "#8B5CF6",
    priceMad: 7900,
    pillars: ["Expérience", "Ventes", "Engagement", "Notoriété", "Taux retour", "Impact", "You"],
  },
  {
    id: "spacescore",
    name: "SpaceScore™",
    model: "SPACE",
    tagline: "Scoring Signalétique & Espaces",
    description:
      "Auditez la performance de votre signalétique, vos espaces de travail et leur impact sur l'expérience collaborateur.",
    url: "/outils/spacescore",
    color: "#06B6D4",
    priceMad: 6500,
    pillars: ["Signalétique", "Parcours", "Accessibilité", "Cohérence visuelle", "Expérience", "You"],
  },
  {
    id: "finnarrative",
    name: "FinNarrative™",
    model: "CAPITAL",
    tagline: "Scoring Communication Financière",
    description:
      "Évaluez la qualité et la clarté de votre communication financière auprès des investisseurs et actionnaires.",
    url: "/outils/finnarrative",
    color: "#0EA5E9",
    priceMad: 9900,
    pillars: ["Clarté", "Fiabilité", "Fréquence", "Narration", "Impact", "Conformité", "You"],
  },
  {
    id: "bmi360",
    name: "BMI 360™ Dashboard",
    model: "GLOBAL",
    tagline: "Vue Globale Intelligence d'Entreprise",
    description:
      "Tableau de bord consolidé de tous vos scores BMI 360™ — une vision 360° de la maturité de votre communication.",
    url: "/outils/bmi360",
    color: "#E3001B",
    priceMad: 0,
    pillars: ["CommPulse", "TalentPrint", "ImpactTrace", "SafeSignal", "EventImpact", "SpaceScore", "FinNarrative"],
  },
];

export default function OutilsHub() {
  const cmsContent = useCmsPage('outils');
  return (
    <>
      <PageMeta
        title="BMI 360™ — Outils de Scoring Intelligence d'Entreprise"
        description="8 outils de scoring BMI 360™ pour mesurer la maturité de votre communication : interne, marque employeur, RSE, QHSE, événementiel, signalétique et financière."
        canonicalPath="/outils"
      />

      {/* JSON-LD structuré */}
      <WebPageSchema
        title="BMI 360™ — Outils de Scoring Intelligence d'Entreprise"
        description="8 outils de scoring BMI 360™ pour mesurer la maturité de votre communication d'entreprise."
        url="/outils"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Outils BMI 360™", url: "/outils" },
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Accueil", url: "/" },
          { name: "Outils BMI 360™", url: "/outils" },
        ]}
      />
      {/* Un SoftwareApplicationSchema par outil pour les rich snippets */}
      {TOOLS.filter((t) => t.priceMad > 0).map((tool) => (
        <SoftwareApplicationSchema
          key={tool.id}
          name={tool.name}
          description={tool.description}
          url={tool.url}
          priceMad={tool.priceMad}
        />
      ))}

      <Navigation />

      <main className="min-h-screen bg-white dark:bg-zinc-950">
        {cmsContent ? (
          <div className="max-w-7xl mx-auto px-6 py-16" dangerouslySetInnerHTML={{ __html: cmsContent }} />
        ) : (<>
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="relative py-24 px-6 text-center overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #E3001B 0%, transparent 70%)" }} />
          <div className="relative max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E3001B]/10 border border-[#E3001B]/20 text-[#E3001B] text-sm font-medium tracking-wider uppercase mb-6">
              BMI 360™ Intelligence
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Pilotez votre communication<br />
              <span className="text-[#E3001B]">avec précision</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
              8 outils de scoring propriétaires pour mesurer, diagnostiquer et transformer
              la maturité de votre communication d'entreprise.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact/brief" className="px-8 py-4 bg-[#E3001B] text-white font-semibold rounded-lg hover:bg-[#c2001a] transition-colors">
                  Demander un diagnostic gratuit
              </Link>
              <Link href="/outils/bmi360" className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors">
                  Voir le Dashboard BMI 360™
              </Link>
            </div>
          </div>
        </section>

        {/* ── Grille des outils ──────────────────────────────────────────── */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              Les 7 dimensions de votre communication
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              Chaque outil explore une dimension critique de votre communication avec 42 indicateurs et un scoring sur 100.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.filter((t) => t.id !== "bmi360").map((tool) => (
              <Link key={tool.id} href={tool.url} className="group relative block p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {/* Pastille couleur */}
                  <div
                    className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center"
                    style={{ backgroundColor: `${tool.color}15`, border: `1px solid ${tool.color}30` }}
                  >
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: tool.color }} />
                  </div>

                  <div className="mb-1">
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: tool.color }}
                    >
                      {tool.model}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 font-medium">
                    {tool.tagline}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-500 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {tool.priceMad > 0 ? `${tool.priceMad.toLocaleString("fr-MA")} MAD` : "Gratuit"}
                    </span>
                    <span
                      className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-200"
                      style={{ color: tool.color }}
                    >
                      Lancer le diagnostic →
                    </span>
                  </div>
              </Link>
            ))}
          </div>

          {/* ── BMI 360™ Dashboard card — mise en avant ──────────── */}
          <div className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-zinc-950 to-zinc-900 border border-[#E3001B]/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#E3001B] mb-2 block">
                GLOBAL
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">BMI 360™ Dashboard</h3>
              <p className="text-zinc-400 max-w-lg">
                Vue consolidée de tous vos scores. Comparez vos dimensions, suivez votre progression
                et pilotez votre transformation communication avec un score global sur 100.
              </p>
            </div>
            <Link href="/outils/bmi360" className="shrink-0 px-8 py-4 bg-[#E3001B] text-white font-semibold rounded-lg hover:bg-[#c2001a] transition-colors whitespace-nowrap">
                Accéder au Dashboard
            </Link>
          </div>
        </section>

        {/* ── Tarification simple ───────────────────────────────────────── */}
        <section className="py-20 px-6 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              Tarification transparente
            </h2>
            <p className="text-zinc-500 mb-12">
              Une session de scoring = un rapport PDF complet + recommandations personnalisées.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "1 outil Intelligence™", price: "4 900 – 9 900 MAD", detail: "Rapport IA complet + plan 90 jours" },
                {
                  label: "BMI 360™ Full — Annuel",
                  price: `${FULL_ANNUAL_PRICE_MAD.toLocaleString("fr-MA")} MAD`,
                  detail: `Accès 12 mois aux 7 outils — économie ${(FULL_INDIVIDUAL_TOTAL - FULL_ANNUAL_PRICE_MAD).toLocaleString("fr-MA")} MAD`,
                  highlight: true,
                },
                { label: "Transform — RDV expert", price: "Sur devis", detail: "Mission d'accompagnement personnalisée" },
              ].map((plan) => (
                <div
                  key={plan.label}
                  className={`p-6 rounded-2xl border ${
                    plan.highlight
                      ? "border-[#C8A96E] bg-[#C8A96E]/5"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  }`}
                >
                  <p className="text-sm font-medium text-zinc-500 mb-2">{plan.label}</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{plan.price}</p>
                  <p className="text-xs text-zinc-500">{plan.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/contact/brief" className="inline-block px-10 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-lg hover:opacity-90 transition-opacity">
                  Demander une démo
              </Link>
            </div>
          </div>
        </section>
        </>)}
      </main>

      <Footer />
    </>
  );
}
