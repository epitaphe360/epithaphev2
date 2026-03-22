import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, ShieldCheck, TrendingUp, Download, ArrowRight, Loader2 } from "lucide-react";
import { PageMeta } from "@/components/seo/page-meta";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { RevealSection } from "@/components/reveal-section";
import { Link } from "wouter";
import { generateVigilancePDF } from "@/lib/vigilance-pdf";

/* ─── Questions QHSE ──────────────────────────────── */
const QUESTIONS = [
  {
    id: 1,
    category: "Documentation",
    question: "Votre système de management QHSE est-il formalisé et documenté ?",
    options: [
      { label: "Non, aucune documentation", score: 0 },
      { label: "Partiellement (quelques procédures)", score: 1 },
      { label: "Oui, mais pas à jour", score: 2 },
      { label: "Oui, complet et à jour", score: 4 },
    ],
    weight: 25,
  },
  {
    id: 2,
    category: "Formation",
    question: "Les formations sécurité et QHSE sont-elles dispensées régulièrement ?",
    options: [
      { label: "Pas de formations organisées", score: 0 },
      { label: "Formations ponctuelles (irrégulières)", score: 1 },
      { label: "Formations annuelles planifiées", score: 2 },
      { label: "Plan de formation continu et traçabilité complète", score: 4 },
    ],
    weight: 20,
  },
  {
    id: 3,
    category: "Affichage & Signalétique",
    question: "L'affichage réglementaire QHSE est-il conforme et visible dans vos locaux ?",
    options: [
      { label: "Affichage absent ou très insuffisant", score: 0 },
      { label: "Affichages présents mais non conformes", score: 1 },
      { label: "Conformes mais non personnalisés", score: 2 },
      { label: "Conformes, personnalisés et régulièrement mis à jour", score: 4 },
    ],
    weight: 20,
  },
  {
    id: 4,
    category: "Procédures d'urgence",
    question: "Les procédures d'urgence sont-elles rédigées, affichées et exercées ?",
    options: [
      { label: "Inexistantes", score: 0 },
      { label: "Rédigées mais non affichées", score: 1 },
      { label: "Affichées mais sans exercices réalisés", score: 2 },
      { label: "Rédigées, affichées, exercices réalisés et tracés", score: 4 },
    ],
    weight: 20,
  },
  {
    id: 5,
    category: "Audits & Amélioration",
    question: "Des audits internes QHSE sont-ils réalisés et suivis d'actions correctives ?",
    options: [
      { label: "Aucun audit réalisé", score: 0 },
      { label: "Audits informels, sans suivi", score: 1 },
      { label: "Audits réalisés, actions non systématiques", score: 2 },
      { label: "Audits planifiés avec PDCA et suivi des indicateurs", score: 4 },
    ],
    weight: 15,
  },
];

/* ─── Niveaux de résultat ─────────────────────────── */
type Level = { key: string; label: string; color: string; bg: string; description: string; recommendation: string };
const LEVELS: Level[] = [
  { key: "critique", label: "Niveau Critique", color: "text-red-600", bg: "bg-red-50 border-red-200", description: "Votre communication QHSE présente des lacunes majeures.", recommendation: "Une refonte complète de votre signalétique et de vos supports est urgente pour être en conformité réglementaire." },
  { key: "fragile", label: "Niveau Fragile", color: "text-orange-600", bg: "bg-orange-50 border-orange-200", description: "Des bases existent mais restent incomplètes.", recommendation: "Renforcez vos points faibles : formation du personnel, mise à jour de l'affichage et plan d'urgence formalisé." },
  { key: "solide", label: "Niveau Solide", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", description: "Votre démarche QHSE est structurée et fonctionne.", recommendation: "Pour atteindre l'excellence, personnalisez vos supports et mettez en place un tableau de bord de suivi des indicateurs." },
  { key: "exemplaire", label: "Niveau Exemplaire", color: "text-green-600", bg: "bg-green-50 border-green-200", description: "Votre communication QHSE est un modèle pour votre secteur.", recommendation: "Capitalisez sur votre image QHSE pour renforcer votre marque employeur et fidéliser vos clients." },
];

function getLevel(score: number): Level {
  if (score < 30) return LEVELS[0];
  if (score < 55) return LEVELS[1];
  if (score < 78) return LEVELS[2];
  return LEVELS[3];
}

function computeScore(answers: Record<number, number>): number {
  let total = 0;
  for (const q of QUESTIONS) {
    const raw = answers[q.id] ?? 0;
    total += (raw / 4) * q.weight;
  }
  return Math.round(total);
}

/* ─── Anneau de score ─────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const r = 80, C = 2 * Math.PI * r;
  const dash = (score / 100) * C;
  const level = getLevel(score);
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r={r} fill="none" stroke="#e5e7eb" strokeWidth="16" />
      <motion.circle cx="100" cy="100" r={r} fill="none" stroke="currentColor"
        strokeWidth="16" strokeLinecap="round" strokeDasharray={`${C}`}
        strokeDashoffset={C - dash} transform="rotate(-90 100 100)"
        className={level.color}
        initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C - dash }}
        transition={{ duration: 1.2, ease: "easeOut" }} />
      <text x="100" y="95" textAnchor="middle" className="fill-foreground" fontSize="32" fontWeight="bold">{score}</text>
      <text x="100" y="120" textAnchor="middle" fill="#6b7280" fontSize="12">/100</text>
    </svg>
  );
}

/* ─── Email capture gate ──────────────────────────── */
function EmailGate({ onUnlock }: { onUnlock: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const FREE = ["gmail", "yahoo", "hotmail", "outlook", "yopmail", "live", "icloud"];
  const submit = () => {
    if (!email.includes("@")) { setError("Email invalide"); return; }
    const domain = email.split("@")[1]?.split(".")[0]?.toLowerCase() ?? "";
    if (FREE.includes(domain)) { setError("Veuillez utiliser votre email professionnel"); return; }
    onUnlock(email);
  };
  return (
    <div className="text-center max-w-md mx-auto py-10 px-6">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <ShieldCheck className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">Accédez à votre rapport détaillé</h3>
      <p className="text-muted-foreground text-sm mb-6">Entrez votre email professionnel pour recevoir votre rapport QHSE et les recommandations personnalisées.</p>
      <div className="flex gap-2">
        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="votre@entreprise.ma" className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        <button onClick={submit} className="bg-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90">OK</button>
      </div>
      {error && <p className="text-destructive text-xs mt-2">{error}</p>}
    </div>
  );
}

/* ─── Page principale ─────────────────────────────── */
export default function VigilanceScore() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [phase, setPhase] = useState<"quiz" | "gate" | "result">("quiz");
  const [pdfEmail, setPdfEmail] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const questionsCurrent = QUESTIONS.findIndex((q) => !(q.id in answers));
  const currentQ = questionsCurrent >= 0 ? QUESTIONS[questionsCurrent] : null;
  const isComplete = Object.keys(answers).length === QUESTIONS.length;
  const score = computeScore(answers);
  const level = getLevel(score);

  const answer = (qId: number, val: number) => {
    setAnswers((p) => ({ ...p, [qId]: val }));
  };

  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Vigilance Score™ QHSE — Évaluez votre maturité QHSE | Epitaphe 360"
        description="Outil d'évaluation QHSE en 5 questions. Obtenez un score sur 100 et des recommandations personnalisées pour votre communication sécurité."
        canonicalPath="/outils/vigilance-score"
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center mb-10">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">Outil QHSE</span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Vigilance Score™</h1>
            <p className="text-muted-foreground">Évaluez en 2 minutes la maturité de votre communication QHSE. Obtenez un score sur 100 et des recommandations ciblées.</p>
          </RevealSection>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Barre de progression */}
            {phase === "quiz" && (
              <div className="h-1.5 bg-muted">
                <motion.div className="h-full bg-primary" style={{ width: `${progress}%` }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
              </div>
            )}

            {phase === "quiz" && (
              <div className="p-6 md:p-10">
                {!isComplete && currentQ && (
                  <AnimatePresence mode="wait">
                    <motion.div key={currentQ.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">{currentQ.category}</span>
                        <span className="text-sm text-muted-foreground">{Object.keys(answers).length + 1} / {QUESTIONS.length}</span>
                      </div>
                      <h2 className="text-lg font-bold text-foreground mb-6">{currentQ.question}</h2>
                      <div className="space-y-3">
                        {currentQ.options.map((opt, i) => (
                          <motion.button key={i} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                            onClick={() => answer(currentQ.id, opt.score)}
                            className="w-full flex items-center gap-3 text-left px-5 py-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 text-foreground text-sm font-medium transition-all group">
                            <div className="w-6 h-6 rounded-full border-2 border-border group-hover:border-primary flex-shrink-0 transition-colors" />
                            {opt.label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
                {isComplete && phase === "quiz" && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-6">Questionnaire complété ! Consultez votre score et rapport.</p>
                    <button onClick={() => setPhase("gate")} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                      Voir mon Vigilance Score™ <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {phase === "gate" && <EmailGate onUnlock={(email) => { setPdfEmail(email); setPhase("result"); }} />}

            {phase === "result" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-10">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4"><ScoreRing score={score} /></div>
                  <div className={`inline-block px-5 py-2 rounded-full border text-sm font-bold mb-2 ${level.bg} ${level.color}`}>{level.label}</div>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">{level.description}</p>
                </div>

                {/* Détail par question */}
                <div className="space-y-3 mb-8">
                  {QUESTIONS.map((q) => {
                    const raw = answers[q.id] ?? 0;
                    const pct = Math.round((raw / 4) * 100);
                    return (
                      <div key={q.id} className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{q.category}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.1 * q.id, duration: 0.6 }} />
                        </div>
                        <span className="text-xs text-foreground font-semibold w-8 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>

                {/* Recommandation */}
                <div className={`rounded-2xl border p-5 mb-8 ${level.bg}`}>
                  <p className={`font-semibold mb-1 ${level.color}`}>Recommandation Epitaphe360</p>
                  <p className="text-sm text-foreground">{level.recommendation}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/contact/brief">
                    <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors cursor-pointer text-sm">
                      Améliorer mon score — Déposer un brief <ArrowRight className="w-4 h-4" />
                    </motion.a>
                  </Link>
                  <button
                    disabled={pdfLoading}
                    onClick={async () => {
                      setPdfLoading(true);
                      try {
                        await generateVigilancePDF({
                          score,
                          level: level.label,
                          levelDescription: level.description,
                          recommendation: level.recommendation,
                          companyEmail: pdfEmail,
                          date: new Date().toLocaleDateString("fr-MA"),
                          questions: QUESTIONS.map((q) => ({
                            category: q.category,
                            question: q.question,
                            answer: q.options.find((o) => o.score === answers[q.id])?.label ?? "",
                            score: answers[q.id] ?? 0,
                            maxScore: 4,
                          })),
                        });
                      } finally {
                        setPdfLoading(false);
                      }
                    }}
                    className="flex items-center justify-center gap-2 border border-border text-foreground px-5 py-3 rounded-xl font-semibold hover:border-primary text-sm transition-colors disabled:opacity-60">
                    {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    {pdfLoading ? "Génération..." : "Télécharger PDF"}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
