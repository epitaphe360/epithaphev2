/**
 * Page Sélecteur de Design — /design-preview
 * Page interne de sélection de variante. Exclue de l'indexation.
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import { Helmet } from "react-helmet-async";

const VARIANTS = [
  {
    id: "v1",
    href: "/design/v1",
    name: "Cinematic Dark",
    sub: "Linear · Vercel · Raycast",
    desc: "Fond charbon #080808 — typographie Inter précise — accent orange électrique #FF4D00 — grilles mathématiques — animations clip-path.",
    preview: "bg-[#080808]",
    tag: "Moderne & Tech",
    tagColor: "#FF4D00",
    textColor: "#FFFFFF",
    sample: (
      <div className="h-full flex flex-col p-4" style={{ background: "#080808", fontFamily: "Inter,system-ui,sans-serif" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-2 rounded" style={{ background: "#FF4D00" }} />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="w-8 h-1.5 rounded bg-white/20" />)}
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: "#FF4D00" }} />
            <div className="w-20 h-1 rounded bg-white/20" />
          </div>
          <div className="w-full h-3 rounded mb-1.5" style={{ background: "#FFFFFF" }} />
          <div className="w-3/4 h-3 rounded" style={{ background: "#FF4D00" }} />
          <div className="mt-3 w-2/3 h-1.5 rounded bg-white/30" />
          <div className="mt-1 w-1/2 h-1.5 rounded bg-white/20" />
          <div className="mt-4 grid grid-cols-4 gap-1">
            {[1,2,3,4].map(i => (
              <div key={i} className="rounded p-1.5" style={{ background: "#111" }}>
                <div className="w-3 h-3 rounded mb-1" style={{ background: "rgba(255,77,0,0.2)" }} />
                <div className="w-full h-1 rounded bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "v2",
    href: "/design/v2",
    name: "Editorial Bold",
    sub: "Pentagram · Huge · Collins",
    desc: "Fond crème #F2EDE4 — typographie ultra-condensée pleine largeur — rouge-brique #C8401E — inversions dramatiques noir/crème — liste éditoriale.",
    preview: "bg-[#F2EDE4]",
    tag: "Éditorial & Puissant",
    tagColor: "#C8401E",
    textColor: "#0D0D0D",
    sample: (
      <div className="h-full flex flex-col p-4" style={{ background: "#F2EDE4", fontFamily: "Inter,system-ui,sans-serif" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-2 rounded bg-[#0D0D0D]" />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="w-8 h-1.5 rounded bg-[#0D0D0D]/20" />)}
          </div>
        </div>
        <div className="flex-1">
          <div className="w-full h-1 rounded mb-0.5 bg-[#C8401E]/30" />
          <div className="w-full h-4 rounded mb-0.5 bg-[#0D0D0D]" />
          <div className="w-full h-4 rounded mb-0.5 bg-[#0D0D0D]" />
          <div className="w-3/4 h-4 rounded mb-0.5" style={{ background: "#C8401E" }} />
          <div className="w-1/2 h-4 rounded bg-[#0D0D0D]" />
          <div className="mt-3 mb-1 w-full h-px bg-[#0D0D0D]/15" />
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-[#0D0D0D]/10">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold" style={{ color: "#C8401E" }}>{String(i).padStart(2,"0")}</span>
                <div className="w-16 h-1.5 rounded bg-[#0D0D0D]/25" />
              </div>
              <div className="w-2 h-2 rounded-full" style={{ background: "#C8401E" }} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "v3",
    href: "/design/v3",
    name: "Liquid Luxury",
    sub: "Malka · Resn · Monograph",
    desc: "Fond ivoire #FAF7F2 — typographie serif Didot élégante — or dégradé #C09849→#E8CF85 — images plein-bleed — grille asymétrique — sections alternées clair/nuit.",
    preview: "bg-[#FAF7F2]",
    tag: "Prestige & Raffinement",
    tagColor: "#C09849",
    textColor: "#1A1209",
    sample: (
      <div className="h-full flex flex-col p-4" style={{ background: "#120E08", fontFamily: "Georgia,serif" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="w-16 h-1.5 rounded" style={{ background: "linear-gradient(90deg,#C09849,#E8CF85)" }} />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="w-6 h-1.5 rounded bg-white/15" />)}
          </div>
        </div>
        {/* Hero image mockup */}
        <div className="relative rounded overflow-hidden mb-3" style={{ height: "55px", background: "#1A1209" }}>
          <div className="absolute inset-0 opacity-40" style={{ background: "linear-gradient(to right,rgba(192,152,73,0.3),transparent)" }} />
          <div className="absolute bottom-2 left-2">
            <div className="w-20 h-1.5 rounded mb-1 bg-white" />
            <div className="w-14 h-1.5 rounded" style={{ background: "linear-gradient(90deg,#C09849,#E8CF85)" }} />
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-1">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded overflow-hidden relative aspect-video" style={{ background: "#1E180E" }}>
              <div className="absolute bottom-1 left-1">
                <div className="w-8 h-1 rounded bg-white/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function DesignPreview() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#FFFFFF", fontFamily: "Inter,system-ui,sans-serif" }}>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
        <title>Sélecteur de design — Epitaphe 360</title>
      </Helmet>
      {/* Header */}
      <div className="border-b px-8 py-5 flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Epitaphe 360 — Sélecteur de design</p>
          <h1 className="text-xl font-bold">Choisissez votre direction</h1>
        </div>
        <Link href="/">
          <span className="text-xs text-white/40 hover:text-white/70 transition-colors">← Site actuel</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-base mb-16 max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}>
          3 directions créatives, 3 identités distinctes. Naviguez sur chacune dans son intégralité, puis faites votre choix.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {VARIANTS.map((v, i) => (
            <motion.div key={v.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col rounded-2xl overflow-hidden border"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "#111" }}
            >
              {/* Preview mockup */}
              <div className="h-52 overflow-hidden relative" style={{ background: v.id === "v3" ? "#120E08" : undefined }}>
                {v.sample}
              </div>

              {/* Contenu */}
              <div className="p-6 flex flex-col flex-1 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold tracking-widest uppercase px-2 py-1 rounded-full mb-2 inline-block"
                      style={{ background: `${v.tagColor}20`, color: v.tagColor }}>
                      {v.tag}
                    </span>
                    <h2 className="text-xl font-bold mt-2">{v.name}</h2>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{v.sub}</p>
                  </div>
                  <span className="text-3xl font-black" style={{ color: "rgba(255,255,255,0.06)" }}>0{i+1}</span>
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {v.desc}
                </p>
                <Link href={v.href}>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
                    style={{ background: v.tagColor, color: v.id === "v3" ? "#1A1209" : "#fff" }}
                  >
                    <Eye className="w-4 h-4" />
                    Voir la version {v.id.toUpperCase()}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-2xl border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#111" }}>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Note</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Ces 3 variantes sont des prototypes haute-fidélité. La version choisie sera affinée, enrichie des vraies photos de l'agence, 
            et intégrée comme page d'accueil principale. Les fonctionnalités (formulaire, navigation, CMS) restent inchangées.
          </p>
        </div>
      </div>
    </div>
  );
}
