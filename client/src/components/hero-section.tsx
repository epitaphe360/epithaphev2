/**
 * HeroSection — Epitaphe 360
 * Skill: UI/UX Pro Max → Motion-Driven + 3D Hyperrealism + OLED Dark
 * Typography: Cormorant Garamond (headings) + Montserrat (body)
 * Palette: #EC4899 magenta · #06B6D4 cyan · #000005 OLED bg
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { WorldGlobe } from "@/components/world-globe";

// ─── Ticker items ─────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  "Convention Nationale", "Gala d'Entreprise", "Architecture de Marque",
  "Signalétique Premium", "Stand 3D", "Événements Corporate",
  "Lancement Produit", "Road Show", "Team Building", "Activation de Marque",
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "20+",  label: "Années d'expertise" },
  { value: "200+", label: "Événements réalisés" },
  { value: "50+",  label: "Clients majeurs"     },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: "easeOut" } },
};

// ─── Floating background particles ───────────────────────────────────────────

function FloatingParticles() {
  const particles = Array.from({ length: 28 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width:  `${3 + (i % 4)}px`,
            height: `${3 + (i % 4)}px`,
            left:   `${(i * 37 + 11) % 100}%`,
            top:    `${(i * 53 + 7)  % 100}%`,
            background: i % 2 === 0 ? "rgba(236,72,153,0.55)" : "rgba(6,182,212,0.45)",
            boxShadow: i % 2 === 0
              ? "0 0 8px 2px rgba(236,72,153,0.35)"
              : "0 0 8px 2px rgba(6,182,212,0.3)",
          }}
          animate={{
            y:       [0, -22 - (i % 16), 0],
            opacity: [0.4, 1, 0.4],
            scale:   [1, 1.3, 1],
          }}
          transition={{
            duration: 4 + (i % 4) * 1.2,
            repeat:   Infinity,
            delay:    (i % 7) * 0.55,
            ease:     "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Infinite ticker ──────────────────────────────────────────────────────────

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden border-t"
      style={{ borderColor: "rgba(236,72,153,0.15)" }}
    >
      <motion.div
        className="flex whitespace-nowrap h-full items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-8 text-xs font-semibold tracking-widest uppercase"
            style={{ color: "rgba(236,72,153,0.7)" }}
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: i % 2 === 0 ? "#EC4899" : "#06B6D4" }}
            />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main HeroSection ─────────────────────────────────────────────────────────

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  // Parallax layers
  const yText    = useTransform(scrollYProgress, [0, 1], ["0%",  "-18%"]);
  const yGlobe   = useTransform(scrollYProgress, [0, 1], ["0%",   "12%"]);
  const opacityS = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const scrollToServices = () => {
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 80% 90% at 65% 45%, #0d0120 0%, #000005 60%)",
      }}
      data-testid="section-hero"
    >
      {/* ── Noise grain overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          opacity: 0.6,
        }}
        aria-hidden
      />

      {/* ── Radial magenta light source ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "5%", top: "10%",
          width: "60vw", height: "60vw",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(236,72,153,0.08) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      {/* ── Floating particles ── */}
      <FloatingParticles />

      {/* ── Main layout ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8 pt-24 pb-20 min-h-screen items-center">

          {/* ── LEFT: Text content ── */}
          <motion.div
            style={{ y: yText, opacity: opacityS }}
            className="flex flex-col justify-center"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 md:space-y-8"
            >
              {/* Badge */}
              <motion.div variants={fadeUp}>
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase border"
                  style={{
                    color: "#06B6D4",
                    borderColor: "rgba(6,182,212,0.3)",
                    background: "rgba(6,182,212,0.07)",
                    boxShadow: "0 0 20px rgba(6,182,212,0.12)",
                  }}
                >
                  <MapPin className="w-3 h-3" />
                  Casablanca · Maroc · Agence 360°
                </span>
              </motion.div>

              {/* Main heading — Cormorant Garamond */}
              <motion.div variants={fadeUp} className="space-y-1">
                <h1
                  className="font-cormorant leading-[0.9] tracking-tight"
                  style={{ fontSize: "clamp(4rem, 9vw, 8.5rem)", fontWeight: 700 }}
                  data-testid="text-hero-title"
                >
                  <span style={{ color: "#FFFFFF" }}>Epitaphe</span>
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #EC4899 0%, #F472B6 40%, #06B6D4 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    360.
                  </span>
                </h1>
              </motion.div>

              {/* Tagline */}
              <motion.p
                variants={fadeUp}
                className="font-montserrat text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-md"
                style={{ color: "rgba(255,255,255,0.6)" }}
                data-testid="text-hero-tagline"
              >
                Inspirez. Connectez.{" "}
                <em
                  className="not-italic font-semibold"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                >
                  Marquez Durablement.
                </em>
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                {/* Primary CTA */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={scrollToServices}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-montserrat text-sm font-semibold tracking-wide text-white cursor-pointer transition-shadow"
                  style={{
                    background: "linear-gradient(135deg, #EC4899, #be185d)",
                    boxShadow: "0 0 30px rgba(236,72,153,0.45), 0 4px 20px rgba(236,72,153,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 50px rgba(236,72,153,0.7), 0 4px 30px rgba(236,72,153,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 30px rgba(236,72,153,0.45), 0 4px 20px rgba(236,72,153,0.3)";
                  }}
                >
                  Découvrir nos métiers
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.button>

                {/* Ghost CTA */}
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-montserrat text-sm font-semibold tracking-wide transition-all cursor-pointer"
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  Nous contacter
                </motion.a>
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={fadeIn}
                className="flex flex-wrap gap-6 pt-4"
              >
                {STATS.map(({ value, label }, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <span
                      className="font-cormorant text-3xl md:text-4xl font-bold leading-none"
                      style={{
                        background: "linear-gradient(135deg, #EC4899, #06B6D4)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {value}
                    </span>
                    <span
                      className="font-montserrat text-xs font-medium tracking-wide uppercase"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: 3D Globe ── */}
          <motion.div
            style={{ y: yGlobe }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative flex items-center justify-center"
            aria-hidden
          >
            {/* Glow halo behind globe */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(236,72,153,0.12) 0%, transparent 65%)",
                filter: "blur(30px)",
                transform: "scale(1.15)",
              }}
            />
            <div
              className="w-full aspect-square max-w-[580px]"
              style={{ filter: "drop-shadow(0 0 60px rgba(236,72,153,0.25))" }}
            >
              <WorldGlobe />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Ticker strip ── */}
      <Ticker />

      {/* ── Scroll indicator ── */}
      <motion.button
        onClick={scrollToServices}
        style={{ opacity: opacityS }}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        aria-label="Défiler vers les services"
        data-testid="button-scroll-down"
      >
        <span
          className="text-[10px] font-semibold tracking-[0.25em] uppercase"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Scroll
        </span>
        <ChevronDown
          className="w-5 h-5 animate-bounce"
          style={{ color: "rgba(236,72,153,0.7)" }}
        />
      </motion.button>
    </section>
  );
}
