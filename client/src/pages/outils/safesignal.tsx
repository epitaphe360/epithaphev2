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

type Step = 'roi' | 'form' | 'gate' | 'discover' | 'pricing' | 'intelligence';

export default function SafeSignalPage() {
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(100);
  const [enrichedAnswers, setEnrichedAnswers] = useState<Record<string, { value: number; pillar: string; weight: number }>>({});
  const [resultId, setResultId] = useState('');
  const [partialScores, setPartialScores] = useState<Record<string, number>>({});
  const [intelligencePrice, setIntelligencePrice] = useState(7900);
  const [discoverGlobalScore, setDiscoverGlobalScore] = useState(0);
  const [discoverMaturityLevel, setDiscoverMaturityLevel] = useState(1);
  const [intelligenceData, setIntelligenceData] = useState<{ globalScore: number; maturityLevel: number; pillarScores: Record<string, number>; aiReport: unknown } | null>(null);

  const [tauxAccident, setTauxAccident] = useState(3);

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
        setIntelligencePrice(res.intelligencePrice ?? 7900);
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
        title="SafeSignal™ — Scoring Communication QHSE"
        description="Évaluez l'efficacité de votre communication sécurité avec SafeSignal™ (modèle SHIELD™). Safety Perception Gap™ : mesurez l'écart entre la sécurité perçue et la sécurité vécue au Maroc."
        canonicalPath="/outils/safesignal"
      />
      <SoftwareApplicationSchema name="SafeSignal™" description="Évaluez l'efficacité de votre communication sécurité et votre culture QHSE." url="/outils/safesignal" priceMad={7900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"SafeSignal™",url:"/outils/safesignal"}]} />
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
                    SafeSignal™ · Modèle SHIELD™ · par Epitaphe360
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    La sécurité que vous croyez avoir<br /><span style={{ color: TOOL_COLOR }}>vs celle qui existe réellement.</span>
                  </h1>
                  <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                    80-90% des accidents ont des causes humaines et organisationnelles.
                    Le Safety Perception Gap™ révèle l'écart entre la vision Direction et la réalité terrain.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={() => setStep('form')} className="px-6 py-3 rounded-xl text-sm font-bold text-black hover:opacity-90" style={{ backgroundColor: TOOL_COLOR }}>Lancer mon audit →</button>
                    <a href="/outils" className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 no-underline">Voir les outils</a>
                    <button onClick={() => document.getElementById('shield-pillars')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">En savoir plus</button>
                    <button className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">Rapport PDF</button>
                  </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                  {[
                    { value: '80%', label: 'des accidents du travail ont des causes humaines ou organisationnelles', src: 'ILO' },
                    { value: '40×', label: 'le coût indirect d’un accident dépasse son coût direct (arrêts, enquetes, image)', src: 'INRS' },
                    { value: '58%', label: 'des signaux faibles de prés-accident sont ignorés ou non-remortés', src: 'SafeSignal™' },
                    { value: '73%', label: 'des accidents graves étaient évitables avec une culture SHIELD™ active', src: 'QHSE Maroc' },
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
                  <h2 className="text-2xl font-bold text-white mb-4">Pourquoi SafeSignal™ ?</h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    SafeSignal™ est le premier outil de scoring culture sécurité qui mesure le <strong className="text-white">Safety Perception Gap™</strong> —
                    l'écart entre la vision HSE de la direction et la réalité vécue par les opérateurs terrain.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="rounded-xl p-5 border border-red-500/20 bg-red-500/5">
                      <h3 className="text-sm font-bold text-red-400 mb-3">L'approche réactive</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Agir après l’accident</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Signaux faibles ignorés</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Compliance sans culture</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Gap direction/terrain non mesuré</li>
                      </ul>
                    </div>
                    <div className="rounded-xl p-5" style={{ border: `1px solid ${TOOL_COLOR}30`, background: `${TOOL_COLOR}08` }}>
                      <h3 className="text-sm font-bold mb-3" style={{ color: TOOL_COLOR }}>Ce que fait SafeSignal™</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Modèle SHIELD™ en 6 dimensions</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Safety Perception Gap™ calculé</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> ROI prévention accidents estimé</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> SafeWalk™ brief terrain généré</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 6 PILIERS SHIELD™ */}
                <div id="shield-pillars" className="mb-14">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>LES 6 PILIERS DU MODÈLE SHIELD™</div>
                    <h2 className="text-2xl font-bold text-white">Qu'évalue SafeSignal™ ?</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { code: 'S', name: 'Signaux Faibles', sub: 'Détection & remortée', desc: 'Système de détection et remortée des prés-accidents et comportements risqués.', tags: ['Near-miss', 'Walk’n’Talk', 'QHSE feedback'] },
                      { code: 'H', name: 'Hiérarchie Sécurité', sub: 'Leadership visible', desc: 'Engagement visible de la direction HSE. Les managers sont-ils des modèles de comportement sécurité ?', tags: ['Leadership HSE', 'Comportements', 'Terrain'] },
                      { code: 'I', name: 'Impact Terrain', sub: 'Réalité opérationnelle', desc: 'La culture sécurité telle qu’elle est vécue par les opérateurs et les contractors.', tags: ['Opérateurs', 'Contractors', 'Postures'] },
                      { code: 'E', name: 'Engagement Total', sub: 'Participation collective', desc: 'Taux d’engagement dans les programmes sécurité, briefings, et démarches participatives.', tags: ['Briefings', 'Suggestions', 'Quarts sécurité'] },
                      { code: 'L', name: 'Learning Culture', sub: 'Apprentissage & retours', desc: 'REX (Retours d’Expérience), formations, capitalisation sur les incidents passés.', tags: ['REX', 'Formations', 'Arbre causes'] },
                      { code: 'D', name: 'Dispositifs Physiques', sub: 'Environnement & signalétique', desc: 'Qualité et pertinence de la signalétique sécurité, des EPI et des dispositifs de protection.', tags: ['Signaletique', 'EPI', 'Barrières sécurité'] },
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>SCORE DE MATURITÉ SÉCURITÉ</div>
                    <h2 className="text-2xl font-bold text-white">Les 5 niveaux SHIELD™</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center">
                      <div className="relative w-44 h-44">
                        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                          <circle cx="100" cy="100" r="80" fill="none" stroke="#1f2937" strokeWidth="20" />
                          <circle cx="100" cy="100" r="80" fill="none" stroke={TOOL_COLOR} strokeWidth="20"
                            strokeDasharray={`${2 * Math.PI * 80 * 0.48} ${2 * Math.PI * 80 * 0.52}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-5xl font-extrabold" style={{ color: TOOL_COLOR }}>48</div>
                          <div className="text-gray-400 text-sm">/100</div>
                        </div>
                      </div>
                      <div className="text-center mt-3"><div className="text-lg font-bold" style={{ color: '#EAB308' }}>Proactif</div><div className="text-xs text-gray-500">Niveau 3 sur 5 — exemple illustratif</div></div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Réactif', range: '0–20', color: '#EF4444', desc: 'On agit après l’accident. Pas de système de détection préventif.' },
                        { name: 'Compliant', range: '21–40', color: '#F97316', desc: 'Conformité réglementaire mais pas de culture sécurité réelle.' },
                        { name: 'Proactif', range: '41–60', color: '#EAB308', desc: 'Systèmes de détection en place, mais engagement partiel.' },
                        { name: 'Préventif', range: '61–80', color: '#22C55E', desc: 'Culture sécurité intégrée, signaux faibles traités systématiquement.' },
                        { name: 'Résilient', range: '81–100', color: '#3B82F6', desc: 'Sécurité = ADN organisationnel. Zéro accident sérieux sur 5 ans.' },
                      ].map(m => (
                        <div key={m.name} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: m.color }} />
                          <div><div className="text-sm font-semibold text-white">{m.name} <span className="text-gray-500 font-normal">({m.range})</span></div><div className="text-xs text-gray-400">{m.desc}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ROI SIMULATOR */}
                <div className="rounded-2xl p-8 mb-10 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>SAFETY PERCEPTION GAP™ — CONTEXTE</div>
                  <h2 className="text-xl font-bold text-white mb-6">Simulateur coût accidentologie</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div><label className="block text-sm text-gray-400 mb-2">Effectif : <strong className="text-white">{effectif} employés</strong></label>
                      <input type="range" min={10} max={5000} step={50} value={effectif} onChange={e => setEffectif(Number(e.target.value))} className="w-full" style={{ accentColor: TOOL_COLOR }} /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Taux d'accident annuel : <strong className="text-white">{tauxAccident}%</strong></label>
                      <input type="range" min={1} max={20} step={1} value={tauxAccident} onChange={e => setTauxAccident(Number(e.target.value))} className="w-full" style={{ accentColor: TOOL_COLOR }} /></div>
                  </div>
                  <div className="rounded-xl p-6 text-center" style={{ background: `${TOOL_COLOR}12`, border: `1px solid ${TOOL_COLOR}40` }}>
                    <div className="text-xs text-gray-400 mb-2">Coût annuel accidentologie estimé</div>
                    <div className="text-5xl font-extrabold mb-1" style={{ color: TOOL_COLOR }}>
                      {Math.round(effectif * (tauxAccident / 100) * 50000).toLocaleString()} MAD
                    </div>
                    <div className="text-xs text-gray-500">({effectif} employés × {tauxAccident}% × 50 000 MAD coût moyen accident)</div>
                    <div className="mt-3 text-sm text-gray-300">Une culture SHIELD™ résiliente peut réduire ce coût de <strong style={{ color: TOOL_COLOR }}>60 à 80%</strong></div>
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
                        {type === 'direction' ? '🎯 Direction / HSE' : '🦷 Opérateur Terrain'}
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
                      { tier: 'Discover', price: 'Gratuit', highlight: false, items: ['Score SHIELD™ partiel (3 piliers)', 'Niveau de maturité sécurité', '2 recommandations prioritaires', 'Safety Gap indicatif'] },
                      { tier: 'Intelligence', price: '7 900 MAD', highlight: true, items: ['Score complet 6 piliers SHIELD™', 'Safety Perception Gap™ mesuré', 'ROI prévention calculé', 'Rapport IA 12 pages', 'Brief SafeWalk™ terrain'] },
                      { tier: 'Transform', price: 'Sur devis', highlight: false, items: ['Accompagnement culture sécurité', 'Ateliers SHIELD™ managers', 'Programme BBS terrain', 'Plan Zero Accident Grave'] },
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>RAPPORT COMPLET — 12 PAGES</div>
                  <h2 className="text-xl font-bold text-white mb-6">Structure du rapport Intelligence™ SafeSignal</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { pages: '1–2', title: 'Safety Perception Gap™', desc: 'Score global et analyse de l’écart direction/terrain.' },
                      { pages: '3–4', title: 'Score détaillé SHIELD™', desc: 'Analyse des 6 piliers avec points forts et risques.' },
                      { pages: '5–6', title: 'ROI Prévention', desc: 'Coût estimé de l’accidentologie et gains prévention.' },
                      { pages: '7', title: 'Carte de chaleur signaux faibles', desc: 'Zones et processus à risque cartographiés.' },
                      { pages: '8', title: 'Plan d’action 90 jours', desc: 'Actions prioritaires terrain + management.' },
                      { pages: '9–10', title: 'Benchmark QHSE Maroc', desc: 'Positionnement par secteur et taille d’entreprise.' },
                      { pages: '11', title: 'Brief SafeWalk™', desc: 'Protocole d’audit terrain 12 zones généré.' },
                      { pages: '12', title: 'Prochaines étapes', desc: 'Modalités d’engagement Epitaphe360.' },
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
                  <h2 className="text-xl font-bold text-white mb-6">Écosystème technique SafeSignal™</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: '📋', name: 'Formulaire', desc: 'Questionnaire SHIELD™ adapté' },
                      { icon: '⚡', name: 'Automatisation', desc: 'Alertes signaux faibles auto' },
                      { icon: '🤖', name: 'Rapport IA', desc: 'Analyse GPT-4o sécurité' },
                      { icon: '📅', name: 'Booking', desc: 'RDV consultant HSE' },
                      { icon: '🦷', name: 'SafeWalk™', desc: 'Brief audit terrain 12 zones' },
                      { icon: '🏆', name: 'Benchmark QHSE', desc: 'Score vs secteur Maroc' },
                      { icon: '📊', name: 'Dashboard', desc: 'KPIs sécurité temps réel' },
                      { icon: '🌍', name: 'Multi-sites', desc: 'Comparatif établissements' },
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
                  <div className="text-4xl mb-4">🛡️</div>
                  <h2 className="text-2xl font-extrabold text-white mb-3">SafeSignal™ — Prochaine étape</h2>
                  <p className="text-gray-400 mb-2 max-w-lg mx-auto">Obtenez votre Safety Perception Gap™ gratuit en 8 minutes. 36 indicateurs culture sécurité analysés.</p>
                  <p className="text-gray-500 text-sm mb-6">Vous êtes {respondentType === 'direction' ? 'Direction / HSE' : 'Opérateur Terrain'} — l'évaluation sera adaptée.</p>
                  <button onClick={() => setStep('form')}
                    className="px-10 py-4 rounded-xl text-base font-bold text-black transition-all hover:opacity-90 hover:scale-105"
                    style={{ backgroundColor: TOOL_COLOR }}>Démarrer l'évaluation SHIELD™ — 36 questions · ~8 min →</button>
                </motion.div>

              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="SafeSignal™" toolColor={TOOL_COLOR} questions={questions} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}
            {step === 'gate' && (
              <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmailGate
                  toolName="SafeSignal�"
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
                  toolLabel="SafeSignal™"
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
                  toolLabel="SafeSignal™"
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
                  toolLabel="SafeSignal™"
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



