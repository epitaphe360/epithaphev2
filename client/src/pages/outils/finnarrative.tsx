import { useState, useRef } from 'react';
import { useToolQuestions } from '@/hooks/useToolQuestions';
import { PageMeta } from '@/components/seo/page-meta';
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
  type ScoringQuestion, type ScoringAnswer,
  type SectorType, type CompanySizeType,
} from '@/lib/scoring-engine';

const TOOL_COLOR = '#0EA5E9'; // Cyan/Sky pour FinNarrative
const TOOL_ID = 'finnarrative' as const;

const DEFAULT_QUESTIONS: ScoringQuestion[] = [
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

type Step = 'roi' | 'form' | 'gate' | 'discover' | 'pricing' | 'intelligence';

export default function FinNarrativePage() {
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('finance');
  const [companySize, setCompanySize] = useState<CompanySizeType>('eti');
  const [effectif, setEffectif] = useState(200);
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [enrichedAnswers, setEnrichedAnswers] = useState<Record<string, { value: number; pillar: string; weight: number }>>({});
  const [resultId, setResultId] = useState('');
  const [partialScores, setPartialScores] = useState<Record<string, number>>({});
  const [intelligencePrice, setIntelligencePrice] = useState(9900);
  const [discoverGlobalScore, setDiscoverGlobalScore] = useState(0);
  const [discoverMaturityLevel, setDiscoverMaturityLevel] = useState(1);
  const [intelligenceData, setIntelligenceData] = useState<{ globalScore: number; maturityLevel: number; pillarScores: Record<string, number>; aiReport: unknown } | null>(null);

  const [valorisation, setValorisation] = useState(50000000);

  const handleComplete = (answers: ScoringAnswer[]) => {
    const enriched: Record<string, { value: number; pillar: string; weight: number; reverseScored?: boolean }> = {};
    for (const a of answers) {
      const q = questions.find(q => q.id === a.questionId);
      if (q) enriched[a.questionId] = { value: a.value, pillar: q.pillar, weight: q.weight, reverseScored: q.reverseScored };
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
        setIntelligencePrice(res.intelligencePrice ?? 9900);
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
      <PageMeta
        title="FinNarrative™ — Scoring Communication Financière"
        description="Évaluez la qualité de votre communication financière avec FinNarrative™ (modèle CAPITAL™). Narrative Doctor™ : 4 pathologies narratives détectées, conformité AMMC 2025."
        canonicalPath="/outils/finnarrative"
      />
      <SoftwareApplicationSchema name="FinNarrative™" description="Évaluez la qualité et la clarté de votre communication financière auprès des investisseurs." url="/outils/finnarrative" priceMad={9900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"FinNarrative™",url:"/outils/finnarrative"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {step !== 'roi' && (
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setStep('roi')} className="text-gray-500 hover:text-white text-sm flex items-center gap-2 transition-colors">← Retour</button>
              <div className="flex items-center gap-2 ml-auto">
                {(['form','gate','discover','pricing','intelligence'] as const).map((s) => {
                  const ss=['form','gate','discover','pricing','intelligence'] as const;
                  const ci=ss.indexOf(step as typeof ss[number]); const si=ss.indexOf(s);
                  return (<div key={s} className={`w-2 h-2 rounded-full ${si===ci?'bg-white':si<ci?'bg-green-500':'bg-gray-700'}`} />);
                })}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'roi' && (
              <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                {/* HERO */}
                <div className="text-center mb-14">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-semibold"
                    style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
                    FinNarrative™ · Modèle CAPITAL™ · par Epitaphe360
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Vos chiffres sont bons.<br /><span style={{ color: TOOL_COLOR }}>Votre narration convainc-elle ?</span>
                  </h1>
                  <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                    78% des investisseurs lisent moins de 30% de votre rapport. 67% des décisions d’investissement reposent sur la qualité de la narration, pas seulement les chiffres.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={() => setStep('form')} className="px-6 py-3 rounded-xl text-sm font-bold text-black hover:opacity-90" style={{ backgroundColor: TOOL_COLOR }}>Lancer mon audit →</button>
                    <a href="/outils" className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 no-underline">Voir les outils</a>
                    <button onClick={() => document.getElementById('capital-pillars')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">En savoir plus</button>
                    <button className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">Rapport PDF</button>
                  </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                  {[
                    { value: '78%', label: 'des investisseurs lisent moins de 30% d’un rapport annuel', src: 'Ernst & Young' },
                    { value: '67%', label: 'des décisions d’investissement reposent sur la qualité narrative', src: 'CFA Institute' },
                    { value: '2.4×', label: 'meilleure valorisation pour les entreprises à narrative financière solide', src: 'McKinsey' },
                    { value: '4', label: 'pathologies narratives récurrentes détectées par le Narrative Doctor™', src: 'FinNarrative™' },
                  ].map(s => (
                    <div key={s.value} className="rounded-xl p-5 border border-gray-800 bg-gray-900/40 text-center">
                      <div className="text-3xl font-extrabold mb-1" style={{ color: TOOL_COLOR }}>{s.value}</div>
                      <p className="text-xs text-gray-400 leading-snug">{s.label}</p>
                      <p className="text-xs text-gray-600 mt-1">— {s.src}</p>
                    </div>
                  ))}
                </div>

                {/* 4 PATHOLOGIES */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>NARRATIVE DOCTOR™ — 4 PATHOLOGIES</div>
                  <h2 className="text-2xl font-bold text-white mb-6">Qu'érode la confiance des investisseurs ?</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {PATHOLOGIES.map(p => (
                      <div key={p.name} className="rounded-xl p-5 border border-gray-800 flex items-start gap-3" style={{ background: `${TOOL_COLOR}06` }}>
                        <span className="text-3xl flex-shrink-0">{p.icon}</span>
                        <div>
                          <div className="text-sm font-bold text-white mb-1">{p.name}</div>
                          <div className="text-xs text-gray-400">{p.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7 PILIERS CAPITAL™ */}
                <div id="capital-pillars" className="mb-14">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>LES 7 PILIERS DU MODÈLE CAPITAL™</div>
                    <h2 className="text-2xl font-bold text-white">Qu'évalue FinNarrative™ ?</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { code: 'C', name: 'Clarté Narrative', sub: 'Structure & lisibilité', desc: 'Votre rapport est-il lisible en <30 minutes ? La thèse d’investissement est-elle explicitée en page 1 ?', tags: ['Executive Summary', 'Lisibilité', 'Structure'] },
                      { code: 'A', name: 'Alignement Stratégique', sub: 'Cohérence & vision', desc: 'Votre communication financière est-elle alignée avec votre stratégie d’entreprise à 3 ans ?', tags: ['Vision 3 ans', 'KPIs strat', 'Roadmap'] },
                      { code: 'P', name: 'Performance Visuelle', sub: 'Datavisualisation', desc: 'Qualité des graphiques, tableaux et infographies. Les données complexes sont-elles rendues accessibles ?', tags: ['Dataviz', 'Infographies', 'Tableaux de bord'] },
                      { code: 'I', name: 'Impact Investisseurs', sub: 'Résonance & persuasion', desc: 'Le rapport génère-t-il un impact émotionnel positif ? Donne-t-il confiance et envie d’investir ?', tags: ['Persuasion', 'Présentation CA', 'Road show'] },
                      { code: 'T', name: 'Transparence', sub: 'Cohérence & intégrité', desc: 'Gestion de la cohérence entre les messages positifs et les risques. Les mauvaises nouvelles sont-elles intégrées honnorément ?', tags: ['Risk disclosure', 'Incertitudes', 'Gouvernance'] },
                      { code: 'AN', name: 'Anticipation', sub: 'Vision prospective', desc: 'Qualité de la communication sur les perspectives futures : guidance, pipeline, marchés en croissance.', tags: ['Guidance', 'Pipeline', 'Prospective'] },
                      { code: 'BM', name: 'Benchmark Sectoriel', sub: 'Positionnement comparatif', desc: 'Votre communication financière vous positionne-t-elle avantageusement vs vos concurrents sectoriels ?', tags: ['Benchmark', 'Comparatifs', 'Premium narratif'] },
                    ].map((p) => (
                      <div key={p.code} className="rounded-xl p-5 border border-gray-800 bg-gray-900/30 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-extrabold shrink-0" style={{ backgroundColor: `${TOOL_COLOR}25`, color: TOOL_COLOR }}>{p.code}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1"><span className="font-bold text-white">{p.name}</span><span className="text-xs text-gray-500">— {p.sub}</span></div>
                          <p className="text-sm text-gray-400 mb-2 leading-relaxed">{p.desc}</p>
                          <div className="flex flex-wrap gap-2">{p.tags.map(tag => (<span key={tag} className="px-2 py-0.5 rounded text-xs border" style={{ borderColor: `${TOOL_COLOR}40`, color: TOOL_COLOR, background: `${TOOL_COLOR}10` }}>{tag}</span>))}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SCORE GAUGE */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>SCORE DE MATURITÉ NARRATIVE</div>
                    <h2 className="text-2xl font-bold text-white">Les 5 niveaux CAPITAL™</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center">
                      <div className="relative w-44 h-44">
                        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                          <circle cx="100" cy="100" r="80" fill="none" stroke="#1f2937" strokeWidth="20" />
                          <circle cx="100" cy="100" r="80" fill="none" stroke={TOOL_COLOR} strokeWidth="20"
                            strokeDasharray={`${2 * Math.PI * 80 * 0.58} ${2 * Math.PI * 80 * 0.42}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-5xl font-extrabold" style={{ color: TOOL_COLOR }}>58</div>
                          <div className="text-gray-400 text-sm">/100</div>
                        </div>
                      </div>
                      <div className="text-center mt-3"><div className="text-lg font-bold" style={{ color: '#22C55E' }}>Clair</div><div className="text-xs text-gray-500">Niveau 3 sur 5 — exemple illustratif</div></div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Opaque', range: '0–20', color: '#EF4444', desc: 'Rapport incompréhensible. Aucune thèse d’investissement visible.' },
                        { name: 'Formel', range: '21–40', color: '#F97316', desc: 'Rapport conformiste. Chiffres présents mais narrative absente.' },
                        { name: 'Clair', range: '41–60', color: '#EAB308', desc: 'Lisible mais sans conviction. La stratégie reste floue.' },
                        { name: 'Convaincant', range: '61–80', color: '#22C55E', desc: 'Narrative solide, stratégie visible, confiance investisseur.' },
                        { name: 'Référence Sectorielle', range: '81–100', color: '#3B82F6', desc: 'Rapport prémium. Référence du secteur. 2.4× valorisation narrative.' },
                      ].map(m => (
                        <div key={m.name} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: m.color }} />
                          <div><div className="text-sm font-semibold text-white">{m.name} <span className="text-gray-500 font-normal">({m.range})</span></div><div className="text-xs text-gray-400">{m.desc}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* NARRATIVE DOCTOR + ROI */}
                <div className="rounded-2xl p-8 mb-10 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>NARRATIVE DOCTOR™ — SIMULATEUR VALORISATION</div>
                  <h2 className="text-xl font-bold text-white mb-6">Estimez le discount narratif sur votre valorisation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div><label className="block text-sm text-gray-400 mb-2">Valorisation / Capitalisation : <strong className="text-white">{(valorisation/1000000).toFixed(0)}M MAD</strong></label>
                      <input type="range" min={5000000} max={5000000000} step={5000000} value={valorisation} onChange={e => setValorisation(Number(e.target.value))} className="w-full" style={{ accentColor: TOOL_COLOR }} /></div>
                    <div className="rounded-xl p-5 text-center" style={{ background: `${TOOL_COLOR}12`, border: `1px solid ${TOOL_COLOR}40` }}>
                      <div className="text-xs text-gray-400 mb-2">Discount narratif estimé</div>
                      <div className="text-4xl font-extrabold" style={{ color: TOOL_COLOR }}>
                        {Math.round(valorisation * 0.15).toLocaleString()} MAD
                      </div>
                      <div className="text-xs text-gray-500 mt-1">(15% = décote moyenne pour narration financière faible)</div>
                    </div>
                  </div>
                  <div className="rounded-xl p-4 border mb-6" style={{ borderColor: `${TOOL_COLOR}40`, background: `${TOOL_COLOR}08` }}>
                    <p className="text-sm font-semibold text-white mb-2">📄 Narrative Doctor™ (optionnel)</p>
                    <p className="text-xs text-gray-400 mb-3">Uploadez votre rapport annuel PDF pour une analyse IA des pathologies narratives.</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-600 text-gray-300 hover:border-gray-400 transition-colors">📎 Joindre le rapport annuel</button>
                      {uploadedFile && <span className="text-xs text-green-400">✓ {uploadedFile}</span>}
                    </div>
                    <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => { if (e.target.files?.[0]) setUploadedFile(e.target.files[0].name); }} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex : Attijariwafa Bank, BMCE..." className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Secteur d'activité</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="finance">Finance / Banque / Assurance</option>
                        <option value="energie">Énergie / Mining</option>
                        <option value="auto">Industrie / Manufacturing</option>
                        <option value="pharma">Pharma / Santé</option>
                        <option value="btp">Immobilier / BTP</option>
                        <option value="tech">Tech / Telecom</option>
                        <option value="autre">Autre</option>
                      </select></div>
                  </div>
                </div>

                {/* RESPONDENT */}
                <div className="mb-10">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Je suis :</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['direction', 'terrain'] as const).map(type => (
                      <button key={type} onClick={() => setRespondentType(type)}
                        className={`px-4 py-4 rounded-xl border text-sm font-medium transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}
                        style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                        {type === 'direction' ? '💼 DG / DAF / Conseil d’Administration' : '📊 Contrôle de gestion'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3-TIER */}
                <div className="mb-14">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>MODÈLE D'ÉVALUATION — 3 TIERS</div>
                    <h2 className="text-2xl font-bold text-white">Choisissez votre niveau d'analyse</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { tier: 'Discover', price: 'Gratuit', highlight: false, items: ['Score CAPITAL™ partiel (4 piliers)', 'Niveau de maturité narrative', '2 pathologies identifiées', 'Benchmark sectoriel indicatif'] },
                      { tier: 'Intelligence', price: '9 900 MAD', highlight: true, items: ['Score complet 7 piliers CAPITAL™', '4 Pathologies Narrative Doctor™', 'Discount narratif estimé', 'Rapport IA 12 pages premium', 'Analyse rapport annuel IA'] },
                      { tier: 'Transform', price: 'Sur devis', highlight: false, items: ['Rédaction rapport annuel', 'Coaching communication DG/DAF', 'Road show story', 'Annual report design premium'] },
                    ].map(t => (
                      <div key={t.tier} className="rounded-2xl p-6 border" style={t.highlight ? { border: `2px solid ${TOOL_COLOR}`, background: `${TOOL_COLOR}10` } : { borderColor: '#374151' }}>
                        {t.highlight && (<div className="text-xs font-bold mb-3 px-2 py-0.5 rounded-full inline-block" style={{ backgroundColor: TOOL_COLOR, color: '#000' }}>✦ RECOMMANDÉ</div>)}
                        <div className="text-lg font-bold text-white mb-1">{t.tier}</div>
                        <div className="text-2xl font-extrabold mb-4" style={{ color: t.highlight ? TOOL_COLOR : '#fff' }}>{t.price}</div>
                        <ul className="space-y-2">{t.items.map(item => (<li key={item} className="flex gap-2 text-sm text-gray-400"><span style={{ color: t.highlight ? TOOL_COLOR : '#6b7280' }}>✓</span> {item}</li>))}</ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FINAL CTA */}
                <motion.div className="rounded-2xl p-10 text-center mb-4"
                  style={{ background: `linear-gradient(135deg, ${TOOL_COLOR}25, ${TOOL_COLOR}08)`, border: `1px solid ${TOOL_COLOR}50` }}>
                  <div className="text-4xl mb-4">💹</div>
                  <h2 className="text-2xl font-extrabold text-white mb-3">FinNarrative™ — Prochaine étape</h2>
                  <p className="text-gray-400 mb-2 max-w-lg mx-auto">Obtenez votre Score CAPITAL™ gratuit en 8 minutes. 42 indicateurs narratifs analysés.</p>
                  <p className="text-gray-500 text-sm mb-6">Vous êtes {respondentType === 'direction' ? 'Direction / CA' : 'Contrôle de gestion'} — l'évaluation sera adaptée.</p>
                  <button onClick={() => setStep('form')}
                    className="px-10 py-4 rounded-xl text-base font-bold text-black transition-all hover:opacity-90 hover:scale-105"
                    style={{ backgroundColor: TOOL_COLOR }}>Démarrer l'évaluation CAPITAL™ — 42 questions · ~8 min →</button>
                </motion.div>

              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="FinNarrative™" toolColor={TOOL_COLOR} questions={questions} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}
            {step === 'gate' && (
              <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmailGate
                  toolName="FinNarrative�"
                  toolColor={TOOL_COLOR}
                  onUnlock={handleUnlock}
                  isLoading={isUnlocking}
                />
              </motion.div>
            )}
            {step === 'discover' && (
              <motion.div key="discover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <DiscoverResults
                  toolId={TOOL_ID}
                  toolLabel="FinNarrative™"
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
            {step === 'pricing' && (
              <motion.div key="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <IntelligencePricing
                  toolId={TOOL_ID}
                  toolLabel="FinNarrative™"
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
            {step === 'intelligence' && intelligenceData && (
              <motion.div key="intelligence" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <IntelligenceResults
                  toolId={TOOL_ID}
                  toolLabel="FinNarrative™"
                  toolColor={TOOL_COLOR}
                  globalScore={intelligenceData.globalScore}
                  maturityLevel={intelligenceData.maturityLevel}
                  pillarScores={intelligenceData.pillarScores}
                  aiReport={intelligenceData.aiReport as any}
                  resultId={intelligenceData.id ?? resultId}
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



