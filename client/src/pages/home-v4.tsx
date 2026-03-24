/**
 * HOME V4 — MONUMENTAL PREMIUM
 * Direction : agence de communication marocaine haut de gamme
 * Esthétique : Acre · Wieden+Kennedy · AKQA — sombre chaud, ambre, serif puissant
 * Palette : #0C0906 noir-café · #F5EFE4 ivoire · #C47B3A ambre · #8B7355 ocre
 */
import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowUpRight, ArrowRight, Menu, X, Mail, MapPin, Phone } from "lucide-react";

/* ─── Palette ────────────────────────────────────────────── */
const C = {
  black:  "#0C0906",
  white:  "#F5EFE4",
  amber:  "#C47B3A",
  amberL: "rgba(196,123,58,0.12)",
  amberG: "linear-gradient(135deg, #C47B3A 0%, #E8A55A 50%, #C47B3A 100%)",
  muted:  "rgba(245,239,228,0.45)",
  border: "rgba(245,239,228,0.10)",
  dark2:  "#150E08",
};

/* ─── Données ─────────────────────────────────────────────── */
const NAV = [
  ["Événements", "/evenements"],
  ["Architecture", "/architecture-de-marque"],
  ["La Fabrique", "/la-fabrique"],
  ["Références", "/nos-references"],
  ["Contact", "/contact"],
];

const SERVICES = [
  { n: "01", label: "Conventions & Kickoffs",   sub: "Événementiel",       href: "/evenements/conventions-kickoffs" },
  { n: "02", label: "Soirées de Gala",            sub: "Événementiel",       href: "/evenements/soirees-de-gala" },
  { n: "03", label: "Roadshows & Tournées",       sub: "Événementiel",       href: "/evenements/roadshows" },
  { n: "04", label: "Stands & Salons",            sub: "Événementiel",       href: "/evenements/salons" },
  { n: "05", label: "Impression Grand Format",    sub: "La Fabrique",        href: "/la-fabrique/impression" },
  { n: "06", label: "Menuiserie & Décor",         sub: "La Fabrique",        href: "/la-fabrique/menuiserie" },
  { n: "07", label: "Signalétique",               sub: "La Fabrique",        href: "/la-fabrique/signaletique" },
  { n: "08", label: "Marque Employeur & QHSE",    sub: "Architecture Marque",href: "/architecture-de-marque" },
];

const PROJECTS = [
  {
    client: "Qatar Airways",
    cat: "Événement Corporate",
    year: "2024",
    img: "https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg",
    span: "lg:col-span-7",
    aspect: "aspect-[16/9]",
  },
  {
    client: "Schneider Electric",
    cat: "Convention",
    year: "2023",
    img: "https://epitaphe.ma/wp-content/uploads/2018/10/LIFE.jpg",
    span: "lg:col-span-5",
    aspect: "aspect-[4/3]",
  },
  {
    client: "Dell",
    cat: "Stand 3D",
    year: "2023",
    img: "https://epitaphe.ma/wp-content/uploads/2018/10/dell-rea.jpg",
    span: "lg:col-span-5",
    aspect: "aspect-[4/3]",
  },
  {
    client: "SNEP",
    cat: "Architecture de Marque",
    year: "2022",
    img: "https://epitaphe.ma/wp-content/uploads/2018/10/REARapport.jpg",
    span: "lg:col-span-7",
    aspect: "aspect-[16/9]",
  },
];

const CLIENTS = [
  "Qatar Airways", "HPS", "Schneider Electric", "Vinci Energies",
  "Dell", "SNEP", "Ajial", "Wafa Assurance", "Lafarge", "OCP Group",
  "Maroc Telecom", "Attijariwafa", "BMCE", "CIH Bank",
];

const TICKER_ITEMS = [
  "Événementiel Corporate",
  "Architecture de Marque",
  "Impression Grand Format",
  "Scénographie 3D",
  "Roadshows & Tournées",
  "Signalétique & Wayfinding",
  "Marque Employeur",
  "Communication QHSE",
];

/* ─── Composants utilitaires ─────────────────────────────── */
function Reveal({
  children, delay = 0, className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "102%", opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function FadeUp({
  children, delay = 0, className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref} className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 50);
    const timer = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Page principale ────────────────────────────────────── */
export default function HomeV4() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const navBg = useTransform(
    scrollY, [0, 80],
    ["rgba(12,9,6,0)", "rgba(12,9,6,0.97)"]
  );
  const heroImgY = useTransform(heroProgress, [0, 1], ["0%", "18%"]);
  const heroTextY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);

  return (
    <div style={{ background: C.black, color: C.white, fontFamily: "Inter, system-ui, sans-serif" }}>
      <Helmet>
        <title>Epitaphe 360 — Agence Événementielle & Architecture de Marque | Casablanca</title>
        <meta name="description" content="Agence de communication 360° basée à Casablanca. Événements d'entreprise, architecture de marque, impression grand format et signalétique. 20 ans d'expertise." />
      </Helmet>
      <style>{`
        .v4-serif { font-family: Georgia, 'Times New Roman', serif; }
        @keyframes v4ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .v4-ticker-run { animation: v4ticker 28s linear infinite; }
        .v4-clients-run { animation: v4ticker 22s linear infinite; }
        .v4-img-hover img { transition: transform 1s cubic-bezier(0.16,1,0.3,1); }
        .v4-img-hover:hover img { transform: scale(1.06); }
        .v4-service-row {
          border-bottom: 1px solid ${C.border};
          transition: background 0.25s, padding-left 0.3s;
          cursor: pointer;
        }
        .v4-service-row:hover { background: ${C.amberL}; padding-left: 20px; }
        .v4-amber-grad {
          background: ${C.amberG};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* ══════════════════════ NAVIGATION ══════════════════════ */}
      <motion.header
        style={{ backgroundColor: navBg }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      >
        <div
          className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${C.border}` }}
        >
          <Link href="/">
            <img
              src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png"
              alt="Epitaphe 360"
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(([label, href]) => (
              <Link key={label} href={href}>
                <span
                  className="px-4 py-2 text-sm rounded-md transition-colors block"
                  style={{ color: C.muted }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = C.white)}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = C.muted)}
                >
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/contact/brief">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: C.amber, color: "#fff" }}
              >
                Déposer un brief <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: C.white }}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden px-6 py-5 space-y-1"
              style={{ background: C.dark2, borderBottom: `1px solid ${C.border}` }}
            >
              {NAV.map(([label, href]) => (
                <Link key={label} href={href} onClick={() => setMenuOpen(false)}>
                  <span className="block py-2.5 text-sm" style={{ color: C.muted }}>{label}</span>
                </Link>
              ))}
              <div className="pt-4">
                <Link href="/contact/brief" onClick={() => setMenuOpen(false)}>
                  <span
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold w-fit"
                    style={{ background: C.amber, color: "#fff" }}
                  >
                    Déposer un brief <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ══════════════════════ HERO ══════════════════════════ */}
      <section
        ref={heroRef}
        className="min-h-screen relative overflow-hidden flex items-end"
      >
        {/* Image parallax fullbleed */}
        <motion.div className="absolute inset-0" style={{ y: heroImgY }}>
          <img
            src="https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg"
            alt="Epitaphe 360 — Qatar Airways Event"
            className="w-full h-[115%] object-cover"
            style={{ objectPosition: "center 30%" }}
          />
          {/* Couche de gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(12,9,6,0.96) 0%, rgba(12,9,6,0.55) 50%, rgba(12,9,6,0.15) 100%)",
            }}
          />
        </motion.div>

        {/* Contenu hero */}
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full pt-24"
          style={{ y: heroTextY }}
        >
          {/* Eyebrow */}
          <FadeUp delay={0.1}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-px" style={{ background: C.amber }} />
              <span
                className="text-xs font-semibold tracking-[0.3em] uppercase"
                style={{ color: C.amber }}
              >
                Casablanca · Maroc · Agence 360°
              </span>
            </div>
          </FadeUp>

          {/* Titre */}
          <div className="mb-10">
            {[
              { text: "Nous créons des", italic: false },
              { text: "expériences", italic: true },
              { text: "qui durent.", italic: false },
            ].map(({ text, italic }, i) => (
              <div key={i} className="overflow-hidden">
                <motion.h1
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2 + i * 0.13,
                  }}
                  className={`leading-none block v4-serif ${italic ? "italic v4-amber-grad" : ""}`}
                  style={{
                    fontSize: "clamp(3.2rem, 8vw, 8.5rem)",
                    letterSpacing: "-0.02em",
                    color: italic ? undefined : C.white,
                    fontWeight: italic ? 400 : 700,
                  }}
                >
                  {text}
                </motion.h1>
              </div>
            ))}
          </div>

          {/* Bas de hero */}
          <div
            className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pt-8"
            style={{ borderTop: `1px solid ${C.border}` }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="max-w-sm text-base leading-relaxed"
              style={{ color: C.muted }}
            >
              Événements d'entreprise, architecture de marque, fabrication
              sur mesure. Votre interlocuteur unique de A à Z.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/contact/brief">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
                  style={{ background: C.amber, color: "#fff" }}
                >
                  Déposer un brief <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/nos-references">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border"
                  style={{ borderColor: C.border, color: C.white }}
                >
                  Nos réalisations <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats flottantes desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-10 right-6 z-10 hidden lg:flex gap-10"
        >
          {[["20+", "ans d'expertise"], ["200+", "événements"], ["50+", "clients majeurs"]].map(
            ([v, l]) => (
              <div key={l} className="text-right">
                <p
                  className="font-bold text-3xl v4-amber-grad v4-serif"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {v}
                </p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: C.muted }}>
                  {l}
                </p>
              </div>
            )
          )}
        </motion.div>
      </section>

      {/* ══════════════════ TICKER SERVICES ═════════════════════ */}
      <div
        className="overflow-hidden py-4"
        style={{ background: C.amber, borderTop: "none" }}
      >
        <div className="flex whitespace-nowrap v4-ticker-run gap-0">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center text-sm font-bold uppercase tracking-widest px-8" style={{ color: "#fff" }}>
              {item}
              <span className="ml-8 w-1 h-1 rounded-full bg-white/40 inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════ INTRO STATEMENT ═════════════════════ */}
      <section className="py-28" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <h2
                  className="v4-serif font-normal leading-tight mb-0"
                  style={{
                    fontSize: "clamp(2.2rem, 4.5vw, 4.5rem)",
                    letterSpacing: "-0.02em",
                    color: C.white,
                  }}
                >
                  Une agence de communication{" "}
                  <em style={{ color: C.amber }}>360°</em>, c'est bien plus
                  qu'une prestation. C'est un partenaire qui
                  construit votre image de A à Z.
                </h2>
              </Reveal>
            </div>
            <FadeUp delay={0.2} className="lg:col-span-5 space-y-6">
              <p style={{ color: C.muted, lineHeight: 1.8 }}>
                Basée à Casablanca, Epitaphe 360 accompagne depuis 20 ans les grandes
                entreprises et multinationales dans leurs défis de communication : là où
                créativité et pragmatisme se croisent.
              </p>
              <ul className="space-y-3">
                {[
                  "Interlocuteur unique de l'idée à la livraison",
                  "Atelier de fabrication intégré (impression, menuiserie, scéno)",
                  "Expertise événementielle & architecture de marque",
                  "Ancrage Casablanca, rayonnement MENA",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: C.muted }}>
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: C.amber }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact/brief">
                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold mt-2"
                  style={{ color: C.amber }}
                >
                  Parlez-nous de votre projet <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ══════════════════ SERVICES ════════════════════════════ */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
            <Reveal>
              <h2
                className="v4-serif font-normal leading-none"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 5rem)",
                  letterSpacing: "-0.02em",
                  color: C.white,
                }}
              >
                Nos domaines<br />
                <em style={{ color: C.amber }}>d'expertise</em>
              </h2>
            </Reveal>
            <Link href="/evenements">
              <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: C.muted }}>
                Voir tous les services <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {SERVICES.map((s, i) => (
              <Link key={s.label} href={s.href}>
                <motion.div
                  className="v4-service-row"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="py-5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span
                        className="text-xs font-bold tabular-nums w-8"
                        style={{ color: C.amber }}
                      >
                        {s.n}
                      </span>
                      <div>
                        <p
                          className="text-base md:text-lg font-semibold"
                          style={{ color: C.white, letterSpacing: "-0.01em" }}
                        >
                          {s.label}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                          {s.sub}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-40" style={{ color: C.amber }} />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ RÉALISATIONS ════════════════════════ */}
      <section className="py-12 pb-28" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-4 pt-16">
            <Reveal>
              <h2
                className="v4-serif font-normal leading-none"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 5rem)",
                  letterSpacing: "-0.02em",
                  color: C.white,
                }}
              >
                Quelques<br />
                <em style={{ color: C.amber }}>réalisations</em>
              </h2>
            </Reveal>
            <Link href="/nos-references">
              <span className="text-sm font-semibold flex items-center gap-1" style={{ color: C.muted }}>
                Toutes les références <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {PROJECTS.map((p, i) => (
              <motion.div
                key={p.client}
                className={`v4-img-hover group relative overflow-hidden rounded-lg cursor-pointer ${p.span} ${p.aspect}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                viewport={{ once: true }}
              >
                <img
                  src={p.img}
                  alt={p.client}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(12,9,6,0.88) 0%, rgba(12,9,6,0.1) 55%, transparent 100%)",
                  }}
                />
                {/* Overlay hover amber */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                  style={{ background: "rgba(196,123,58,0.7)" }}
                >
                  <ArrowUpRight className="w-10 h-10 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 group-hover:opacity-0 transition-opacity">
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color: C.amber }}
                  >
                    {p.cat} · {p.year}
                  </p>
                  <p className="text-lg font-semibold v4-serif" style={{ color: C.white }}>
                    {p.client}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ STATS ═══════════════════════════════ */}
      <section style={{ background: C.dark2, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: C.border }}>
            {[
              { to: 20,  suffix: "+", label: "Années d'expertise" },
              { to: 200, suffix: "+", label: "Événements réalisés" },
              { to: 50,  suffix: "+", label: "Clients majeurs" },
            ].map(({ to, suffix, label }) => (
              <div key={label} className="py-14 px-10 text-center" style={{ background: C.dark2 }}>
                <p
                  className="v4-serif font-bold leading-none mb-3 v4-amber-grad"
                  style={{ fontSize: "clamp(4rem, 8vw, 7rem)", letterSpacing: "-0.03em" }}
                >
                  <Counter to={to} suffix={suffix} />
                </p>
                <p className="text-sm uppercase tracking-widest" style={{ color: C.muted }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CLIENTS ═════════════════════════════ */}
      <section className="py-16 overflow-hidden" style={{ borderBottom: `1px solid ${C.border}` }}>
        <p
          className="text-center text-xs tracking-[0.3em] uppercase mb-10"
          style={{ color: C.muted }}
        >
          Ils nous font confiance
        </p>
        <div className="flex whitespace-nowrap v4-clients-run gap-0">
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center text-sm font-semibold uppercase tracking-widest px-10"
              style={{ color: C.muted }}
            >
              {c}
              <span className="ml-10 w-1 h-1 rounded-full inline-block" style={{ background: C.amber, opacity: 0.5 }} />
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════ CTA ═════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        {/* Glow ambre */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(196,123,58,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <FadeUp>
            <div className="w-16 h-px mx-auto mb-10" style={{ background: C.amberG }} />
            <h2
              className="v4-serif font-normal leading-tight mb-8"
              style={{
                fontSize: "clamp(2.8rem, 6.5vw, 6.5rem)",
                letterSpacing: "-0.02em",
                color: C.white,
              }}
            >
              Votre prochain projet<br />
              <em className="v4-amber-grad">commence ici.</em>
            </h2>
            <p className="text-base mb-12 max-w-md mx-auto leading-relaxed" style={{ color: C.muted }}>
              Partagez votre vision. En 24h, vous avez une réponse et une première
              esquisse de solution.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact/brief">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-10 py-4 rounded-full text-base font-semibold"
                  style={{ background: C.amber, color: "#fff" }}
                >
                  <Mail className="w-4 h-4" /> Déposer un brief
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-10 py-4 rounded-full border text-base font-medium"
                  style={{ borderColor: C.border, color: C.white }}
                >
                  <Phone className="w-4 h-4" /> Nous appeler
                </motion.button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════════════════ */}
      <footer style={{ background: C.dark2, borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 mb-8"
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            {/* Logo + desc */}
            <div>
              <img
                src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png"
                alt="Epitaphe 360"
                className="h-8 w-auto brightness-0 invert mb-5"
              />
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                Agence de communication 360° <br />
                basée à Casablanca, Maroc.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-5 font-semibold"
                style={{ color: C.amber }}
              >
                Navigation
              </p>
              <div className="grid grid-cols-2 gap-x-4">
                {NAV.map(([label, href]) => (
                  <Link key={label} href={href}>
                    <span className="block text-sm py-1" style={{ color: C.muted }}>
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p
                className="text-xs tracking-widest uppercase mb-5 font-semibold"
                style={{ color: C.amber }}
              >
                Contact
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.amber }} />
                  <p className="text-sm" style={{ color: C.muted }}>
                    Rez-de-chaussée Immeuble 7<br />
                    9 Rue Bussang, Casablanca
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: C.amber }} />
                  <a href="tel:212662744741" className="text-sm" style={{ color: C.muted }}>
                    +212 6 62 74 47 41
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: C.amber }} />
                  <a href="mailto:info@epitaphe.ma" className="text-sm" style={{ color: C.muted }}>
                    info@epitaphe.ma
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: "rgba(245,239,228,0.25)" }}>
              © {new Date().getFullYear()} Epitaphe 360. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              {[["CGV", "/cgv"], ["Mentions légales", "/mentions-legales"], ["Confidentialité", "/politique-confidentialite"]].map(([l, h]) => (
                <Link key={l} href={h}>
                  <span className="text-xs" style={{ color: "rgba(245,239,228,0.25)" }}>{l}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
