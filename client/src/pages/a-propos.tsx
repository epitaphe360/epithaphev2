import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";
import { RevealSection } from "@/components/reveal-section";

// ─── Images de la page référence ────────────────────────────────────────────
const IMG = {
  commPulse:        "https://version2.epitaphe.ma/wp-content/uploads/2025/11/commPulse-dashboard-scoring-epitaphe360.webp",
  comInterne:       "https://version2.epitaphe.ma/wp-content/uploads/2025/11/Communication-interne-Industrie-Maroc-700x876.webp",
  marqueEmployeur:  "https://version2.epitaphe.ma/wp-content/uploads/2025/11/marque-employeur-maroc-700x1012.jpg",
  rse:              "https://version2.epitaphe.ma/wp-content/uploads/2025/11/Communication-RSE-Maroc-700x400.webp",
  finance:          "https://version2.epitaphe.ma/wp-content/uploads/2025/11/finance-700x426.webp",
  evenement:        "https://version2.epitaphe.ma/wp-content/uploads/2025/11/Organisation-evenement-Maroc-700x990.webp",
  qatarAirways:     "https://version2.epitaphe.ma/wp-content/uploads/2026/04/qatar-airways.webp",
  standCimat:       "https://version2.epitaphe.ma/wp-content/uploads/2026/04/stand-Cimat-epitaphe360.webp",
};

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || target === 0) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-7xl font-black text-white mb-2">{count}+</div>
      <div className="text-xs uppercase tracking-[0.25em] text-white/50 font-semibold">{label}</div>
    </div>
  );
}

// ─── CTA Button ──────────────────────────────────────────────────────────────
function CtaBtn({ href = "/contact", children }: { href?: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <motion.span
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 bg-[#EC4899] text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 cursor-pointer"
      >
        {children} <ArrowRight className="w-3.5 h-3.5" />
      </motion.span>
    </Link>
  );
}

export default function APropos() {
  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <PageMeta
        title="À propos — Strategic Influence & Brand Architecture | Epitaphe360"
        description="Basée à Casablanca, Epitaphe360 est, depuis plus de 20 ans, l'agence de communication des organisations qui exigent l'excellence. Structuring influence. Securing growth."
        canonicalPath="/a-propos"
      />
      <Navigation />

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-6 overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(236,72,153,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#07070a]" />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#EC4899] text-xs font-bold uppercase tracking-[0.35em] mb-8"
          >
            strategic influence &amp; brand architecture
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] mb-10"
          >
            <span className="text-white">structuring</span>
            <br />
            <span className="text-[#EC4899]">influence.</span>
            <br />
            <span className="text-white">securing</span>
            <br />
            <span className="text-white/30">growth.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <CtaBtn>Parlez-nous de votre projet</CtaBtn>
            <Link href="/outils/commpulse">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 cursor-pointer hover:border-[#EC4899] hover:text-[#EC4899] transition-colors"
              >
                Lancer mon scoring <ChevronRight className="w-3.5 h-3.5" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — "structuring influence.securing growth." (À propos)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Colonne texte */}
            <div>
              <RevealSection>
                <p className="text-[#EC4899] text-xs font-bold uppercase tracking-[0.3em] mb-6">
                  strategic influence &amp; brand architecture
                </p>
                <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight mb-8">
                  structuring influence.<br />
                  <span className="text-white/30">securing growth.</span>
                </h2>
                <div className="space-y-5 text-white/70 leading-relaxed mb-10">
                  <p>
                    À un certain stade de développement, la communication dépasse la simple
                    recherche de visibilité. Elle devient un enjeu de cohérence et un levier d'influence.
                  </p>
                  <p>
                    Basée à Casablanca, Epitaphe360 est, depuis plus de 20 ans,{" "}
                    <strong className="text-white">l'agence de communication des organisations qui
                    exigent l'excellence.</strong> Nous intervenons là où la stratégie rencontre l'action pour
                    structurer votre position, mobiliser vos forces vives et consolider votre
                    capital immatériel.
                  </p>
                  <p>
                    Qu'il s'agisse de fleurons locaux, de multinationales ou d'investisseurs
                    s'implantant dans l'une des 12 régions du Royaume, nous alignons votre communication
                    sur les standards internationaux pour accompagner les Plans de Développement
                    Régionaux (PDR) et consolider votre croissance et votre intégration territoriale.
                  </p>
                </div>

                {/* 5 piliers */}
                <div className="mb-10">
                  <p className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-5 border-l-2 border-[#EC4899] pl-4">
                    Notre engagement : sécuriser vos piliers de performance.
                  </p>
                  <ul className="space-y-3">
                    {[
                      { label: "La Stabilité", desc: "Bâtir une image de marque solide." },
                      { label: "La Fluidité", desc: "Optimiser vos flux pour une organisation sans friction." },
                      { label: "La Crédibilité", desc: "Garantir votre autorité auprès de vos partenaires stratégiques." },
                      { label: "La Mobilisation", desc: "Transformer vos équipes en un collectif engagé." },
                      { label: "La Rentabilité", desc: "Assurer la pérennité de votre performance économique." },
                    ].map((p) => (
                      <li key={p.label} className="flex items-start gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EC4899] mt-1.5 flex-shrink-0" />
                        <span className="text-white/80">
                          <strong className="text-white">{p.label} :</strong> {p.desc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <CtaBtn>Parlez-nous de votre projet</CtaBtn>
              </RevealSection>
            </div>

            {/* Colonne image — Dashboard CommPulse */}
            <RevealSection direction="left" delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-px bg-gradient-to-br from-[#EC4899]/20 to-transparent rounded-sm pointer-events-none" />
                <img
                  src={IMG.commPulse}
                  alt="Dashboard de scoring CommPulse Epitaphe360 : audit de maturité et mesure de l'impact de la communication interne pour entreprises au Maroc."
                  className="w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — BANNER "Votre communication interne"
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-[#EC4899]/10 border-y border-[#EC4899]/20">
        <div className="max-w-5xl mx-auto text-center">
          <RevealSection>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-6">
              Votre communication interne :{" "}
              <span className="text-[#EC4899]">actif de croissance</span>{" "}
              ou perte sèche ?
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              <strong className="text-white">72% des employés se sentent mal informés.</strong> Ne laissez
              plus le désengagement freiner vos ambitions. Diagnostiquez votre maturité narrative avec
              CommPulse™ pour booster votre efficacité opérationnelle.
            </p>
            <Link href="/outils/commpulse">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-[#EC4899] text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 cursor-pointer"
              >
                Évaluer ma performance interne <ArrowRight className="w-3.5 h-3.5" />
              </motion.span>
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — "partenaire de communication des organisations"
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <p className="text-[#EC4899] text-xs font-bold uppercase tracking-[0.3em] mb-4">
              strategic influence &amp; brand architecture
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight mb-6 max-w-3xl">
              partenaire de communication des organisations
              <br />
              <span className="text-white/40">au cœur des 12 régions du maroc.</span>
            </h2>
            <p className="text-white/70 leading-relaxed max-w-3xl mb-10 text-base">
              Nous portons la vision des entreprises engagées pour le Maroc 2030, par une
              communication stratégique et un déploiement opérationnel sur l'ensemble du
              territoire. Que ce soit pour mobiliser vos talents locaux, ancrer votre culture SST,
              orchestrer vos événements régionaux ou matérialiser votre image, nous transformons
              chaque projet en un puissant levier de croissance pour votre organisation.
            </p>

            <p className="text-white text-sm font-bold uppercase tracking-[0.15em] mb-6 border-l-2 border-[#EC4899] pl-4">
              Nous concentrons notre expertise en communication autour de cinq impératifs stratégiques :
            </p>
            <ul className="space-y-4 mb-12 max-w-3xl">
              {[
                {
                  label: "Asseoir votre autorité",
                  desc: "Transformer votre expertise métier en un leadership institutionnel pour accompagner la vision Maroc 2030.",
                },
                {
                  label: "Sécuriser l'engagement",
                  desc: "Aligner vos équipes autour de votre vision et de votre culture SST pour garantir une exécution sans faille sur tous vos sites.",
                },
                {
                  label: "Maximiser votre attractivité",
                  desc: "Faire de votre marque un pôle d'aimantation pour vos futurs talents et partenaires grâce à une Marque Employeur forte.",
                },
                {
                  label: "Soutenir votre performance",
                  desc: "Convertir votre communication et vos événements stratégiques en leviers de croissance mesurables.",
                },
                {
                  label: "Optimiser votre déploiement",
                  desc: "Matérialiser votre brand via La Fabrique tout en maîtrisant votre temps, votre énergie et votre budget.",
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-4 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#EC4899] mt-2 flex-shrink-0" />
                  <span className="text-white/80 leading-relaxed">
                    <strong className="text-white">{item.label} :</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>

            <CtaBtn>Parlez-nous de votre projet</CtaBtn>
          </RevealSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — "nos pôles d'expertise"
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <p className="text-[#EC4899] text-xs font-bold uppercase tracking-[0.3em] mb-4">
              strategic influence &amp; brand architecture
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight mb-6">
              nos pôles d'expertise
            </h2>
            <p className="text-white/70 leading-relaxed max-w-3xl mb-12">
              Nous vous accompagnons pour aligner votre communication sur les enjeux du Maroc
              2030 afin de maximiser votre impact. Notre approche systémique active six
              leviers de performance :
            </p>
          </RevealSection>

          {/* Image principale du pôle */}
          <RevealSection delay={0.15}>
            <div className="mb-14">
              <img
                src={IMG.comInterne}
                alt="Accompagnement des entreprises pour l'alignement stratégique sur les enjeux des Plans de Développement Régionaux au Maroc - Epitaphe360."
                className="w-full max-w-2xl object-cover"
                loading="lazy"
              />
            </div>
          </RevealSection>

          {/* Les 6 pôles */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Pôle 1 — Communication interne */}
            <RevealSection>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#EC4899] mb-3">
                  communication interne : passez de l'information à l'engagement
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Une communication défaillante n'est pas un détail organisationnel, c'est une
                  crise financière silencieuse : hémorragie de temps, explosion des coûts
                  opérationnels, risque de réputation. Synchronisez les énergies pour transformer
                  l'information en moteur d'engagement.
                </p>
                <img
                  src={IMG.marqueEmployeur}
                  alt="Conseil en stratégie Marque Employeur et Marketing RH pour multinationales et entreprises dans les 12 régions du Maroc – Epitaphe360."
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            </RevealSection>

            {/* Pôle 2 — Marque employeur */}
            <RevealSection delay={0.1}>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#EC4899] mb-3">
                  marque employeur : soyez une destination, pas une option
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Lorsque votre culture d'entreprise est invisible ou mal racontée, vous perdez
                  vos meilleurs profils au profit de la concurrence. Cultivez votre singularité pour
                  devenir l'employeur de référence sur votre région.
                </p>
              </div>
            </RevealSection>

            {/* Pôle 3 — SST */}
            <RevealSection>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#EC4899] mb-3">
                  santé &amp; sécurité au travail : de la contrainte à l'instinct de vigilance
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Investir dans des équipements de pointe est inutile si vos équipes ne
                  s'approprient pas la culture de la qualité et de la sécurité. Instaurez une culture de la
                  vigilance qui protège vos équipes et votre réputation afin de garantir
                  l'excellence opérationnelle et la sécurité sur les grands projets d'infrastructure.
                </p>
                <img
                  src={IMG.rse}
                  alt="Stratégie de communication RSE et impact sociétal pour les entreprises dans les 12 régions du Maroc – Alignement Plans de Développement Régionaux Epitaphe360."
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            </RevealSection>

            {/* Pôle 4 — Communication RSE */}
            <RevealSection delay={0.1}>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#EC4899] mb-3">
                  communication rse : de la conformité à la valeur de signature
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Selon Nielsen, 66 % des consommateurs mondiaux préfèrent acheter auprès
                  d'entreprises engagées. Et si vous transformiez votre communication RSE en actif de
                  croissance qui inscrit votre activité dans le tissu social et durable défini par les
                  priorités régionales.
                </p>
                <img
                  src={IMG.finance}
                  alt="Communication financière stratégique et rapports annuels pour entreprises et investisseurs dans les 12 régions du Maroc – Expertise Epitaphe360 et conformité AMMC."
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            </RevealSection>

            {/* Pôle 5 — Communication financière */}
            <RevealSection>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#EC4899] mb-3">
                  communication financière : l'actif de réputation
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Votre bilan comptable dit ce que vous avez fait. Votre communication dit ce que
                  vous valez. Dépassez la simple «information» vers une communication d'influence
                  qui renforce la confiance de votre écosystème.
                </p>
                <img
                  src={IMG.evenement}
                  alt="Organisation d'événements stratégiques et lancements institutionnels dans les 12 régions du Maroc – Accompagnement des entreprises et multinationales par Epitaphe360."
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            </RevealSection>

            {/* Pôle 6 — Événementiel stratégique */}
            <RevealSection delay={0.1}>
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#EC4899] mb-3">
                  événementiel stratégique : orchestrer l'expérience. affirmer le leadership.
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Orchestrer vos événements de bout en bout pour les convertir en levier
                  stratégique, tout en optimisant votre temps et vos budgets.
                </p>
              </div>
            </RevealSection>
          </div>

          <div className="mt-14">
            <CtaBtn>Parlez-nous de votre projet</CtaBtn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — "la fabrique : l'excellence opérationnelle"
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-6 bg-[#EC4899]/5 border-t border-[#EC4899]/10">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <p className="text-[#EC4899] text-xs font-bold uppercase tracking-[0.3em] mb-4">
              strategic influence &amp; brand architecture
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight mb-8">
              la fabrique :{" "}
              <span className="text-white/30">l'excellence opérationnelle</span>
              <br />
              par la matérialisation.
            </h2>
            <p className="text-white/70 leading-relaxed max-w-3xl mb-16">
              La Fabrique est notre unité de production intégrée dédiée à la conception et au déploiement
              de vos actifs physiques sur l'ensemble des 12 régions du Maroc. Équipés de technologies
              de pointe, nos ateliers permettent de matérialiser votre brand avec une précision
              stratégique, garantissant la cohérence et maximisant l'impact de chacune de nos interventions.
            </p>
          </RevealSection>

          {/* Compteurs */}
          <div className="grid grid-cols-2 gap-10 max-w-lg mx-auto">
            <AnimatedCounter target={200} label="Travaux réalisés" />
            <AnimatedCounter target={50} label="Clients satisfaits" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 7 — "la fabrique 360"
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <p className="text-[#EC4899] text-xs font-bold uppercase tracking-[0.3em] mb-4">
              strategic influence &amp; brand architecture
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight mb-6">
              la fabrique 360 :{" "}
              <span className="text-white/30">l'excellence opérationnelle</span>
              <br />
              au service de votre image.
            </h2>
            <p className="text-white/70 leading-relaxed max-w-3xl mb-14">
              Parce qu'une stratégie n'a d'impact que si elle est visible, La Fabrique 360
              matérialise vos ambitions. Dans notre atelier de production intégré, nous
              fusionnons ingénierie et design pour donner corps à votre marque. Partout au Maroc, nous
              assurons une maîtrise totale de votre temps, de votre énergie et de votre budget
              pour un déploiement sans compromis.
            </p>
          </RevealSection>

          {/* 6 sous-pôles */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
            {[
              {
                title: "branding de siège & espaces corporate",
                desc: "Transformez vos bureaux en vecteurs de culture d'entreprise. Nous concevons des environnements qui inspirent vos talents et affirment votre autorité institutionnelle.",
              },
              {
                title: "stands et showrooms",
                desc: "De la conception 3D à l'installation, nous bâtissons des espaces d'exposition immersifs qui maximisent vos interactions business pour transformer chaque visiteur en opportunité concrète.",
              },
              {
                title: "enseignes & signalétique",
                desc: "La signalétique est le dernier maillon de votre sécurité et le premier de votre visibilité. Nous sécurisons vos flux et affirmons votre présence avec des dispositifs haute performance adaptés aux standards industriels les plus stricts.",
              },
              {
                title: "impression & habillage physique",
                desc: "Protégez votre image de marque sur la durée. Nous maîtrisons les matériaux les plus résistants pour que vos habillages de chantiers et d'infrastructures restent impeccables, peu importe l'environnement géographique ou climatique.",
              },
              {
                title: "lettrage & découpe laser & cnc",
                desc: "La précision industrielle au service de votre identité. Notre maîtrise technologique nous permet de réaliser des pièces complexes et premium qui signent la qualité et le sérieux de votre organisation.",
              },
              {
                title: "plv & dispositifs retail",
                desc: "Harmonisez l'expérience client sur l'ensemble de votre réseau. Nos solutions de déploiement retail garantissent une présence de marque homogène et impactante, capable de convertir chaque point de vente en relais de votre stratégie nationale.",
              },
            ].map((pole, i) => (
              <RevealSection key={pole.title} delay={i * 0.08}>
                <div className="border border-white/8 p-6 hover:border-[#EC4899]/40 transition-colors group h-full">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#EC4899] mb-3 group-hover:text-[#EC4899]">
                    {pole.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">{pole.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>

          {/* Images de référence */}
          <RevealSection>
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <img
                src={IMG.qatarAirways}
                alt="qatar-airways-epitaphe360"
                className="w-full sm:w-1/2 object-cover"
                loading="lazy"
              />
              <img
                src={IMG.standCimat}
                alt="stand-cimat-epitaphe360"
                className="w-full sm:w-1/2 object-cover"
                loading="lazy"
              />
            </div>
          </RevealSection>

          <CtaBtn>Parlez-nous de votre projet</CtaBtn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
