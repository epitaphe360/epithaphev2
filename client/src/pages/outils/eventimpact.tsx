import { useState } from 'react';
import { useToolQuestions } from '@/hooks/useToolQuestions';
import { Helmet } from 'react-helmet-async';
import { SoftwareApplicationSchema, BreadcrumbSchema } from '@/components/seo/schema-org';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ScoringQuestionnaire } from '@/components/scoring-questionnaire';
import { ScoringResults } from '@/components/scoring-results';
import { EmailGate } from '@/components/email-gate';
import {
  calculateScore, calculatePillarScores,
  getMaturityLevel, MATURITY_LEVELS, saveScore,
  type ScoringQuestion, type ScoringAnswer, type ScoringResult,
  type SectorType, type CompanySizeType,
} from '@/lib/scoring-engine';

const TOOL_COLOR = '#8B5CF6'; // Violet pour EventImpact
const TOOL_ID = 'eventimpact' as const;

type EventMode = 'retrospectif' | 'anticipatif' | 'annuel';

const DEFAULT_QUESTIONS: ScoringQuestion[] = [
  // S â€” StratÃ©gie Ã‰vÃ©nementielle
  { id: 's1', pillar: 'S', pillarLabel: 'StratÃ©gie', text: 'Les Ã©vÃ©nements organisÃ©s s\'inscrivent dans une stratÃ©gie de communication globale documentÃ©e.', weight: 3 },
  { id: 's2', pillar: 'S', pillarLabel: 'StratÃ©gie', text: 'Les objectifs de chaque Ã©vÃ©nement sont dÃ©finis, mesurables et communiquÃ©s avant l\'organisation.', weight: 3 },
  { id: 's3', pillar: 'S', pillarLabel: 'StratÃ©gie', text: 'Le calendrier Ã©vÃ©nementiel est planifiÃ© sur l\'annÃ©e entiÃ¨re avec une vision stratÃ©gique.', weight: 2 },
  { id: 's4', pillar: 'S', pillarLabel: 'StratÃ©gie', text: 'Chaque Ã©vÃ©nement a un brief clair incluant cible, message clÃ©, format et KPIs attendus.', weight: 2 },
  { id: 's5', pillar: 'S', pillarLabel: 'StratÃ©gie', text: 'La sÃ©lection des Ã©vÃ©nements (foires, salons, sÃ©minaires) rÃ©pond Ã  des critÃ¨res stratÃ©giques, pas seulement Ã  des habitudes.', weight: 2 },
  { id: 's6', pillar: 'S', pillarLabel: 'StratÃ©gie', text: 'Il existe une cohÃ©rence entre les types d\'Ã©vÃ©nements choisis et le positionnement de marque.', weight: 2 },
  // T â€” Targeting
  { id: 't1', pillar: 'T', pillarLabel: 'Targeting', text: 'Nos Ã©vÃ©nements atteignent avec prÃ©cision notre cible prioritaire (acheteurs, prescripteurs, partenaires).', weight: 3 },
  { id: 't2', pillar: 'T', pillarLabel: 'Targeting', text: 'Nous qualifions les leads collectÃ©s lors des Ã©vÃ©nements dans les 48h suivant l\'Ã©vÃ©nement.', weight: 3 },
  { id: 't3', pillar: 'T', pillarLabel: 'Targeting', text: 'Un plan de suivi post-Ã©vÃ©nement est prÃ©parÃ© avant mÃªme l\'Ã©vÃ©nement.', weight: 2 },
  { id: 't4', pillar: 'T', pillarLabel: 'Targeting', text: 'Nos invitations Ã©vÃ©nementielles sont personnalisÃ©es selon les segments de cible.', weight: 2 },
  { id: 't5', pillar: 'T', pillarLabel: 'Targeting', text: 'Nous mesurons le taux de conversion lead-Ã©vÃ©nement vers opportunitÃ© commerciale.', weight: 2 },
  { id: 't6', pillar: 'T', pillarLabel: 'Targeting', text: 'La participation aux Ã©vÃ©nements des concurrents est analysÃ©e pour adapter notre stratÃ©gie.', weight: 1 },
  // A â€” Ambiance de Marque
  { id: 'a1', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'L\'identitÃ© visuelle de marque est appliquÃ©e avec cohÃ©rence Ã  tous les Ã©lÃ©ments visuels de nos Ã©vÃ©nements.', weight: 3 },
  { id: 'a2', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'L\'ambiance et l\'expÃ©rience sensorielle de nos Ã©vÃ©nements reflÃ¨tent notre positionnement de marque.', weight: 3 },
  { id: 'a3', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'Le Brand Coherence Scoreâ„¢ de nos derniers Ã©vÃ©nements (cohÃ©rence design/message/expÃ©rience) serait Ã©levÃ©.', weight: 2 },
  { id: 'a4', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'Le contenu Ã©vÃ©nementiel est original, mÃ©morable et crÃ©e une expÃ©rience distinctive.', weight: 2 },
  { id: 'a5', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'Les supports Ã©vÃ©nementiels (kakÃ©monos, PLV, goodies) sont de qualitÃ© professionnelle.', weight: 2 },
  { id: 'a6', pillar: 'A', pillarLabel: 'Ambiance de Marque', text: 'La cohÃ©rence entre le discours des intervenants et l\'identitÃ© de marque est vÃ©rifiÃ©e en amont.', weight: 2 },
  // G â€” GÃ©nÃ©ration Leads & ROI
  { id: 'g1', pillar: 'G', pillarLabel: 'GÃ©nÃ©ration & ROI', text: 'Nous calculons systÃ©matiquement le ROI financier de nos Ã©vÃ©nements (revenus gÃ©nÃ©rÃ©s / coÃ»ts engagÃ©s).', weight: 3 },
  { id: 'g2', pillar: 'G', pillarLabel: 'GÃ©nÃ©ration & ROI', text: 'Le coÃ»t par lead ou par contact qualifiÃ© de nos Ã©vÃ©nements est connu et maÃ®trisÃ©.', weight: 2 },
  { id: 'g3', pillar: 'G', pillarLabel: 'GÃ©nÃ©ration & ROI', text: 'Le budget Ã©vÃ©nementiel est allouÃ© de maniÃ¨re sÃ©lective aux Ã©vÃ©nements Ã  ROI prouvÃ©.', weight: 2 },
  { id: 'g4', pillar: 'G', pillarLabel: 'GÃ©nÃ©ration & ROI', text: 'Les 40% de ROI immatÃ©riel (notoriÃ©tÃ©, perception de marque) sont Ã©galement mesurÃ©s et pris en compte.', weight: 2 },
  { id: 'g5', pillar: 'G', pillarLabel: 'GÃ©nÃ©ration & ROI', text: 'La comparaison ROI Ã©vÃ©nements vs autres canaux (digital, print) est rÃ©alisÃ©e et documentÃ©e.', weight: 2 },
  { id: 'g6', pillar: 'G', pillarLabel: 'GÃ©nÃ©ration & ROI', text: 'Les objectifs chiffrÃ©s (nombre de leads, RDV pris, contrats signÃ©s) sont dÃ©finis avant chaque Ã©vÃ©nement.', weight: 3 },
  // E â€” Engagement Participants
  { id: 'e1', pillar: 'E', pillarLabel: 'Engagement', text: 'Le taux de satisfaction des participants Ã  nos Ã©vÃ©nements est mesurÃ© et supÃ©rieur Ã  80%.', weight: 2 },
  { id: 'e2', pillar: 'E', pillarLabel: 'Engagement', text: 'Les participants partagent spontanÃ©ment leur expÃ©rience sur les rÃ©seaux sociaux pendant l\'Ã©vÃ©nement.', weight: 2 },
  { id: 'e3', pillar: 'E', pillarLabel: 'Engagement', text: 'Les Ã©vÃ©nements donnent lieu Ã  du contenu rÃ©utilisable (photos, vidÃ©os, tÃ©moignages, articles).', weight: 2 },
  { id: 'e4', pillar: 'E', pillarLabel: 'Engagement', text: 'Le taux de retour des participants lors d\'Ã©vÃ©nements rÃ©currents est supÃ©rieur Ã  60%.', weight: 2 },
  { id: 'e5', pillar: 'E', pillarLabel: 'Engagement', text: 'Les intervenants et speakers sont soigneusement sÃ©lectionnÃ©s pour leur impact sur la rÃ©putation de marque.', weight: 2 },
  { id: 'e6', pillar: 'E', pillarLabel: 'Engagement', text: 'Nos Ã©vÃ©nements gÃ©nÃ¨rent spontanÃ©ment des recommandations et des inscriptions par le bouche-Ã -oreille.', weight: 3 },
];

const PILLAR_COLORS: Record<string, string> = {
  S: '#8B5CF6', T: '#A78BFA', A: '#C4B5FD', G: '#7C3AED', E: '#6D28D9',
};

function generateRecommendations(pillarScores: Array<{ pillarId: string; score: number }>, globalScore: number): string[] {
  const recs: string[] = [];
  const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3);
  if (globalScore < 40) recs.push("Attention : 64% des entreprises ne prouvent pas le ROI de leurs Ã©vÃ©nements. Votre score indique que votre budget Ã©vÃ©nementiel s'Ã©coule sans mesure de performance. Mettez en place un cadre de mesure minimal dÃ¨s maintenant.");
  weakest.forEach(ps => {
    if (ps.pillarId === 'S') recs.push("StratÃ©gie : crÃ©ez un calendrier Ã©vÃ©nementiel annuel avec brief structurÃ© (cible/message/KPIs) pour chaque Ã©vÃ©nement. La dÃ©cision de participer doit Ãªtre stratÃ©gique, pas automatique.");
    if (ps.pillarId === 'T') recs.push("Ciblage : implÃ©mentez un processus de qualification leads en 48h post-Ã©vÃ©nement avec CRM. PrÃ©parez l'email de suivi personnalisÃ© avant mÃªme le jour J.");
    if (ps.pillarId === 'A') recs.push("CohÃ©rence de marque : crÃ©ez un Brand Book Ã‰vÃ©nementiel avec templates visuels (standup, kakÃ©mono, PPT) garantissant un Brand Coherence Scoreâ„¢ maximal sur tous vos Ã©vÃ©nements.");
    if (ps.pillarId === 'G') recs.push("ROI : Ã©tablissez une fiche ROI systÃ©matique (coÃ»ts engagÃ©s / revenus gÃ©nÃ©rÃ©s / coÃ»t par lead). IntÃ©grez les 40% immatÃ©riels (notoriÃ©tÃ©, perception) dans votre calcul via sondage post-Ã©vÃ©nement.");
    if (ps.pillarId === 'E') recs.push("Engagement : crÃ©ez un programme de contenu Ã©vÃ©nementiel ('live-blogging', stories, tÃ©moignages vidÃ©o) et incentivez le partage social des participants avec une campagne de hashtag dÃ©diÃ©.");
  });
  return recs.slice(0, 4);
}

type Step = 'roi' | 'form' | 'gate' | 'result';

export default function EventImpactPage() {
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(50);
  const [eventMode, setEventMode] = useState<EventMode>('retrospectif');
  const [result, setResult] = useState<ScoringResult | null>(null);

  const handleComplete = (answers: ScoringAnswer[]) => {
    const globalScore = calculateScore(answers, questions);
    const pillarScores = calculatePillarScores(answers, questions, PILLAR_COLORS);
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
    setStep('gate');
  };

  const [isUnlocking, setIsUnlocking] = useState(false);
  const handleUnlock = async (data: { email: string; name: string }) => {
    setIsUnlocking(true);
    try {
      await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, sourceTool: TOOL_ID, companyName }),
      });
    } catch (err) {
      console.error('Erreur capture lead', err);
    } finally {
      setIsUnlocking(false);
      setStep('result');
    }
  };

  const eventModeLabels: Record<EventMode, { label: string; desc: string; emoji: string }> = {
    retrospectif: { label: 'RÃ©trospectif', desc: 'Ã‰valuer un Ã©vÃ©nement passÃ©', emoji: 'ðŸ”„' },
    anticipatif: { label: 'Anticipatif', desc: 'PrÃ©parer un Ã©vÃ©nement futur', emoji: 'ðŸš€' },
    annuel: { label: 'Annuel', desc: 'Ã‰valuer toute l\'annÃ©e Ã©vÃ©nementielle', emoji: 'ðŸ“…' },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Helmet>
        <title>EventImpactâ„¢ â€” Scoring Ã‰vÃ©nementiel Corporate | Epitaphe 360</title>
        <meta name="description" content="Mesurez le ROI et l'impact de vos Ã©vÃ©nements corporate avec EventImpactâ„¢ (modÃ¨le ENGAGE). Scoring sur 100." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/eventimpact" />
        <meta property="og:title" content="EventImpactâ„¢ â€” Scoring Ã‰vÃ©nementiel Corporate" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/eventimpact" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="EventImpactâ„¢" description="Mesurez le ROI et l'impact rÃ©el de vos Ã©vÃ©nements corporate sur l'engagement." url="/outils/eventimpact" priceMad={4900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360â„¢",url:"/outils"},{name:"EventImpactâ„¢",url:"/outils/eventimpact"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
              EventImpactâ„¢ Â· ModÃ¨le STAGEâ„¢
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Chaque Ã©vÃ©nement doit<br />
              <span style={{ color: TOOL_COLOR }}>prouver son impact.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              64% des entreprises ne prouvent pas le ROI de leurs Ã©vÃ©nements. 40% du ROI rÃ©el est immatÃ©riel.<br />
              Le Brand Coherence Scoreâ„¢ mesure l'alignement entre votre stratÃ©gie et votre scÃ¨ne.
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
                  {s === 'roi' ? 'Mode' : s === 'form' ? 'Ã‰valuation' : 'RÃ©sultats'}
                </span>
                {i < 2 && <div className="w-8 h-px bg-gray-700" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'roi' && (
              <motion.div key="roi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="border border-gray-800 rounded-2xl p-8 space-y-6">
                  <h2 className="text-xl font-bold text-white">Triple TemporalitÃ© STAGEâ„¢</h2>
                  <p className="text-gray-400 text-sm">EventImpactâ„¢ s'adapte Ã  votre besoin : rÃ©trospectif (bilan), anticipatif (prÃ©paration) ou annuel (vision globale).</p>
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
                        <option value="pharma">Pharma / SantÃ©</option>
                        <option value="auto">Automobile / B2B</option>
                        <option value="luxury">Luxe / Retail</option>
                        <option value="tech">Tech / Innovation</option>
                        <option value="energie">Ã‰nergie / Industrie</option>
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
                      <label className="block text-sm text-gray-400 mb-2">Vous Ãªtes :</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['direction', 'terrain'] as const).map(type => (
                          <button key={type} onClick={() => setRespondentType(type)}
                            className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400'}`}
                            style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                            {type === 'direction' ? 'ðŸŽª Direction Comm' : 'ðŸŽ­ Chef de Projet'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStep('form')} className="w-full py-4 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: TOOL_COLOR }}>
                    DÃ©marrer l'Ã©valuation STAGEâ„¢ ({eventModeLabels[eventMode].label}) â†’
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="EventImpactâ„¢" toolColor={TOOL_COLOR} questions={questions} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}

            {step === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Votre score EventImpactâ„¢ â€” {result.companyName}</h2>
                  <p className="text-gray-400 mt-1">Analyse STAGEâ„¢ Â· Brand Coherence Scoreâ„¢ Â· {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <ScoringResults result={result} toolName="EventImpactâ„¢" toolColor={TOOL_COLOR} toolModel="STAGEâ„¢" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}



