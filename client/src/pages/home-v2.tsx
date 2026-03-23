/**
 * HOME V2 — EDITORIAL BOLD
 * Référence : Pentagram · Huge · Instrument · Collins
 * Palette : #F2EDE4 crème · #0D0D0D noir · #C8401E rouge-brique
 * Typography : font-black condensé, typographie architecturale
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, ArrowUpRight, Mail, Menu, X,
  Calendar, Trophy, Printer, Hammer, Signpost, LayoutGrid, Truck, Store,
} from "lucide-react";

/* ─── Palette ────────────────────────────────────────────── */
const C = {
  cream:   "#F2EDE4",
  dark:    "#0D0D0D",
  brick:   "#C8401E",
  brickL:  "rgba(200,64,30,0.08)",
  muted:   "#6B6560",
  border:  "#E0D9CF",
  darkB:   "rgba(255,255,255,0.08)",
};

/* ─── Données ─────────────────────────────────────────────── */
const NAV_LINKS = [
  ["Événements", "/evenements"],
  ["Architecture", "/architecture-de-marque"],
  ["La Fabrique", "/la-fabrique"],
  ["Références", "/nos-references"],
  ["Contact", "/contact"],
];

const SERVICES = [
  { n: "01", label: "Conventions & Kickoffs",  href: "/evenements/conventions-kickoffs", icon: <Calendar className="w-4 h-4" /> },
  { n: "02", label: "Soirées de Gala",          href: "/evenements/soirees-de-gala",      icon: <Trophy className="w-4 h-4" /> },
  { n: "03", label: "Roadshows & Tournées",     href: "/evenements/roadshows",            icon: <Truck className="w-4 h-4" /> },
  { n: "04", label: "Salons & Expositions",     href: "/evenements/salons",               icon: <Store className="w-4 h-4" /> },
  { n: "05", label: "Impression Grand Format",  href: "/la-fabrique/impression",          icon: <Printer className="w-4 h-4" /> },
  { n: "06", label: "Menuiserie & Décor",       href: "/la-fabrique/menuiserie",          icon: <Hammer className="w-4 h-4" /> },
  { n: "07", label: "Signalétique",             href: "/la-fabrique/signaletique",        icon: <Signpost className="w-4 h-4" /> },
  { n: "08", label: "Aménagement Espace",       href: "/la-fabrique/amenagement",         icon: <LayoutGrid className="w-4 h-4" /> },
];

const STATS = [
  { v: "20+", l: "Ans d'expertise" },
  { v: "200+", l: "Événements réalisés" },
  { v: "50+", l: "Clients majeurs" },
];

const PROJECTS = [
  { client: "Qatar Airways",      cat: "Événement Corporate", img: "https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg", wide: true },
  { client: "Schneider Electric", cat: "Convention",           img: "https://epitaphe.ma/wp-content/uploads/2018/10/LIFE.jpg",       wide: false },
  { client: "Dell",               cat: "Stand 3D",             img: "https://epitaphe.ma/wp-content/uploads/2018/10/dell-rea.jpg",   wide: false },
  { client: "SNEP",               cat: "Architecture Marque",  img: "https://epitaphe.ma/wp-content/uploads/2018/10/REARapport.jpg", wide: true },
];

const CLIENTS = ["Qatar Airways","HPS","Schneider","Vinci Energies","Dell","SNEP","Ajial","Wafa Assurance","Lafarge","OCP"];

/* ─── AnimateReveal ──────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function HomeV2() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 60], ["rgba(242,237,228,0)", "rgba(242,237,228,0.97)"]);

  return (
    <div style={{ background: C.cream, color: C.dark, fontFamily: "Inter, system-ui, sans-serif" }}>
      <Helmet><meta name="robots" content="noindex,nofollow" /></Helmet>

      {/* ══ NAV ═══════════════════════════════════════════════ */}
      <motion.header style={{ backgroundColor: navBg }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
        <style>{`.nav-border { border-color: ${C.border}; }`}</style>
        <div className="nav-border border-b" style={{ borderColor: C.border }}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/">
              <img src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png" alt="Epitaphe 360" className="h-8 w-auto" />
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(([l, h]) => (
                <Link key={l} href={h} className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: C.muted }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                  {l}
                </Link>
              ))}
            </nav>
            <div className="hidden md:block">
              <Link href="/contact/brief">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 text-sm font-bold rounded-full"
                  style={{ background: C.brick, color: "#fff" }}>
                  Brief →
                </motion.button>
              </Link>
            </div>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 py-4 space-y-1 border-b" style={{ background: C.cream, borderColor: C.border }}>
            {NAV_LINKS.map(([l, h]) => (
              <Link key={l} href={h} onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm" style={{ color: C.muted }}>{l}</Link>
            ))}
          </div>
        )}
      </motion.header>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col justify-end pt-16 relative overflow-hidden">
        {/* Texture grain */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
        }} aria-hidden />

        <div className="max-w-7xl mx-auto px-6 pb-16 w-full">
          {/* Tag */}
          <div className="overflow-hidden mb-6">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}>
              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                style={{ color: C.brick }}>
                <span className="w-8 h-px" style={{ background: C.brick }} />
                Agence Événementielle & Architecture de Marque — Casablanca
              </span>
            </motion.div>
          </div>

          {/* Titre massive */}
          <div className="space-y-0 mb-10">
            {["AGENCE", "ÉVÉNEMENTIELLE", "& ARCHITECTURE", "DE MARQUE."].map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.h1
                  initial={{ y: "105%" }} animate={{ y: 0 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.08 * i }}
                  className="font-black leading-none tracking-tight uppercase block"
                  style={{
                    fontSize: "clamp(2.8rem, 9.5vw, 9.5rem)",
                    letterSpacing: "-0.03em",
                    color: i === 3 ? C.brick : C.dark,
                  }}
                >
                  {line}
                </motion.h1>
              </div>
            ))}
          </div>

          {/* Bas de hero : tagline + CTA */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-t pt-8" style={{ borderColor: C.border }}>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-base md:text-lg max-w-sm leading-relaxed font-medium"
              style={{ color: C.muted }}>
              Inspirez. Connectez.<br />
              <strong style={{ color: C.dark }}>Marquez durablement.</strong>
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="flex gap-3">
              <Link href="/contact/brief">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm"
                  style={{ background: C.brick, color: "#fff" }}>
                  Déposer un brief <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/nos-references">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full border font-bold text-sm"
                  style={{ borderColor: C.border, color: C.dark, background: "transparent" }}>
                  Nos références
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ STATS (inversion noir) ═══════════════════════════ */}
      <section style={{ background: C.dark }}>
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
            {STATS.map(({ v, l }) => (
              <div key={l} className="p-10" style={{ background: C.dark }}>
                <Reveal>
                  <p className="font-black leading-none mb-3"
                    style={{ fontSize: "clamp(4rem, 8vw, 7rem)", color: C.brick }}>
                    {v}
                  </p>
                </Reveal>
                <p className="font-semibold tracking-wide" style={{ color: "rgba(255,255,255,0.5)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES (liste éditoriale) ══════════════════════ */}
      <section className="py-28 border-t" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
            <Reveal>
              <h2 className="font-black uppercase leading-none text-4xl md:text-6xl tracking-tight"
                style={{ letterSpacing: "-0.02em" }}>
                Nos<br />métiers<span style={{ color: C.brick }}>.</span>
              </h2>
            </Reveal>
            <Link href="/evenements">
              <span className="font-bold text-sm flex items-center gap-1" style={{ color: C.brick }}>
                Voir tout <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: C.border }}>
            {SERVICES.map((s, i) => (
              <Link key={s.label} href={s.href}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }} viewport={{ once: true }}
                  className="group py-5 flex items-center justify-between cursor-pointer"
                  style={{ borderColor: C.border }}
                  onMouseEnter={e => (e.currentTarget.style.paddingLeft = "12px")}
                  onMouseLeave={e => (e.currentTarget.style.paddingLeft = "0")}
                >
                  <div className="flex items-center gap-5">
                    <span className="text-xs font-bold tabular-nums" style={{ color: C.brick }}>{s.n}</span>
                    <span className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: C.brickL, color: C.brick }}>
                      {s.icon}
                    </span>
                    <span className="font-bold text-base md:text-lg tracking-tight">{s.label}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: C.brick }} />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ RÉALISATIONS ════════════════════════════════════ */}
      <section className="pb-28 border-t" style={{ borderColor: C.border, paddingTop: "6rem" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
            <Reveal>
              <h2 className="font-black uppercase leading-none text-4xl md:text-6xl tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                Réalisations<span style={{ color: C.brick }}>.</span>
              </h2>
            </Reveal>
            <Link href="/nos-references">
              <span className="font-bold text-sm flex items-center gap-1" style={{ color: C.brick }}>
                Toutes les références <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: C.border }}>
            {PROJECTS.map((p, i) => (
              <motion.div key={p.client}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}
                className={`group relative overflow-hidden aspect-[4/3] cursor-pointer ${p.wide && i === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                <img src={p.img} alt={p.client} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,13,13,0.85) 0%, transparent 60%)" }} />
                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ background: `rgba(200,64,30,0.88)` }}>
                  <ArrowUpRight className="w-10 h-10 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 group-hover:opacity-0 transition-opacity">
                  <p className="text-xs font-bold tracking-widest uppercase mb-1 text-white/60">{p.cat}</p>
                  <p className="text-lg font-black text-white">{p.client}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CLIENTS ═════════════════════════════════════════ */}
      <section className="border-t border-b py-16 overflow-hidden" style={{ borderColor: C.border }}>
        <p className="text-center text-xs tracking-widest uppercase mb-10 font-bold" style={{ color: C.muted }}>
          Ils nous font confiance
        </p>
        <div className="flex gap-16 animate-scroll-v2 whitespace-nowrap">
          {[...CLIENTS,...CLIENTS].map((c,i) => (
            <span key={i} className="text-sm font-black uppercase tracking-widest inline-block" style={{ color: C.muted }}>{c}</span>
          ))}
        </div>
        <style>{`
          @keyframes sv2 { from{transform:translateX(0)} to{transform:translateX(-50%)} }
          .animate-scroll-v2{ animation:sv2 22s linear infinite; }
        `}</style>
      </section>

      {/* ══ CTA (fond brique) ════════════════════════════════ */}
      <section style={{ background: C.brick }}>
        <div className="max-w-7xl mx-auto px-6 py-28">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
            <div>
              <Reveal>
                <h2 className="font-black uppercase text-white leading-none"
                  style={{ fontSize: "clamp(3rem, 7vw, 7rem)", letterSpacing: "-0.03em" }}>
                  TRAVAILLONS<br />ENSEMBLE.
                </h2>
              </Reveal>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-white/80 max-w-xs text-sm leading-relaxed">
                Un projet ? Une idée ? Parlons-en. Nous transformons vos ambitions en expériences mémorables.
              </p>
              <Link href="/contact/brief">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm w-fit"
                  style={{ background: "#fff", color: C.brick }}>
                  <Mail className="w-4 h-4" /> Déposer un brief
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer className="border-t py-10" style={{ background: C.cream, borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png" alt="Epitaphe 360" className="h-7 w-auto" />
          <p className="text-xs" style={{ color: C.muted }}>© {new Date().getFullYear()} Epitaphe 360. Tous droits réservés.</p>
          <div className="flex gap-6">
            {[["Événements","/evenements"],["Contact","/contact"],["Admin","/admin/login"]].map(([l,h]) => (
              <Link key={l} href={h} className="text-xs" style={{ color: C.muted }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Barre switcher design ───────────────────────────── */}
      <div style={{
        position: "fixed", bottom: "1.25rem", left: "50%",
        transform: "translateX(-50%)", zIndex: 9999,
        display: "flex", alignItems: "center", gap: "0.5rem",
        background: "rgba(13,13,13,0.92)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.12)", borderRadius: "9999px",
        padding: "0.5rem 1rem", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}>
        <span style={{ color: C.muted, fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", marginRight: "0.25rem" }}>Variante</span>
        {[
          { href: "/design/v1", label: "V1", active: false, accent: "#FF4D00" },
          { href: "/design/v2", label: "V2", active: true,  accent: C.brick },
          { href: "/design/v3", label: "V3", active: false, accent: "#C09849" },
        ].map(({ href, label, active, accent }) => (
          <Link key={label} href={href} style={{
            display: "inline-block", padding: "0.3rem 0.85rem",
            borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700,
            letterSpacing: "0.05em",
            background: active ? accent : "transparent",
            color: active ? "#fff" : "rgba(255,255,255,0.4)",
            border: active ? `1px solid ${accent}` : "1px solid rgba(255,255,255,0.12)",
            textDecoration: "none", transition: "all 0.2s",
          }}>{label}</Link>
        ))}
        <Link href="/design-preview" style={{
          display: "inline-flex", alignItems: "center", gap: "0.3rem",
          padding: "0.3rem 0.85rem", borderRadius: "9999px",
          fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.05em",
          background: "transparent", color: "rgba(255,255,255,0.35)",
          border: "1px solid rgba(255,255,255,0.12)", textDecoration: "none",
          marginLeft: "0.25rem",
        }}>← Sélecteur</Link>
      </div>
    </div>
  );
}
