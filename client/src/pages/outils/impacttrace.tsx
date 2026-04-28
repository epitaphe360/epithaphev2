import { useState } from 'react';
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

type Step = 'roi' | 'form' | 'gate' | 'discover' | 'pricing' | 'intelligence';

export default function ImpactTracePage() {
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(100);
  const walkTalkGap = 43; // 43% déclarent RSE, ~25% labellisées → illustration

  const [enrichedAnswers, setEnrichedAnswers] = useState<Record<string, { value: number; pillar: string; weight: number; reverseScored?: boolean }>>({});
  const [resultId, setResultId] = useState('');
  const [partialScores, setPartialScores] = useState<Record<string, number>>({});
  const [intelligencePrice, setIntelligencePrice] = useState(8400);
  const [discoverGlobalScore, setDiscoverGlobalScore] = useState(0);
  const [discoverMaturityLevel, setDiscoverMaturityLevel] = useState(1);
  const [intelligenceData, setIntelligenceData] = useState<{ globalScore: number; maturityLevel: number; pillarScores: Record<string, number>; aiReport: unknown } | null>(null);

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
        setIntelligencePrice(res.intelligencePrice ?? 8400);
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
        title="ImpactTrace™ — Scoring RSE &amp; Communication Responsable"
        description="Diagnostiquez la maturité RSE de votre communication avec ImpactTrace™ (modèle PROOF™). Walk vs Talk Score™ : mesurez l'écart entre vos déclarations RSE et vos actions réelles."
        canonicalPath="/outils/impacttrace"
      />
      <SoftwareApplicationSchema name="ImpactTrace™" description="Diagnostiquez la maturité RSE de votre communication et son impact sur vos parties prenantes." url="/outils/impacttrace" priceMad={8400} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"ImpactTrace™",url:"/outils/impacttrace"}]} />
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
                    ImpactTrace™ · Modèle PROOF™ · par Epitaphe360
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    RSE : ce que vous dites<br /><span style={{ color: TOOL_COLOR }}>vs ce que vous faites.</span>
                  </h1>
                  <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                    43% des FTSE500 au Maroc déclarent une démarche RSE. Seulement 124 sont labelliées CGEM.
                    Votre Walk vs Talk Score™ mesure l'écart entre vos déclarations et vos actions réelles.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={() => setStep('form')} className="px-6 py-3 rounded-xl text-sm font-bold text-black hover:opacity-90" style={{ backgroundColor: TOOL_COLOR }}>Lancer mon audit →</button>
                    <a href="/outils" className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 no-underline">Voir les outils</a>
                    <button onClick={() => document.getElementById('proof-pillars')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">En savoir plus</button>
                    <button className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">Rapport PDF</button>
                  </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                  {[
                    { value: '87%', label: 'des grandes entreprises marocaines ont une politique RSE déclarée', src: 'CGEM' },
                    { value: '43%', label: 'Walk vs Talk Gap : déclarent RSE mais pratiques non auditées', src: 'ImpactTrace™' },
                    { value: '3.2×', label: 'plus de candidatures pour les entreprises à forte maturité RSE', src: 'Deloitte' },
                    { value: '+28%', label: 'de valorisation en moyenne pour les entreprises leader RSE', src: 'PwC Maroc' },
                  ].map(s => (
                    <div key={s.value} className="rounded-xl p-5 border border-gray-800 bg-gray-900/40 text-center">
                      <div className="text-3xl font-extrabold mb-1" style={{ color: TOOL_COLOR }}>{s.value}</div>
                      <p className="text-xs text-gray-400 leading-snug">{s.label}</p>
                      <p className="text-xs text-gray-600 mt-1">— {s.src}</p>
                    </div>
                  ))}
                </div>

                {/* POSITIONNEMENT */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>POSITIONNEMENT UNIQUE</div>
                  <h2 className="text-2xl font-bold text-white mb-4">Pourquoi ImpactTrace™ ?</h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    ImpactTrace™ est le premier outil de diagnostic RSE calibré sur les référentiels marocains (Label CGEM, ODD).
                    Il calcule votre <strong className="text-white">Walk vs Talk Score™</strong> — l'écart entre vos déclarations RSE et vos pratiques mesurables.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="rounded-xl p-5 border border-red-500/20 bg-red-500/5">
                      <h3 className="text-sm font-bold text-red-400 mb-3">Le risque greenwashing</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Stratégie RSE non formalisée</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Engagements sans KPIs mesurables</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Walk vs Talk Score négatif</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Impact réel non communiqué</li>
                      </ul>
                    </div>
                    <div className="rounded-xl p-5" style={{ border: `1px solid ${TOOL_COLOR}30`, background: `${TOOL_COLOR}08` }}>
                      <h3 className="text-sm font-bold mb-3" style={{ color: TOOL_COLOR }}>Ce que fait ImpactTrace™</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Modèle PROOF™ en 5 dimensions</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Walk vs Talk Score™ calculé</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Benchmark CGEM & ODD Maroc</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Feuille de route labellisation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 5 PILIERS PROOF™ */}
                <div id="proof-pillars" className="mb-14">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>LES 5 PILIERS DU MODÈLE PROOF™</div>
                    <h2 className="text-2xl font-bold text-white">Qu'évalue ImpactTrace™ ?</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { code: 'P', name: 'Plateforme RSE', sub: 'Stratégie & structure', desc: 'Formalisation de la stratégie RSE avec objectifs chiffrés, budget dédié et référentiel reconnu.', tags: ['Label CGEM', 'ODD', 'Budget RSE', 'Responsable RSE'] },
                      { code: 'R', name: 'Réputation RSE', sub: 'Crédibilité & visibilité', desc: 'Walk vs Talk Score™ : vos actions dépassent-elles vos déclarations ? La réputation RSE se mesure.', tags: ['Walk vs Talk', 'Rapport RSE', 'Prix & certifs'] },
                      { code: 'O', name: 'Opérations', sub: 'Pratiques & mesure', desc: 'Empreinte carbone, achats responsables, indicateurs opérationnels intégrés dans les tableaux de bord.', tags: ['Bilan carbone', 'Achats RSE', 'KPIs COMEX'] },
                      { code: 'OC', name: 'Ouverture Communautaire', sub: 'Impact territorial', desc: 'Projets à impact social et environnemental dans les communautés locales où vous opérez.', tags: ['Impact territorial', 'Partenariats ONG', 'Mécénat compétences'] },
                      { code: 'F', name: 'Formation RSE', sub: 'Mobilisation interne', desc: 'Sensibilisation et formation de vos équipes aux enjeux RSE. L\'implication interne détermine le succès.', tags: ['Formation RSE', 'Ambassadeurs', 'Objectifs perf'] },
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>SCORE DE MATURITÉ RSE</div>
                    <h2 className="text-2xl font-bold text-white">Les 5 niveaux PROOF™</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center">
                      <div className="relative w-44 h-44">
                        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                          <circle cx="100" cy="100" r="80" fill="none" stroke="#1f2937" strokeWidth="20" />
                          <circle cx="100" cy="100" r="80" fill="none" stroke={TOOL_COLOR} strokeWidth="20"
                            strokeDasharray={`${2 * Math.PI * 80 * 0.55} ${2 * Math.PI * 80 * 0.45}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-5xl font-extrabold" style={{ color: TOOL_COLOR }}>55</div>
                          <div className="text-gray-400 text-sm">/100</div>
                        </div>
                      </div>
                      <div className="text-center mt-3"><div className="text-lg font-bold" style={{ color: '#EAB308' }}>Structuré</div><div className="text-xs text-gray-500">Niveau 3 sur 5 — exemple illustratif</div></div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Déclaratif', range: '0–20', color: '#EF4444', desc: 'RSE en communication uniquement. Risque greenwashing élevé.' },
                        { name: 'Ponctuel', range: '21–40', color: '#F97316', desc: 'Actions RSE isolées sans stratégie cohérente.' },
                        { name: 'Structuré', range: '41–60', color: '#EAB308', desc: 'Stratégie formalisée mais Walk vs Talk à améliorer.' },
                        { name: 'Mesurable', range: '61–80', color: '#22C55E', desc: 'KPIs RSE suivis, impact communiqué de manière crédible.' },
                        { name: 'Leader RSE', range: '81–100', color: '#3B82F6', desc: 'Label CGEM. RSE = avantage compétitif et levier de valorisation.' },
                      ].map(m => (
                        <div key={m.name} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: m.color }} />
                          <div><div className="text-sm font-semibold text-white">{m.name} <span className="text-gray-500 font-normal">({m.range})</span></div><div className="text-xs text-gray-400">{m.desc}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* WALK vs TALK SIMULATOR */}
                <div className="rounded-2xl p-8 mb-10 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>GREENWASH DETECTOR™ — BENCHMARK MAROC</div>
                  <h2 className="text-xl font-bold text-white mb-4">Contexte RSE de votre entreprise</h2>
                  <div className="rounded-xl p-5 border mb-5" style={{ borderColor: `${TOOL_COLOR}40`, background: `${TOOL_COLOR}08` }}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-white">Walk vs Talk Gap — Benchmark Maroc</span>
                      <span className="text-xs font-mono" style={{ color: TOOL_COLOR }}>43% déclarent / ~25% labelliées</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 relative">
                      <div className="h-3 rounded-full" style={{ width: '43%', backgroundColor: `${TOOL_COLOR}50` }} />
                      <div className="h-3 rounded-full absolute top-0 left-0" style={{ width: '25%', backgroundColor: TOOL_COLOR }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span style={{ color: TOOL_COLOR }}>→ Labelliées CGEM (25%)</span>
                      <span style={{ color: `${TOOL_COLOR}80` }}>→ Déclarent RSE (43%)</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div><label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex : OCP, Marjane..." className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Secteur d'activité</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="pharma">Pharma / Santé</option><option value="auto">Automobile</option>
                        <option value="finance">Banque / Finance</option><option value="tech">Tech / IT</option>
                        <option value="energie">Énergie / Industrie</option><option value="luxury">Luxe / Retail</option>
                        <option value="btp">BTP / Immobilier</option><option value="agroalimentaire">Agroalimentaire</option>
                        <option value="textile">Textile / Mode</option><option value="autre">Autre</option>
                      </select></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Taille entreprise</label>
                      <select value={companySize} onChange={e => setCompanySize(e.target.value as CompanySizeType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="tpe">TPE (&lt;10)</option><option value="pme">PME (10–250)</option>
                        <option value="eti">ETI (250–5000)</option><option value="ge">Grande entreprise (5000+)</option>
                      </select></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Effectif : <strong className="text-white">{effectif} employés</strong></label>
                      <input type="range" min={10} max={10000} step={50} value={effectif} onChange={e => setEffectif(Number(e.target.value))} className="w-full" style={{ accentColor: TOOL_COLOR }} /></div>
                  </div>
                </div>

                {/* RESPONDENT TYPE */}
                <div className="mb-10">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Je suis :</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['direction', 'terrain'] as const).map(type => (
                      <button key={type} onClick={() => setRespondentType(type)}
                        className={`px-4 py-4 rounded-xl border text-sm font-medium transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}
                        style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                        {type === 'direction' ? '👔 Direction / RSE' : '🌿 Responsable Opérationnel'}
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
                      { tier: 'Discover', price: 'Gratuit', highlight: false, items: ['Score PROOF™ partiel (3 piliers)', 'Niveau de maturité RSE', '2 recommandations RSE', 'Walk vs Talk indicatif'] },
                      { tier: 'Intelligence', price: '8 400 MAD', highlight: true, items: ['Score complet 5 piliers PROOF™', 'Walk vs Talk Score™ détaillé', 'Benchmark CGEM & ODD Maroc', 'Rapport IA 12 pages', 'Feuille route labellisation'] },
                      { tier: 'Transform', price: 'Sur devis', highlight: false, items: ['Accompagnement labellisation', 'Ateliers RSE stratégiques', 'Rapport RSE vérifiable', 'Programme ambassadeurs'] },
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

                {/* RAPPORT */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>CAPITAL RAPPORT COMPLET — 12 PAGES</div>
                  <h2 className="text-xl font-bold text-white mb-6">Structure du rapport Intelligence™ ImpactTrace</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { pages: '1–2', title: 'Walk vs Talk Score™', desc: 'Score global et analyse de l\'authenticité RSE.' },
                      { pages: '3–4', title: 'Score détaillé PROOF™', desc: 'Analyse des 5 piliers avec points forts et lacunes.' },
                      { pages: '5–6', title: 'Benchmark CGEM & ODD', desc: 'Positionnement par rapport aux standards marocains.' },
                      { pages: '7', title: 'Diagnostic Direction/Terrain', desc: 'Écart de perception RSE entre les niveaux.' },
                      { pages: '8', title: 'Plan RSE 90 jours', desc: 'Actions prioritaires à J+30, J+60, J+90.' },
                      { pages: '9–10', title: 'ROI RSE & image', desc: 'Impact financier de la maturité RSE sur la valorisation.' },
                      { pages: '11', title: 'Feuille de route labellisation', desc: 'Chemin vers le Label CGEM ou certification ODD.' },
                      { pages: '12', title: 'Prochaines étapes', desc: 'Modalités d\'engagement Epitaphe360.' },
                    ].map(r => (
                      <div key={r.pages} className="flex gap-3 p-3 rounded-lg border border-gray-800">
                        <div className="text-xs font-bold rounded px-1.5 py-0.5 shrink-0 h-fit mt-0.5" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>P. {r.pages}</div>
                        <div><div className="text-sm font-semibold text-white">{r.title}</div><div className="text-xs text-gray-500">{r.desc}</div></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INTEGRATIONS */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>FONCTIONNALITÉS ET INTÉGRATIONS</div>
                  <h2 className="text-xl font-bold text-white mb-6">Écosystème technique ImpactTrace™</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: '📋', name: 'Formulaire', desc: 'Questionnaire RSE adapté' },
                      { icon: '⚡', name: 'Automatisation', desc: 'Rapports auto & alertes RSE' },
                      { icon: '🤖', name: 'Rapport IA', desc: 'Analyse GPT-4o RSE' },
                      { icon: '📅', name: 'Booking', desc: 'RDV consultant RSE' },
                      { icon: '🌱', name: 'Bilan Carbone', desc: 'Intégration Scope 1+2+3' },
                      { icon: '🏆', name: 'CGEM Tracker', desc: 'Suivi label CGEM' },
                      { icon: '📊', name: 'Dashboard RSE', desc: 'KPIs temps réel' },
                      { icon: '🌍', name: 'ODD Mapping', desc: 'Alignement ODD ONU' },
                    ].map(int => (
                      <div key={int.name} className="rounded-xl p-4 border border-gray-800 text-center">
                        <div className="text-2xl mb-2">{int.icon}</div>
                        <div className="text-sm font-semibold text-white">{int.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{int.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FINAL CTA */}
                <motion.div className="rounded-2xl p-10 text-center mb-4"
                  style={{ background: `linear-gradient(135deg, ${TOOL_COLOR}25, ${TOOL_COLOR}08)`, border: `1px solid ${TOOL_COLOR}50` }}>
                  <div className="text-4xl mb-4">🌿</div>
                  <h2 className="text-2xl font-extrabold text-white mb-3">ImpactTrace™ — Prochaine étape</h2>
                  <p className="text-gray-400 mb-2 max-w-lg mx-auto">Obtenez votre Walk vs Talk Score™ gratuit en 6 minutes. 30 indicateurs RSE analysés.</p>
                  <p className="text-gray-500 text-sm mb-6">Vous êtes {respondentType === 'direction' ? 'une direction / RSE' : 'un responsable opérationnel'} — l'évaluation sera adaptée.</p>
                  <button onClick={() => setStep('form')}
                    className="px-10 py-4 rounded-xl text-base font-bold text-black transition-all hover:opacity-90 hover:scale-105"
                    style={{ backgroundColor: TOOL_COLOR }}>Démarrer l'évaluation PROOF™ — 30 questions · ~6 min →</button>
                </motion.div>

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
            {step === 'discover' && (
              <motion.div key="discover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <DiscoverResults
                  toolId={TOOL_ID}
                  toolLabel="ImpactTrace™"
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
                  toolLabel="ImpactTrace™"
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
                  toolLabel="ImpactTrace™"
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



