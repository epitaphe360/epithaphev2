/**
 * HOME V3 — LIQUID LUXURY
 * Référence : Malka Tequila · Resn · Monograph · Acne Studios
 * Palette : #FAF7F2 ivoire · #1A1209 encre · #C09849 or
 * Typography : Didot-like serif + Inter léger · clip-path fluid
 */
import { useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight, ArrowUpRight, Mail, Menu, X,
  Calendar, Trophy, Printer, Hammer, Signpost, LayoutGrid, Truck, Store,
  MapPin, Phone,
} from "lucide-react";

/* ─── Palette ────────────────────────────────────────────── */
const C = {
  ivory:  "#FAF7F2",
  ink:    "#1A1209",
  gold:   "#C09849",
  goldL:  "rgba(192,152,73,0.10)",
  goldG:  "linear-gradient(135deg, #C09849 0%, #E8CF85 50%, #C09849 100%)",
  muted:  "#8B7E6E",
  border: "#EAE4D8",
  dark:   "#120E08",
};

/* ─── Données ─────────────────────────────────────────────── */
const SERVICES = [
  { icon: <Calendar className="w-4 h-4"/>, label:"Conventions & Kickoffs", sub:"Événementiel",     href:"/evenements/conventions-kickoffs" },
  { icon: <Trophy className="w-4 h-4"/>,   label:"Soirées de Gala",         sub:"Événementiel",     href:"/evenements/soirees-de-gala"      },
  { icon: <Truck className="w-4 h-4"/>,    label:"Roadshows & Tournées",    sub:"Événementiel",     href:"/evenements/roadshows"            },
  { icon: <Store className="w-4 h-4"/>,    label:"Salons & Expositions",    sub:"Événementiel",     href:"/evenements/salons"               },
  { icon: <Printer className="w-4 h-4"/>,  label:"Impression Grand Format", sub:"La Fabrique",      href:"/la-fabrique/impression"          },
  { icon: <Hammer className="w-4 h-4"/>,   label:"Menuiserie & Décor",      sub:"La Fabrique",      href:"/la-fabrique/menuiserie"          },
  { icon: <Signpost className="w-4 h-4"/>, label:"Signalétique",            sub:"La Fabrique",      href:"/la-fabrique/signaletique"        },
  { icon: <LayoutGrid className="w-4 h-4"/>,label:"Aménagement Espace",     sub:"Architecture",     href:"/la-fabrique/amenagement"         },
];

const PROJECTS = [
  { client:"Qatar Airways",      cat:"Événement",    img:"https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg",  year:"2024" },
  { client:"Schneider Electric", cat:"Convention",    img:"https://epitaphe.ma/wp-content/uploads/2018/10/LIFE.jpg",        year:"2023" },
  { client:"Dell",               cat:"Stand & Expo",  img:"https://epitaphe.ma/wp-content/uploads/2018/10/dell-rea.jpg",   year:"2023" },
  { client:"SNEP",               cat:"Architecture",  img:"https://epitaphe.ma/wp-content/uploads/2018/10/REARapport.jpg", year:"2022" },
  { client:"Ajial",              cat:"Scénographie",  img:"https://epitaphe.ma/wp-content/uploads/2018/10/Ajial2-1.jpg",   year:"2022" },
];

const CLIENTS = ["Qatar Airways","HPS","Schneider","Vinci","Dell","SNEP","Ajial","Wafa Assurance","Lafarge","OCP"];

/* ─── FadeSlide ──────────────────────────────────────────── */
function FS({ children, delay = 0, dir = "up", className = "" }:
  { children: React.ReactNode; delay?: number; dir?: "up"|"left"|"right"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const y = dir === "up" ? 40 : 0;
  const x = dir === "left" ? -40 : dir === "right" ? 40 : 0;
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── GoldLine décorative ────────────────────────────────── */
function Goldline() {
  return <div className="w-16 h-px" style={{ background: C.goldG }} />;
}

/* ─── Page ────────────────────────────────────────────────── */
export default function HomeV3() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start","end start"] });
  const imgY = useTransform(scrollYProgress, [0,1], ["0%", "20%"]);
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 60], ["rgba(250,247,242,0)", "rgba(250,247,242,0.98)"]);

  return (
    <div style={{ background: C.ivory, color: C.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <Helmet><meta name="robots" content="noindex,nofollow" /></Helmet>
      <style>{`
        .v3-sans { font-family: Inter, system-ui, sans-serif; }
        @keyframes sv3 { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .animate-sv3 { animation: sv3 30s linear infinite; }
        .gold-text {
          background: ${C.goldG};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .img-zoom img { transition: transform 0.9s cubic-bezier(0.16,1,0.3,1); }
        .img-zoom:hover img { transform: scale(1.06); }
        .service-row { transition: background 0.2s, padding-left 0.25s; }
        .service-row:hover { background: ${C.goldL}; padding-left: 16px; }
      `}</style>

      {/* ══ NAV ═══════════════════════════════════════════════ */}
      <motion.header style={{ backgroundColor: navBg }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
        <div className="border-b" style={{ borderColor: C.border }}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/">
              <img src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png" alt="Epitaphe 360" className="h-8 w-auto" />
            </Link>
            <nav className="hidden md:flex items-center gap-1 v3-sans">
              {[["Événements","/evenements"],["Architecture","/architecture-de-marque"],["La Fabrique","/la-fabrique"],["Références","/nos-references"],["Contact","/contact"]].map(([l,h]) => (
                <Link key={l} href={h} className="px-4 py-2 text-sm transition-colors"
                  style={{ color: C.muted, fontFamily: "Inter,system-ui,sans-serif" }}
                  onMouseEnter={e=>(e.currentTarget.style.color=C.ink)}
                  onMouseLeave={e=>(e.currentTarget.style.color=C.muted)}>{l}</Link>
              ))}
            </nav>
            <div className="hidden md:block v3-sans">
              <Link href="/contact/brief">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 text-sm font-semibold rounded-full border"
                  style={{ borderColor: C.gold, color: C.gold, background: "transparent", fontFamily:"Inter,system-ui,sans-serif" }}
                  onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background=C.goldL; }}
                  onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background="transparent"; }}>
                  Brief →
                </motion.button>
              </Link>
            </div>
            <button className="md:hidden v3-sans" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 py-4 space-y-1 border-b" style={{ background: C.ivory, borderColor: C.border }}>
            {[["Événements","/evenements"],["Architecture","/architecture-de-marque"],["La Fabrique","/la-fabrique"],["Références","/nos-references"],["Contact","/contact"]].map(([l,h]) => (
              <Link key={l} href={h} onClick={() => setMenuOpen(false)} className="block py-2 text-sm v3-sans" style={{ color: C.muted }}>{l}</Link>
            ))}
          </div>
        )}
      </motion.header>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section ref={heroRef} className="min-h-screen relative overflow-hidden flex items-end pt-16">
        {/* Image fullbleed parallax */}
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(26,18,9,0.65) 0%, rgba(26,18,9,0.15) 60%, rgba(26,18,9,0.4) 100%)" }} />
          <img
            src="https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg"
            alt="Hero"
            className="w-full h-full object-cover"
            style={{ transform: "scale(1.05)" }}
          />
        </motion.div>

        {/* Contenu hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
          {/* Subtitle */}
          <FS delay={0.1}>
            <div className="flex items-center gap-3 mb-6">
              <Goldline />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-white/70 v3-sans">
                Casablanca · Maroc · Agence 360°
              </span>
            </div>
          </FS>

          {/* Titre */}
          <div className="mb-10">
            {[
              { text: "L'agence qui", white: true },
              { text: "marque les esprits", white: false },
              { text: "et les territoires.", white: true },
            ].map(({ text, white }, i) => (
              <div key={i} className="overflow-hidden">
                <motion.h1
                  initial={{ y: "110%" }} animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.12 }}
                  className="leading-tight font-normal"
                  style={{
                    fontSize: "clamp(3rem, 7vw, 7.5rem)",
                    color: white ? "#FFFFFF" : "transparent",
                    background: !white ? C.goldG : undefined,
                    WebkitBackgroundClip: !white ? "text" : undefined,
                    WebkitTextFillColor: !white ? "transparent" : undefined,
                    backgroundClip: !white ? "text" : undefined,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {text}
                </motion.h1>
              </div>
            ))}
          </div>

          {/* CTA + scroll */}
          <FS delay={0.6} className="flex flex-wrap items-center gap-6">
            <Link href="/contact/brief">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm v3-sans"
                style={{ background: C.goldG, color: C.ink }}>
                Déposer un brief <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/nos-references">
              <span className="flex items-center gap-2 text-sm font-medium text-white/80 v3-sans">
                Découvrir nos réalisations <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          </FS>
        </div>

        {/* Stats flottantes (bas-droite) */}
        <FS delay={0.8} dir="right" className="absolute bottom-10 right-6 hidden lg:flex gap-8 z-10">
          {[["20+","ans"],["200+","événements"],["50+","clients"]].map(([v,l]) => (
            <div key={l} className="text-right">
              <p className="font-bold text-3xl gold-text">{v}</p>
              <p className="text-xs text-white/60 tracking-widest uppercase v3-sans">{l}</p>
            </div>
          ))}
        </FS>
      </section>

      {/* ══ INTRO ══════════════════════════════════════════════ */}
      <section className="py-28 border-b" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FS>
              <div className="mb-4"><Goldline /></div>
              <h2 className="text-4xl md:text-5xl leading-tight font-normal mb-6" style={{ letterSpacing: "-0.02em" }}>
                Une agence de communication <em>360°</em>, c'est&nbsp;:
              </h2>
              <p className="text-base leading-relaxed mb-8 v3-sans" style={{ color: C.muted }}>
                Une vision globale de votre présence — de la conception scénographique à la fabrication, 
                de la stratégie de marque à l'émotion vécue par vos audiences.
              </p>
              <ul className="space-y-3 v3-sans">
                {[
                  "Un interlocuteur unique de A à Z",
                  "Conception, fabrication et logistique intégrées",
                  "20 ans d'expertise au service de votre image",
                  "Un ancrage fort à Casablanca, une portée régionale",
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: C.muted }}>
                    <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: C.gold }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link href="/contact/brief">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold border v3-sans"
                    style={{ borderColor: C.gold, color: C.gold }}>
                    Parlez-nous de votre projet <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </FS>
            <FS delay={0.2} dir="right">
              <div className="img-zoom overflow-hidden rounded-2xl aspect-[4/3]">
                <img
                  src="https://epitaphe.ma/wp-content/uploads/2018/10/LIFE.jpg"
                  alt="Agence Epitaphe"
                  className="w-full h-full object-cover"
                />
              </div>
            </FS>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ════════════════════════════════════════ */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <FS className="mb-16">
            <div className="mb-4"><Goldline /></div>
            <h2 className="text-4xl md:text-5xl leading-none font-normal" style={{ letterSpacing: "-0.02em" }}>
              Nos domaines<br /><em>d'expertise</em>
            </h2>
          </FS>
          <div className="divide-y" style={{ borderColor: C.border }}>
            {SERVICES.map((s, i) => (
              <Link key={s.label} href={s.href}>
                <div className="service-row py-5 flex items-center justify-between cursor-pointer border-t" style={{ borderColor: C.border }}>
                  <div className="flex items-center gap-5">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.goldL, color: C.gold }}>
                      {s.icon}
                    </span>
                    <div>
                      <p className="font-semibold" style={{ fontFamily: "Georgia, serif" }}>{s.label}</p>
                      <p className="text-xs v3-sans" style={{ color: C.muted }}>{s.sub}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4" style={{ color: C.gold }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ RÉALISATIONS ════════════════════════════════════ */}
      <section className="py-16 border-t" style={{ background: C.dark, borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <FS className="mb-16">
            <div className="mb-4"><Goldline /></div>
            <h2 className="text-4xl md:text-5xl leading-none font-normal text-white" style={{ letterSpacing: "-0.02em" }}>
              Quelques<br /><em className="gold-text">réalisations</em>
            </h2>
          </FS>
          {/* Grille asymétrique */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {PROJECTS.map((p, i) => {
              const spans = ["md:col-span-7","md:col-span-5","md:col-span-5","md:col-span-7","md:col-span-12"];
              const aspects = ["aspect-[16/9]","aspect-[4/3]","aspect-[4/3]","aspect-[16/9]","aspect-[21/6]"];
              return (
                <motion.div key={p.client}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.7 }} viewport={{ once: true }}
                  className={`img-zoom group relative overflow-hidden rounded-xl cursor-pointer ${spans[i] || "md:col-span-6"} ${aspects[i] || "aspect-[4/3]"}`}
                >
                  <img src={p.img} alt={p.client} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(18,14,8,0.85) 0%, transparent 60%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-xs tracking-widest uppercase mb-1 v3-sans" style={{ color: C.gold }}>{p.cat} · {p.year}</p>
                    <p className="text-lg font-normal text-white">{p.client}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link href="/nos-references">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium border v3-sans"
                style={{ borderColor: C.gold, color: C.gold }}>
                Voir toutes les références <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ CLIENTS CAROUSEL ════════════════════════════════ */}
      <section className="border-t border-b py-14 overflow-hidden" style={{ borderColor: C.border }}>
        <p className="text-center text-xs tracking-[0.3em] uppercase mb-10 v3-sans" style={{ color: C.muted }}>
          Ils nous font confiance
        </p>
        <div className="flex gap-14 animate-sv3 whitespace-nowrap">
          {[...CLIENTS,...CLIENTS].map((c,i) => (
            <span key={i} className="text-sm font-semibold tracking-widest uppercase inline-block v3-sans" style={{ color: C.muted }}>{c}</span>
          ))}
        </div>
      </section>

      {/* ══ CTA FINALE ══════════════════════════════════════ */}
      <section className="py-32" style={{ background: C.ivory }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <FS>
            <div className="flex justify-center mb-6"><Goldline /></div>
            <h2 className="font-normal leading-tight mb-8" style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)", letterSpacing: "-0.02em" }}>
              Prêt à créer<br />
              <em className="gold-text">l'inoubliable</em>&nbsp;?
            </h2>
            <p className="text-base mb-12 max-w-md mx-auto leading-relaxed v3-sans" style={{ color: C.muted }}>
              Chaque grand événement commence par une conversation. 
              Dites-nous votre vision, nous la bâtissons.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact/brief">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-sm v3-sans"
                  style={{ background: C.goldG, color: C.ink }}>
                  <Mail className="w-4 h-4" /> Déposer un brief
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-10 py-4 rounded-full border font-medium text-sm v3-sans"
                  style={{ borderColor: C.border, color: C.ink }}>
                  <Phone className="w-4 h-4" /> Nous appeler
                </motion.button>
              </Link>
            </div>
          </FS>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer className="border-t py-12" style={{ background: C.dark, borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-10 border-b mb-8" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div>
              <img src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png" alt="Epitaphe 360" className="h-8 w-auto brightness-0 invert mb-4" />
              <p className="text-sm max-w-xs leading-relaxed v3-sans" style={{ color: "rgba(255,255,255,0.4)" }}>
                Agence événementielle & architecture de marque à Casablanca.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 v3-sans">
              <div>
                <p className="text-xs tracking-widest uppercase mb-4" style={{ color: C.gold }}>Navigation</p>
                {[["Événements","/evenements"],["Architecture","/architecture-de-marque"],["La Fabrique","/la-fabrique"]].map(([l,h]) => (
                  <Link key={l} href={h} className="block text-sm mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{l}</Link>
                ))}
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase mb-4" style={{ color: C.gold }}>Contact</p>
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: C.gold }} />
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Casablanca, Maroc</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.gold }} />
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>contact@epitaphe.ma</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs v3-sans" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Epitaphe 360. Tous droits réservés.
          </p>
        </div>
      </footer>

      {/* ── Barre switcher design ───────────────────────────── */}
      <div style={{
        position: "fixed", bottom: "1.25rem", left: "50%",
        transform: "translateX(-50%)", zIndex: 9999,
        display: "flex", alignItems: "center", gap: "0.5rem",
        background: "rgba(26,18,9,0.92)", backdropFilter: "blur(12px)",
        border: `1px solid ${C.border}`, borderRadius: "9999px",
        padding: "0.5rem 1rem", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}>
        <span style={{ color: C.muted, fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", marginRight: "0.25rem" }}>Variante</span>
        {[
          { href: "/design/v1", label: "V1", active: false, accent: "#FF4D00" },
          { href: "/design/v2", label: "V2", active: false, accent: "#C8401E" },
          { href: "/design/v3", label: "V3", active: true,  accent: C.gold },
        ].map(({ href, label, active, accent }) => (
          <Link key={label} href={href} style={{
            display: "inline-block", padding: "0.3rem 0.85rem",
            borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700,
            letterSpacing: "0.05em",
            background: active ? accent : "transparent",
            color: active ? C.ink : C.muted,
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
