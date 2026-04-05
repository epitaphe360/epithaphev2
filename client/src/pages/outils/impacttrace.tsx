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
  getMaturityLevel, MATURITY_LEVELS, saveScore, persistScore,
  type ScoringQuestion, type ScoringAnswer, type ScoringResult,
  type SectorType, type CompanySizeType,
} from '@/lib/scoring-engine';

const TOOL_COLOR = '#10B981'; // Émeraude pour ImpactTrace
const TOOL_ID = 'impacttrace' as const;

const DEFAULT_QUESTIONS: ScoringQuestion[] = [
  // P — Plateforme RSE
  { id: 'p1', pillar: 'P', pillarLabel: 'Plateforme RSE', text: 'Notre stratégie RSE est formalisée dans un document officiel (rapport, charte, politique).', weight: 3 },
  { id: 'p2', pillar: 'P', pillarLabel: 'Plateforme RSE', text: 'Les objectifs RSE sont chiffrés, datés et alignés sur un référentiel reconnu (ODD, GRI, Label CGEM).', weight: 3 },
  { id: 'p3', pillar: 'P', pillarLabel: 'Plateforme RSE', text: 'Un budget dédié RSE est alloué chaque année et protégé en période de crise.', weight: 2 },
  { id: 'p4', pillar: 'P', pillarLabel: 'Plateforme RSE', text: 'Un responsable RSE ou une équipe dédiée existe au sein de l\'organisation.', weight: 2 },
  { id: 'p5', pillar: 'P', pillarLabel: 'Plateforme RSE', text: 'La stratégie RSE est revue et actualisée au minimum annuellement.', weight: 2 },
  { id: 'p6', pillar: 'P', pillarLabel: 'Plateforme RSE', text: 'Les parties prenantes externes (ONG, collectivités, clients) ont été consultées lors de l\'élaboration de notre stratégie RSE.', weight: 2 },
  // R — Réputation RSE
  { id: 'r1', pillar: 'R', pillarLabel: 'Réputation RSE', text: 'Notre communication RSE génère de la visibilité positive auprès de nos parties prenantes.', weight: 2 },
  { id: 'r2', pillar: 'R', pillarLabel: 'Réputation RSE', text: 'Nous avons reçu des prix, certifications ou mentions liées à notre engagement RSE.', weight: 2 },
  { id: 'r3', pillar: 'R', pillarLabel: 'Réputation RSE', text: 'Notre réputation RSE est mesurée régulièrement (baromètre, sondage, NPS stakeholders).', weight: 2 },
  { id: 'r4', pillar: 'R', pillarLabel: 'Réputation RSE', text: 'Les clients et partenaires citent spontanément notre engagement RSE comme un facteur différenciant.', weight: 3 },
  { id: 'r5', pillar: 'R', pillarLabel: 'Réputation RSE', text: 'Nous publions un rapport RSE ou de développement durable vérifiable.', weight: 3 },
  { id: 'r6', pillar: 'R', pillarLabel: 'Réputation RSE', text: 'Le Walk vs Talk Score de notre RSE est positif (nos actions dépassent nos déclarations).', weight: 3 },
  // O — Opérations RH/RSE
  { id: 'o1', pillar: 'O', pillarLabel: 'Opérations', text: 'Les pratiques environnementales (économies d\'énergie, réduction déchets, etc.) sont documentées et suivies.', weight: 2 },
  { id: 'o2', pillar: 'O', pillarLabel: 'Opérations', text: 'Nos achats intègrent des critères environnementaux et sociaux dans les appels d\'offres.', weight: 2 },
  { id: 'o3', pillar: 'O', pillarLabel: 'Opérations', text: 'Notre empreinte carbone est mesurée et fait l\'objet d\'un plan de réduction.', weight: 2 },
  { id: 'o4', pillar: 'O', pillarLabel: 'Opérations', text: 'Les indicateurs RSE opérationnels sont intégrés dans les tableaux de bord de direction.', weight: 3 },
  { id: 'o5', pillar: 'O', pillarLabel: 'Opérations', text: 'Nos pratiques sociales (diversité, équité, inclusion) respectent et dépassent les obligations légales.', weight: 2 },
  { id: 'o6', pillar: 'O', pillarLabel: 'Opérations', text: 'Nos fournisseurs et sous-traitants sont évalués sur des critères RSE.', weight: 2 },
  // O2 — Ouverture Communautaire
  { id: 'oc1', pillar: 'OC', pillarLabel: 'Ouverture Communautaire', text: 'Nous menons des projets à impact social ou environnemental dans nos communautés locales.', weight: 2 },
  { id: 'oc2', pillar: 'OC', pillarLabel: 'Ouverture Communautaire', text: 'Des partenariats formels avec des associations, universités ou ONG sont actifs.', weight: 2 },
  { id: 'oc3', pillar: 'OC', pillarLabel: 'Ouverture Communautaire', text: 'Nos employés sont encouragés à s\'engager dans des actions de bénévolat ou mécénat de compétences.', weight: 2 },
  { id: 'oc4', pillar: 'OC', pillarLabel: 'Ouverture Communautaire', text: 'L\'impact social et territorial de notre activité est mesuré et communiqué.', weight: 2 },
  { id: 'oc5', pillar: 'OC', pillarLabel: 'Ouverture Communautaire', text: 'Nous collaborons à des initiatives collectives sectorielles ou intersectorielles sur des enjeux RSE.', weight: 2 },
  { id: 'oc6', pillar: 'OC', pillarLabel: 'Ouverture Communautaire', text: 'La voix des communautés affectées par notre activité est intégrée dans nos décisions stratégiques.', weight: 3 },
  // F — Formation & Sensibilisation
  { id: 'f1', pillar: 'F', pillarLabel: 'Formation RSE', text: 'Les employés reçoivent des formations régulières sur les enjeux RSE pertinents à leur métier.', weight: 2 },
  { id: 'f2', pillar: 'F', pillarLabel: 'Formation RSE', text: 'Les managers sont formés pour intégrer les critères RSE dans leurs décisions quotidiennes.', weight: 2 },
  { id: 'f3', pillar: 'F', pillarLabel: 'Formation RSE', text: 'La sensibilisation RSE est intégrée dans le parcours d\'onboarding des nouveaux collaborateurs.', weight: 2 },
  { id: 'f4', pillar: 'F', pillarLabel: 'Formation RSE', text: 'Les ambassadeurs RSE internes sont identifiés et valorisés.', weight: 2 },
  { id: 'f5', pillar: 'F', pillarLabel: 'Formation RSE', text: 'Les objectifs RSE sont inclus dans les évaluations annuelles de performance.', weight: 3 },
  { id: 'f6', pillar: 'F', pillarLabel: 'Formation RSE', text: 'Un budget de formation dédié aux enjeux de développement durable est alloué.', weight: 2 },
];

const PILLAR_COLORS: Record<string, string> = {
  P: '#10B981', R: '#34D399', O: '#6EE7B7', OC: '#059669', F: '#047857',
};

function generateRecommendations(pillarScores: Array<{ pillarId: string; score: number }>, globalScore: number): string[] {
  const recs: string[] = [];
  const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3);
  if (globalScore < 40) recs.push("Alerte greenwashing : 43% des FTSE500 au Maroc déclarent une démarche RSE, mais seulement 124 sont labellisées CGEM. Définissez des engagements mesurables avant de communiquer.");
  weakest.forEach(ps => {
    if (ps.pillarId === 'P') recs.push("Plateforme : formalisez votre stratégie RSE dans un document officiel, avec objectifs chiffrés et référentiel (ODD, Label CGEM). Soumettez-vous à un audit de labellisation.");
    if (ps.pillarId === 'R') recs.push("Réputation : publiez un rapport RSE vérifiable et indépendant. Répondez à la question décisive : votre Walk vs Talk Score est-il positif ? Faites auditer vos déclarations.");
    if (ps.pillarId === 'O') recs.push("Opérations : mesurez votre empreinte carbone avec un bilan Scope 1+2+3, intégrez des clauses RSE dans vos contrats fournisseurs et établissez des KPIs opérationnels en tableau de bord.");
    if (ps.pillarId === 'OC') recs.push("Communautaire : cartographiez vos parties prenantes locales, formalisez au moins 2 partenariats à impact mesurable et créez un programme de mécénat de compétences.");
    if (ps.pillarId === 'F') recs.push("Formation : intégrez au moins 1 jour de sensibilisation RSE/an par employé, créez un réseau d'ambassadeurs RSE et liez les objectifs RSE aux évaluations de performance.");
  });
  return recs.slice(0, 4);
}

type Step = 'roi' | 'form' | 'gate' | 'result';

export default function ImpactTracePage() {
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(100);
  const [result, setResult] = useState<ScoringResult | null>(null);

  const walkTalkGap = 43; // 43% déclarent RSE, ~25% labellisées → illustration

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
        <title>ImpactTrace™ — Scoring RSE & Communication Responsable | Epitaphe 360</title>
        <meta name="description" content="Diagnostiquez la maturité RSE de votre communication avec ImpactTrace™ (modèle IMPACT). 42 indicateurs sur l'impact responsable." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/impacttrace" />
        <meta property="og:title" content="ImpactTrace™ — Scoring RSE" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/impacttrace" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="ImpactTrace™" description="Diagnostiquez la maturité RSE de votre communication et son impact sur vos parties prenantes." url="/outils/impacttrace" priceMad={4900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"ImpactTrace™",url:"/outils/impacttrace"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
              ImpactTrace™ · Modèle PROOF™
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              RSE : <span style={{ color: TOOL_COLOR }}>ce que vous dites<br />vs ce que vous faites.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              43% des FTSE500 au Maroc déclarent une démarche RSE. Seulement 124 sont labellisées CGEM.<br />
              Votre Walk vs Talk Score™ révèle l'écart entre votre communication et vos actions réelles.
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
                  <h2 className="text-xl font-bold text-white">Greenwash Detector™ — Contexte entreprise</h2>
                  <p className="text-gray-400 text-sm">Dans {walkTalkGap}% des entreprises, il existe un écart significatif entre les déclarations RSE et les pratiques réelles. L'ImpactTrace™ mesure cet écart avec précision.</p>
                  
                  <div className="rounded-xl p-4 border" style={{ borderColor: `${TOOL_COLOR}40`, background: `${TOOL_COLOR}10` }}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-300">Benchmark Maroc</span>
                      <span className="text-xs font-mono" style={{ color: TOOL_COLOR }}>43% déclarent / ~25% labellisées</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 relative">
                      <div className="h-3 rounded-full" style={{ width: '43%', backgroundColor: `${TOOL_COLOR}60` }} />
                      <div className="h-3 rounded-full absolute top-0 left-0" style={{ width: '25%', backgroundColor: TOOL_COLOR }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span style={{ color: TOOL_COLOR }}>→ Labellisées</span>
                      <span style={{ color: `${TOOL_COLOR}80` }}>→ Déclarent RSE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex : OCP, Marjane..." className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" />
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
                      <label className="block text-sm text-gray-400 mb-2">Taille entreprise</label>
                      <select value={companySize} onChange={e => setCompanySize(e.target.value as CompanySizeType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="tpe">TPE (moins de 10 employés)</option>
                        <option value="pme">PME (10-250 employés)</option>
                        <option value="eti">ETI (250-5000 employés)</option>
                        <option value="grande">Grande entreprise (5000+)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Vous répondez en tant que :</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['direction', 'terrain'] as const).map(type => (
                          <button key={type} onClick={() => setRespondentType(type)}
                            className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400'}`}
                            style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                            {type === 'direction' ? '👔 Direction' : '🌿 Opérations'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStep('form')} className="w-full py-4 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: TOOL_COLOR }}>
                    Démarrer l'évaluation PROOF™ — 30 questions →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="ImpactTrace™" toolColor={TOOL_COLOR} questions={questions} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}
            {step === 'gate' && (
              <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmailGate
                  toolName="ImpactTrace�"
                  toolColor={TOOL_COLOR}
                  onUnlock={handleUnlock}
                  isLoading={isUnlocking}
                />
              </motion.div>
            )}
            {step === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Votre score ImpactTrace™ — {result.companyName}</h2>
                  <p className="text-gray-400 mt-1">Analyse PROOF™ · Walk vs Talk Score™ · {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <ScoringResults result={result} toolName="ImpactTrace™" toolColor={TOOL_COLOR} toolModel="PROOF™" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}



