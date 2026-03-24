import { useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useInView, useMotionValueEvent } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ArrowUpRight, Play, ChevronDown } from "lucide-react";
import { Navigation } from "@/components/navigation";

/**
 * EPITAPHE 360 — HOMEPAGE "BLACK MONOLITH"
 * Niveau : Top 3 Mondial (ManvsMachine / Active Theory / AKQA)
 *
 * Principes :
 * - Full-bleed cinematic 4K imagery (zero rounded corners on hero)
 * - Giant kinetic typography (clamp responsive)
 * - Horizontal scroll project showcase
 * - Scroll-driven parallax layers
 * - Client marquee trust bar
 * - Dark/light dramatic contrast
 * - Zero bullshit, zero template energy
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4K IMAGERY — Real industrial event production
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const IMG = {
  // Full-bleed hero — massive LED stage with lighting rig
  hero: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=100&w=3840&auto=format&fit=crop",
  // Project 1 — Corporate convention massive stage
  proj1: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=100&w=2400&auto=format&fit=crop",
  // Project 2 — CNC precision machining / fabrication
  proj2: "https://images.unsplash.com/photo-1565043666747-69f6646db940?q=100&w=2400&auto=format&fit=crop",
  // Project 3 — Luxury gala event / dark ambiance
  proj3: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=100&w=2400&auto=format&fit=crop",
  // Project 4 — Trade show / exhibition stand architecture
  proj4: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=100&w=2400&auto=format&fit=crop",
  // About section — workshop / atelier production
  atelier: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=100&w=2400&auto=format&fit=crop",
  // CTA section — aerial view of massive event
  cta: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=100&w=3840&auto=format&fit=crop",
};

// Client logos (text-based for now, replace with SVGs later)
const CLIENTS = [
  "OCP Group", "Renault", "ONEE", "Maroc Telecom", "BMCE Bank",
  "Royal Air Maroc", "Attijariwafa", "Addoha", "Managem", "Cosumar",
  "Lydec", "ONCF", "Inwi", "Orange", "TotalEnergies",
];

// ━━━ Utility: Marquee auto-scroll ━━━
function Marquee({ children, speed = 30 }: { children: React.ReactNode; speed?: number }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex gap-16"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// ━━━ Utility: Section reveal ━━━
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ━━━ Horizontal scroll project card ━━━
function ProjectCard({ img, title, category, index }: { img: string; title: string; category: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[35vw] cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-[4/5] md:aspect-[3/4]">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <ArrowUpRight size={20} className="text-black" />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium mb-2">{category}</p>
        <h3 className="text-2xl md:text-3xl font-medium tracking-tight">{title}</h3>
      </div>
    </motion.div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function HomeV4() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Hero parallax
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 200]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.2], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Horizontal scroll for projects
  const projectsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: projectsScroll } = useScroll({
    target: projectsRef,
    offset: ["start end", "end start"],
  });
  const projectsX = useTransform(projectsScroll, [0.1, 0.9], ["5%", "-40%"]);

  return (
    <div ref={containerRef} className="bg-white text-[#0a0a0a] selection:bg-[#0a0a0a] selection:text-white">
      <Helmet>
        <title>Épitaphe 360 | Architecture Événementielle Globale</title>
        <meta name="description" content="Épitaphe 360 — Agence de marketing 360° et d'architecture événementielle. Conception, fabrication, scénographie et production audiovisuelle à l'échelle mondiale." />
      </Helmet>

      {/* ══════════════════════════════════════════════════════════
          NAVIGATION — Composant complet partagé (mega-menus, drawer mobile)
          ══════════════════════════════════════════════════════════ */}
      <Navigation />

      {/* ══════════════════════════════════════════════════════════
          HERO — Full-bleed cinematic, edge-to-edge, no rounded corners
          ══════════════════════════════════════════════════════════ */}
      <section className="relative h-[100vh] overflow-hidden bg-black">
        {/* 4K Background Image with parallax */}
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <img
            src={IMG.hero}
            alt="Événement corporate monumentale"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
        </motion.div>

        {/* Hero Content */}
        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-12 max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.3em] font-medium mb-6">Architecture Événementielle Globale</p>
            <h1 className="text-white text-[12vw] md:text-[8vw] lg:text-[6.5vw] font-bold leading-[0.9] tracking-tighter max-w-[90%]">
              Nous construisons<br />
              des expériences<br />
              <span className="italic font-light">monumentales.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center gap-8 mt-12"
          >
            <Link href="/contact/brief">
              <span className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] cursor-pointer hover:bg-gray-100 transition-colors">
                Démarrer un projet <ArrowRight size={18} />
              </span>
            </Link>
            <button className="inline-flex items-center gap-3 text-white/70 hover:text-white text-sm font-medium uppercase tracking-[0.1em] transition-colors group">
              <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Play size={16} fill="white" />
              </div>
              Voir le showreel
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown size={24} className="text-white/40" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CLIENT TRUST BAR — Infinite marquee
          ══════════════════════════════════════════════════════════ */}
      <section className="py-8 md:py-12 border-b border-black/5 bg-white">
        <Marquee speed={40}>
          <div className="flex items-center gap-16">
            {CLIENTS.map((name) => (
              <span key={name} className="text-[13px] font-bold uppercase tracking-[0.2em] text-black/20 whitespace-nowrap select-none">
                {name}
              </span>
            ))}
          </div>
        </Marquee>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MANIFESTO — Giant scroll reveal typography
          ══════════════════════════════════════════════════════════ */}
      <section className="py-32 md:py-48 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[7vw] md:text-[4vw] lg:text-[3.2vw] font-medium leading-[1.15] tracking-tight text-black/15">
              Depuis plus de 15 ans, nous orchestrons{" "}
              <span className="text-black">l'ingénierie événementielle de A à Z</span>{" "}
              pour les plus grandes marques africaines et internationales. De l'usinage CNC au mur LED 4K,{" "}
              <span className="text-black">chaque détail est sous contrôle.</span>
            </p>
          </Reveal>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-24 md:mt-32 pt-16 border-t border-black/10">
            {[
              { num: "250+", label: "Projets par an" },
              { num: "3500", label: "m² d'ateliers" },
              { num: "15+", label: "Années d'expertise" },
              { num: "100%", label: "Intégré" },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div>
                  <span className="text-5xl md:text-7xl font-bold tracking-tighter">{stat.num}</span>
                  <p className="text-sm uppercase tracking-[0.15em] text-black/40 font-medium mt-3">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SERVICES — Staggered grid with hover reveals
          ══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#0a0a0a] text-white">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95]">
                Ce que<br />nous faisons.
              </h2>
              <p className="text-white/40 text-lg font-medium max-w-sm mt-6 md:mt-0 leading-relaxed">
                Quatre métiers, un seul objectif : la perfection au service de votre marque.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {[
              {
                num: "01",
                title: "Événements Corporate",
                desc: "Conventions, kick-offs, galas, roadshows, salons internationaux. De 50 à 15 000 personnes.",
                link: "/evenements",
              },
              {
                num: "02",
                title: "Architecture de Marque",
                desc: "Identité visuelle, expérience client, marque employeur, communication QHSE. L'ADN de votre entreprise, matérialisé.",
                link: "/architecture-de-marque",
              },
              {
                num: "03",
                title: "La Fabrique",
                desc: "Menuiserie, métallerie, impression grand format, signalétique, aménagement d'espaces. 3500m² de production internalisée.",
                link: "/la-fabrique",
              },
              {
                num: "04",
                title: "Production Audiovisuelle",
                desc: "Captation 4K, régie multi-caméras, murs LED, son spatialisé, mapping vidéo. Le broadcast au service de l'événement.",
                link: "/evenements",
              },
            ].map((service, i) => (
              <Reveal key={service.num} delay={i * 0.1}>
                <Link href={service.link}>
                  <div className="group bg-[#0a0a0a] p-10 md:p-16 cursor-pointer hover:bg-[#111] transition-colors duration-500 h-full">
                    <span className="text-xs font-bold text-white/20 tracking-[0.3em]">{service.num}</span>
                    <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mt-6 mb-4 group-hover:translate-x-3 transition-transform duration-500">{service.title}</h3>
                    <p className="text-white/40 text-base md:text-lg leading-relaxed max-w-md">{service.desc}</p>
                    <div className="mt-8 flex items-center gap-2 text-white/30 group-hover:text-white transition-colors duration-500">
                      <span className="text-xs font-bold uppercase tracking-[0.2em]">Explorer</span>
                      <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROJECTS — Horizontal scroll showcase
          ══════════════════════════════════════════════════════════ */}
      <section ref={projectsRef} className="py-24 md:py-40 bg-white overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 mb-16">
          <Reveal>
            <div className="flex justify-between items-end">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">Réalisations.</h2>
              <Link href="/nos-references">
                <span className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-black/40 hover:text-black transition-colors cursor-pointer">
                  Tout voir <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>

        <motion.div style={{ x: projectsX }} className="flex gap-6 md:gap-8 pl-6 md:pl-12">
          <ProjectCard img={IMG.proj1} title="Convention Nationale OCP" category="Événement Corporate" index={0} />
          <ProjectCard img={IMG.proj2} title="Usinage Stand Premium" category="La Fabrique — CNC" index={1} />
          <ProjectCard img={IMG.proj3} title="Gala Annuel Attijariwafa" category="Soirée de Gala" index={2} />
          <ProjectCard img={IMG.proj4} title="Salon International Auto" category="Stand & Scénographie" index={3} />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ABOUT — Split layout with 4K atelier image
          ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#F5F5F0]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          {/* Image */}
          <div className="relative overflow-hidden h-[60vh] lg:h-auto">
            <motion.img
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              src={IMG.atelier}
              alt="Atelier de fabrication Épitaphe"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 lg:py-0">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-black/30 font-bold mb-8">Notre ADN</p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-8">
                100% intégré.<br />
                Zéro sous-traitance<br />
                <span className="italic font-light text-black/40">sur l'essentiel.</span>
              </h2>
              <p className="text-lg text-black/50 font-medium leading-relaxed mb-10 max-w-lg">
                Notre usine de 3500m² intègre menuiserie, métallerie, impression grand format et usinage CNC. Du concept à la livraison, chaque étape est maîtrisée en interne pour une qualité irréprochable.
              </p>
              <Link href="/la-fabrique">
                <span className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.15em] cursor-pointer group">
                  Découvrir La Fabrique
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PROCESS — Numbered steps, minimal
          ══════════════════════════════════════════════════════════ */}
      <section className="py-32 md:py-48 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-black/30 font-bold mb-4">Notre Process</p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-20">Comment on travaille.</h2>
          </Reveal>

          <div className="space-y-0">
            {[
              { step: "01", title: "Brief & Stratégie", desc: "Immersion totale dans votre marque, vos objectifs, vos contraintes. On challenge, on questionne, on structure." },
              { step: "02", title: "Conception & Design", desc: "Modélisation 3D, maquettes, scénographies, plans techniques. Chaque pixel et chaque vis sont pensés en amont." },
              { step: "03", title: "Fabrication & Production", desc: "Nos 3500m² d'ateliers entrent en action. CNC, menuiserie, métallerie, impression. Tout est intégré." },
              { step: "04", title: "Installation & Régie", desc: "Montage sur site, régie audiovisuelle, coordination logistique. L'exécution chirurgicale jusqu'au dernier moment." },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.08}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-16 py-12 border-t border-black/10 group hover:bg-[#FAFAFA] transition-colors duration-300 -mx-6 md:-mx-12 px-6 md:px-12">
                  <span className="text-5xl md:text-6xl font-bold tracking-tighter text-black/10 group-hover:text-black/30 transition-colors md:w-32 flex-shrink-0">{item.step}</span>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">{item.title}</h3>
                    <p className="text-black/40 text-lg leading-relaxed max-w-xl">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CTA — Full-bleed dramatic image with overlay
          ══════════════════════════════════════════════════════════ */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-black">
        <img src={IMG.cta} alt="Événement aérien" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <Reveal>
            <h2 className="text-white text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter leading-[0.9] mb-8">
              Votre prochain<br />projet commence ici.
            </h2>
            <p className="text-white/50 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
              Parlez-nous de votre vision. Nous la transformerons en une réalité qui dépasse vos attentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact/brief">
                <span className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 text-sm font-bold uppercase tracking-[0.1em] cursor-pointer hover:bg-gray-100 transition-colors">
                  Envoyer un brief <ArrowRight size={18} />
                </span>
              </Link>
              <Link href="/contact">
                <span className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-10 py-5 text-sm font-bold uppercase tracking-[0.1em] cursor-pointer hover:bg-white/10 transition-colors">
                  Nous appeler
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOOTER — Dark, authoritative, global presence
          ══════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0a0a0a] text-white pt-24 pb-8">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          {/* Top */}
          <div className="flex flex-col lg:flex-row justify-between gap-16 pb-20 border-b border-white/10">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">ÉPITAPHE <span className="text-white/30">360</span></h3>
              <p className="text-white/30 text-lg font-medium">Architecture Événementielle Globale</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/20 font-bold mb-6">Expertise</p>
                <ul className="space-y-3">
                  {[
                    { label: "Événements", href: "/evenements" },
                    { label: "Architecture de Marque", href: "/architecture-de-marque" },
                    { label: "La Fabrique", href: "/la-fabrique" },
                    { label: "Production AV", href: "/la-fabrique/impression" },
                  ].map((item) => (
                    <li key={item.label}><Link href={item.href}><span className="text-white/50 hover:text-white transition-colors cursor-pointer text-sm">{item.label}</span></Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/20 font-bold mb-6">Agence</p>
                <ul className="space-y-3">
                  {[
                    { label: "Réalisations", href: "/nos-references" },
                    { label: "Blog", href: "/blog" },
                    { label: "Ressources", href: "/ressources" },
                    { label: "Contact", href: "/contact" },
                  ].map((item) => (
                    <li key={item.label}><Link href={item.href}><span className="text-white/50 hover:text-white transition-colors cursor-pointer text-sm">{item.label}</span></Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/20 font-bold mb-6">Contact</p>
                <a href="mailto:hello@epitaphe.com" className="text-xl md:text-2xl font-bold hover:text-white/60 transition-colors block mb-4">hello@epitaphe.com</a>
                <p className="text-white/30 text-sm leading-relaxed">Casablanca • Paris • Dubaï</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-xs text-white/20 font-medium uppercase tracking-[0.15em]">
            <span>© {new Date().getFullYear()} Épitaphe 360. Tous droits réservés.</span>
            <div className="flex gap-8 mt-4 md:mt-0">
              <Link href="/mentions-legales"><span className="hover:text-white/50 cursor-pointer transition-colors">Conditions</span></Link>
              <Link href="/politique-confidentialite"><span className="hover:text-white/50 cursor-pointer transition-colors">Confidentialité</span></Link>
              <Link href="/mentions-legales"><span className="hover:text-white/50 cursor-pointer transition-colors">Mentions légales</span></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
