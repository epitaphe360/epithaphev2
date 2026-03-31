import { useState, useRef } from 'react';
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

const TOOL_COLOR = '#0EA5E9'; // Cyan/Sky pour FinNarrative
const TOOL_ID = 'finnarrative' as const;

const DEFAULT_QUESTIONS: ScoringQuestion[] = [
  // C â€” ClartÃ© Narrative
  { id: 'c1', pillar: 'C', pillarLabel: 'ClartÃ© Narrative', text: 'Notre rapport annuel est comprÃ©hensible par un lecteur non-financier en moins de 10 minutes.', weight: 3 },
  { id: 'c2', pillar: 'C', pillarLabel: 'ClartÃ© Narrative', text: 'Notre message financier central ("notre thÃ¨se d\'investissement") est clair en une phrase.', weight: 3 },
  { id: 'c3', pillar: 'C', pillarLabel: 'ClartÃ© Narrative', text: 'Les termes techniques sont dÃ©finis et les acronymes expliquÃ©s dans nos communications financiÃ¨res.', weight: 2 },
  { id: 'c4', pillar: 'C', pillarLabel: 'ClartÃ© Narrative', text: 'La structure narrative de nos documents financiers guide naturellement le lecteur vers les informations essentielles.', weight: 2 },
  { id: 'c5', pillar: 'C', pillarLabel: 'ClartÃ© Narrative', text: 'Nos membres du CA non-financiers comprennent et peuvent expliquer nos chiffres clÃ©s.', weight: 2 },
  { id: 'c6', pillar: 'C', pillarLabel: 'ClartÃ© Narrative', text: 'Les notes de bas de page et annexes clarifient plutÃ´t qu\'elles n\'obscurcissent les performances.', weight: 2 },
  // A â€” Alignement StratÃ©gique
  { id: 'a1', pillar: 'A', pillarLabel: 'Alignement StratÃ©gique', text: 'Nos documents financiers traduisent clairement la stratÃ©gie de l\'entreprise en chiffres et rÃ©sultats.', weight: 3 },
  { id: 'a2', pillar: 'A', pillarLabel: 'Alignement StratÃ©gique', text: 'Il y a une cohÃ©rence parfaite entre les messages du CEO, du CFO et les chiffres prÃ©sentÃ©s.', weight: 3 },
  { id: 'a3', pillar: 'A', pillarLabel: 'Alignement StratÃ©gique', text: 'Les objectifs financiers annoncÃ©s l\'annÃ©e prÃ©cÃ©dente sont explicitement repris et leur rÃ©alisation commentÃ©e.', weight: 2 },
  { id: 'a4', pillar: 'A', pillarLabel: 'Alignement StratÃ©gique', text: 'La feuille de route stratÃ©gique et ses indicateurs de suivi sont visibles dans nos communications financiÃ¨res.', weight: 2 },
  { id: 'a5', pillar: 'A', pillarLabel: 'Alignement StratÃ©gique', text: 'Les dÃ©cisions d\'investissement majeures sont accompagnÃ©es d\'une narration stratÃ©gique convaincante.', weight: 2 },
  { id: 'a6', pillar: 'A', pillarLabel: 'Alignement StratÃ©gique', text: 'Les indicateurs non-financiers (RH, RSE, innovation) sont intÃ©grÃ©s dans la narration financiÃ¨re globale.', weight: 2 },
  // P â€” Performance Visuelle
  { id: 'p1', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Nos graphiques et visualisations de donnÃ©es sont clairs, prÃ©cis et sans manipulation visuelle.', weight: 3 },
  { id: 'p2', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'La mise en page de nos documents financiers respecte notre charte graphique.', weight: 2 },
  { id: 'p3', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Les donnÃ©es clÃ©s sont mises en Ã©vidence visuellement (encadrÃ©s, infographies, KPIs en avant).', weight: 2 },
  { id: 'p4', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Nos documents financiers sont disponibles en version digitale interactive (liens, tableaux dynamiques).', weight: 2 },
  { id: 'p5', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Un design professionnel renforce la crÃ©dibilitÃ© et l\'attractivitÃ© de nos documents financiers.', weight: 2 },
  { id: 'p6', pillar: 'P', pillarLabel: 'Performance Visuelle', text: 'Les comparaisons temporelles (N vs N-1) sont systÃ©matiquement prÃ©sentÃ©es de maniÃ¨re lisible.', weight: 2 },
  // I â€” Impact Investisseurs
  { id: 'i1', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Nos communications financiÃ¨res convainquent les investisseurs potentiels sans nÃ©cessiter de prÃ©sentation complÃ©mentaire.', weight: 3 },
  { id: 'i2', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Notre thÃ¨se d\'investissement est diffÃ©renciante par rapport aux concurrents directs.', weight: 3 },
  { id: 'i3', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Les risques sont prÃ©sentÃ©s de maniÃ¨re honnÃªte et contextualisÃ©e, renforÃ§ant la confiance.', weight: 2 },
  { id: 'i4', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Le management track record est clairement valorisÃ© et documentÃ©.', weight: 2 },
  { id: 'i5', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Les retours d\'expÃ©rience des investisseurs sur nos documents financiers sont collectÃ©s et intÃ©grÃ©s.', weight: 2 },
  { id: 'i6', pillar: 'I', pillarLabel: 'Impact Investisseurs', text: 'Notre document financier serait classÃ© dans le top 25% de notre secteur par un analyste indÃ©pendant.', weight: 3 },
  // T â€” Transparence
  { id: 'tr1', pillar: 'T', pillarLabel: 'Transparence', text: 'Les performances dÃ©cevantes sont prÃ©sentÃ©es honnÃªtement avec explication et plan d\'action.', weight: 3 },
  { id: 'tr2', pillar: 'T', pillarLabel: 'Transparence', text: 'La gouvernance financiÃ¨re (conseil, comitÃ©s, rÃ©munÃ©rations) est prÃ©sentÃ©e de maniÃ¨re transparente.', weight: 2 },
  { id: 'tr3', pillar: 'T', pillarLabel: 'Transparence', text: 'Les engagements financiers hors bilan (garanties, contingences) sont clairement mentionnÃ©s.', weight: 2 },
  { id: 'tr4', pillar: 'T', pillarLabel: 'Transparence', text: 'Nos politiques comptables sont stables ou les changements sont explicitement justifiÃ©s.', weight: 2 },
  { id: 'tr5', pillar: 'T', pillarLabel: 'Transparence', text: 'Les transactions intra-groupe et parties liÃ©es sont correctement dÃ©taillÃ©es.', weight: 2 },
  { id: 'tr6', pillar: 'T', pillarLabel: 'Transparence', text: 'Notre niveau de transparence financiÃ¨re dÃ©passe les obligations lÃ©gales minimales.', weight: 3 },
  // AN â€” Anticipation
  { id: 'an1', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Notre communication financiÃ¨re inclut des perspectives Ã  moyen terme (2-3 ans) documentÃ©es.', weight: 2 },
  { id: 'an2', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Les tendances sectorielles et leur impact sur nos performances futures sont adressÃ©s.', weight: 2 },
  { id: 'an3', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Un scÃ©nario de stress test ou de sensibilitÃ© est prÃ©sentÃ© pour les hypothÃ¨ses clÃ©s.', weight: 2 },
  { id: 'an4', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Les risques gÃ©opolitiques, rÃ©glementaires et technologiques sont anticipÃ©s et quantifiÃ©s.', weight: 2 },
  { id: 'an5', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Notre politique de dividende et de rachat d\'actions est expliquÃ©e de maniÃ¨re prÃ©visible.', weight: 2 },
  { id: 'an6', pillar: 'AN', pillarLabel: 'Anticipation', text: 'Les indicateurs avancÃ©s (leading indicators) sont prÃ©sentÃ©s Ã  cÃ´tÃ© des indicateurs de rÃ©sultats.', weight: 2 },
  // BM â€” Benchmark
  { id: 'bm1', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'Nos ratios financiers clÃ©s sont mis en perspective par rapport aux standards du secteur.', weight: 2 },
  { id: 'bm2', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'La comparaison avec des pairs pertinents est intÃ©grÃ©e dans notre communication financiÃ¨re.', weight: 2 },
  { id: 'bm3', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'Nous utilisons les rÃ©fÃ©rentiels sectoriels (OCDE, IFC, normes IFRS) de maniÃ¨re visible.', weight: 2 },
  { id: 'bm4', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'Notre positionnement compÃ©titif est illustrÃ© par des donnÃ©es de marchÃ© vÃ©rifiables.', weight: 2 },
  { id: 'bm5', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'La performance financiÃ¨re de l\'entreprise sur 5 ans est prÃ©sentÃ©e avec une comparaison sectorielle.', weight: 2 },
  { id: 'bm6', pillar: 'BM', pillarLabel: 'Benchmark Sectoriel', text: 'Le Narrative Doctorâ„¢ que nous avons rÃ©alisÃ© a permis d\'identifier et corriger au moins une pathologie narrative.', weight: 3 },
];

const PILLAR_COLORS: Record<string, string> = {
  C: '#0EA5E9', A: '#38BDF8', P: '#7DD3FC', I: '#0284C7', T: '#0369A1', AN: '#075985', BM: '#0C4A6E',
};

const PATHOLOGIES = [
  { name: 'La Noyade', desc: 'Surcharge d\'information complexe masquant la performance rÃ©elle', icon: 'ðŸŒŠ' },
  { name: 'L\'Embellissement', desc: 'Sur-communication des positifs, euphÃ©mismes sur les nÃ©gatifs', icon: 'ðŸŽ¨' },
  { name: 'La DÃ©connexion', desc: 'Ã‰cart entre les messages du CEO/CFO et les chiffres publiÃ©s', icon: 'ðŸ”Œ' },
  { name: 'La Myopie', desc: 'Focalisation sur le court terme sans vision stratÃ©gique crÃ©dible', icon: 'ðŸ‘“' },
];

function generateRecommendations(pillarScores: Array<{ pillarId: string; score: number }>, globalScore: number): string[] {
  const recs: string[] = [];
  const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3);
  if (globalScore < 40) recs.push("Diagnostic critique : votre communication financiÃ¨re prÃ©sente des pathologies narratives affectant votre crÃ©dibilitÃ© auprÃ¨s des investisseurs et partenaires financiers. Le Narrative Doctorâ„¢ est recommandÃ© en urgence.");
  weakest.forEach(ps => {
    if (ps.pillarId === 'C') recs.push("ClartÃ© : rÃ©digez votre 'ThÃ¨se d'investissement' en une seule phrase percutante. Testez la comprÃ©hension de votre rapport avec 3 lecteurs non-financiers. Simplifiez radicalement avant de soumette.");
    if (ps.pillarId === 'A') recs.push("Alignement : organisez un atelier direction (CEO, CFO, DG) pour harmoniser les messages. CrÃ©ez un 'ComitÃ© narratif' trimestriel avant chaque publication financiÃ¨re.");
    if (ps.pillarId === 'P') recs.push("Visualisation : faites retravailler vos graphiques par un dataviz designer. Remplacez les tableaux complexes par des infographies et adoptez les standards de data storytelling financier.");
    if (ps.pillarId === 'I') recs.push("Impact investisseurs : comparez votre rapport annuel avec les 3 meilleurs rapports de votre secteur et identifiez les 5 Ã©lÃ©ments diffÃ©renciants manquants. Faites relire par un analyste indÃ©pendant.");
    if (ps.pillarId === 'T') recs.push("Transparence : adoptez une politique de communication financiÃ¨re proactive sur les points nÃ©gatifs. La confiance se bÃ¢tit dans les mauvaises nouvelles bien communiquÃ©es, pas dans les bonnes.");
    if (ps.pillarId === 'AN') recs.push("Anticipation : ajoutez une section 'Perspectives & SensibilitÃ©s' Ã  votre rapport annuel avec scÃ©narios Ã  3 ans. Les investisseurs dÃ©cident sur l'avenir, pas sur le passÃ©.");
    if (ps.pillarId === 'BM') recs.push("Benchmark : intÃ©grez systÃ©matiquement une comparaison sectorielle dans chaque KPI clÃ©. Le contexte transforme les chiffres â€” un ratio isolÃ© ne dit rien.");
  });
  return recs.slice(0, 4);
}

type Step = 'roi' | 'form' | 'gate' | 'result';

export default function FinNarrativePage() {
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
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
        <title>FinNarrativeâ„¢ â€” Scoring Communication FinanciÃ¨re | Epitaphe 360</title>
        <meta name="description" content="Ã‰valuez la qualitÃ© de votre communication financiÃ¨re avec FinNarrativeâ„¢ (modÃ¨le TRUST). Scoring investisseurs sur 100." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/finnarrative" />
        <meta property="og:title" content="FinNarrativeâ„¢ â€” Scoring Communication FinanciÃ¨re" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/finnarrative" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="FinNarrativeâ„¢" description="Ã‰valuez la qualitÃ© et la clartÃ© de votre communication financiÃ¨re auprÃ¨s des investisseurs." url="/outils/finnarrative" priceMad={4900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360â„¢",url:"/outils"},{name:"FinNarrativeâ„¢",url:"/outils/finnarrative"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
              FinNarrativeâ„¢ Â· ModÃ¨le CAPITALâ„¢
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Vos chiffres sont bons.<br />
              <span style={{ color: TOOL_COLOR }}>Votre narration convainc-elle ?</span>
            </h1>
            <p className="text-gray-400 text-lg">
              La performance financiÃ¨re ne suffit pas â€” la narration financiÃ¨re dÃ©cide.<br />
              Le Narrative Doctorâ„¢ dÃ©tecte les 4 pathologies qui Ã©rodent la confiance des investisseurs.
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
                  <h2 className="text-xl font-bold text-white">Narrative Doctorâ„¢ â€” Contexte financier</h2>
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
                    <p className="text-sm font-semibold text-white mb-2">ðŸ“„ Narrative Doctorâ„¢ (optionnel)</p>
                    <p className="text-xs text-gray-400 mb-3">Uploadez votre rapport annuel PDF pour une analyse IA des pathologies narratives avec votre consultant Epitaphe360.</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-600 text-gray-300 hover:border-gray-400 transition-colors">
                        ðŸ“Ž Joindre le rapport annuel
                      </button>
                      {uploadedFile && <span className="text-xs text-green-400">âœ“ {uploadedFile}</span>}
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
                        <option value="energie">Ã‰nergie / Mining</option>
                        <option value="auto">Industrie / Manufacturing</option>
                        <option value="pharma">Pharma / SantÃ©</option>
                        <option value="btp">Immobilier / BTP</option>
                        <option value="tech">Tech / Telecom</option>
                        <option value="agroalimentaire">Agroalimentaire</option>
                        <option value="luxury">Retail / Distribution</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Vous Ãªtes :</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['direction', 'terrain'] as const).map(type => (
                          <button key={type} onClick={() => setRespondentType(type)}
                            className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400'}`}
                            style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                            {type === 'direction' ? 'ðŸ’¼ DG / DAF / CA' : 'ðŸ“Š ContrÃ´le gestion'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Taille entreprise</label>
                      <select value={companySize} onChange={e => setCompanySize(e.target.value as CompanySizeType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="pme">PME</option>
                        <option value="eti">ETI cotÃ©e / Non cotÃ©e</option>
                        <option value="grande">Grande entreprise / Groupe</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => setStep('form')} className="w-full py-4 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: TOOL_COLOR }}>
                    DÃ©marrer l'Ã©valuation CAPITALâ„¢ â€” 42 questions â†’
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="FinNarrativeâ„¢" toolColor={TOOL_COLOR} questions={questions} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}

            {step === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Votre score FinNarrativeâ„¢ â€” {result.companyName}</h2>
                  <p className="text-gray-400 mt-1">Analyse CAPITALâ„¢ Â· Narrative Doctorâ„¢ Â· {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <ScoringResults result={result} toolName="FinNarrativeâ„¢" toolColor={TOOL_COLOR} toolModel="CAPITALâ„¢" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}



