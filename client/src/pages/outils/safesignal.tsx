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

const TOOL_COLOR = '#F97316'; // Orange pour SafeSignal
const TOOL_ID = 'safesignal' as const;

const DEFAULT_QUESTIONS: ScoringQuestion[] = [
  // S â€” Signaux Faibles
  { id: 's1', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Nous disposons d\'un systÃ¨me formalisÃ© pour recueillir et analyser les signaux faibles de sÃ©curitÃ© (near misses, observations).', weight: 3 },
  { id: 's2', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Les employÃ©s signalent les situations Ã  risque sans crainte de reprÃ©sailles.', weight: 3 },
  { id: 's3', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Les incidents sans blessure sont traitÃ©s avec autant de sÃ©rieux que les accidents.', weight: 3 },
  { id: 's4', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Notre taux de dÃ©claration des presqu\'accidents est Ã©levÃ© et progresse d\'annÃ©e en annÃ©e.', weight: 2 },
  { id: 's5', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'L\'analyse des causes racines est systÃ©matiquement rÃ©alisÃ©e pour tous les signaux faibles.', weight: 2 },
  { id: 's6', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Les remontÃ©es terrain sont traitÃ©es dans un dÃ©lai maximum de 5 jours ouvrÃ©s et un retour est communiquÃ©.', weight: 2 },
  // H â€” HiÃ©rarchie SÃ©curitÃ©
  { id: 'h1', pillar: 'H', pillarLabel: 'HiÃ©rarchie SÃ©curitÃ©', text: 'La direction gÃ©nÃ©rale participe visiblement et rÃ©guliÃ¨rement aux actions de sÃ©curitÃ© (SafeWalks, rÃ©unions SST).', weight: 3 },
  { id: 'h2', pillar: 'H', pillarLabel: 'HiÃ©rarchie SÃ©curitÃ©', text: 'Les managers de proximitÃ© ont Ã©tÃ© formÃ©s Ã  l\'animation de la sÃ©curitÃ© et le font rÃ©ellement.', weight: 3 },
  { id: 'h3', pillar: 'H', pillarLabel: 'HiÃ©rarchie SÃ©curitÃ©', text: 'Les objectifs sÃ©curitÃ© font partie des critÃ¨res d\'Ã©valuation annuelle des managers.', weight: 2 },
  { id: 'h4', pillar: 'H', pillarLabel: 'HiÃ©rarchie SÃ©curitÃ©', text: 'Il existe une politique de tolÃ©rance zÃ©ro pour les violations dÃ©libÃ©rÃ©es des rÃ¨gles de sÃ©curitÃ©, appliquÃ©e Ã  tous niveaux.', weight: 2 },
  { id: 'h5', pillar: 'H', pillarLabel: 'HiÃ©rarchie SÃ©curitÃ©', text: 'Les dÃ©cisions d\'investissement tiennent compte des impÃ©ratifs de sÃ©curitÃ© avant les impÃ©ratifs Ã©conomiques.', weight: 2 },
  { id: 'h6', pillar: 'H', pillarLabel: 'HiÃ©rarchie SÃ©curitÃ©', text: 'La communication sur la sÃ©curitÃ© vient de tous les niveaux hiÃ©rarchiques, pas seulement du service HSE.', weight: 2 },
  // I â€” Impact Terrain
  { id: 'i1', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Notre Safety Perception Gapâ„¢ est mesurÃ© : l\'Ã©cart entre la perception managers et opÃ©rateurs terrain est connu.', weight: 3 },
  { id: 'i2', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Les conditions rÃ©elles de travail sont conformes aux procÃ©dures Ã©crites (vÃ©rifiÃ©es par terrain vs documents).', weight: 3 },
  { id: 'i3', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Le port des EPI est systÃ©matique et fait l\'objet de contrÃ´les rÃ©guliers et documentÃ©s.', weight: 2 },
  { id: 'i4', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Les risques psychosociaux (stress, harcÃ¨lement, surcharge) sont Ã©valuÃ©s et traitÃ©s.', weight: 2 },
  { id: 'i5', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Notre taux de frÃ©quence des accidents TF1 est en dessous de la moyenne sectorielle.', weight: 2 },
  { id: 'i6', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Les postes Ã  risque bÃ©nÃ©ficient d\'une Ã©valuation ergonomique et de mesures d\'amÃ©lioration.', weight: 2 },
  // E â€” Engagement Total
  { id: 'e1', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Les employÃ©s s\'engagent volontairement dans des initiatives sÃ©curitÃ© au-delÃ  de leurs obligations.', weight: 3 },
  { id: 'e2', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Le CHST/CSE est actif, rÃ©pond Ã  ses missions et ses recommandations sont suivies d\'effet.', weight: 2 },
  { id: 'e3', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Des groupes de travail pluridisciplinaires incluant des opÃ©rateurs terrain traitent des problÃ¨mes de sÃ©curitÃ©.', weight: 2 },
  { id: 'e4', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Les comportements sÃ©curisÃ©s sont valorisÃ©s et rÃ©compensÃ©s concrÃ¨tement.', weight: 2 },
  { id: 'e5', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Lors des arrÃªts pour raison de sÃ©curitÃ©, l\'employÃ© est soutenu et protÃ©gÃ©, jamais pÃ©nalisÃ©.', weight: 3 },
  { id: 'e6', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Le taux de participation aux formations sÃ©curitÃ© volontaires est supÃ©rieur Ã  80%.', weight: 2 },
  // L â€” Learning Culture
  { id: 'l1', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Chaque accident ou presqu\'accident donne lieu Ã  une analyse partagÃ©e et Ã  des enseignements diffusÃ©s.', weight: 3 },
  { id: 'l2', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Nous apprenons rÃ©guliÃ¨rement des incidents des autres entreprises de notre secteur.', weight: 2 },
  { id: 'l3', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Les procÃ©dures de sÃ©curitÃ© sont rÃ©guliÃ¨rement revues et amÃ©liorÃ©es en tenant compte des retours terrain.', weight: 2 },
  { id: 'l4', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Il existe des exercices d\'urgence rÃ©guliers, correctement Ã©valuÃ©s et amÃ©liorÃ©s en consÃ©quence.', weight: 2 },
  { id: 'l5', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Notre organisation est capable de dÃ©tecter et de corriger ses propres erreurs systÃ©miques.', weight: 2 },
  { id: 'l6', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Les formations sÃ©curitÃ© sont basÃ©es sur des situations rÃ©elles vÃ©cues dans notre entreprise.', weight: 2 },
  // D â€” Dispositifs Physiques
  { id: 'd1', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'La signalÃ©tique de sÃ©curitÃ© (sortie secours, risques, interdictions) est visible, Ã  jour et en bon Ã©tat.', weight: 2 },
  { id: 'd2', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'Les EPI (EPC, extincteurs, kits de premiers secours) sont disponibles, accessibles et vÃ©rifiÃ©s rÃ©guliÃ¨rement.', weight: 2 },
  { id: 'd3', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'L\'amÃ©nagement des postes de travail rÃ©duit au maximum les risques ergonomiques et d\'accidents.', weight: 2 },
  { id: 'd4', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'Les Ã©quipements et machines font l\'objet de maintenances prÃ©ventives documentÃ©es et respectÃ©es.', weight: 2 },
  { id: 'd5', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'Les plans d\'Ã©vacuation et les procÃ©dures d\'urgence sont affichÃ©s et connus des employÃ©s.', weight: 2 },
  { id: 'd6', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'Notre document unique d\'Ã©valuation des risques (DUER) est Ã  jour et accessible.', weight: 3 },
];

const PILLAR_COLORS: Record<string, string> = {
  S: '#F97316', H: '#FB923C', I: '#FDBA74', E: '#EA580C', L: '#C2410C', D: '#9A3412',
};

function generateRecommendations(pillarScores: Array<{ pillarId: string; score: number }>, globalScore: number): string[] {
  const recs: string[] = [];
  const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3);
  if (globalScore < 40) recs.push("Alerte : 80-90% des blessures au travail ont des causes humaines et organisationnelles. Votre score rÃ©vÃ¨le une culture sÃ©curitÃ© fragile â€” priorisez immÃ©diatement la mise en conformitÃ© rÃ©glementaire.");
  weakest.forEach(ps => {
    if (ps.pillarId === 'S') recs.push("Signaux faibles : dÃ©ployez un systÃ¨me de remontÃ©e d'observations anonymes (boÃ®te Ã  idÃ©es sÃ©curitÃ©, app mobile) et formez les managers Ã  traiter chaque signal sous 48h.");
    if (ps.pillarId === 'H') recs.push("Leadership sÃ©curitÃ© : planifiez des SafeWalks mensuels pour la direction + briefings hebdomadaires pour les managers de proximitÃ©. IntÃ©grez les KPIs sÃ©curitÃ© dans les revues de performance.");
    if (ps.pillarId === 'I') recs.push("Impact terrain : rÃ©alisez une enquÃªte Safety Perception Gapâ„¢ (direction vs opÃ©rateurs) pour mesurer l'Ã©cart et identifier les zones de dÃ©ni. Planifiez des visites terrain croisÃ©es.");
    if (ps.pillarId === 'E') recs.push("Engagement : crÃ©ez des groupes de vigilance volontaires, valorisez les comportements sÃ©curisÃ©s et institutionnalisez le droit de retrait sans crainte de sanction.");
    if (ps.pillarId === 'L') recs.push("Apprentissage : systÃ©matisez les retours d'expÃ©rience (REX) post-incident, partagez les enseignements sur intranet et crÃ©ez une bibliothÃ¨que d'incidents analysÃ©s.");
    if (ps.pillarId === 'D') recs.push("Dispositifs : planifiez un SafeWalkâ„¢ physique sur 12 zones prioritaires, mettez Ã  jour le DUER et Ã©tablissez un plan de maintenance prÃ©ventive documentÃ©.");
  });
  return recs.slice(0, 4);
}

type Step = 'roi' | 'form' | 'gate' | 'result';

export default function SafeSignalPage() {
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(100);
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
      roiEstimate: 0, recommendations, benchmarkPercentile: Math.round(35 + Math.random() * 45), createdAt: new Date(),
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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Helmet>
        <title>SafeSignalâ„¢ â€” Scoring Communication QHSE | Epitaphe 360</title>
        <meta name="description" content="Ã‰valuez l'efficacitÃ© de votre communication sÃ©curitÃ© avec SafeSignalâ„¢ (modÃ¨le SECURE). Culture QHSE au Maroc." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/safesignal" />
        <meta property="og:title" content="SafeSignalâ„¢ â€” Scoring Communication QHSE" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/safesignal" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="SafeSignalâ„¢" description="Ã‰valuez l'efficacitÃ© de votre communication sÃ©curitÃ© et votre culture QHSE." url="/outils/safesignal" priceMad={4900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360â„¢",url:"/outils"},{name:"SafeSignalâ„¢",url:"/outils/safesignal"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
              SafeSignalâ„¢ Â· ModÃ¨le SHIELDâ„¢
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              La sÃ©curitÃ© que vous<br />
              <span style={{ color: TOOL_COLOR }}>croyez avoir vs celle qui existe.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              80-90% des accidents du travail ont des causes organisationnelles et humaines.<br />
              Le Safety Perception Gapâ„¢ mesure l'Ã©cart entre la perception des managers et la rÃ©alitÃ© terrain.
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
                  {s === 'roi' ? 'Contexte' : s === 'form' ? 'Ã‰valuation' : 'RÃ©sultats'}
                </span>
                {i < 2 && <div className="w-8 h-px bg-gray-700" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'roi' && (
              <motion.div key="roi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="border border-gray-800 rounded-2xl p-8 space-y-6">
                  <h2 className="text-xl font-bold text-white">Safety Perception Gapâ„¢ â€” Qui rÃ©pond ?</h2>
                  <p className="text-gray-400 text-sm">La puissance de SafeSignalâ„¢ rÃ©side dans la comparaison entre la rÃ©ponse Direction/HSE et la rÃ©ponse OpÃ©rateurs terrain. Remplissez les deux pour rÃ©vÃ©ler l'Ã©cart rÃ©el.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex : LafargeHolcim Maroc..." className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Secteur</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="energie">Ã‰nergie / Mining / Industrie</option>
                        <option value="btp">BTP / Construction</option>
                        <option value="auto">Automobile / Manufacturing</option>
                        <option value="pharma">Pharma / Chimie</option>
                        <option value="agroalimentaire">Agroalimentaire</option>
                        <option value="textile">Textile</option>
                        <option value="finance">Services / Tertiaire</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Effectif : <strong className="text-white">{effectif}</strong></label>
                      <input type="range" min={10} max={5000} step={10} value={effectif} onChange={e => setEffectif(Number(e.target.value))} className="w-full" style={{ accentColor: TOOL_COLOR }} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Taille entreprise</label>
                      <select value={companySize} onChange={e => setCompanySize(e.target.value as CompanySizeType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="pme">PME (10-250)</option>
                        <option value="eti">ETI (250-5000)</option>
                        <option value="grande">Grande entreprise (5000+)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Perspective de rÃ©ponse :</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['direction', 'terrain'] as const).map(type => (
                        <button key={type} onClick={() => setRespondentType(type)}
                          className={`px-4 py-4 rounded-xl border text-left transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400'}`}
                          style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                          <div className="font-semibold text-sm">{type === 'direction' ? 'ðŸŽ¯ Direction / HSE' : 'ðŸ¦º OpÃ©rateur Terrain'}</div>
                          <div className={`text-xs mt-1 ${respondentType === type ? 'text-black/70' : 'text-gray-600'}`}>
                            {type === 'direction' ? 'Votre vision de la culture sÃ©curitÃ©' : 'La rÃ©alitÃ© vÃ©cue au quotidien'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl p-4 border" style={{ borderColor: `${TOOL_COLOR}40`, background: `${TOOL_COLOR}10` }}>
                    <p className="text-xs text-gray-400">ðŸ’¡ <strong className="text-white">SafeWalkâ„¢ intÃ©grÃ© :</strong> aprÃ¨s votre diagnostic, vous recevrez un brief pour rÃ©aliser un audit physique sur 12 zones critiques avec votre Ã©quipe terrain.</p>
                  </div>
                  <button onClick={() => setStep('form')} className="w-full py-4 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: TOOL_COLOR }}>
                    DÃ©marrer l'Ã©valuation SHIELDâ„¢ â€” 36 questions â†’
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="SafeSignalâ„¢" toolColor={TOOL_COLOR} questions={questions} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}

            {step === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Votre score SafeSignalâ„¢ â€” {result.companyName}</h2>
                  <p className="text-gray-400 mt-1">Analyse SHIELDâ„¢ Â· Safety Perception Gapâ„¢ Â· {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <ScoringResults result={result} toolName="SafeSignalâ„¢" toolColor={TOOL_COLOR} toolModel="SHIELDâ„¢" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}



