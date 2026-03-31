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
  calculateScore, calculatePillarScores, calculateRoiEstimate,
  getMaturityLevel, MATURITY_LEVELS, saveScore,
  type ScoringQuestion, type ScoringAnswer, type ScoringResult,
  type SectorType, type CompanySizeType,
} from '@/lib/scoring-engine';

const TOOL_COLOR = '#EC4899'; // Rose/Fuchsia pour TalentPrint
const TOOL_ID = 'talentprint' as const;

const DEFAULT_QUESTIONS: ScoringQuestion[] = [
  // A â€” AuthenticitÃ©
  { id: 'a1', pillar: 'A', pillarLabel: 'AuthenticitÃ©', text: 'Notre discours sur la marque employeur reflÃ¨te fidÃ¨lement l\'expÃ©rience rÃ©elle des employÃ©s.', weight: 3 },
  { id: 'a2', pillar: 'A', pillarLabel: 'AuthenticitÃ©', text: 'Les engagements pris lors du recrutement sont tenus dans la rÃ©alitÃ© du poste.', weight: 3 },
  { id: 'a3', pillar: 'A', pillarLabel: 'AuthenticitÃ©', text: 'Notre EVP (Employee Value Proposition) est dÃ©fini formellement et connu des managers.', weight: 2 },
  { id: 'a4', pillar: 'A', pillarLabel: 'AuthenticitÃ©', text: 'Les avis publiÃ©s sur Glassdoor/LinkedIn reflÃ¨tent notre culture rÃ©elle.', weight: 2 },
  { id: 'a5', pillar: 'A', pillarLabel: 'AuthenticitÃ©', text: 'La direction consacre au moins 80% de ses efforts Ã  tenir ses promesses EVP plutÃ´t qu\'Ã  les dÃ©finir.', weight: 2 },
  { id: 'a6', pillar: 'A', pillarLabel: 'AuthenticitÃ©', text: 'Notre message de marque employeur est cohÃ©rent sur tous les canaux (site, rÃ©seaux, offres d\'emploi).', weight: 2 },
  // T1 â€” Talent Magnet
  { id: 't1', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Nous attirons rÃ©guliÃ¨rement des profils qualifiÃ©s sans avoir recours Ã  des chasseurs de tÃªtes.', weight: 2 },
  { id: 't2', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Notre marque employeur diffÃ©rencie clairement notre offre des concurrents du mÃªme secteur.', weight: 3 },
  { id: 't3', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Nous recevons des candidatures spontanÃ©es de qualitÃ© de maniÃ¨re rÃ©guliÃ¨re.', weight: 2 },
  { id: 't4', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Notre dÃ©lai de recrutement moyen est infÃ©rieur Ã  la moyenne du secteur.', weight: 1 },
  { id: 't5', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Les rÃ©seaux sociaux professionnels de l\'entreprise sont actifs et engagent notre cible talent.', weight: 2 },
  { id: 't6', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Notre carriÃ¨re-site est moderne, mobile-friendly et reflÃ¨te notre culture.', weight: 2 },
  // T2 â€” Turnover DNA
  { id: 't7', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Notre taux de turnover est infÃ©rieur Ã  la moyenne sectorielle.', weight: 3 },
  { id: 't8', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Nous rÃ©alisons des entretiens de sortie systÃ©matiques et analysons les rÃ©sultats.', weight: 2 },
  { id: 't9', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Les raisons profondes du dÃ©part des talents sont comprises et documentÃ©es.', weight: 3 },
  { id: 't10', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Des actions concrÃ¨tes ont Ã©tÃ© mises en place suite aux rÃ©sultats d\'entretiens de sortie.', weight: 2 },
  { id: 't11', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Le coÃ»t rÃ©el du turnover (remplacement, formation, perte de productivitÃ©) est calculÃ©.', weight: 2 },
  { id: 't12', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Les talents Ã  fort potentiel sont identifiÃ©s et bÃ©nÃ©ficient de plans de rÃ©tention personnalisÃ©s.', weight: 3 },
  // R â€” RÃ©putation Digitale
  { id: 'r1', pillar: 'R', pillarLabel: 'RÃ©putation Digitale', text: 'Notre prÃ©sence sur LinkedIn est soignÃ©e, Ã  jour et montre notre culture d\'entreprise.', weight: 2 },
  { id: 'r2', pillar: 'R', pillarLabel: 'RÃ©putation Digitale', text: 'Nos avis Glassdoor ou Ã©quivalents sont globalement positifs et font l\'objet de rÃ©ponses.', weight: 2 },
  { id: 'r3', pillar: 'R', pillarLabel: 'RÃ©putation Digitale', text: 'Notre page carriÃ¨res est rÃ©guliÃ¨rement mise Ã  jour avec du contenu (tÃ©moignages, vidÃ©os).', weight: 2 },
  { id: 'r4', pillar: 'R', pillarLabel: 'RÃ©putation Digitale', text: 'La note moyenne de notre entreprise sur les plateformes d\'avis employeurs est supÃ©rieure Ã  3,5/5.', weight: 3 },
  { id: 'r5', pillar: 'R', pillarLabel: 'RÃ©putation Digitale', text: 'Nos offres d\'emploi sont bien rÃ©digÃ©es, attractives et cohÃ©rentes avec notre positionnement.', weight: 1 },
  { id: 'r6', pillar: 'R', pillarLabel: 'RÃ©putation Digitale', text: 'Nous mesurons rÃ©guliÃ¨rement notre e-rÃ©putation employeur avec des outils dÃ©diÃ©s.', weight: 2 },
  // A2 â€” Ambassadeurs
  { id: 'am1', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Nos employÃ©s parlent positivement de l\'entreprise dans leur entourage.', weight: 3 },
  { id: 'am2', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Un programme formel d\'ambassadeurs employÃ©s existe et est actif.', weight: 2 },
  { id: 'am3', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Les employÃ©s partagent du contenu liÃ© Ã  l\'entreprise sur leurs rÃ©seaux personnels.', weight: 2 },
  { id: 'am4', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Notre score NPS employÃ© (recommandation comme employeur) est mesurÃ© rÃ©guliÃ¨rement.', weight: 2 },
  { id: 'am5', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Les managers sont formÃ©s et engagÃ©s dans la dÃ©marche de marque employeur.', weight: 2 },
  { id: 'am6', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Les recrutements par cooptation reprÃ©sentent une part significative de nos embauches.', weight: 2 },
  // C â€” Culture Fitness
  { id: 'cf1', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Les valeurs d\'entreprise sont vÃ©cues au quotidien, pas seulement affichÃ©es.', weight: 3 },
  { id: 'cf2', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Les pratiques managÃ©riales reflÃ¨tent les valeurs proclamÃ©es.', weight: 3 },
  { id: 'cf3', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Les critÃ¨res de recrutement incluent explicitement le fit culturel.', weight: 2 },
  { id: 'cf4', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Il existe des rituels et pratiques qui incarnent et renforcent la culture.', weight: 2 },
  { id: 'cf5', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'La culture d\'entreprise est une source de fiertÃ© pour les employÃ©s.', weight: 2 },
  { id: 'cf6', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Les processus d\'onboarding transmettent efficacement la culture aux nouveaux arrivants.', weight: 2 },
  // T3 â€” Transition (Onboarding/Offboarding)
  { id: 'tr1', pillar: 'TR', pillarLabel: 'Transition', text: 'Notre parcours d\'onboarding dure au moins 3 mois et est structurÃ©.', weight: 2 },
  { id: 'tr2', pillar: 'TR', pillarLabel: 'Transition', text: 'Les nouveaux arrivants atteignent leur pleine productivitÃ© dans les dÃ©lais attendus.', weight: 2 },
  { id: 'tr3', pillar: 'TR', pillarLabel: 'Transition', text: 'Un mentor ou buddy est systÃ©matiquement assignÃ© aux nouvelles recrues.', weight: 2 },
  { id: 'tr4', pillar: 'TR', pillarLabel: 'Transition', text: 'Les dÃ©parts de l\'entreprise sont gÃ©rÃ©s avec respect et professionnalisme.', weight: 2 },
  { id: 'tr5', pillar: 'TR', pillarLabel: 'Transition', text: 'Les anciens employÃ©s (alumni) maintiennent une relation positive avec l\'entreprise.', weight: 2 },
  { id: 'tr6', pillar: 'TR', pillarLabel: 'Transition', text: 'Le taux de rÃ©tention Ã  12 mois des nouvelles recrues est supÃ©rieur Ã  80%.', weight: 3 },
];

const PILLAR_COLORS: Record<string, string> = {
  A: '#EC4899', T1: '#F472B6', T2: '#FB7185', R: '#F9A8D4', AM: '#BE185D', CF: '#9D174D', TR: '#831843',
};

function generateRecommendations(pillarScores: Array<{ pillarId: string; score: number }>, globalScore: number): string[] {
  const recs: string[] = [];
  const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3);
  if (globalScore < 40) recs.push("Urgence : dÃ©finir et formaliser votre EVP (Employee Value Proposition) avec une session de co-crÃ©ation impliquant direction, RH et reprÃ©sentants terrain.");
  weakest.forEach(ps => {
    if (ps.pillarId === 'A') recs.push("AuthenticitÃ© : conduire un audit Gap (discours vs vÃ©cu) avec des focus groupes anonymes. Le rÃ©sultat doit guider votre refonte de l'EVP.");
    if (ps.pillarId === 'T1') recs.push("Attraction : refondre votre carriÃ¨re-site, activer une stratÃ©gie de contenu LinkedIn (tÃ©moignages, coulisses, projets) et crÃ©er un brief recrutement diffÃ©renciant.");
    if (ps.pillarId === 'T2') recs.push("RÃ©tention : mettre en place des entretiens de rÃ©tention proactifs (avant les dÃ©parts) et calculer le coÃ»t rÃ©el du turnover pour prioriser les actions.");
    if (ps.pillarId === 'R') recs.push("RÃ©putation digitale : rÃ©pondre systÃ©matiquement aux avis Glassdoor, activer un programme de tÃ©moignages employÃ©s et auditer votre prÃ©sence LinkedIn mensuelle.");
    if (ps.pillarId === 'AM') recs.push("Ambassadeurs : lancer un programme Employee Advocacy structurÃ© avec des contenus prÃªt-Ã -partager et former vos managers Ã  Ãªtre les premiers ambassadeurs.");
    if (ps.pillarId === 'CF') recs.push("Culture : crÃ©er un Culture Book vivant (pas un PDF figÃ©), institutionnaliser des rituels culturels et intÃ©grer les valeurs dans tous les processus RH.");
    if (ps.pillarId === 'TR') recs.push("Transition : structurer un parcours d'onboarding sur 90 jours (J1+J30+J90) et crÃ©er un rÃ©seau alumni actif pour maintenir des ambassadeurs post-dÃ©part.");
  });
  return recs.slice(0, 4);
}

type Step = 'roi' | 'form' | 'gate' | 'result';

export default function TalentPrintPage() {
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(50);
  const [salaireMoyen, setSalaireMoyen] = useState(8000);
  const [result, setResult] = useState<ScoringResult | null>(null);

  // Turnover cost estimate : effectif Ã— taux turnover moyen (20%) Ã— coÃ»t remplacement (6 mois salaire)
  const turnoverCost = Math.round(effectif * 0.20 * (salaireMoyen * 6));

  const handleComplete = (answers: ScoringAnswer[]) => {
    const globalScore = calculateScore(answers, questions);
    const pillarScores = calculatePillarScores(answers, questions, PILLAR_COLORS);
    const maturityLevel = getMaturityLevel(globalScore);
    const maturity = MATURITY_LEVELS[maturityLevel];
    const recommendations = generateRecommendations(pillarScores, globalScore);
    const newResult: ScoringResult = {
      toolId: TOOL_ID, companyName, respondentType, sector, companySize, effectif,
      pillarScores, globalScore, maturityLevel, maturityLabel: maturity.label, maturityColor: maturity.color,
      roiEstimate: turnoverCost, recommendations, benchmarkPercentile: Math.round(40 + Math.random() * 40), createdAt: new Date(),
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
        <title>TalentPrintâ„¢ â€” Scoring Marque Employeur | Epitaphe 360</title>
        <meta name="description" content="Mesurez l'attractivitÃ© de votre marque employeur avec TalentPrintâ„¢ (modÃ¨le ATTRACT). Score RH sur 100." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/talentprint" />
        <meta property="og:title" content="TalentPrintâ„¢ â€” Scoring Marque Employeur" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/talentprint" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="TalentPrintâ„¢" description="Mesurez l'attractivitÃ© de votre marque employeur et votre capacitÃ© Ã  retenir les talents." url="/outils/talentprint" priceMad={4900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360â„¢",url:"/outils"},{name:"TalentPrintâ„¢",url:"/outils/talentprint"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
              TalentPrintâ„¢ Â· ModÃ¨le ATTRACTâ„¢
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your employer brand,<br />
              <span style={{ color: TOOL_COLOR }}>decoded.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Gartner confirme : un EVP convaincant rÃ©duit le turnover de 69% et les coÃ»ts de recrutement de 50%.<br />
              Mesurez l'Ã©cart entre votre promesse et la rÃ©alitÃ© vÃ©cue.
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
                  <h2 className="text-xl font-bold text-white">Calculez le coÃ»t rÃ©el de votre turnover</h2>
                  <p className="text-gray-400 text-sm">Remplacer un employÃ© coÃ»te en moyenne 6 mois de son salaire. Combien perdez-vous chaque annÃ©e ?</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex : Maroc Telecom..." className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" style={{ '--tw-ring-color': TOOL_COLOR } as React.CSSProperties} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Secteur</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="pharma">Pharma / SantÃ©</option>
                        <option value="auto">Automobile</option>
                        <option value="finance">Banque / Finance</option>
                        <option value="tech">Tech / IT</option>
                        <option value="energie">Ã‰nergie / Industrie</option>
                        <option value="luxury">Luxe / Retail</option>
                        <option value="btp">BTP / Immobilier</option>
                        <option value="agroalimentaire">Agroalimentaire</option>
                        <option value="textile">Textile / Mode</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Effectif : <strong className="text-white">{effectif}</strong></label>
                      <input type="range" min={10} max={5000} step={10} value={effectif} onChange={e => setEffectif(Number(e.target.value))} className="w-full" style={{ accentColor: TOOL_COLOR }} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Salaire moyen : <strong className="text-white">{salaireMoyen.toLocaleString('fr-MA')} MAD/mois</strong></label>
                      <input type="range" min={3000} max={50000} step={500} value={salaireMoyen} onChange={e => setSalaireMoyen(Number(e.target.value))} className="w-full" style={{ accentColor: TOOL_COLOR }} />
                    </div>
                  </div>
                  <motion.div key={turnoverCost} initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                    className="rounded-xl p-6 text-center"
                    style={{ background: `linear-gradient(135deg, ${TOOL_COLOR}20, ${TOOL_COLOR}08)`, border: `1px solid ${TOOL_COLOR}40` }}>
                    <p className="text-sm text-gray-400 mb-2">CoÃ»t annuel estimÃ© de votre turnover</p>
                    <div className="text-4xl font-bold mb-1" style={{ color: TOOL_COLOR }}>{turnoverCost.toLocaleString('fr-MA')} MAD</div>
                    <p className="text-xs text-gray-500">20% turnover moyen Ã— 6 mois salaire par remplacement</p>
                  </motion.div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Vous rÃ©pondez en tant que :</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['direction', 'terrain'] as const).map(type => (
                        <button key={type} onClick={() => setRespondentType(type)}
                          className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400'}`}
                          style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                          {type === 'direction' ? 'ðŸ‘” Direction / RH' : 'ðŸ‘¥ Collaborateur / Manager'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setStep('form')} className="w-full py-4 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: TOOL_COLOR }}>
                    DÃ©marrer l'Ã©valuation ATTRACTâ„¢ â€” 42 questions â†’ 
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="TalentPrintâ„¢" toolColor={TOOL_COLOR} questions={questions} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}

            {step === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Votre score TalentPrintâ„¢ â€” {result.companyName}</h2>
                  <p className="text-gray-400 mt-1">Analyse ATTRACTâ„¢ Â· {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <ScoringResults result={result} toolName="TalentPrintâ„¢" toolColor={TOOL_COLOR} toolModel="ATTRACTâ„¢" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}



