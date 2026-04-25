import { useState } from 'react';
import { useToolQuestions } from '@/hooks/useToolQuestions';
import { Helmet } from 'react-helmet-async';
import { SoftwareApplicationSchema, BreadcrumbSchema } from '@/components/seo/schema-org';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ScoringQuestionnaire } from '@/components/scoring-questionnaire';
import { EmailGate } from '@/components/email-gate';
import { DiscoverResults } from '@/components/discover-results';
import { IntelligencePricing } from '@/components/intelligence-pricing';
import { IntelligenceResults } from '@/components/intelligence-results';
import {
  type ScoringQuestion, type ScoringAnswer,
  type SectorType, type CompanySizeType,
} from '@/lib/scoring-engine';

const TOOL_COLOR = '#8B5CF6'; // Violet pour EventImpact
const TOOL_ID = 'eventimpact' as const;

type EventMode = 'retrospectif' | 'anticipatif' | 'annuel';

const DEFAULT_QUESTIONS: ScoringQuestion[] = [
  // S — Stratégie Événementielle
  { id: 's1', pillar: 'S', pillarLabel: 'Stratégie', text: 'Les événements organisés s\'inscrivent dans une stratégie de communication globale documentée.', weight: 3 },
  { id: 's2', pillar: 'S', pillarLabel: 'Stratégie', text: 'Les objectifs de chaque événement sont définis, mesurables et communiqués avant l\'organisation.', weight: 3 },
  { id: 's3', pillar: 'S', pillarLabel: 'Stratégie', text: 'Le calendrier événementiel est planifié sur l\'année entière avec une vision stratégique.', weight: 2 },
  { id: 's4', pillar: 'S', pillarLabel: 'Stratégie', text: 'Chaque événement a un brief clair incluant cible, message clé, format et KPIs attendus.', weight: 2 },
  { id: 's5', pillar: 'S', pillarLabel: 'Stratégie', text: 'La sélection des événements (foires, salons, séminaires) répond à des critères stratégiques, pas seulement à des habitudes.', weight: 2 },
  { id: 's6', pillar: 'S', pillarLabel: 'Stratégie', text: 'Il existe une cohérence entre les types d\'événements choisis et le positionnement de marque.', weight: 2 },
  // T — Targeting
  { id: 't1', pillar: 'T', pillarLabel: 'Targeting', text: 'Nos événements atteignent avec précision notre cible prioritaire (acheteurs, prescripteurs, partenaires).', weight: 3 },
  { id: 't2', pillar: 'T', pillarLabel: 'Targeting', text: 'Nous qualifions les leads collectés lors des événements dans les 48h suivant l\'événement.', weight: 3 },
  { id: 't3', pillar: 'T', pillarLabel: 'Targeting', text: 'Un plan de suivi post-événement est préparé avant même l\'événement.', weight: 2 },
  { id: 't4', pillar: 'T', pillarLabel: 'Targeting', text: 'Nos invitations événementielles sont personnalisées selon les segments de cible.', weight: 2 },
  { id: 't5', pillar: 'T', pillarLabel: 'Targeting', text: 'Nous mesurons le taux de conversion lead-événement vers opportunité commerciale.', weight: 2 },
  { id: 't6', pillar: 'T', pillarLabel: 'Targeting', text: 'La participation aux événements des concurrents est analysée pour adapter notre stratégie.', weight: 1 },
  // A — Ambiance de Marque
  { id: 'a1', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'L\'identité visuelle de marque est appliquée avec cohérence à tous les éléments visuels de nos événements.', weight: 3 },
  { id: 'a2', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'L\'ambiance et l\'expérience sensorielle de nos événements reflètent notre positionnement de marque.', weight: 3 },
  { id: 'a3', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'Le Brand Coherence Score™ de nos derniers événements (cohérence design/message/expérience) serait élevé.', weight: 2 },
  { id: 'a4', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'Le contenu événementiel est original, mémorable et crée une expérience distinctive.', weight: 2 },
  { id: 'a5', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'Les supports événementiels (kakémonos, PLV, goodies) sont de qualité professionnelle.', weight: 2 },
  { id: 'a6', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'La cohérence entre le discours des intervenants et l\'identité de marque est vérifiée en amont.', weight: 2 },
  // G — Génération Leads & ROI
  { id: 'g1', pillar: 'G', pillarLabel: 'Génération & ROI', text: 'Nous calculons systématiquement le ROI financier de nos événements (revenus générés / coûts engagés).', weight: 3 },
  { id: 'g2', pillar: 'G', pillarLabel: 'Génération & ROI', text: 'Le coût par lead ou par contact qualifié de nos événements est connu et maîtrisé.', weight: 2 },
  { id: 'g3', pillar: 'G', pillarLabel: 'Génération & ROI', text: 'Le budget événementiel est alloué de manière sélective aux événements à ROI prouvé.', weight: 2 },
  { id: 'g4', pillar: 'G', pillarLabel: 'Génération & ROI', text: 'Les 40% de ROI immatériel (notoriété, perception de marque) sont également mesurés et pris en compte.', weight: 2 },
  { id: 'g5', pillar: 'G', pillarLabel: 'Génération & ROI', text: 'La comparaison ROI événements vs autres canaux (digital, print) est réalisée et documentée.', weight: 2 },
  { id: 'g6', pillar: 'G', pillarLabel: 'Génération & ROI', text: 'Les objectifs chiffrés (nombre de leads, RDV pris, contrats signés) sont définis avant chaque événement.', weight: 3 },
  // E — Engagement Participants
  { id: 'e1', pillar: 'E', pillarLabel: 'Engagement', text: 'Le taux de satisfaction des participants à nos événements est mesuré et supérieur à 80%.', weight: 2 },
  { id: 'e2', pillar: 'E', pillarLabel: 'Engagement', text: 'Les participants partagent spontanément leur expérience sur les réseaux sociaux pendant l\'événement.', weight: 2 },
  { id: 'e3', pillar: 'E', pillarLabel: 'Engagement', text: 'Les événements donnent lieu à du contenu réutilisable (photos, vidéos, témoignages, articles).', weight: 2 },
  { id: 'e4', pillar: 'E', pillarLabel: 'Engagement', text: 'Le taux de retour des participants lors d\'événements récurrents est supérieur à 60%.', weight: 2 },
  { id: 'e5', pillar: 'E', pillarLabel: 'Engagement', text: 'Les intervenants et speakers sont soigneusement sélectionnés pour leur impact sur la réputation de marque.', weight: 2 },
  { id: 'e6', pillar: 'E', pillarLabel: 'Engagement', text: 'Nos événements génèrent spontanément des recommandations et des inscriptions par le bouche-à-oreille.', weight: 3 },
];

const PILLAR_COLORS: Record<string, string> = {
  S: '#8B5CF6', T: '#A78BFA', A: '#C4B5FD', G: '#7C3AED', E: '#6D28D9',
};

function generateRecommendations(pillarScores: Array<{ pillarId: string; score: number }>, globalScore: number): string[] {
  const recs: string[] = [];
  const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3);
  if (globalScore < 40) recs.push("Attention : 64% des entreprises ne prouvent pas le ROI de leurs événements. Votre score indique que votre budget événementiel s'écoule sans mesure de performance. Mettez en place un cadre de mesure minimal dès maintenant.");
  weakest.forEach(ps => {
    if (ps.pillarId === 'S') recs.push("Stratégie : créez un calendrier événementiel annuel avec brief structuré (cible/message/KPIs) pour chaque événement. La décision de participer doit être stratégique, pas automatique.");
    if (ps.pillarId === 'T') recs.push("Ciblage : implémentez un processus de qualification leads en 48h post-événement avec CRM. Préparez l'email de suivi personnalisé avant même le jour J.");
    if (ps.pillarId === 'A') recs.push("Cohérence de marque : créez un Brand Book Événementiel avec templates visuels (standup, kakémono, PPT) garantissant un Brand Coherence Score™ maximal sur tous vos événements.");
    if (ps.pillarId === 'G') recs.push("ROI : établissez une fiche ROI systématique (coûts engagés / revenus générés / coût par lead). Intégrez les 40% immatériels (notoriété, perception) dans votre calcul via sondage post-événement.");
    if (ps.pillarId === 'E') recs.push("Engagement : créez un programme de contenu événementiel ('live-blogging', stories, témoignages vidéo) et incentivez le partage social des participants avec une campagne de hashtag dédié.");
  });
  return recs.slice(0, 4);
}

type Step = 'roi' | 'form' | 'gate' | 'discover' | 'pricing' | 'intelligence';

export default function EventImpactPage() {
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(50);
  const [eventMode, setEventMode] = useState<EventMode>('retrospectif');
  const [enrichedAnswers, setEnrichedAnswers] = useState<Record<string, { value: number; pillar: string; weight: number }>>({});
  const [resultId, setResultId] = useState('');
  const [partialScores, setPartialScores] = useState<Record<string, number>>({});
  const [intelligencePrice, setIntelligencePrice] = useState(7900);
  const [discoverGlobalScore, setDiscoverGlobalScore] = useState(0);
  const [discoverMaturityLevel, setDiscoverMaturityLevel] = useState(1);
  const [intelligenceData, setIntelligenceData] = useState<{ globalScore: number; maturityLevel: number; pillarScores: Record<string, number>; aiReport: unknown } | null>(null);

  const [budgetEvenementiel, setBudgetEvenementiel] = useState(500000);

  const handleComplete = (answers: ScoringAnswer[]) => {
    const enriched: Record<string, { value: number; pillar: string; weight: number; reverseScored?: boolean }> = {};
    for (const a of answers) {
      const q = questions.find(q => q.id === a.questionId);
      if (q) enriched[a.questionId] = { value: a.value, pillar: q.pillar, weight: q.weight, reverseScored: q.reverseScored };
    }
    setEnrichedAnswers(enriched);
    setStep('gate');
  };

  const [isUnlocking, setIsUnlocking] = useState(false);
  const handleUnlock = async (data: { email: string; name: string }) => {
    setIsUnlocking(true);
    try {
      const response = await fetch(`/api/scoring/${TOOL_ID}/discover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: enrichedAnswers,
          companyName, sector, companySize,
          voiceType: respondentType,
          email: data.email,
          respondentName: data.name,
        }),
      });
      if (response.ok) {
        const res = await response.json();
        setResultId(res.id);
        setPartialScores(res.pillarScores);
        setDiscoverGlobalScore(res.globalScore);
        setDiscoverMaturityLevel(res.maturityLevel);
        setIntelligencePrice(res.intelligencePrice ?? 7900);
      }
    } catch (err) {
      console.error('Erreur discover scoring', err);
    } finally {
      setIsUnlocking(false);
      setStep('discover');
    }
  };

  const eventModeLabels: Record<EventMode, { label: string; desc: string; emoji: string }> = {
    retrospectif: { label: 'Rétrospectif', desc: 'Évaluer un événement passé', emoji: '🔄' },
    anticipatif: { label: 'Anticipatif', desc: 'Préparer un événement futur', emoji: '🚀' },
    annuel: { label: 'Annuel', desc: 'Évaluer toute l\'année événementielle', emoji: '📅' },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Helmet>
        <title>EventImpact™ — Scoring Événementiel Corporate | Epitaphe 360</title>
        <meta name="description" content="Mesurez le ROI et l'impact de vos événements corporate avec EventImpact™ (modèle STAGE™). Brand Coherence Score™ : alignement stratégie × expérience événementielle." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/eventimpact" />
        <meta property="og:title" content="EventImpact™ — Scoring Événementiel Corporate" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/eventimpact" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="EventImpact™" description="Mesurez le ROI et l'impact réel de vos événements corporate sur l'engagement." url="/outils/eventimpact" priceMad={7900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"EventImpact™",url:"/outils/eventimpact"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {step !== 'roi' && (
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setStep('roi')} className="text-gray-500 hover:text-white text-sm flex items-center gap-2 transition-colors">← Retour</button>
              <div className="flex items-center gap-2 ml-auto">
                {(['form','gate','discover','pricing','intelligence'] as const).map((s) => {
                  const ss=['form','gate','discover','pricing','intelligence'] as const;
                  const ci=ss.indexOf(step as typeof ss[number]); const si=ss.indexOf(s);
                  return (<div key={s} className={`w-2 h-2 rounded-full ${si===ci?'bg-white':si<ci?'bg-green-500':'bg-gray-700'}`} />);
                })}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'roi' && (
              <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* HERO */}
                <div className="text-center mb-14">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-semibold"
                    style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
                    EventImpact™ · Modèle STAGE™ · par Epitaphe360
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Chaque événement doit<br /><span style={{ color: TOOL_COLOR }}>prouver son impact.</span>
                  </h1>
                  <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                    64% des entreprises ne mesurent pas le ROI de leurs événements. 40% du ROI réel est immatériel et non capturé.
                    EventImpact™ mesure l'alignement entre votre stratégie et votre scène.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={() => setStep('form')} className="px-6 py-3 rounded-xl text-sm font-bold text-black hover:opacity-90" style={{ backgroundColor: TOOL_COLOR }}>Lancer mon audit →</button>
                    <a href="/outils" className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 no-underline">Voir les outils</a>
                    <button onClick={() => document.getElementById('stage-pillars')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">En savoir plus</button>
                    <button className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">Rapport PDF</button>
                  </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                  {[
                    { value: '64%', label: 'des entreprises ne mesurent pas le ROI de leurs événements corporates', src: 'EventImpact™' },
                    { value: '40%', label: 'du ROI événementiel est immatériel et non capturé (image, lien)', src: 'Deloitte' },
                    { value: '2.3×', label: 'meilleur retour sur événement avec une stratégie STAGE™ définie', src: 'HBR' },
                    { value: '3 jours', label: 'temps moyen pour qualifier un lead généré lors d’un événement', src: 'Martech' },
                  ].map(s => (
                    <div key={s.value} className="rounded-xl p-5 border border-gray-800 bg-gray-900/40 text-center">
                      <div className="text-3xl font-extrabold mb-1" style={{ color: TOOL_COLOR }}>{s.value}</div>
                      <p className="text-xs text-gray-400 leading-snug">{s.label}</p>
                      <p className="text-xs text-gray-600 mt-1">— {s.src}</p>
                    </div>
                  ))}
                </div>

                {/* POSITIONNEMENT */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>POSITIONNEMENT UNIQUE</div>
                  <h2 className="text-2xl font-bold text-white mb-4">Pourquoi EventImpact™ ?</h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    EventImpact™ est le premier scoring événementiel calibré sur le marché corporate marocain.
                    Il calcule votre <strong className="text-white">Brand Coherence Score™</strong> — l’alignement entre votre stratégie de marque et votre exécution événementielle.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="rounded-xl p-5 border border-red-500/20 bg-red-500/5">
                      <h3 className="text-sm font-bold text-red-400 mb-3">L’événement sans mesure</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Budget sans objectifs mesurés</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> ROI estimé à la louche</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Expérience non cohérente marque</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Leads non qualifiés post-événement</li>
                      </ul>
                    </div>
                    <div className="rounded-xl p-5" style={{ border: `1px solid ${TOOL_COLOR}30`, background: `${TOOL_COLOR}08` }}>
                      <h3 className="text-sm font-bold mb-3" style={{ color: TOOL_COLOR }}>Ce que fait EventImpact™</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Modèle STAGE™ en 5 dimensions</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Brand Coherence Score™ calculé</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> ROI manqué estimé en MAD</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Triple temporalité (Rétro/Antici/Annuel)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 5 PILIERS STAGE™ */}
                <div id="stage-pillars" className="mb-14">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>LES 5 PILIERS DU MODÈLE STAGE™</div>
                    <h2 className="text-2xl font-bold text-white">Qu'évalue EventImpact™ ?</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { code: 'S', name: 'Stratégie Événementielle', sub: 'Objectifs & cadrage', desc: 'Formalisation des objectifs business de l’événement, budget réalié aux KPIs, cohérence avec la stratégie annuelle.', tags: ['Objectifs SMART', 'Budget KPI', 'Plan événem.'] },
                      { code: 'T', name: 'Targeting & Audience', sub: 'Qualification & pertinence', desc: 'Qualité du ciblage des participants. Taux de personnes qualifiées présentes. Score d’engagement post-événement.', tags: ['Taux qualification', 'Scoring leads', 'Follow-up'] },
                      { code: 'A', name: 'Ambiance de Marque', sub: 'Cohérence & expérience', desc: 'Alignement de l’expérience sensorielle, signalétique et narrative avec l’identité de marque.', tags: ['Brand Experience', 'Staging', 'Storytelling'] },
                      { code: 'G', name: 'Génération & ROI', sub: 'Mesure & performance', desc: 'Outils de mesure du ROI direct et immatériel : leads, presse, contenus générés, NPS participants.', tags: ['ROI mesuré', 'Lead gen', 'NPS'] },
                      { code: 'E', name: 'Engagement Post-Événement', sub: 'Capitalisation & suivi', desc: 'Plan de suivi et capitalisation : contenus créés, relances, closing des opportunités générées.', tags: ['Replay', 'CRM post', 'Leads closing'] },
                    ].map((p) => (
                      <div key={p.code} className="rounded-xl p-5 border border-gray-800 bg-gray-900/30 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-extrabold shrink-0" style={{ backgroundColor: `${TOOL_COLOR}25`, color: TOOL_COLOR }}>{p.code}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1"><span className="font-bold text-white">{p.name}</span><span className="text-xs text-gray-500">— {p.sub}</span></div>
                          <p className="text-sm text-gray-400 mb-2 leading-relaxed">{p.desc}</p>
                          <div className="flex flex-wrap gap-2">{p.tags.map(tag => (<span key={tag} className="px-2 py-0.5 rounded text-xs border" style={{ borderColor: `${TOOL_COLOR}40`, color: TOOL_COLOR, background: `${TOOL_COLOR}10` }}>{tag}</span>))}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SCORE GAUGE */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>SCORE DE MATURITÉ ÉVÉNEMENTIELLE</div>
                    <h2 className="text-2xl font-bold text-white">Les 5 niveaux STAGE™</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center">
                      <div className="relative w-44 h-44">
                        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                          <circle cx="100" cy="100" r="80" fill="none" stroke="#1f2937" strokeWidth="20" />
                          <circle cx="100" cy="100" r="80" fill="none" stroke={TOOL_COLOR} strokeWidth="20"
                            strokeDasharray={`${2 * Math.PI * 80 * 0.52} ${2 * Math.PI * 80 * 0.48}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-5xl font-extrabold" style={{ color: TOOL_COLOR }}>52</div>
                          <div className="text-gray-400 text-sm">/100</div>
                        </div>
                      </div>
                      <div className="text-center mt-3"><div className="text-lg font-bold" style={{ color: '#EAB308' }}>Ciblé</div><div className="text-xs text-gray-500">Niveau 3 sur 5 — exemple illustratif</div></div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Anecdotique', range: '0–20', color: '#EF4444', desc: 'Événements ponctuels sans stratégie. ROI non mesuré.' },
                        { name: 'Organisé', range: '21–40', color: '#F97316', desc: 'Logistique maîtrisée mais objectifs flous. ROI partiel.' },
                        { name: 'Ciblé', range: '41–60', color: '#EAB308', desc: 'Audiences qualifiées, stratégie en cours de formalisation.' },
                        { name: 'Optimisé', range: '61–80', color: '#22C55E', desc: 'ROI mesuré, Brand Coherence Score™ élevé, leads générés.' },
                        { name: 'Référence', range: '81–100', color: '#3B82F6', desc: 'Chaque événement génère du business mesurable et de la présence media.' },
                      ].map(m => (
                        <div key={m.name} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: m.color }} />
                          <div><div className="text-sm font-semibold text-white">{m.name} <span className="text-gray-500 font-normal">({m.range})</span></div><div className="text-xs text-gray-400">{m.desc}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ROI SIMULATOR */}
                <div className="rounded-2xl p-8 mb-10 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>TRIPLE TEMPORALITÉ STAGE™ — SIMULATEUR ROI</div>
                  <h2 className="text-xl font-bold text-white mb-6">Estimez votre ROI événementiel manqué</h2>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {(Object.entries(eventModeLabels) as [EventMode, typeof eventModeLabels[EventMode]][]).map(([mode, info]) => (
                      <button key={mode} onClick={() => setEventMode(mode)}
                        className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border text-center transition-all ${eventMode === mode ? 'text-black' : 'border-gray-700 text-gray-400'}`}
                        style={eventMode === mode ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                        <span className="text-2xl">{info.emoji}</span>
                        <span className="font-semibold text-sm">{info.label}</span>
                        <span className={`text-xs ${eventMode === mode ? 'text-black/60' : 'text-gray-600'}`}>{info.desc}</span>
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div><label className="block text-sm text-gray-400 mb-2">Budget événementiel annuel : <strong className="text-white">{(budgetEvenementiel/1000).toFixed(0)}K MAD</strong></label>
                      <input type="range" min={100000} max={5000000} step={50000} value={budgetEvenementiel} onChange={e => setBudgetEvenementiel(Number(e.target.value))} className="w-full" style={{ accentColor: TOOL_COLOR }} /></div>
                    <div className="rounded-xl p-5 text-center" style={{ background: `${TOOL_COLOR}12`, border: `1px solid ${TOOL_COLOR}40` }}>
                      <div className="text-xs text-gray-400 mb-2">ROI événementiel manqué estimé</div>
                      <div className="text-4xl font-extrabold" style={{ color: TOOL_COLOR }}>
                        {Math.round(budgetEvenementiel * 0.40).toLocaleString()} MAD
                      </div>
                      <div className="text-xs text-gray-500 mt-1">(40% du budget = ROI immatériel non capturé)</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex : Casablanca Finance City..." className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Secteur d'activité</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="finance">Finance / Banque</option><option value="pharma">Pharma / Santé</option>
                        <option value="auto">Automobile / B2B</option><option value="luxury">Luxe / Retail</option>
                        <option value="tech">Tech / Innovation</option><option value="energie">Énergie / Industrie</option>
                        <option value="btp">BTP / Immobilier</option><option value="autre">Autre</option>
                      </select></div>
                  </div>
                </div>

                {/* RESPONDENT */}
                <div className="mb-10">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Je suis :</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['direction', 'terrain'] as const).map(type => (
                      <button key={type} onClick={() => setRespondentType(type)}
                        className={`px-4 py-4 rounded-xl border text-sm font-medium transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}
                        style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                        {type === 'direction' ? '🎯 Direction / Marketing' : '🎤 Chef de Projet Événem.'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3-TIER */}
                <div className="mb-14">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>MODÈLE D'ÉVALUATION — 3 TIERS</div>
                    <h2 className="text-2xl font-bold text-white">Choisissez votre niveau d'analyse</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { tier: 'Discover', price: 'Gratuit', highlight: false, items: ['Score STAGE™ partiel (3 piliers)', 'Niveau de maturité événementielle', '2 recommandations ROI', 'Brand Coherence indicatif'] },
                      { tier: 'Intelligence', price: '7 900 MAD', highlight: true, items: ['Score complet 5 piliers STAGE™', 'Brand Coherence Score™ détaillé', 'ROI manqué calculé en MAD', 'Rapport IA 12 pages', 'Plan événementiel 12 mois'] },
                      { tier: 'Transform', price: 'Sur devis', highlight: false, items: ['Coaching stratégie événementielle', 'Templates & frameworks STAGE™', 'Mesure ROI en temps réel', 'Annual Event Calendar'] },
                    ].map(t => (
                      <div key={t.tier} className="rounded-2xl p-6 border" style={t.highlight ? { border: `2px solid ${TOOL_COLOR}`, background: `${TOOL_COLOR}10` } : { borderColor: '#374151' }}>
                        {t.highlight && (<div className="text-xs font-bold mb-3 px-2 py-0.5 rounded-full inline-block" style={{ backgroundColor: TOOL_COLOR, color: '#000' }}>✦ RECOMMANDÉ</div>)}
                        <div className="text-lg font-bold text-white mb-1">{t.tier}</div>
                        <div className="text-2xl font-extrabold mb-4" style={{ color: t.highlight ? TOOL_COLOR : '#fff' }}>{t.price}</div>
                        <ul className="space-y-2">{t.items.map(item => (<li key={item} className="flex gap-2 text-sm text-gray-400"><span style={{ color: t.highlight ? TOOL_COLOR : '#6b7280' }}>✓</span> {item}</li>))}</ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RAPPORT */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>RAPPORT COMPLET — 12 PAGES</div>
                  <h2 className="text-xl font-bold text-white mb-6">Structure du rapport Intelligence™ EventImpact</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { pages: '1–2', title: 'Brand Coherence Score™', desc: 'Score global et analyse de l’alignement marque/événement.' },
                      { pages: '3–4', title: 'Score détaillé STAGE™', desc: 'Analyse des 5 piliers avec points forts et lacunes ROI.' },
                      { pages: '5–6', title: 'ROI Manqué Calculé', desc: 'Estimation du ROI non capturé sur les 12 derniers mois.' },
                      { pages: '7', title: 'Benchmarks Événementiels', desc: 'Positionnement par secteur et type d’événement Maroc.' },
                      { pages: '8', title: 'Plan Événementiel 90 jours', desc: '3 actions prioritaires pour maximiser le prochain événement.' },
                      { pages: '9–10', title: 'Templates & Frameworks', desc: 'Outils STAGE™ clés en main pour mesurer le ROI.' },
                      { pages: '11', title: 'Annual Event Calendar', desc: 'Plan événementiel annuel aligné stratégie de marque.' },
                      { pages: '12', title: 'Prochaines étapes', desc: 'Modalités d’engagement Epitaphe360.' },
                    ].map(r => (
                      <div key={r.pages} className="flex gap-3 p-3 rounded-lg border border-gray-800">
                        <div className="text-xs font-bold rounded px-1.5 py-0.5 shrink-0 h-fit mt-0.5" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>P. {r.pages}</div>
                        <div><div className="text-sm font-semibold text-white">{r.title}</div><div className="text-xs text-gray-500">{r.desc}</div></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INTEGRATIONS */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>FONCTIONNALITÉS ET INTÉGRATIONS</div>
                  <h2 className="text-xl font-bold text-white mb-6">Écosystème technique EventImpact™</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: '📋', name: 'Formulaire', desc: 'Scoring STAGE™ adapté type événement' },
                      { icon: '⚡', name: 'Automatisation', desc: 'Follow-up leads post-événement auto' },
                      { icon: '🤖', name: 'Rapport IA', desc: 'Analyse GPT-4o ROI événementiel' },
                      { icon: '📅', name: 'Booking', desc: 'RDV consultant événementiel' },
                      { icon: '🎬', name: 'Brand Experience', desc: 'Scoring ambiance & cohérence' },
                      { icon: '🏆', name: 'Benchmark', desc: 'Score vs événements secteur Maroc' },
                      { icon: '📊', name: 'Dashboard', desc: 'KPIs événementiels temps réel' },
                      { icon: '🌍', name: 'Multi-événements', desc: 'Comparatif & consolidation annuelle' },
                    ].map(int => (
                      <div key={int.name} className="rounded-xl p-4 border border-gray-800 text-center">
                        <div className="text-2xl mb-2">{int.icon}</div>
                        <div className="text-sm font-semibold text-white">{int.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{int.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FINAL CTA */}
                <motion.div className="rounded-2xl p-10 text-center mb-4"
                  style={{ background: `linear-gradient(135deg, ${TOOL_COLOR}25, ${TOOL_COLOR}08)`, border: `1px solid ${TOOL_COLOR}50` }}>
                  <div className="text-4xl mb-4">🎤</div>
                  <h2 className="text-2xl font-extrabold text-white mb-3">EventImpact™ — Prochaine étape</h2>
                  <p className="text-gray-400 mb-2 max-w-lg mx-auto">Obtenez votre Brand Coherence Score™ gratuit en 7 minutes. 30 indicateurs événementiels analysés.</p>
                  <p className="text-gray-500 text-sm mb-6">Mode sélectionné : <strong className="text-white">{eventModeLabels[eventMode].label}</strong></p>
                  <button onClick={() => setStep('form')}
                    className="px-10 py-4 rounded-xl text-base font-bold text-black transition-all hover:opacity-90 hover:scale-105"
                    style={{ backgroundColor: TOOL_COLOR }}>Démarrer l'évaluation STAGE™ ({eventModeLabels[eventMode].label}) · ~7 min →</button>
                </motion.div>

              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="EventImpact™" toolColor={TOOL_COLOR} questions={questions} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}
            {step === 'gate' && (
              <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmailGate
                  toolName="EventImpact�"
                  toolColor={TOOL_COLOR}
                  onUnlock={handleUnlock}
                  isLoading={isUnlocking}
                />
              </motion.div>
            )}
            {step === 'discover' && (
              <motion.div key="discover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <DiscoverResults
                  toolId={TOOL_ID}
                  toolLabel="EventImpact™"
                  toolColor={TOOL_COLOR}
                  resultId={resultId}
                  globalScore={discoverGlobalScore}
                  maturityLevel={discoverMaturityLevel}
                  pillarScores={partialScores}
                  allPillars={Array.from(new Set(questions.map(q => q.pillar))).map(p => ({ id: p, label: questions.find(q => q.pillar === p)?.pillarLabel ?? p, color: PILLAR_COLORS[p] }))}
                  intelligencePrice={intelligencePrice}
                  onUpgrade={() => setStep('pricing')}
                />
              </motion.div>
            )}
            {step === 'pricing' && (
              <motion.div key="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <IntelligencePricing
                  toolId={TOOL_ID}
                  toolLabel="EventImpact™"
                  toolColor={TOOL_COLOR}
                  intelligencePrice={intelligencePrice}
                  resultId={resultId}
                  enrichedAnswers={enrichedAnswers}
                  companyName={companyName}
                  sector={sector}
                  companySize={companySize}
                  onSuccess={(data) => { setIntelligenceData(data); setStep('intelligence'); }}
                  onBack={() => setStep('discover')}
                />
              </motion.div>
            )}
            {step === 'intelligence' && intelligenceData && (
              <motion.div key="intelligence" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <IntelligenceResults
                  toolId={TOOL_ID}
                  toolLabel="EventImpact™"
                  toolColor={TOOL_COLOR}
                  globalScore={intelligenceData.globalScore}
                  maturityLevel={intelligenceData.maturityLevel}
                  pillarScores={intelligenceData.pillarScores}
                  aiReport={intelligenceData.aiReport as any}
                  resultId={intelligenceData.id ?? resultId}
                  allPillars={Array.from(new Set(questions.map(q => q.pillar))).map(p => ({ id: p, label: questions.find(q => q.pillar === p)?.pillarLabel ?? p, color: PILLAR_COLORS[p] }))}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}



