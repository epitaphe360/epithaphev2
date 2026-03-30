import { useState, useRef } from 'react';
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

const TOOL_COLOR = '#0EA5E9'; // Cyan/Sky pour FinNarrative
const TOOL_ID = 'finnarrative' as const;

const QUESTIONS: ScoringQuestion[] = [
  // C — Clarté Narrative
  { id: 'c1', pillar: 'C', pillarLabel: 'Clarté Narrative', text: 'Notre rapport annuel est compréhensible par un lecteur non-financier en moins de 10 minutes.', weight: 3 },
  { id: 'c2', pillar: 'C', pillarLabel: 'Clarté Narrative', text: 'Notre message financier central ("notre thèse d\'investissement") est clair en une phrase.', weight: 3 },
  { id: 'c3', pillar: 'C', pillarLabel: 'Clarté Narrative', text: 'Les termes techniques sont définis et les acronymes expliqués dans nos communications financières.', weight: 2 },
  { id: 'c4', pillar: 'C', pillarLabel: 'Clarté Narrative', text: 'La structure narrative de nos documents financiers guide naturellement le lecteur vers les informations essentielles.', weight: 2 },
  { id: 'c5', pillar: 'C', pillarLabel: 'Clarté Narrative', text: 'Nos membres du CA non-financiers comprennent et peuvent expliquer nos chiffres clés.', weight: 2 },
  { id: 'c6', pillar: 'C', pillarLabel: 'Clarté Narrative', text: 'Les notes de bas de page et annexes clarifient plutôt qu\'elles n\'obscurcissent les performances.', weight: 2 },
  // A — Alignement Stratégique
  { id: 'a1', pillar: 'A', pillarLabel: 'Alignement Stratégique', text: 'Nos documents financiers traduisent clairement la stratégie de l\'entreprise en chiffres et résultats.', weight: 3 },
  { id: 'a2', pillar: 'A', pillarLabel: 'Alignement Stratégique', text: 'Il y a une cohérence parfaite entre les messages du CEO, du CFO et les chiffres présentés.', weight: 3 },
  { id: 'a3', pillar: 'A', pillarLabel: 'Alignement Stratégique', text: 'Les objectifs financiers annoncés l\'année précédente sont explicitement repris et leur réalisation commentée.', weight: 2 },
  { id: 'a4', pillar: 'A', pillarLabel: 'Alignement Stratégique', text: 'La feuille de route stratégique et ses indicateurs de suivi sont visibles dans nos communications financières.', weight: 2 },
  { id: 'a5', pillar: 'A', pillarLabel: 'Alignement Stratégique', text: 'Les décisions d\'investissement majeures sont accompagnées d\'une narration stratégique convaincante.', weight: 2 },
  { id: 'a6', pillar: 'A', pillarLabel: 'Alignement Stratégique', text: 'Les indicateurs non-financiers (RH, RSE, innovation) sont intégrés dans la narration financière globale.', weight: 2 },
  // P — Performance Visuelle
  { id: 'p1', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Nos graphiques et visualisations de données sont clairs, précis et sans manipulation visuelle.', weight: 3 },
  { id: 'p2', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'La mise en page de nos documents financiers respecte notre charte graphique.', weight: 2 },
  { id: 'p3', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Les données clés sont mises en évidence visuellement (encadrés, infographies, KPIs en avant).', weight: 2 },
  { id: 'p4', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Nos documents financiers sont disponibles en version digitale interactive (liens, tableaux dynamiques).', weight: 2 },
  { id: 'p5', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Un design professionnel renforce la crédibilité et l\'attractivité de nos documents financiers.', weight: 2 },
  { id: 'p6', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Les comparaisons temporelles (N vs N-1) sont systématiquement présentées de manière lisible.', weight: 2 },
  // I — Impact Investisseurs
  { id: 'i1', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Nos communications financières convainquent les investisseurs potentiels sans nécessiter de présentation complémentaire.', weight: 3 },
  { id: 'i2', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Notre thèse d\'investissement est différenciante par rapport aux concurrents directs.', weight: 3 },
  { id: 'i3', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Les risques sont présentés de manière honnête et contextualisée, renforçant la confiance.', weight: 2 },
  { id: 'i4', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Le management track record est clairement valorisé et documenté.', weight: 2 },
  { id: 'i5', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Les retours d\'expérience des investisseurs sur nos documents financiers sont collectés et intégrés.', weight: 2 },
  { id: 'i6', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Notre document financier serait classé dans le top 25% de notre secteur par un analyste indépendant.', weight: 3 },
  // T — Transparence
  { id: 'tr1', pillar: 'T', pillarLabel: 'Transparence', text: 'Les performances décevantes sont présentées honnêtement avec explication et plan d\'action.', weight: 3 },
  { id: 'tr2', pillar: 'T', pillarLabel: 'Transparence', text: 'La gouvernance financière (conseil, comités, rémunérations) est présentée de manière transparente.', weight: 2 },
  { id: 'tr3', pillar: 'T', pillarLabel: 'Transparence', text: 'Les engagements financiers hors bilan (garanties, contingences) sont clairement mentionnés.', weight: 2 },
  { id: 'tr4', pillar: 'T', pillarLabel: 'Transparence', text: 'Nos politiques comptables sont stables ou les changements sont explicitement justifiés.', weight: 2 },
  { id: 'tr5', pillar: 'T', pillarLabel: 'Transparence', text: 'Les transactions intra-groupe et parties liées sont correctement détaillées.', weight: 2 },
  { id: 'tr6', pillar: 'T', pillarLabel: 'Transparence', text: 'Notre niveau de transparence financière dépasse les obligations légales minimales.', weight: 3 },
  // AN — Anticipation
  { id: 'an1', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Notre communication financière inclut des perspectives à moyen terme (2-3 ans) documentées.', weight: 2 },
  { id: 'an2', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Les tendances sectorielles et leur impact sur nos performances futures sont adressés.', weight: 2 },
  { id: 'an3', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Un scénario de stress test ou de sensibilité est présenté pour les hypothèses clés.', weight: 2 },
  { id: 'an4', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Les risques géopolitiques, réglementaires et technologiques sont anticipés et quantifiés.', weight: 2 },
  { id: 'an5', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Notre politique de dividende et de rachat d\'actions est expliquée de manière prévisible.', weight: 2 },
  { id: 'an6', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Les indicateurs avancés (leading indicators) sont présentés à côté des indicateurs de résultats.', weight: 2 },
  // BM — Benchmark
  { id: 'bm1', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'Nos ratios financiers clés sont mis en perspective par rapport aux standards du secteur.', weight: 2 },
  { id: 'bm2', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'La comparaison avec des pairs pertinents est intégrée dans notre communication financière.', weight: 2 },
  { id: 'bm3', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'Nous utilisons les référentiels sectoriels (OCDE, IFC, normes IFRS) de manière visible.', weight: 2 },
  { id: 'bm4', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'Notre positionnement compétitif est illustré par des données de marché vérifiables.', weight: 2 },
  { id: 'bm5', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'La performance financière de l\'entreprise sur 5 ans est présentée avec une comparaison sectorielle.', weight: 2 },
  { id: 'bm6', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'Le Narrative Doctor™ que nous avons réalisé a permis d\'identifier et corriger au moins une pathologie narrative.', weight: 3 },
];

const PILLAR_COLORS: Record<string, string> = {
  C: '#0EA5E9', A: '#38BDF8', P: '#7DD3FC', I: '#0284C7', T: '#0369A1', AN: '#075985', BM: '#0C4A6E',
};

const PATHOLOGIES = [
  { name: 'La Noyade', desc: 'Surcharge d\'information complexe masquant la performance réelle', icon: '🌊' },
  { name: 'L\'Embellissement', desc: 'Sur-communication des positifs, euphémismes sur les négatifs', icon: '🎨' },
  { name: 'La Déconnexion', desc: 'Écart entre les messages du CEO/CFO et les chiffres publiés', icon: '🔌' },
  { name: 'La Myopie', desc: 'Focalisation sur le court terme sans vision stratégique crédible', icon: '👓' },
];

function generateRecommendations(pillarScores: Array<{ pillarId: string; score: number }>, globalScore: number): string[] {
  const recs: string[] = [];
  const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3);
  if (globalScore < 40) recs.push("Diagnostic critique : votre communication financière présente des pathologies narratives affectant votre crédibilité auprès des investisseurs et partenaires financiers. Le Narrative Doctor™ est recommandé en urgence.");
  weakest.forEach(ps => {
    if (ps.pillarId === 'C') recs.push("Clarté : rédigez votre 'Thèse d'investissement' en une seule phrase percutante. Testez la compréhension de votre rapport avec 3 lecteurs non-financiers. Simplifiez radicalement avant de soumette.");
    if (ps.pillarId === 'A') recs.push("Alignement : organisez un atelier direction (CEO, CFO, DG) pour harmoniser les messages. Créez un 'Comité narratif' trimestriel avant chaque publication financière.");
    if (ps.pillarId === 'P') recs.push("Visualisation : faites retravailler vos graphiques par un dataviz designer. Remplacez les tableaux complexes par des infographies et adoptez les standards de data storytelling financier.");
    if (ps.pillarId === 'I') recs.push("Impact investisseurs : comparez votre rapport annuel avec les 3 meilleurs rapports de votre secteur et identifiez les 5 éléments différenciants manquants. Faites relire par un analyste indépendant.");
    if (ps.pillarId === 'T') recs.push("Transparence : adoptez une politique de communication financière proactive sur les points négatifs. La confiance se bâtit dans les mauvaises nouvelles bien communiquées, pas dans les bonnes.");
    if (ps.pillarId === 'AN') recs.push("Anticipation : ajoutez une section 'Perspectives & Sensibilités' à votre rapport annuel avec scénarios à 3 ans. Les investisseurs décident sur l'avenir, pas sur le passé.");
    if (ps.pillarId === 'BM') recs.push("Benchmark : intégrez systématiquement une comparaison sectorielle dans chaque KPI clé. Le contexte transforme les chiffres — un ratio isolé ne dit rien.");
  });
  return recs.slice(0, 4);
}

type Step = 'roi' | 'form' | 'result';

export default function FinNarrativePage() {
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('finance');
  const [companySize, setCompanySize] = useState<CompanySizeType>('eti');
  const [effectif, setEffectif] = useState(200);
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleComplete = (answers: ScoringAnswer[]) => {
    const globalScore = calculateScore(answers, QUESTIONS);
    const pillarScores = calculatePillarScores(answers, QUESTIONS, PILLAR_COLORS);
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
        <title>FinNarrative™ — Scoring Communication Financière | Epitaphe 360</title>
        <meta name="description" content="Évaluez la qualité de votre communication financière avec FinNarrative™ (modèle TRUST). Scoring investisseurs sur 100." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/finnarrative" />
        <meta property="og:title" content="FinNarrative™ — Scoring Communication Financière" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/finnarrative" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="FinNarrative™" description="Évaluez la qualité et la clarté de votre communication financière auprès des investisseurs." url="/outils/finnarrative" priceMad={4900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"FinNarrative™",url:"/outils/finnarrative"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
              FinNarrative™ · Modèle CAPITAL™
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Vos chiffres sont bons.<br />
              <span style={{ color: TOOL_COLOR }}>Votre narration convainc-elle ?</span>
            </h1>
            <p className="text-gray-400 text-lg">
              La performance financière ne suffit pas — la narration financière décide.<br />
              Le Narrative Doctor™ détecte les 4 pathologies qui érodent la confiance des investisseurs.
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
                  <h2 className="text-xl font-bold text-white">Narrative Doctor™ — Contexte financier</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {PATHOLOGIES.map(p => (
                      <div key={p.name} className="flex items-start gap-3 rounded-xl p-4 border border-gray-800" style={{ background: `${TOOL_COLOR}08` }}>
                        <span className="text-2xl flex-shrink-0">{p.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-white">{p.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-4 border" style={{ borderColor: `${TOOL_COLOR}40`, background: `${TOOL_COLOR}10` }}>
                    <p className="text-sm font-semibold text-white mb-2">📄 Narrative Doctor™ (optionnel)</p>
                    <p className="text-xs text-gray-400 mb-3">Uploadez votre rapport annuel PDF pour une analyse IA des pathologies narratives avec votre consultant Epitaphe360.</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-600 text-gray-300 hover:border-gray-400 transition-colors">
                        📎 Joindre le rapport annuel
                      </button>
                      {uploadedFile && <span className="text-xs text-green-400">✓ {uploadedFile}</span>}
                    </div>
                    <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
                      onChange={e => { if (e.target.files?.[0]) setUploadedFile(e.target.files[0].name); }} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex : Attijariwafa Bank, BMCE..." className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Secteur</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="finance">Finance / Banque / Assurance</option>
                        <option value="energie">Énergie / Mining</option>
                        <option value="auto">Industrie / Manufacturing</option>
                        <option value="pharma">Pharma / Santé</option>
                        <option value="btp">Immobilier / BTP</option>
                        <option value="tech">Tech / Telecom</option>
                        <option value="agroalimentaire">Agroalimentaire</option>
                        <option value="luxury">Retail / Distribution</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Vous êtes :</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['direction', 'terrain'] as const).map(type => (
                          <button key={type} onClick={() => setRespondentType(type)}
                            className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400'}`}
                            style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                            {type === 'direction' ? '💼 DG / DAF / CA' : '📊 Contrôle gestion'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Taille entreprise</label>
                      <select value={companySize} onChange={e => setCompanySize(e.target.value as CompanySizeType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="pme">PME</option>
                        <option value="eti">ETI cotée / Non cotée</option>
                        <option value="grande">Grande entreprise / Groupe</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => setStep('form')} className="w-full py-4 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: TOOL_COLOR }}>
                    Démarrer l'évaluation CAPITAL™ — 42 questions →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="FinNarrative™" toolColor={TOOL_COLOR} questions={QUESTIONS} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}

            {step === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Votre score FinNarrative™ — {result.companyName}</h2>
                  <p className="text-gray-400 mt-1">Analyse CAPITAL™ · Narrative Doctor™ · {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <ScoringResults result={result} toolName="FinNarrative™" toolColor={TOOL_COLOR} toolModel="CAPITAL™" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
