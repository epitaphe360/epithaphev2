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
  getMaturityLevel, MATURITY_LEVELS, saveScore, persistScore,
  type ScoringQuestion, type ScoringAnswer, type ScoringResult,
  type SectorType, type CompanySizeType,
} from '@/lib/scoring-engine';

const TOOL_COLOR = '#EC4899'; // Rose/Fuchsia pour TalentPrint
const TOOL_ID = 'talentprint' as const;

const DEFAULT_QUESTIONS: ScoringQuestion[] = [
  // A — Authenticité
  { id: 'a1', pillar: 'A', pillarLabel: 'Authenticité', text: 'Notre discours sur la marque employeur reflète fidèlement l\'expérience réelle des employés.', weight: 3 },
  { id: 'a2', pillar: 'A', pillarLabel: 'Authenticité', text: 'Les engagements pris lors du recrutement sont tenus dans la réalité du poste.', weight: 3 },
  { id: 'a3', pillar: 'A', pillarLabel: 'Authenticité', text: 'Notre EVP (Employee Value Proposition) est défini formellement et connu des managers.', weight: 2 },
  { id: 'a4', pillar: 'A', pillarLabel: 'Authenticité', text: 'Les avis publiés sur Glassdoor/LinkedIn reflètent notre culture réelle.', weight: 2 },
  { id: 'a5', pillar: 'A', pillarLabel: 'Authenticité', text: 'La direction consacre au moins 80% de ses efforts à tenir ses promesses EVP plutôt qu\'à les définir.', weight: 2 },
  { id: 'a6', pillar: 'A', pillarLabel: 'Authenticité', text: 'Notre message de marque employeur est cohérent sur tous les canaux (site, réseaux, offres d\'emploi).', weight: 2 },
  // T1 — Talent Magnet
  { id: 't1', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Nous attirons régulièrement des profils qualifiés sans avoir recours à des chasseurs de têtes.', weight: 2 },
  { id: 't2', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Notre marque employeur différencie clairement notre offre des concurrents du même secteur.', weight: 3 },
  { id: 't3', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Nous recevons des candidatures spontanées de qualité de manière régulière.', weight: 2 },
  { id: 't4', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Notre délai de recrutement moyen est inférieur à la moyenne du secteur.', weight: 1 },
  { id: 't5', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Les réseaux sociaux professionnels de l\'entreprise sont actifs et engagent notre cible talent.', weight: 2 },
  { id: 't6', pillar: 'T1', pillarLabel: 'Talent Magnet', text: 'Notre carrière-site est moderne, mobile-friendly et reflète notre culture.', weight: 2 },
  // T2 — Turnover DNA
  { id: 't7', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Notre taux de turnover est inférieur à la moyenne sectorielle.', weight: 3 },
  { id: 't8', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Nous réalisons des entretiens de sortie systématiques et analysons les résultats.', weight: 2 },
  { id: 't9', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Les raisons profondes du départ des talents sont comprises et documentées.', weight: 3 },
  { id: 't10', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Des actions concrètes ont été mises en place suite aux résultats d\'entretiens de sortie.', weight: 2 },
  { id: 't11', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Le coût réel du turnover (remplacement, formation, perte de productivité) est calculé.', weight: 2 },
  { id: 't12', pillar: 'T2', pillarLabel: 'Turnover DNA', text: 'Les talents à fort potentiel sont identifiés et bénéficient de plans de rétention personnalisés.', weight: 3 },
  // R — Réputation Digitale
  { id: 'r1', pillar: 'R', pillarLabel: 'Réputation Digitale', text: 'Notre présence sur LinkedIn est soignée, à jour et montre notre culture d\'entreprise.', weight: 2 },
  { id: 'r2', pillar: 'R', pillarLabel: 'Réputation Digitale', text: 'Nos avis Glassdoor ou équivalents sont globalement positifs et font l\'objet de réponses.', weight: 2 },
  { id: 'r3', pillar: 'R', pillarLabel: 'Réputation Digitale', text: 'Notre page carrières est régulièrement mise à jour avec du contenu (témoignages, vidéos).', weight: 2 },
  { id: 'r4', pillar: 'R', pillarLabel: 'Réputation Digitale', text: 'La note moyenne de notre entreprise sur les plateformes d\'avis employeurs est supérieure à 3,5/5.', weight: 3 },
  { id: 'r5', pillar: 'R', pillarLabel: 'Réputation Digitale', text: 'Nos offres d\'emploi sont bien rédigées, attractives et cohérentes avec notre positionnement.', weight: 1 },
  { id: 'r6', pillar: 'R', pillarLabel: 'Réputation Digitale', text: 'Nous mesurons régulièrement notre e-réputation employeur avec des outils dédiés.', weight: 2 },
  // A2 — Ambassadeurs
  { id: 'am1', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Nos employés parlent positivement de l\'entreprise dans leur entourage.', weight: 3 },
  { id: 'am2', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Un programme formel d\'ambassadeurs employés existe et est actif.', weight: 2 },
  { id: 'am3', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Les employés partagent du contenu lié à l\'entreprise sur leurs réseaux personnels.', weight: 2 },
  { id: 'am4', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Notre score NPS employé (recommandation comme employeur) est mesuré régulièrement.', weight: 2 },
  { id: 'am5', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Les managers sont formés et engagés dans la démarche de marque employeur.', weight: 2 },
  { id: 'am6', pillar: 'AM', pillarLabel: 'Ambassadeurs', text: 'Les recrutements par cooptation représentent une part significative de nos embauches.', weight: 2 },
  // C — Culture Fitness
  { id: 'cf1', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Les valeurs d\'entreprise sont vécues au quotidien, pas seulement affichées.', weight: 3 },
  { id: 'cf2', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Les pratiques managériales reflètent les valeurs proclamées.', weight: 3 },
  { id: 'cf3', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Les critères de recrutement incluent explicitement le fit culturel.', weight: 2 },
  { id: 'cf4', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Il existe des rituels et pratiques qui incarnent et renforcent la culture.', weight: 2 },
  { id: 'cf5', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'La culture d\'entreprise est une source de fierté pour les employés.', weight: 2 },
  { id: 'cf6', pillar: 'CF', pillarLabel: 'Culture Fitness', text: 'Les processus d\'onboarding transmettent efficacement la culture aux nouveaux arrivants.', weight: 2 },
  // T3 — Transition (Onboarding/Offboarding)
  { id: 'tr1', pillar: 'TR', pillarLabel: 'Transition', text: 'Notre parcours d\'onboarding dure au moins 3 mois et est structuré.', weight: 2 },
  { id: 'tr2', pillar: 'TR', pillarLabel: 'Transition', text: 'Les nouveaux arrivants atteignent leur pleine productivité dans les délais attendus.', weight: 2 },
  { id: 'tr3', pillar: 'TR', pillarLabel: 'Transition', text: 'Un mentor ou buddy est systématiquement assigné aux nouvelles recrues.', weight: 2 },
  { id: 'tr4', pillar: 'TR', pillarLabel: 'Transition', text: 'Les départs de l\'entreprise sont gérés avec respect et professionnalisme.', weight: 2 },
  { id: 'tr5', pillar: 'TR', pillarLabel: 'Transition', text: 'Les anciens employés (alumni) maintiennent une relation positive avec l\'entreprise.', weight: 2 },
  { id: 'tr6', pillar: 'TR', pillarLabel: 'Transition', text: 'Le taux de rétention à 12 mois des nouvelles recrues est supérieur à 80%.', weight: 3 },
];

const PILLAR_COLORS: Record<string, string> = {
  A: '#EC4899', T1: '#F472B6', T2: '#FB7185', R: '#F9A8D4', AM: '#BE185D', CF: '#9D174D', TR: '#831843',
};

function generateRecommendations(pillarScores: Array<{ pillarId: string; score: number }>, globalScore: number): string[] {
  const recs: string[] = [];
  const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3);
  if (globalScore < 40) recs.push("Urgence : définir et formaliser votre EVP (Employee Value Proposition) avec une session de co-création impliquant direction, RH et représentants terrain.");
  weakest.forEach(ps => {
    if (ps.pillarId === 'A') recs.push("Authenticité : conduire un audit Gap (discours vs vécu) avec des focus groupes anonymes. Le résultat doit guider votre refonte de l'EVP.");
    if (ps.pillarId === 'T1') recs.push("Attraction : refondre votre carrière-site, activer une stratégie de contenu LinkedIn (témoignages, coulisses, projets) et créer un brief recrutement différenciant.");
    if (ps.pillarId === 'T2') recs.push("Rétention : mettre en place des entretiens de rétention proactifs (avant les départs) et calculer le coût réel du turnover pour prioriser les actions.");
    if (ps.pillarId === 'R') recs.push("Réputation digitale : répondre systématiquement aux avis Glassdoor, activer un programme de témoignages employés et auditer votre présence LinkedIn mensuelle.");
    if (ps.pillarId === 'AM') recs.push("Ambassadeurs : lancer un programme Employee Advocacy structuré avec des contenus prêt-à-partager et former vos managers à être les premiers ambassadeurs.");
    if (ps.pillarId === 'CF') recs.push("Culture : créer un Culture Book vivant (pas un PDF figé), institutionnaliser des rituels culturels et intégrer les valeurs dans tous les processus RH.");
    if (ps.pillarId === 'TR') recs.push("Transition : structurer un parcours d'onboarding sur 90 jours (J1+J30+J90) et créer un réseau alumni actif pour maintenir des ambassadeurs post-départ.");
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

  // Turnover cost estimate : effectif × taux turnover moyen (20%) × coût remplacement (6 mois salaire)
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
    persistScore(newResult);
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
        <title>TalentPrint™ — Scoring Marque Employeur | Epitaphe 360</title>
        <meta name="description" content="Mesurez l'attractivité de votre marque employeur avec TalentPrint™ (modèle ATTRACT). Score RH sur 100." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/talentprint" />
        <meta property="og:title" content="TalentPrint™ — Scoring Marque Employeur" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/talentprint" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="TalentPrint™" description="Mesurez l'attractivité de votre marque employeur et votre capacité à retenir les talents." url="/outils/talentprint" priceMad={4900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"TalentPrint™",url:"/outils/talentprint"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
              TalentPrint™ · Modèle ATTRACT™
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your employer brand,<br />
              <span style={{ color: TOOL_COLOR }}>decoded.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Gartner confirme : un EVP convaincant réduit le turnover de 69% et les coûts de recrutement de 50%.<br />
              Mesurez l'écart entre votre promesse et la réalité vécue.
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
                  {s === 'roi' ? 'Contexte' : s === 'form' ? 'Évaluation' : 'Résultats'}
                </span>
                {i < 2 && <div className="w-8 h-px bg-gray-700" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'roi' && (
              <motion.div key="roi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="border border-gray-800 rounded-2xl p-8 space-y-6">
                  <h2 className="text-xl font-bold text-white">Calculez le coût réel de votre turnover</h2>
                  <p className="text-gray-400 text-sm">Remplacer un employé coûte en moyenne 6 mois de son salaire. Combien perdez-vous chaque année ?</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex : Maroc Telecom..." className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" style={{ '--tw-ring-color': TOOL_COLOR } as React.CSSProperties} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Secteur</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
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
                    <p className="text-sm text-gray-400 mb-2">Coût annuel estimé de votre turnover</p>
                    <div className="text-4xl font-bold mb-1" style={{ color: TOOL_COLOR }}>{turnoverCost.toLocaleString('fr-MA')} MAD</div>
                    <p className="text-xs text-gray-500">20% turnover moyen × 6 mois salaire par remplacement</p>
                  </motion.div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Vous répondez en tant que :</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['direction', 'terrain'] as const).map(type => (
                        <button key={type} onClick={() => setRespondentType(type)}
                          className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400'}`}
                          style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                          {type === 'direction' ? '👔 Direction / RH' : '👥 Collaborateur / Manager'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setStep('form')} className="w-full py-4 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: TOOL_COLOR }}>
                    Démarrer l'évaluation ATTRACT™ — 42 questions → 
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="TalentPrint™" toolColor={TOOL_COLOR} questions={questions} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}
            {step === 'gate' && (
              <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmailGate
                  toolName="TalentPrint�"
                  toolColor={TOOL_COLOR}
                  onUnlock={handleUnlock}
                  isLoading={isUnlocking}
                />
              </motion.div>
            )}
            {step === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Votre score TalentPrint™ — {result.companyName}</h2>
                  <p className="text-gray-400 mt-1">Analyse ATTRACT™ · {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <ScoringResults result={result} toolName="TalentPrint™" toolColor={TOOL_COLOR} toolModel="ATTRACT™" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}



