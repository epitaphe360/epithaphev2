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
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(50);
  const [salaireMoyen, setSalaireMoyen] = useState(8000);
  const [enrichedAnswers, setEnrichedAnswers] = useState<Record<string, { value: number; pillar: string; weight: number }>>({});
  const [resultId, setResultId] = useState('');
  const [partialScores, setPartialScores] = useState<Record<string, number>>({});
  const [intelligencePrice, setIntelligencePrice] = useState(4900);
  const [discoverGlobalScore, setDiscoverGlobalScore] = useState(0);
  const [discoverMaturityLevel, setDiscoverMaturityLevel] = useState(1);
  const [intelligenceData, setIntelligenceData] = useState<{ globalScore: number; maturityLevel: number; pillarScores: Record<string, number>; aiReport: unknown } | null>(null);

  const roiEstimate = calculateRoiEstimate(effectif, salaireMoyen, 0.18);

  const handleComplete = (answers: ScoringAnswer[]) => {
    const enriched: Record<string, { value: number; pillar: string; weight: number }> = {};
    for (const a of answers) {
      const q = questions.find(q => q.id === a.questionId);
      if (q) enriched[a.questionId] = { value: a.value, pillar: q.pillar, weight: q.weight };
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
        setIntelligencePrice(res.intelligencePrice ?? 4900);
      }
    } catch (err) {
      console.error('Erreur discover scoring', err);
    } finally {
      setIsUnlocking(false);
      setStep('discover');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
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
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
              CommPulse™ · Modèle CLARITY™
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Feel the heartbeat of<br />
              <span style={{ color: TOOL_COLOR }}>your organization.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              71% des employés sont insatisfaits de leur communication interne.<br />
              Découvrez où vous en êtes — et ce que ça vous coûte vraiment.
            </p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {(['roi', 'form', 'result'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === s ? 'text-black' : ((['roi', 'form', 'result'].indexOf(s) < ['roi', 'form', 'result'].indexOf(step)) ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500')
                }`} style={step === s ? { backgroundColor: TOOL_COLOR } : {}}>
                  {i + 1}
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">
                  {s === 'roi' ? 'Contexte' : s === 'form' ? 'Évaluation' : 'Résultats'}
                </span>
                {i < 2 && <div className="w-8 h-px bg-gray-700" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: ROI Calculator */}
            {step === 'roi' && (
              <motion.div key="roi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="border border-gray-800 rounded-2xl p-8 space-y-6">
                  <h2 className="text-xl font-bold text-white">
                    Calculez d'abord le coût de votre communication défaillante
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Les cadres seniors perdent en moyenne 63 jours/an à cause d'une communication inefficace. 
                    Quel est votre coût réel ?
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        placeholder="Ex : Maroc Telecom, OCP..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Secteur d'activité</label>
                      <select
                        value={sector}
                        onChange={e => setSector(e.target.value as SectorType)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
                      >
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
                      <input
                        type="range" min={10} max={5000} step={10}
                        value={effectif}
                        onChange={e => setEffectif(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Salaire moyen : <strong className="text-white">{salaireMoyen.toLocaleString('fr-MA')} MAD/mois</strong>
                      </label>
                      <input
                        type="range" min={3000} max={50000} step={500}
                        value={salaireMoyen}
                        onChange={e => setSalaireMoyen(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>
                  </div>

                  {/* ROI display */}
                  <motion.div
                    key={roiEstimate}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="rounded-xl p-6 text-center"
                    style={{ background: `linear-gradient(135deg, ${TOOL_COLOR}20, ${TOOL_COLOR}08)`, border: `1px solid ${TOOL_COLOR}40` }}
                  >
                    <p className="text-sm text-gray-400 mb-2">Coût estimé de votre communication défaillante</p>
                    <div className="text-4xl font-bold mb-1" style={{ color: TOOL_COLOR }}>
                      {roiEstimate.toLocaleString('fr-MA')} MAD
                    </div>
                    <p className="text-xs text-gray-500">par an · basé sur le facteur CLARITY™ (18% de la masse salariale)</p>
                  </motion.div>

                  {/* Respondent type */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Je suis :</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['direction', 'terrain'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setRespondentType(type)}
                          className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                            respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                          style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}
                        >
                          {type === 'direction' ? '👔 Direction / Management' : '🔧 Collaborateur / Terrain'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('form')}
                    className="w-full py-4 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: TOOL_COLOR }}
                  >
                    Démarrer l'évaluation CLARITY™ — 42 questions · ~8 min →
                  </button>
                </div>
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
