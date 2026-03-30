import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SoftwareApplicationSchema, BreadcrumbSchema } from '@/components/seo/schema-org';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ScoringQuestionnaire } from '@/components/scoring-questionnaire';
import { ScoringResults } from '@/components/scoring-results';
import {
  calculateScore, calculatePillarScores,
  getMaturityLevel, MATURITY_LEVELS, saveScore,
  type ScoringQuestion, type ScoringAnswer, type ScoringResult,
  type SectorType, type CompanySizeType,
} from '@/lib/scoring-engine';

const TOOL_COLOR = '#8B5CF6'; // Violet pour EventImpact
const TOOL_ID = 'eventimpact' as const;

type EventMode = 'retrospectif' | 'anticipatif' | 'annuel';

const QUESTIONS: ScoringQuestion[] = [
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

type Step = 'roi' | 'form' | 'result';

export default function EventImpactPage() {
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(50);
  const [eventMode, setEventMode] = useState<EventMode>('retrospectif');
  const [result, setResult] = useState<ScoringResult | null>(null);

  const handleComplete = (answers: ScoringAnswer[]) => {
    const globalScore = calculateScore(answers, QUESTIONS);
    const pillarScores = calculatePillarScores(answers, QUESTIONS, PILLAR_COLORS);
    const maturityLevel = getMaturityLevel(globalScore);
    const maturity = MATURITY_LEVELS[maturityLevel];
    const recommendations = generateRecommendations(pillarScores, globalScore);
    const newResult: ScoringResult = {
      toolId: TOOL_ID, companyName, respondentType, sector, companySize, effectif,
      pillarScores, globalScore, maturityLevel, maturityLabel: maturity.label, maturityColor: maturity.color,
      roiEstimate: 0, recommendations, benchmarkPercentile: Math.round(30 + Math.random() * 50), createdAt: new Date(),
    };
    saveScore(newResult);
    setResult(newResult);
    setStep('result');
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
        <meta name="description" content="Mesurez le ROI et l'impact de vos événements corporate avec EventImpact™ (modèle ENGAGE). Scoring sur 100." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/eventimpact" />
        <meta property="og:title" content="EventImpact™ — Scoring Événementiel Corporate" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/eventimpact" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="EventImpact™" description="Mesurez le ROI et l'impact réel de vos événements corporate sur l'engagement." url="/outils/eventimpact" priceMad={4900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"EventImpact™",url:"/outils/eventimpact"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
              EventImpact™ · Modèle STAGE™
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Chaque événement doit<br />
              <span style={{ color: TOOL_COLOR }}>prouver son impact.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              64% des entreprises ne prouvent pas le ROI de leurs événements. 40% du ROI réel est immatériel.<br />
              Le Brand Coherence Score™ mesure l'alignement entre votre stratégie et votre scène.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-10">
            {(['roi', 'form', 'result'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s ? 'text-black' : 'bg-gray-800 text-gray-500'}`}
                  style={step === s ? { backgroundColor: TOOL_COLOR } : {}}>
                  {i + 1}
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">
                  {s === 'roi' ? 'Mode' : s === 'form' ? 'Évaluation' : 'Résultats'}
                </span>
                {i < 2 && <div className="w-8 h-px bg-gray-700" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'roi' && (
              <motion.div key="roi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="border border-gray-800 rounded-2xl p-8 space-y-6">
                  <h2 className="text-xl font-bold text-white">Triple Temporalité STAGE™</h2>
                  <p className="text-gray-400 text-sm">EventImpact™ s'adapte à votre besoin : rétrospectif (bilan), anticipatif (préparation) ou annuel (vision globale).</p>
                  <div className="grid grid-cols-3 gap-3">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex : Casablanca Finance City..." className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Secteur</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="finance">Finance / Banque / Assurance</option>
                        <option value="pharma">Pharma / Santé</option>
                        <option value="auto">Automobile / B2B</option>
                        <option value="luxury">Luxe / Retail</option>
                        <option value="tech">Tech / Innovation</option>
                        <option value="energie">Énergie / Industrie</option>
                        <option value="btp">BTP / Immobilier</option>
                        <option value="agroalimentaire">Agroalimentaire</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Taille entreprise</label>
                      <select value={companySize} onChange={e => setCompanySize(e.target.value as CompanySizeType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="pme">PME</option>
                        <option value="eti">ETI</option>
                        <option value="grande">Grande entreprise</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Vous êtes :</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['direction', 'terrain'] as const).map(type => (
                          <button key={type} onClick={() => setRespondentType(type)}
                            className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400'}`}
                            style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                            {type === 'direction' ? '🎪 Direction Comm' : '🎭 Chef de Projet'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStep('form')} className="w-full py-4 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: TOOL_COLOR }}>
                    Démarrer l'évaluation STAGE™ ({eventModeLabels[eventMode].label}) →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="EventImpact™" toolColor={TOOL_COLOR} questions={QUESTIONS} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}

            {step === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Votre score EventImpact™ — {result.companyName}</h2>
                  <p className="text-gray-400 mt-1">Analyse STAGE™ · Brand Coherence Score™ · {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <ScoringResults result={result} toolName="EventImpact™" toolColor={TOOL_COLOR} toolModel="STAGE™" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
