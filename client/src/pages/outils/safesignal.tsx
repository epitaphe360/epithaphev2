import { useState } from 'react';
import { useToolQuestions } from '@/hooks/useToolQuestions';
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

const TOOL_COLOR = '#F97316'; // Orange pour SafeSignal
const TOOL_ID = 'safesignal' as const;

const DEFAULT_QUESTIONS: ScoringQuestion[] = [
  // S — Signaux Faibles
  { id: 's1', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Nous disposons d\'un système formalisé pour recueillir et analyser les signaux faibles de sécurité (near misses, observations).', weight: 3 },
  { id: 's2', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Les employés signalent les situations à risque sans crainte de représailles.', weight: 3 },
  { id: 's3', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Les incidents sans blessure sont traités avec autant de sérieux que les accidents.', weight: 3 },
  { id: 's4', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Notre taux de déclaration des presqu\'accidents est élevé et progresse d\'année en année.', weight: 2 },
  { id: 's5', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'L\'analyse des causes racines est systématiquement réalisée pour tous les signaux faibles.', weight: 2 },
  { id: 's6', pillar: 'S', pillarLabel: 'Signaux Faibles', text: 'Les remontées terrain sont traitées dans un délai maximum de 5 jours ouvrés et un retour est communiqué.', weight: 2 },
  // H — Hiérarchie Sécurité
  { id: 'h1', pillar: 'H', pillarLabel: 'Hiérarchie Sécurité', text: 'La direction générale participe visiblement et régulièrement aux actions de sécurité (SafeWalks, réunions SST).', weight: 3 },
  { id: 'h2', pillar: 'H', pillarLabel: 'Hiérarchie Sécurité', text: 'Les managers de proximité ont été formés à l\'animation de la sécurité et le font réellement.', weight: 3 },
  { id: 'h3', pillar: 'H', pillarLabel: 'Hiérarchie Sécurité', text: 'Les objectifs sécurité font partie des critères d\'évaluation annuelle des managers.', weight: 2 },
  { id: 'h4', pillar: 'H', pillarLabel: 'Hiérarchie Sécurité', text: 'Il existe une politique de tolérance zéro pour les violations délibérées des règles de sécurité, appliquée à tous niveaux.', weight: 2 },
  { id: 'h5', pillar: 'H', pillarLabel: 'Hiérarchie Sécurité', text: 'Les décisions d\'investissement tiennent compte des impératifs de sécurité avant les impératifs économiques.', weight: 2 },
  { id: 'h6', pillar: 'H', pillarLabel: 'Hiérarchie Sécurité', text: 'La communication sur la sécurité vient de tous les niveaux hiérarchiques, pas seulement du service HSE.', weight: 2 },
  // I — Impact Terrain
  { id: 'i1', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Notre Safety Perception Gap™ est mesuré : l\'écart entre la perception managers et opérateurs terrain est connu.', weight: 3 },
  { id: 'i2', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Les conditions réelles de travail sont conformes aux procédures écrites (vérifiées par terrain vs documents).', weight: 3 },
  { id: 'i3', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Le port des EPI est systématique et fait l\'objet de contrôles réguliers et documentés.', weight: 2 },
  { id: 'i4', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Les risques psychosociaux (stress, harcèlement, surcharge) sont évalués et traités.', weight: 2 },
  { id: 'i5', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Notre taux de fréquence des accidents TF1 est en dessous de la moyenne sectorielle.', weight: 2 },
  { id: 'i6', pillar: 'I', pillarLabel: 'Impact Terrain', text: 'Les postes à risque bénéficient d\'une évaluation ergonomique et de mesures d\'amélioration.', weight: 2 },
  // E — Engagement Total
  { id: 'e1', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Les employés s\'engagent volontairement dans des initiatives sécurité au-delà de leurs obligations.', weight: 3 },
  { id: 'e2', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Le CHST/CSE est actif, répond à ses missions et ses recommandations sont suivies d\'effet.', weight: 2 },
  { id: 'e3', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Des groupes de travail pluridisciplinaires incluant des opérateurs terrain traitent des problèmes de sécurité.', weight: 2 },
  { id: 'e4', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Les comportements sécurisés sont valorisés et récompensés concrètement.', weight: 2 },
  { id: 'e5', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Lors des arrêts pour raison de sécurité, l\'employé est soutenu et protégé, jamais pénalisé.', weight: 3 },
  { id: 'e6', pillar: 'E', pillarLabel: 'Engagement Total', text: 'Le taux de participation aux formations sécurité volontaires est supérieur à 80%.', weight: 2 },
  // L — Learning Culture
  { id: 'l1', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Chaque accident ou presqu\'accident donne lieu à une analyse partagée et à des enseignements diffusés.', weight: 3 },
  { id: 'l2', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Nous apprenons régulièrement des incidents des autres entreprises de notre secteur.', weight: 2 },
  { id: 'l3', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Les procédures de sécurité sont régulièrement revues et améliorées en tenant compte des retours terrain.', weight: 2 },
  { id: 'l4', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Il existe des exercices d\'urgence réguliers, correctement évalués et améliorés en conséquence.', weight: 2 },
  { id: 'l5', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Notre organisation est capable de détecter et de corriger ses propres erreurs systémiques.', weight: 2 },
  { id: 'l6', pillar: 'L', pillarLabel: 'Learning Culture', text: 'Les formations sécurité sont basées sur des situations réelles vécues dans notre entreprise.', weight: 2 },
  // D — Dispositifs Physiques
  { id: 'd1', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'La signalétique de sécurité (sortie secours, risques, interdictions) est visible, à jour et en bon état.', weight: 2 },
  { id: 'd2', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'Les EPI (EPC, extincteurs, kits de premiers secours) sont disponibles, accessibles et vérifiés régulièrement.', weight: 2 },
  { id: 'd3', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'L\'aménagement des postes de travail réduit au maximum les risques ergonomiques et d\'accidents.', weight: 2 },
  { id: 'd4', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'Les équipements et machines font l\'objet de maintenances préventives documentées et respectées.', weight: 2 },
  { id: 'd5', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'Les plans d\'évacuation et les procédures d\'urgence sont affichés et connus des employés.', weight: 2 },
  { id: 'd6', pillar: 'D', pillarLabel: 'Dispositifs Physiques', text: 'Notre document unique d\'évaluation des risques (DUER) est à jour et accessible.', weight: 3 },
];

const PILLAR_COLORS: Record<string, string> = {
  S: '#F97316', H: '#FB923C', I: '#FDBA74', E: '#EA580C', L: '#C2410C', D: '#9A3412',
};

function generateRecommendations(pillarScores: Array<{ pillarId: string; score: number }>, globalScore: number): string[] {
  const recs: string[] = [];
  const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3);
  if (globalScore < 40) recs.push("Alerte : 80-90% des blessures au travail ont des causes humaines et organisationnelles. Votre score révèle une culture sécurité fragile — priorisez immédiatement la mise en conformité réglementaire.");
  weakest.forEach(ps => {
    if (ps.pillarId === 'S') recs.push("Signaux faibles : déployez un système de remontée d'observations anonymes (boîte à idées sécurité, app mobile) et formez les managers à traiter chaque signal sous 48h.");
    if (ps.pillarId === 'H') recs.push("Leadership sécurité : planifiez des SafeWalks mensuels pour la direction + briefings hebdomadaires pour les managers de proximité. Intégrez les KPIs sécurité dans les revues de performance.");
    if (ps.pillarId === 'I') recs.push("Impact terrain : réalisez une enquête Safety Perception Gap™ (direction vs opérateurs) pour mesurer l'écart et identifier les zones de déni. Planifiez des visites terrain croisées.");
    if (ps.pillarId === 'E') recs.push("Engagement : créez des groupes de vigilance volontaires, valorisez les comportements sécurisés et institutionnalisez le droit de retrait sans crainte de sanction.");
    if (ps.pillarId === 'L') recs.push("Apprentissage : systématisez les retours d'expérience (REX) post-incident, partagez les enseignements sur intranet et créez une bibliothèque d'incidents analysés.");
    if (ps.pillarId === 'D') recs.push("Dispositifs : planifiez un SafeWalk™ physique sur 12 zones prioritaires, mettez à jour le DUER et établissez un plan de maintenance préventive documenté.");
  });
  return recs.slice(0, 4);
}

type Step = 'roi' | 'form' | 'result';

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
    setStep('result');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Helmet>
        <title>SafeSignal™ — Scoring Communication QHSE | Epitaphe 360</title>
        <meta name="description" content="Évaluez l'efficacité de votre communication sécurité avec SafeSignal™ (modèle SECURE). Culture QHSE au Maroc." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/safesignal" />
        <meta property="og:title" content="SafeSignal™ — Scoring Communication QHSE" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/safesignal" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="SafeSignal™" description="Évaluez l'efficacité de votre communication sécurité et votre culture QHSE." url="/outils/safesignal" priceMad={4900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"SafeSignal™",url:"/outils/safesignal"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
              SafeSignal™ · Modèle SHIELD™
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              La sécurité que vous<br />
              <span style={{ color: TOOL_COLOR }}>croyez avoir vs celle qui existe.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              80-90% des accidents du travail ont des causes organisationnelles et humaines.<br />
              Le Safety Perception Gap™ mesure l'écart entre la perception des managers et la réalité terrain.
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
                  <h2 className="text-xl font-bold text-white">Safety Perception Gap™ — Qui répond ?</h2>
                  <p className="text-gray-400 text-sm">La puissance de SafeSignal™ réside dans la comparaison entre la réponse Direction/HSE et la réponse Opérateurs terrain. Remplissez les deux pour révéler l'écart réel.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex : LafargeHolcim Maroc..." className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Secteur</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="energie">Énergie / Mining / Industrie</option>
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
                    <label className="block text-sm text-gray-400 mb-3">Perspective de réponse :</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['direction', 'terrain'] as const).map(type => (
                        <button key={type} onClick={() => setRespondentType(type)}
                          className={`px-4 py-4 rounded-xl border text-left transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400'}`}
                          style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                          <div className="font-semibold text-sm">{type === 'direction' ? '🎯 Direction / HSE' : '🦺 Opérateur Terrain'}</div>
                          <div className={`text-xs mt-1 ${respondentType === type ? 'text-black/70' : 'text-gray-600'}`}>
                            {type === 'direction' ? 'Votre vision de la culture sécurité' : 'La réalité vécue au quotidien'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl p-4 border" style={{ borderColor: `${TOOL_COLOR}40`, background: `${TOOL_COLOR}10` }}>
                    <p className="text-xs text-gray-400">💡 <strong className="text-white">SafeWalk™ intégré :</strong> après votre diagnostic, vous recevrez un brief pour réaliser un audit physique sur 12 zones critiques avec votre équipe terrain.</p>
                  </div>
                  <button onClick={() => setStep('form')} className="w-full py-4 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: TOOL_COLOR }}>
                    Démarrer l'évaluation SHIELD™ — 36 questions →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="SafeSignal™" toolColor={TOOL_COLOR} questions={questions} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}

            {step === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Votre score SafeSignal™ — {result.companyName}</h2>
                  <p className="text-gray-400 mt-1">Analyse SHIELD™ · Safety Perception Gap™ · {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <ScoringResults result={result} toolName="SafeSignal™" toolColor={TOOL_COLOR} toolModel="SHIELD™" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
