import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Calculator, Truck, Clock, DollarSign, TrendingDown, ArrowRight, Info } from "lucide-react";
import { PageMeta } from "@/components/seo/page-meta";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { RevealSection } from "@/components/reveal-section";
import { Link } from "wouter";

/* ─── Compteur animé ─────────────────────────────── */
function AnimatedCounter({ value, format }: { value: number; format: (v: number) => string }) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState("0");
  useEffect(() => { motionVal.set(value); }, [value]);
  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => setDisplay(format(Math.round(v))));
    return unsubscribe;
  }, [spring, format]);
  return <span>{display}</span>;
}

/* ─── Input slider + number ──────────────────────── */
function InputField({
  label, tooltip, min, max, step, value, onChange, unit, icon,
}: { label: string; tooltip: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; unit: string; icon: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">{icon}</div>
          <div>
            <p className="font-semibold text-foreground text-sm">{label}</p>
            <p className="text-muted-foreground text-xs">{tooltip}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/20 rounded-xl px-3 py-1.5 min-w-[90px]">
          <input type="number" min={min} max={max} step={step} value={value}
            onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
            className="w-14 bg-transparent text-primary font-bold text-sm focus:outline-none text-right" />
          <span className="text-primary/70 text-xs font-medium flex-shrink-0">{unit}</span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 appearance-none rounded-full bg-muted cursor-pointer focus:outline-none accent-primary" />
      <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
        <span>{min} {unit}</span><span>{max} {unit}</span>
      </div>
    </div>
  );
}

/* ─── Page principale ────────────────────────────── */
export default function CalculateurFabrique() {
  const [suppliers, setSuppliers] = useState(6);
  const [leadTime,  setLeadTime]  = useState(12);
  const [costPerProject, setCost] = useState(80000);
  const [projectsPerYear, setProjects] = useState(15);

  /* Formules */
  const timePerSupplier   = 3.5; // heures/projet/fournisseur (coordination, devis, suivi)
  const hourlyRate        = 350; // MAD/h (coût interne d'un chef de projet)
  const fabricMultiplier  = 0.30; // 30% d'économie coût avec La Fabrique (intégration verticale)
  const leadTimeReduction = 0.45; // 45% gain de délai (sourcing centralisé)

  /* Actuellement */
  const currentTimePerProject   = suppliers * timePerSupplier; // heures
  const totalCurrentTime        = currentTimePerProject * projectsPerYear;
  const totalCurrentCost        = costPerProject * projectsPerYear;
  const currentTimeInDays       = Math.round(leadTime * projectsPerYear / 20); // jours ouvrables

  /* Avec La Fabrique */
  const savedTimePerProject     = currentTimePerProject * 0.70;
  const totalSavedTime          = Math.round(savedTimePerProject * projectsPerYear);
  const savedCost               = Math.round(totalCurrentCost * fabricMultiplier);
  const savedLeadTime           = Math.round(leadTime * leadTimeReduction);
  const savedTimeValue          = Math.round(totalSavedTime * hourlyRate);
  const totalGain               = savedCost + savedTimeValue;

  const fmt = (v: number) => v.toLocaleString("fr-MA") + " MAD";
  const fmtH = (v: number) => v.toLocaleString("fr-MA") + "h";
  const fmtJ = (v: number) => v + "j";

  const results = [
    { label: "Économie sur les coûts projets", value: savedCost, format: fmt, color: "text-green-600", bg: "bg-green-50 border-green-200", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Temps coordinat. récupéré/an", value: totalSavedTime, format: fmtH, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: <Clock className="w-5 h-5" /> },
    { label: "Gain délai moyen / projet", value: savedLeadTime, format: fmtJ, color: "text-purple-600", bg: "bg-purple-50 border-purple-200", icon: <TrendingDown className="w-5 h-5" /> },
    { label: "Gain total estimé (coût + temps)", value: totalGain, format: fmt, color: "text-primary", bg: "bg-primary/5 border-primary/20", icon: <TrendingDown className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Calculateur La Fabrique™ — ROI Fabrication | Epitaphe 360"
        description="Calculez en temps réel vos économies potentielles avec La Fabrique. Réduisez vos coûts de 30% et vos délais de 45% grâce à l'intégration verticale."
        canonicalPath="/outils/calculateur-fabrique"
      />
      <Navigation />
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0A0A0A] via-[#0d1117] to-[#0A0A0A] border-b border-white/6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-primary/20">
            🏭 La Fabrique™ · Calculateur ROI
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight">
            Combien perdez-vous<br /><span className="text-primary">à gérer 6 fournisseurs ?</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Chaque projet multi-fournisseurs coûte en moyenne <strong className="text-foreground">3,5h de coordination par fournisseur</strong>.
            Estimez en 30 secondes vos gains potentiels avec l'intégration verticale Epitaphe360.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button onClick={() => document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 rounded-xl font-bold text-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-colors">
              Calculer mes économies →
            </button>
            <a href="/outils" className="px-8 py-3 rounded-xl font-semibold text-sm text-muted-foreground border border-border hover:border-primary/50 transition-colors no-underline">
              Voir tous les outils
            </a>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { v: '−30%', l: 'sur les coûts de fabrication (intégration verticale)' },
              { v: '−45%', l: 'sur les délais projet (sourcing centralisé)' },
              { v: '−70%', l: 'du temps de coordination interne récupéré' },
              { v: '1 interlocuteur', l: 'au lieu de 6+ fournisseurs à gérer' },
            ].map(s => (
              <div key={s.v} className="rounded-xl p-4 border border-border bg-muted/30 text-center">
                <div className="text-xl font-extrabold text-primary mb-1">{s.v}</div>
                <p className="text-xs text-muted-foreground leading-snug">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Avantages La Fabrique ─────────────────────────────────────── */}
      <section className="py-12 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-primary/10 text-primary border border-primary/20">INTÉGRATION VERTICALE</span>
            <h2 className="text-2xl font-bold text-foreground">Tout sous un même toit</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🖨️', name: 'Impression', desc: 'Grand format, numérique, offset' },
              { icon: '🪵', name: 'Menuiserie', desc: 'Stands, mobilier, présentoirs' },
              { icon: '🪧', name: 'Signalétique', desc: 'Intérieure, extérieure, murale' },
              { icon: '🎧', name: 'Audiovisuel', desc: 'Écrans, son, éclairage LED' },
            ].map(s => (
              <div key={s.name} className="rounded-xl p-5 border border-border bg-card text-center">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-sm font-bold text-foreground mb-1">{s.name}</div>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main id="calculator-section" className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">Outil ROI</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Calculateur La Fabrique™</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ajustez les curseurs selon votre situation. Vos gains s'affichent en temps réel.
            </p>
          </RevealSection>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Inputs */}
            <RevealSection direction="left">
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2"><Calculator className="w-5 h-5 text-primary" /> Votre situation actuelle</h2>
              <div className="space-y-4">
                <InputField label="Nombre de fournisseurs" tooltip="Impression, menuiserie, signalétique, AV..." min={1} max={20} step={1} value={suppliers} onChange={setSuppliers} unit="four." icon={<Truck className="w-4 h-4" />} />
                <InputField label="Délai moyen / projet" tooltip="Du brief à la livraison finale" min={3} max={60} step={1} value={leadTime} onChange={setLeadTime} unit="jours" icon={<Clock className="w-4 h-4" />} />
                <InputField label="Budget moyen / projet" tooltip="Coût total d'un projet type" min={10000} max={2000000} step={5000} value={costPerProject} onChange={setCost} unit="MAD" icon={<DollarSign className="w-4 h-4" />} />
                <InputField label="Projets par an" tooltip="Nombre de projets annuels estimés" min={1} max={100} step={1} value={projectsPerYear} onChange={setProjects} unit="proj." icon={<Calculator className="w-4 h-4" />} />
              </div>
              <div className="mt-5 p-4 bg-muted/50 rounded-xl border border-border flex items-start gap-3">
                <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">Estimation basée sur nos données clients (30% économie coût, 45% réduction délais, 70% réduction coordination interne). Résultats indicatifs.</p>
              </div>
            </RevealSection>

            {/* Résultats */}
            <RevealSection direction="right">
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2"><TrendingDown className="w-5 h-5 text-green-600" /> Vos gains estimés avec La Fabrique</h2>
              <div className="space-y-3 mb-5">
                {results.map((r, i) => (
                  <motion.div key={r.label} layout className={`flex items-center gap-4 p-4 rounded-2xl border ${r.bg}`}>
                    <div className={`w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0 ${r.color}`}>{r.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{r.label}</p>
                      <p className={`text-xl font-bold ${r.color}`}>
                        <AnimatedCounter value={r.value} format={r.format} />
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Comparatif */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: "Actuellement", sub: "Multi-fournisseurs", val: Math.round(totalCurrentCost * projectsPerYear / projectsPerYear).toLocaleString("fr-MA") + " MAD/proj.", color: "text-muted-foreground", border: "border-border" },
                  { label: "Avec La Fabrique", sub: "Intégration verticale", val: Math.round((costPerProject * (1 - fabricMultiplier))).toLocaleString("fr-MA") + " MAD/proj.", color: "text-green-600", border: "border-green-200" },
                ].map((c) => (
                  <div key={c.label} className={`p-4 rounded-xl border ${c.border} bg-card text-center`}>
                    <p className="text-xs text-muted-foreground mb-0.5">{c.label}</p>
                    <p className="text-xs text-muted-foreground/70 mb-2">{c.sub}</p>
                    <p className={`text-sm font-bold ${c.color}`}>{c.val}</p>
                  </div>
                ))}
              </div>

              <Link href="/contact/brief">
                <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors cursor-pointer text-sm">
                  Concrétiser ces économies — Demander une offre <ArrowRight className="w-4 h-4" />
                </motion.a>
              </Link>
            </RevealSection>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
