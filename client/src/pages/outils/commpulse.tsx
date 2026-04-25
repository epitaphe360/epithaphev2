import { useState } from 'react';
import { useToolQuestions } from '@/hooks/useToolQuestions';
import { useEmbed } from '@/contexts/embed-context';
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
  calculateRoiEstimate,
  type ScoringQuestion, type ScoringAnswer,
  type SectorType, type CompanySizeType,
} from '@/lib/scoring-engine';

const TOOL_COLOR = '#6366F1'; // Indigo pour CommPulse
const TOOL_ID = 'commpulse' as const;

const DEFAULT_QUESTIONS: ScoringQuestion[] = [
  // C — Cohérence
  { id: 'c1', pillar: 'C', pillarLabel: 'Cohérence', text: 'Les messages de la direction sont alignés avec les valeurs affichées de l\'entreprise.', weight: 2 },
  { id: 'c2', pillar: 'C', pillarLabel: 'Cohérence', text: 'Les communications internes reflètent fidèlement la stratégie de l\'entreprise.', weight: 2 },
  { id: 'c3', pillar: 'C', pillarLabel: 'Cohérence', text: 'Les équipes reçoivent des messages cohérents de leurs différents managers.', weight: 1 },
  { id: 'c4', pillar: 'C', pillarLabel: 'Cohérence', text: 'Il n\'y a pas de contradictions entre les déclarations officielles et la réalité vécue.', weight: 2 },
  { id: 'c5', pillar: 'C', pillarLabel: 'Cohérence', text: 'La communication externe est cohérente avec la communication interne.', weight: 1 },
  { id: 'c6', pillar: 'C', pillarLabel: 'Cohérence', text: 'Les engagements pris en réunion sont bien suivis d\'actions communiquées.', weight: 2 },
  // L — Liens
  { id: 'l1', pillar: 'L', pillarLabel: 'Liens', text: 'Les canaux de communication internes (intranet, emails, réunions) sont adaptés aux besoins.', weight: 2 },
  { id: 'l2', pillar: 'L', pillarLabel: 'Liens', text: 'L\'information circule efficacement entre les départements.', weight: 2 },
  { id: 'l3', pillar: 'L', pillarLabel: 'Liens', text: 'Les employés savent exactement où trouver les informations dont ils ont besoin.', weight: 2 },
  { id: 'l4', pillar: 'L', pillarLabel: 'Liens', text: 'Les outils digitaux de communication sont faciles à utiliser et adoptés.', weight: 1 },
  { id: 'l5', pillar: 'L', pillarLabel: 'Liens', text: 'Les réunions sont utiles, bien structurées et ne font pas double emploi avec les emails.', weight: 1 },
  { id: 'l6', pillar: 'L', pillarLabel: 'Liens', text: 'La communication entre le siège et les équipes terrain est fluide.', weight: 2 },
  // A — Attention
  { id: 'a1', pillar: 'A', pillarLabel: 'Attention', text: 'Les managers écoutent activement les préoccupations de leurs équipes.', weight: 3 },
  { id: 'a2', pillar: 'A', pillarLabel: 'Attention', text: 'Les retours des employés sont pris en compte et font l\'objet de réponses.', weight: 3 },
  { id: 'a3', pillar: 'A', pillarLabel: 'Attention', text: 'Des espaces formels existent pour s\'exprimer (enquêtes, feedbacks, ateliers).', weight: 2 },
  { id: 'a4', pillar: 'A', pillarLabel: 'Attention', text: 'La direction est accessible et ouverte au dialogue.', weight: 2 },
  { id: 'a5', pillar: 'A', pillarLabel: 'Attention', text: 'Les signaux faibles de mal-être ou de désengagement sont détectés rapidement.', weight: 2 },
  { id: 'a6', pillar: 'A', pillarLabel: 'Attention', text: 'La qualité de l\'écoute est constante quelle que soit la hiérarchie.', weight: 2 },
  // R — Résultats
  { id: 'r1', pillar: 'R', pillarLabel: 'Résultats', text: 'L\'impact de la communication interne sur la performance est mesuré.', weight: 3 },
  { id: 'r2', pillar: 'R', pillarLabel: 'Résultats', text: 'Les objectifs communiqués aux équipes sont clairs et quantifiés.', weight: 2 },
  { id: 'r3', pillar: 'R', pillarLabel: 'Résultats', text: 'Les équipes connaissent les résultats de l\'entreprise et leur contribution.', weight: 2 },
  { id: 'r4', pillar: 'R', pillarLabel: 'Résultats', text: 'La communication interne contribue visiblement à l\'atteinte des objectifs.', weight: 3 },
  { id: 'r5', pillar: 'R', pillarLabel: 'Résultats', text: 'Un tableau de bord de communication interne est suivi régulièrement.', weight: 2 },
  { id: 'r6', pillar: 'R', pillarLabel: 'Résultats', text: 'Les succès et réussites sont célébrés et communiqués à l\'ensemble des équipes.', weight: 1 },
  // I — Inclusion
  { id: 'i1', pillar: 'I', pillarLabel: 'Inclusion', text: 'Tous les employés ont accès aux mêmes informations stratégiques.', weight: 2 },
  { id: 'i2', pillar: 'I', pillarLabel: 'Inclusion', text: 'La communication tient compte des différences culturelles et linguistiques.', weight: 2 },
  { id: 'i3', pillar: 'I', pillarLabel: 'Inclusion', text: 'Les employés en télétravail ou hors bureau sont aussi bien informés que les autres.', weight: 2 },
  { id: 'i4', pillar: 'I', pillarLabel: 'Inclusion', text: 'Les nouveaux arrivants sont rapidement intégrés au flux d\'information.', weight: 2 },
  { id: 'i5', pillar: 'I', pillarLabel: 'Inclusion', text: 'La communication respecte la diversité et évite tout biais discriminatoire.', weight: 1 },
  { id: 'i6', pillar: 'I', pillarLabel: 'Inclusion', text: 'Les équipes de terrain ont la même visibilité que les équipes siège.', weight: 2 },
  // T — Transparence
  { id: 't1', pillar: 'T', pillarLabel: 'Transparence', text: 'Les décisions stratégiques importantes sont expliquées avec leurs raisons.', weight: 3 },
  { id: 't2', pillar: 'T', pillarLabel: 'Transparence', text: 'Les difficultés ou mauvaises nouvelles sont communiquées honnêtement.', weight: 3 },
  { id: 't3', pillar: 'T', pillarLabel: 'Transparence', text: 'Les changements organisationnels sont annoncés en amont et bien expliqués.', weight: 2 },
  { id: 't4', pillar: 'T', pillarLabel: 'Transparence', text: 'L\'entreprise partage ses indicateurs de performance avec les employés.', weight: 2 },
  { id: 't5', pillar: 'T', pillarLabel: 'Transparence', text: 'Les employés comprennent les raisons des décisions prises par la direction.', weight: 3 },
  { id: 't6', pillar: 'T', pillarLabel: 'Transparence', text: 'Il n\'y a pas de "communication de couloir" non officielle plus fiable que la communication officielle.', weight: 2, reverseScored: true },
  // Y — You (Engagement)
  { id: 'y1', pillar: 'Y', pillarLabel: 'Engagement', text: 'Les employés se sentent fiers de représenter l\'entreprise.', weight: 2 },
  { id: 'y2', pillar: 'Y', pillarLabel: 'Engagement', text: 'Les employés comprennent comment leur travail contribue à la vision de l\'entreprise.', weight: 3 },
  { id: 'y3', pillar: 'Y', pillarLabel: 'Engagement', text: 'Les employés recommanderaient l\'entreprise comme employeur à leurs proches.', weight: 2 },
  { id: 'y4', pillar: 'Y', pillarLabel: 'Engagement', text: 'La communication interne renforce le sentiment d\'appartenance.', weight: 2 },
  { id: 'y5', pillar: 'Y', pillarLabel: 'Engagement', text: 'Les employés participent activement aux initiatives de communication de l\'entreprise.', weight: 2 },
  { id: 'y6', pillar: 'Y', pillarLabel: 'Engagement', text: 'Le niveau d\'engagement global a progressé au cours des 12 derniers mois.', weight: 2 },
];

const PILLAR_COLORS: Record<string, string> = {
  C: '#6366F1', L: '#8B5CF6', A: '#A78BFA',
  R: '#7C3AED', I: '#C4B5FD', T: '#DDD6FE', Y: '#EDE9FE',
};

function generateRecommendations(pillarScores: Array<{ pillarId: string; pillarLabel: string; score: number }>, globalScore: number): string[] {
  const recs: string[] = [];
  const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3);

  if (globalScore < 40) {
    recs.push("Priorité absolue : mettre en place une stratégie de communication interne formalisée avec un responsable dédié.");
  }
  weakest.forEach(ps => {
    if (ps.pillarId === 'C') recs.push("Cohérence : créer un guide éditorial interne et organiser des sessions d'alignement management trimestrielles.");
    if (ps.pillarId === 'L') recs.push("Liens : auditer et rationaliser vos canaux (email, intranet, Teams/Slack) — éliminer les doublons et créer une charte de communication.");
    if (ps.pillarId === 'A') recs.push("Attention : instaurer des rituels d'écoute (pulse surveys mensuels, cercles de parole) et former les managers à la communication active.");
    if (ps.pillarId === 'R') recs.push("Résultats : créer un tableau de bord mensuel de la communication interne avec 3-5 KPIs clés partagés avec le COMEX.");
    if (ps.pillarId === 'I') recs.push("Inclusion : adapter les supports selon les profils (opérateurs terrain, télétravailleurs) et garantir l'accès équitable à l'information.");
    if (ps.pillarId === 'T') recs.push("Transparence : instituer un 'Town Hall' trimestriel avec la direction et une FAQ stratégique accessible à tous.");
    if (ps.pillarId === 'Y') recs.push("Engagement : lancer un programme d'ambassadeurs internes et intégrer la communication dans les entretiens annuels d'évaluation.");
  });
  return recs.slice(0, 4);
}

type Step = 'roi' | 'form' | 'gate' | 'discover' | 'pricing' | 'intelligence';

export default function CommPulsePage() {
  const isEmbed = useEmbed();
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(50);
  const [salaireMoyen, setSalaireMoyen] = useState(8000);
  const [enrichedAnswers, setEnrichedAnswers] = useState<Record<string, { value: number; pillar: string; weight: number; reverseScored?: boolean }>>({})
  const [resultId, setResultId] = useState('');
  const [partialScores, setPartialScores] = useState<Record<string, number>>({});
  const [intelligencePrice, setIntelligencePrice] = useState(4900);
  const [respondentEmail, setRespondentEmail] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [discoverGlobalScore, setDiscoverGlobalScore] = useState(0);
  const [discoverMaturityLevel, setDiscoverMaturityLevel] = useState(1);
  const [intelligenceData, setIntelligenceData] = useState<{ globalScore: number; maturityLevel: number; pillarScores: Record<string, number>; aiReport: unknown } | null>(null);

  const roiEstimate = calculateRoiEstimate(effectif, salaireMoyen, 0.18);

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
    setRespondentEmail(data.email);
    setRespondentName(data.name);
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
        setIntelligencePrice(res.intelligencePrice ?? 4900);
        // Notify WordPress parent iframe of lead capture
        if (isEmbed) {
          window.parent.postMessage({
            type: 'bmi360:lead',
            lead: {
              tool: TOOL_ID,
              email: data.email,
              name: data.name,
              score: res.globalScore,
              maturity: res.maturityLevel,
            },
          }, '*');
        }
      }
    } catch (err) {
      console.error('Erreur discover scoring', err);
    } finally {
      setIsUnlocking(false);
      setStep('discover');
    }
  };

  return (
    <div className={`${isEmbed ? '' : 'min-h-screen'} bg-[#0A0A0A] text-white`}>
      <Helmet>
        <title>CommPulse™ — Scoring Communication Interne | Epitaphe 360</title>
        <meta name="description" content="Évaluez la santé de votre communication interne avec CommPulse™ (modèle CLARITY). 42 indicateurs, score sur 100, recommandations expert." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/commpulse" />
        <meta property="og:title" content="CommPulse™ — Scoring Communication Interne" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/commpulse" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="CommPulse™" description="Évaluez la santé de votre communication interne : cohérence, écoute, transparence et impact RH." url="/outils/commpulse" priceMad={4900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"CommPulse™",url:"/outils/commpulse"}]} />
      <Navigation />
      <main className={isEmbed ? "pt-6 pb-10" : "pt-24 pb-20"}>
        <div className="max-w-3xl mx-auto px-6">

          {step !== 'roi' && (
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setStep('roi')} className="text-gray-500 hover:text-white text-sm flex items-center gap-2 transition-colors">
                ← Retour
              </button>
              <div className="flex items-center gap-2 ml-auto">
                {(['form', 'gate', 'discover', 'pricing', 'intelligence'] as const).map((s) => {
                  const steps = ['form', 'gate', 'discover', 'pricing', 'intelligence'] as const;
                  const currentIdx = steps.indexOf(step as typeof steps[number]);
                  const sIdx = steps.indexOf(s);
                  return (
                    <div key={s} className={`w-2 h-2 rounded-full transition-colors ${
                      sIdx === currentIdx ? 'bg-white' : sIdx < currentIdx ? 'bg-green-500' : 'bg-gray-700'
                    }`} />
                  );
                })}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1 : Landing Page Complète */}
            {step === 'roi' && (
              <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* ── HERO ─────────────────────────────────────────────── */}
                <div className="text-center mb-14">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-semibold"
                    style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
                    CommPulse™ · Modèle CLARITY™ · par Epitaphe360
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Feel the heartbeat of<br />
                    <span style={{ color: TOOL_COLOR }}>your organization.</span>
                  </h1>
                  <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                    71% des employés sont insatisfaits de leur communication interne. Découvrez où vous en êtes — et ce que ça vous coûte vraiment.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={() => setStep('form')}
                      className="px-6 py-3 rounded-xl text-sm font-bold text-black hover:opacity-90"
                      style={{ backgroundColor: TOOL_COLOR }}>
                      Lancer mon audit →
                    </button>
                    <a href="/outils" className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 no-underline">
                      Voir les outils
                    </a>
                    <button
                      onClick={() => document.getElementById('clarity-pillars')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">
                      En savoir plus
                    </button>
                    <button className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">
                      Rapport PDF
                    </button>
                  </div>
                </div>

                {/* ── STATS BANNER ─────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                  {[
                    { value: '71%', label: 'des employés insatisfaits de leur communication interne', src: 'Towers Watson' },
                    { value: '63j', label: 'perdus par cadre senior / an en communication inefficace', src: 'McKinsey' },
                    { value: '9 284 $', label: 'coût annuel par employé d\'une communication défaillante', src: 'Gallup' },
                    { value: '86%', label: 'des entreprises améliorent leur performance avec CLARITY™', src: 'Epitaphe360' },
                  ].map(s => (
                    <div key={s.value} className="rounded-xl p-5 border border-gray-800 bg-gray-900/40 text-center">
                      <div className="text-3xl font-extrabold mb-1" style={{ color: TOOL_COLOR }}>{s.value}</div>
                      <p className="text-xs text-gray-400 leading-snug">{s.label}</p>
                      <p className="text-xs text-gray-600 mt-1">— {s.src}</p>
                    </div>
                  ))}
                </div>

                {/* ── POSITIONNEMENT UNIQUE ────────────────────────────── */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>
                    POSITIONNEMENT UNIQUE
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Pourquoi CommPulse™ ?</h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    CommPulse™ est la première suite de scoring de la communication interne développée pour les entreprises francophones. Ce n'est pas un sondage de satisfaction — c'est un outil d'<strong className="text-white">intelligence organisationnelle</strong> en 7 dimensions calibré sur les réalités du terrain marocain et africain.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="rounded-xl p-5 border border-red-500/20 bg-red-500/5">
                      <h3 className="text-sm font-bold text-red-400 mb-3">Ce que font les autres</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Sondages satisfaction génériques</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Résultats non actionnables</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Pas de benchmark sectoriel</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Aucun calcul de ROI</li>
                      </ul>
                    </div>
                    <div className="rounded-xl p-5" style={{ border: `1px solid ${TOOL_COLOR}30`, background: `${TOOL_COLOR}08` }}>
                      <h3 className="text-sm font-bold mb-3" style={{ color: TOOL_COLOR }}>Ce que fait CommPulse™</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Modèle CLARITY™ en 7 dimensions</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Score sur 100 + niveau de maturité</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Dual Voice Score™ Direction vs Terrain</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> ROI calculé + rapport IA 12 pages</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* ── 7 PILIERS CLARITY™ ───────────────────────────────── */}
                <div id="clarity-pillars" className="mb-14">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                      style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>
                      LES 7 PILIERS DU MODÈLE CLARITY™
                    </div>
                    <h2 className="text-2xl font-bold text-white">Qu'évalue CommPulse™ ?</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { code: 'C', name: 'Cohérence', sub: 'Cohérence Stratégique', desc: 'Alignement entre messages direction, valeurs affichées et réalité vécue. Premier pilier de la confiance organisationnelle.', tags: ['Alignement direction', 'Cohérence multi-niveaux', 'Suivi engagements'] },
                      { code: 'L', name: 'Liens', sub: 'Culture du feedback', desc: 'Efficacité et fluidité des canaux de communication interne. L\'info circule-t-elle vraiment dans toute l\'organisation ?', tags: ['Canaux adaptés', 'Circulation info', 'Outils digitaux'] },
                      { code: 'A', name: 'Attention', sub: 'Écoute active', desc: 'Qualité de l\'écoute managériale et mécanismes de remontée terrain. Les signaux faibles sont-ils captés à temps ?', tags: ['Écoute active', 'Espaces d\'expression', 'Signaux faibles'] },
                      { code: 'R', name: 'Résultats', sub: 'Amplification & impact', desc: 'L\'impact de la communication sur la performance organisationnelle est-il mesuré, prouvé et communiqué ?', tags: ['KPIs com', 'Impact performance', 'Tableau de bord'] },
                      { code: 'I', name: 'Inclusion', sub: 'Résonance & équité', desc: 'Accès équitable à l\'information pour tous les profils, localisations et niveaux hiérarchiques sans exception.', tags: ['Accès équitable', 'Diversité', 'Terrain vs siège'] },
                      { code: 'T', name: 'Transparence', sub: 'Intelligence & confiance', desc: 'Honnêteté dans la communication des décisions difficiles et des mauvaises nouvelles. La confiance se bâtit dans les moments difficiles.', tags: ['Décisions expliquées', 'Mauvaises nouvelles', 'Confiance'] },
                      { code: 'Y', name: 'Yield', sub: 'Impact business', desc: 'Retour réel de la communication sur l\'engagement des employés. Fierté, appartenance et NPS employé mesurés.', tags: ['Fierté', 'Appartenance', 'NPS employé'] },
                    ].map((p) => (
                      <div key={p.code} className="rounded-xl p-5 border border-gray-800 bg-gray-900/30 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-extrabold shrink-0"
                          style={{ backgroundColor: `${TOOL_COLOR}25`, color: TOOL_COLOR }}>
                          {p.code}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-bold text-white">{p.name}</span>
                            <span className="text-xs text-gray-500">— {p.sub}</span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2 leading-relaxed">{p.desc}</p>
                          <div className="flex flex-wrap gap-2">
                            {p.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded text-xs border"
                                style={{ borderColor: `${TOOL_COLOR}40`, color: TOOL_COLOR, background: `${TOOL_COLOR}10` }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── SCORE GAUGE + MATURITÉ ───────────────────────────── */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                      style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>
                      VOTRE SCORE DE MATURITÉ COMMUNICATIONNELLE
                    </div>
                    <h2 className="text-2xl font-bold text-white">Comment se lit votre score ?</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center">
                      <div className="relative w-44 h-44">
                        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                          <circle cx="100" cy="100" r="80" fill="none" stroke="#1f2937" strokeWidth="20" />
                          <circle cx="100" cy="100" r="80" fill="none"
                            stroke={TOOL_COLOR} strokeWidth="20"
                            strokeDasharray={`${2 * Math.PI * 80 * 0.70} ${2 * Math.PI * 80 * 0.30}`}
                            strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-5xl font-extrabold" style={{ color: TOOL_COLOR }}>70</div>
                          <div className="text-gray-400 text-sm">/100</div>
                        </div>
                      </div>
                      <div className="text-center mt-3">
                        <div className="text-lg font-bold" style={{ color: '#22C55E' }}>Engaged</div>
                        <div className="text-xs text-gray-500">Niveau 4 sur 5 — exemple illustratif</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Silent', range: '0–20', color: '#EF4444', desc: 'Absence de stratégie. Les rumeurs remplacent l\'info officielle.' },
                        { name: 'Broadcast', range: '21–40', color: '#F97316', desc: 'Communication unidirectionnelle sans retour du terrain.' },
                        { name: 'Dialogue', range: '41–60', color: '#EAB308', desc: 'Échanges existent mais sans cohérence ni mesure d\'impact.' },
                        { name: 'Engaged', range: '61–80', color: '#22C55E', desc: 'Culture de communication construite. Employés actifs.' },
                        { name: 'Pulse', range: '81–100', color: '#3B82F6', desc: 'Standard de référence sectorielle. Avantage compétitif.' },
                      ].map(m => (
                        <div key={m.name} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: m.color }} />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {m.name} <span className="text-gray-500 font-normal">({m.range})</span>
                            </div>
                            <div className="text-xs text-gray-400">{m.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── ROI SIMULATOR ────────────────────────────────────── */}
                <div id="roi-calc" className="rounded-2xl p-8 mb-10 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>
                    SIMULATEUR — COÛT DE LA COMMUNICATION INEFFICACE
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Calculez votre coût réel</h2>
                  <p className="text-gray-400 text-sm mb-6">Les cadres seniors perdent en moyenne 63 jours/an. Quel est votre coût annuel réel ?</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                        placeholder="Ex : OCP, Maroc Telecom..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Secteur d'activité</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-indigo-500">
                        <option value="pharma">Pharma / Santé</option>
                        <option value="auto">Automobile</option>
                        <option value="finance">Banque / Finance</option>
                        <option value="tech">Tech / IT</option>
                        <option value="energie">Énergie / Industrie</option>
                        <option value="luxury">Luxe / Retail</option>
                        <option value="btp">BTP / Immobilier</option>
                        <option value="agroalimentaire">Agroalimentaire</option>
                        <option value="textile">Textile / Mode</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Effectif : <strong className="text-white">{effectif} employés</strong>
                      </label>
                      <input type="range" min={10} max={5000} step={10} value={effectif}
                        onChange={e => setEffectif(Number(e.target.value))}
                        className="w-full accent-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Salaire moyen : <strong className="text-white">{salaireMoyen.toLocaleString('fr-MA')} MAD/mois</strong>
                      </label>
                      <input type="range" min={3000} max={50000} step={500} value={salaireMoyen}
                        onChange={e => setSalaireMoyen(Number(e.target.value))}
                        className="w-full accent-indigo-500" />
                    </div>
                  </div>
                  <motion.div key={roiEstimate} initial={{ scale: 0.97 }} animate={{ scale: 1 }}
                    className="rounded-xl p-6 text-center"
                    style={{ background: `linear-gradient(135deg, ${TOOL_COLOR}15, ${TOOL_COLOR}05)`, border: `1px solid ${TOOL_COLOR}40` }}>
                    <p className="text-sm text-gray-400 mb-1">Coût estimé de votre communication défaillante</p>
                    <div className="text-4xl font-extrabold mb-1" style={{ color: TOOL_COLOR }}>
                      {(roiEstimate * 12).toLocaleString('fr-MA')} MAD
                    </div>
                    <p className="text-xs text-gray-500">par an · facteur CLARITY™ (18% de la masse salariale) · ~{Math.round(63 * effectif / 100)} jours perdus / an</p>
                  </motion.div>
                </div>

                {/* ── RESPONDENT TYPE ──────────────────────────────────── */}
                <div className="mb-10">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Je suis :</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['direction', 'terrain'] as const).map(type => (
                      <button key={type} onClick={() => setRespondentType(type)}
                        className={`px-4 py-4 rounded-xl border text-sm font-medium transition-all ${
                          respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                        style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                        {type === 'direction' ? '👔 Direction / Management' : '🔧 Collaborateur / Terrain'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── 3-TIER MODEL ─────────────────────────────────────── */}
                <div className="mb-14">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                      style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>
                      MODÈLE D'ÉVALUATION — 3 TIERS
                    </div>
                    <h2 className="text-2xl font-bold text-white">Choisissez votre niveau d'analyse</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { tier: 'Discover', price: 'Gratuit', highlight: false, items: ['Score CLARITY™ partiel (4 pilliers)', 'Niveau de maturité CLARITY™', '2 recommandations prioritaires', 'Résultat immédiat en ligne'] },
                      { tier: 'Intelligence', price: '4 900 MAD', highlight: true, items: ['Score complet 7 pilliers', 'Dual Voice Score™ Direction/Terrain', 'Rapport IA 12 pages personnalisé', 'Benchmark sectoriel Maroc', 'Plan d\'action 90 jours'] },
                      { tier: 'Transform', price: 'Sur devis', highlight: false, items: ['Accompagnement expert 6 mois', 'Ateliers co-construction équipe', 'KPIs & tableau de bord mensuel', 'ROI garanti contractuellement'] },
                    ].map(t => (
                      <div key={t.tier} className="rounded-2xl p-6 border"
                        style={t.highlight ? { border: `2px solid ${TOOL_COLOR}`, background: `${TOOL_COLOR}10` } : { borderColor: '#374151' }}>
                        {t.highlight && (
                          <div className="text-xs font-bold mb-3 px-2 py-0.5 rounded-full inline-block"
                            style={{ backgroundColor: TOOL_COLOR, color: '#000' }}>✦ RECOMMANDÉ</div>
                        )}
                        <div className="text-lg font-bold text-white mb-1">{t.tier}</div>
                        <div className="text-2xl font-extrabold mb-4"
                          style={{ color: t.highlight ? TOOL_COLOR : '#fff' }}>{t.price}</div>
                        <ul className="space-y-2">
                          {t.items.map(item => (
                            <li key={item} className="flex gap-2 text-sm text-gray-400">
                              <span style={{ color: t.highlight ? TOOL_COLOR : '#6b7280' }}>✓</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── RAPPORT 12 PAGES ─────────────────────────────────── */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>
                    CAPITAL RAPPORT COMPLET — 12 PAGES
                  </div>
                  <h2 className="text-xl font-bold text-white mb-6">Structure du rapport Intelligence™</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { pages: '1–2', title: 'Executive Summary', desc: 'Score global, niveau CLARITY™ et top 3 priorités.' },
                      { pages: '3–4', title: 'Score détaillé par pilier', desc: 'Analyse des 7 dimensions avec forces et faiblesses.' },
                      { pages: '5–6', title: 'Benchmark sectoriel', desc: 'Positionnement vs entreprises similaires au Maroc.' },
                      { pages: '7', title: 'Diagnostic Dual Voice™', desc: 'Écart Direction / Terrain — zones de tension identifiées.' },
                      { pages: '8', title: 'Plan d\'action 90 jours', desc: 'Quick wins à J+30, J+60, J+90 priorisés.' },
                      { pages: '9–10', title: 'Cartographie de l\'impact', desc: 'Impact financier et ROI des actions recommandées.' },
                      { pages: '11', title: 'Roadmap Transform', desc: 'Architecture du programme d\'accompagnement 6 mois.' },
                      { pages: '12', title: 'Prochaines étapes', desc: 'Modalités d\'engagement et planning Epitaphe360.' },
                    ].map(r => (
                      <div key={r.pages} className="flex gap-3 p-3 rounded-lg border border-gray-800">
                        <div className="text-xs font-bold rounded px-1.5 py-0.5 shrink-0 h-fit mt-0.5"
                          style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>P. {r.pages}</div>
                        <div>
                          <div className="text-sm font-semibold text-white">{r.title}</div>
                          <div className="text-xs text-gray-500">{r.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── INTÉGRATIONS ─────────────────────────────────────── */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>
                    FONCTIONNALITÉS ET INTÉGRATIONS
                  </div>
                  <h2 className="text-xl font-bold text-white mb-6">Écosystème technique CommPulse™</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: '📋', name: 'Formulaire', desc: 'Questionnaire digital optimisé' },
                      { icon: '⚡', name: 'Automatisation', desc: 'Envoi automatique des rapports' },
                      { icon: '🤖', name: 'Rapport IA', desc: 'Analyse GPT-4o personnalisée' },
                      { icon: '📅', name: 'Booking', desc: 'Prise de RDV intégrée' },
                      { icon: '📄', name: 'PDF Report', desc: 'Rapport 12 pages téléchargeable' },
                      { icon: '🔗', name: 'Slack / CRM', desc: 'Intégrations tierces disponibles' },
                      { icon: '📊', name: 'Dashboard', desc: 'Suivi temps réel évolution' },
                      { icon: '🌐', name: 'Multi-sites', desc: 'Comparaison inter-entités' },
                    ].map(int => (
                      <div key={int.name} className="rounded-xl p-4 border border-gray-800 text-center">
                        <div className="text-2xl mb-2">{int.icon}</div>
                        <div className="text-sm font-semibold text-white">{int.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{int.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── FINAL CTA ────────────────────────────────────────── */}
                <motion.div
                  className="rounded-2xl p-10 text-center mb-4"
                  style={{ background: `linear-gradient(135deg, ${TOOL_COLOR}25, ${TOOL_COLOR}08)`, border: `1px solid ${TOOL_COLOR}50` }}
                >
                  <div className="text-4xl mb-4">💬</div>
                  <h2 className="text-2xl font-extrabold text-white mb-3">CommPulse™ — Prochaine étape</h2>
                  <p className="text-gray-400 mb-2 max-w-lg mx-auto">
                    Obtenez votre score CLARITY™ gratuit en 8 minutes. 42 indicateurs analysés. Résultat immédiat.
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    Vous êtes {respondentType === 'direction' ? 'une direction / management' : 'un collaborateur terrain'} — l'évaluation sera adaptée à votre perspective.
                  </p>
                  <button
                    onClick={() => setStep('form')}
                    className="px-10 py-4 rounded-xl text-base font-bold text-black transition-all hover:opacity-90 hover:scale-105"
                    style={{ backgroundColor: TOOL_COLOR }}>
                    Démarrer l'évaluation CLARITY™ — 42 questions · ~8 min →
                  </button>
                </motion.div>

              </motion.div>
            )}

            {/* STEP 2: Questionnaire */}
            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire
                  toolId={TOOL_ID}
                  toolName="CommPulse™"
                  toolColor={TOOL_COLOR}
                  questions={questions}
                  onComplete={handleComplete}
                  variant={respondentType}
                />
              </motion.div>
            )}

            {/* STEP 3: Email Gate */}
            {step === 'gate' && (
              <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmailGate
                  toolName="CommPulse™"
                  toolColor={TOOL_COLOR}
                  onUnlock={handleUnlock}
                  isLoading={isUnlocking}
                />
              </motion.div>
            )}

            {/* STEP 4: Discover Results */}
            {step === 'discover' && (
              <motion.div key="discover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <DiscoverResults
                  toolId={TOOL_ID}
                  toolLabel="CommPulse™"
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

            {/* STEP 5: Intelligence Pricing */}
            {step === 'pricing' && (
              <motion.div key="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <IntelligencePricing
                  toolId={TOOL_ID}
                  toolLabel="CommPulse™"
                  toolColor={TOOL_COLOR}
                  intelligencePrice={intelligencePrice}
                  resultId={resultId}
                  enrichedAnswers={enrichedAnswers}
                  companyName={companyName}
                  sector={sector}
                  companySize={companySize}
                  respondentEmail={respondentEmail}
                  respondentName={respondentName}
                  onSuccess={(data) => { setIntelligenceData(data); setStep('intelligence'); }}
                  onBack={() => setStep('discover')}
                />
              </motion.div>
            )}

            {/* STEP 6: Intelligence Results */}
            {step === 'intelligence' && intelligenceData && (
              <motion.div key="intelligence" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <IntelligenceResults
                  toolId={TOOL_ID}
                  toolLabel="CommPulse™"
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
