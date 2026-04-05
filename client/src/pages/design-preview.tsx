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
    id: "v4",
    href: "/design-v4",
    name: "Black Monolith",
    sub: "Apple · Tesla · Porsche Digital",
    desc: "Fond charbon #0a0a0a — typographie géante tracking serré — scroll horizontal projects — parallax cinématique — sections high-contrast noir/blanc.",
    preview: "bg-[#0a0a0a]",
    tag: "Cinéma & Prestige",
    tagColor: "#FFFFFF",
    textColor: "#FFFFFF",
    sample: (
      <div className="h-full flex flex-col p-4" style={{ background: "#0a0a0a", fontFamily: "Inter,system-ui,sans-serif" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-2 rounded bg-white" />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="w-8 h-1.5 rounded bg-white/20" />)}
          </div>
        </div>
        <div className="flex-1">
          <div className="w-full h-4 rounded mb-1.5 bg-white" />
          <div className="w-3/4 h-4 rounded mb-1.5 bg-white/60" />
          <div className="w-1/2 h-2 rounded bg-white/20 mt-3" />
          <div className="mt-4 grid grid-cols-3 gap-1">
            {[1,2,3].map(i => (
              <div key={i} className="rounded p-2 bg-white/5">
                <div className="w-full h-8 rounded mb-1 bg-white/10" />
                <div className="w-full h-1 rounded bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "v5",
    href: "/",
    name: "Site Actuel",
    sub: "Accueil principal en production",
    desc: "La page d'accueil actuelle du site — design professionnel avec sections héros, expertises, références, et appels à l'action intégrés.",
    preview: "bg-[#FFFFFF]",
    tag: "Version Active",
    tagColor: "#6366f1",
    textColor: "#FFFFFF",
    sample: (
      <div className="h-full flex flex-col p-4" style={{ background: "#FFFFFF", fontFamily: "Inter,system-ui,sans-serif" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-16 h-2 rounded bg-[#111]" />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="w-8 h-1.5 rounded bg-[#111]/20" />)}
          </div>
        </div>
        <div className="flex-1">
          <div className="w-full h-4 rounded mb-1.5 bg-[#111]" />
          <div className="w-3/4 h-4 rounded mb-1.5 bg-[#6366f1]" />
          <div className="w-1/2 h-2 rounded bg-[#111]/20 mt-3" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="rounded p-2 border border-[#111]/10">
                <div className="w-full h-6 rounded mb-1 bg-[#6366f1]/10" />
                <div className="w-full h-1 rounded bg-[#111]/15" />
              </div>
            ))}
          </div>
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
          2 directions créatives disponibles. Naviguez sur chacune dans son intégralité, puis faites votre choix.
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
          Ces variantes sont des prototypes haute-fidélité. La version choisie sera affinée, enrichie des vraies photos de l'agence, 
            et intégrée comme page d'accueil principale. Les fonctionnalités (formulaire, navigation, CMS) restent inchangées.
          </p>
        </div>
      </div>
    </div>
  );
}
