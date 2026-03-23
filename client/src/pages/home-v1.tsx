/**
 * HOME V1 — CINEMATIC DARK
 * Référence : Linear · Vercel · Figma · Raycast
 * Palette : #080808 · #FFFFFF · #FF4D00
 * Typography : Inter system-ui — précision chirurgicale
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, ArrowUpRight, Calendar, Trophy, Truck, Store,
  Printer, Hammer, Signpost, LayoutGrid, Mail, Menu, X, ChevronRight,
} from "lucide-react";

/* ─── Palette ─────────────────────────────────────────────── */
const C = {
  bg:      "#080808",
  surface: "#111111",
  border:  "rgba(255,255,255,0.08)",
  text:    "#FFFFFF",
  muted:   "rgba(255,255,255,0.45)",
  accent:  "#FF4D00",
  accentL: "rgba(255,77,0,0.12)",
};

/* ─── Données ─────────────────────────────────────────────── */
const SERVICES = [
  { icon: <Calendar className="w-5 h-5" />, label: "Conventions & Kickoffs",   desc: "Fédérez vos équipes autour de vos ambitions stratégiques", href: "/evenements/conventions-kickoffs" },
  { icon: <Trophy className="w-5 h-5" />,   label: "Soirées de Gala",          desc: "Créez des moments d'exception gravés dans les mémoires",   href: "/evenements/soirees-de-gala" },
  { icon: <Truck className="w-5 h-5" />,    label: "Roadshows & Tournées",     desc: "Portez votre message dans toute la région MENA",           href: "/evenements/roadshows" },
  { icon: <Store className="w-5 h-5" />,    label: "Salons & Expositions",     desc: "Maximisez votre présence sur les salons B2B internationaux",href: "/evenements/salons" },
  { icon: <Printer className="w-5 h-5" />,  label: "Impression Grand Format",  desc: "Bâches, adhésifs, toiles rétroéclairées haute définition",  href: "/la-fabrique/impression" },
  { icon: <Hammer className="w-5 h-5" />,   label: "Menuiserie & Décor",       desc: "Stands sur mesure, mobilier d'ambiance, scénographie 3D",  href: "/la-fabrique/menuiserie" },
  { icon: <Signpost className="w-5 h-5" />, label: "Signalétique",             desc: "Totems, enseignes, wayfinding professionnel impactant",     href: "/la-fabrique/signaletique" },
  { icon: <LayoutGrid className="w-5 h-5" />,label: "Aménagement Espace",      desc: "Architecture éphémère, scénographie & expérience client",  href: "/la-fabrique/amenagement" },
];

const STATS = [
  { value: 20,  suffix: "+", label: "Ans d'expertise" },
  { value: 200, suffix: "+", label: "Événements réalisés" },
  { value: 50,  suffix: "+", label: "Clients majeurs" },
  { value: 98,  suffix: "%", label: "Taux de satisfaction" },
];

const CLIENTS = [
  "Qatar Airways", "HPS", "Schneider Electric", "Vinci Energies",
  "Dell", "SNEP", "Ajial", "Wafa Assurance", "Lafarge", "OCP Group",
];

const PROJECTS = [
  { client: "Qatar Airways",       category: "Événement",    image: "https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg" },
  { client: "Schneider Electric",  category: "Convention",    image: "https://epitaphe.ma/wp-content/uploads/2018/10/LIFE.jpg" },
  { client: "Dell",                category: "Stand 3D",      image: "https://epitaphe.ma/wp-content/uploads/2018/10/dell-rea.jpg" },
  { client: "SNEP",                category: "Architecture",  image: "https://epitaphe.ma/wp-content/uploads/2018/10/REARapport.jpg" },
];

/* ─── Counter animé ──────────────────────────────────────── */
function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const t = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Page ────────────────────────────────────────────────── */
export default function HomeV1() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 80], ["rgba(8,8,8,0)", "rgba(8,8,8,0.96)"]);
  const navBorder = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0)", "rgba(255,255,255,0.08)"]);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      <Helmet><meta name="robots" content="noindex,nofollow" /></Helmet>

      {/* ══ NAVIGATION ══════════════════════════════════════ */}
      <motion.header
        style={{ backgroundColor: navBg, borderColor: navBorder }}
        className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <img src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png" alt="Epitaphe 360" className="h-8 w-auto brightness-0 invert" />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {[["Événements","/evenements"],["Architecture","/architecture-de-marque"],["La Fabrique","/la-fabrique"],["Références","/nos-references"],["Blog","/blog"]].map(([l,h])=>(
              <Link key={l} href={h} className="px-4 py-2 text-sm rounded-lg transition-colors" style={{ color: C.muted }}>
                <span className="hover:text-white transition-colors">{l}</span>
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/contact/brief">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: C.accent, color: "#fff" }}
              >
                Déposer un brief <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: C.text }}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t px-6 py-4 space-y-2" style={{ background: C.surface, borderColor: C.border }}>
            {[["Événements","/evenements"],["Architecture","/architecture-de-marque"],["La Fabrique","/la-fabrique"],["Références","/nos-references"],["Blog","/blog"],["Contact","/contact"]].map(([l,h])=>(
              <Link key={l} href={h} onClick={() => setMenuOpen(false)} className="block py-2 text-sm" style={{ color: C.muted }}>{l}</Link>
            ))}
          </div>
        )}
      </motion.header>

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col justify-center pt-16 relative overflow-hidden">
        {/* Grid lines déco */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }} />
        {/* Glow accent */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{
          background: "radial-gradient(circle, rgba(255,77,0,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-8 border"
              style={{ color: C.accent, borderColor: "rgba(255,77,0,0.25)", background: C.accentL }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.accent }} />
              Casablanca · Maroc · 20 ans d'expertise
            </span>
          </motion.div>

          {/* Heading */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: "100%" }} animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="font-black leading-none tracking-tight"
              style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)", letterSpacing: "-0.03em" }}
            >
              Epitaphe<span style={{ color: C.accent }}>.</span>
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.p
              initial={{ y: "100%" }} animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-xl md:text-2xl font-light max-w-2xl leading-relaxed"
              style={{ color: C.muted }}
            >
              Agence événementielle & architecture de marque.<br />
              <span style={{ color: C.text }}>Inspirez. Connectez. Marquez durablement.</span>
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap gap-4 mb-24">
            <Link href="/contact/brief">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold"
                style={{ background: C.accent, color: "#fff" }}>
                Déposer un brief <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/nos-references">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold border"
                style={{ color: C.text, borderColor: C.border, background: "transparent" }}>
                Nos références <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px border" style={{ borderColor: C.border }}>
            {STATS.map(({ value, suffix, label }) => (
              <div key={label} className="p-6 border-r last:border-r-0" style={{ borderColor: C.border, background: C.surface }}>
                <p className="text-3xl md:text-4xl font-black mb-1" style={{ color: C.accent }}>
                  <Counter to={value} suffix={suffix} />
                </p>
                <p className="text-xs tracking-widest uppercase" style={{ color: C.muted }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ SERVICES ════════════════════════════════════════ */}
      <section className="py-32 border-t" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: C.accent }}>Nos métiers</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Ce que nous<br />faisons.</h2>
            </div>
            <Link href="/evenements">
              <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: C.muted }}>
                Voir tous les services <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: C.border }}>
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }} viewport={{ once: true }}
              >
                <Link href={s.href}>
                  <div className="group p-6 h-full flex flex-col gap-4 transition-colors cursor-pointer"
                    style={{ background: C.surface }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#161616")}
                    onMouseLeave={e => (e.currentTarget.style.background = C.surface)}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: C.accentL, color: C.accent }}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="font-semibold mb-2 group-hover:text-white transition-colors" style={{ color: C.text }}>{s.label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{s.desc}</p>
                    </div>
                    <div className="mt-auto">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: C.accent }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ RÉFÉRENCES ══════════════════════════════════════ */}
      <section className="py-32 border-t" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: C.accent }}>Projets récents</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Nos<br />réalisations.</h2>
            </div>
            <Link href="/nos-references">
              <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: C.muted }}>
                Toutes les références <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: C.border }}>
            {PROJECTS.map((p, i) => (
              <motion.div key={p.client}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.6 }} viewport={{ once: true }}
                className="group relative overflow-hidden aspect-[4/3] cursor-pointer"
              >
                <img src={p.image} alt={p.client} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.2) 60%, transparent 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: C.accent }}>{p.category}</p>
                  <p className="text-xl font-bold">{p.client}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.accent }}>
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CLIENTS ═════════════════════════════════════════ */}
      <section className="py-20 border-t border-b overflow-hidden" style={{ borderColor: C.border }}>
        <p className="text-center text-xs tracking-widest uppercase mb-10" style={{ color: C.muted }}>
          Ils nous font confiance
        </p>
        <div className="relative">
          <div className="flex animate-scroll-x gap-16 whitespace-nowrap">
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <span key={i} className="text-base font-semibold inline-block" style={{ color: C.muted }}>{c}</span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes scroll-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .animate-scroll-x { animation: scroll-x 25s linear infinite; }
        `}</style>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════ */}
      <section className="py-40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-8">
              Votre prochain<br />événement<br /><span style={{ color: C.accent }}>commence ici.</span>
            </h2>
            <p className="text-lg mb-12 max-w-xl mx-auto" style={{ color: C.muted }}>
              Parlez-nous de votre projet. Nous construisons ensemble l'expérience qui marquera vos audiences.
            </p>
            <Link href="/contact/brief">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-xl text-base font-bold"
                style={{ background: C.accent, color: "#fff" }}>
                <Mail className="w-5 h-5" /> Déposer un brief
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer className="border-t py-12" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png" alt="Epitaphe 360" className="h-7 w-auto brightness-0 invert" />
          <p className="text-xs" style={{ color: C.muted }}>© {new Date().getFullYear()} Epitaphe 360. Tous droits réservés.</p>
          <div className="flex gap-6">
            {[["Événements","/evenements"],["Contact","/contact"],["Admin","/admin/login"]].map(([l,h]) => (
              <Link key={l} href={h} className="text-xs transition-colors" style={{ color: C.muted }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Barre switcher design ───────────────────────────── */}
      <div style={{
        position: "fixed", bottom: "1.25rem", left: "50%",
        transform: "translateX(-50%)", zIndex: 9999,
        display: "flex", alignItems: "center", gap: "0.5rem",
        background: "rgba(17,17,17,0.92)", backdropFilter: "blur(12px)",
        border: `1px solid ${C.border}`, borderRadius: "9999px",
        padding: "0.5rem 1rem", boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}>
        <span style={{ color: C.muted, fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", marginRight: "0.25rem" }}>Variante</span>
        {[
          { href: "/design/v1", label: "V1", active: true,  accent: C.accent },
          { href: "/design/v2", label: "V2", active: false, accent: "#C8401E" },
          { href: "/design/v3", label: "V3", active: false, accent: "#C09849" },
        ].map(({ href, label, active, accent }) => (
          <Link key={label} href={href} style={{
            display: "inline-block", padding: "0.3rem 0.85rem",
            borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700,
            letterSpacing: "0.05em",
            background: active ? accent : "transparent",
            color: active ? "#000" : C.muted,
            border: active ? `1px solid ${accent}` : `1px solid ${C.border}`,
            textDecoration: "none", transition: "all 0.2s",
          }}>{label}</Link>
        ))}
        <Link href="/design-preview" style={{
          display: "inline-flex", alignItems: "center", gap: "0.3rem",
          padding: "0.3rem 0.85rem", borderRadius: "9999px",
          fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.05em",
          background: "transparent", color: C.muted,
          border: `1px solid ${C.border}`, textDecoration: "none",
          marginLeft: "0.25rem",
        }}>← Sélecteur</Link>
      </div>
    </div>
  );
}
