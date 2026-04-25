import { useState } from 'react';
import { useToolQuestions } from '@/hooks/useToolQuestions';
import { Helmet } from 'react-helmet-async';
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

const TOOL_COLOR = '#F59E0B'; // Ambre pour SpaceScore
const TOOL_ID = 'spacescore' as const;

const ZONES_AUDIT = [
  "Entrée principale & accueil", "Signalétique directionnelle", "Salle d'attente / Réception",
  "Salles de réunion", "Espaces de travail collaboratifs", "Bureaux individuels",
  "Espaces de pause / Cafétéria", "Couloirs & circulations", "Fenêtres & façade",
  "Zone d'exposition produits / showroom", "Façade & enseigne extérieure", "Parking & abords"
];

const DEFAULT_QUESTIONS: ScoringQuestion[] = [
  // S — Signalétique
  { id: 's1', pillar: 'S', pillarLabel: 'Signalétique', text: 'Notre signalétique directionnelle permet à un visiteur de s\'orienter seul sans assistance.', weight: 3 },
  { id: 's2', pillar: 'S', pillarLabel: 'Signalétique', text: 'Les enseignes, panneaux et affichages sont en bon état, lisibles et professionnels.', weight: 2 },
  { id: 's3', pillar: 'S', pillarLabel: 'Signalétique', text: 'La signalétique utilise de manière cohérente les codes graphiques de notre marque (typographie, couleurs, logo).', weight: 3 },
  { id: 's4', pillar: 'S', pillarLabel: 'Signalétique', text: '76% des clients entrent grâce à la signalétique — la nôtre est suffisamment visible depuis la rue.', weight: 2 },
  { id: 's5', pillar: 'S', pillarLabel: 'Signalétique', text: 'Les informations pratiques (horaires, wifi, urgences) sont clairement affichées.', weight: 1 },
  { id: 's6', pillar: 'S', pillarLabel: 'Signalétique', text: 'La signalétique a été révisée et mise à jour dans les 2 dernières années.', weight: 2 },
  // P — Présence de Marque
  { id: 'p1', pillar: 'P', pillarLabel: 'Présence de Marque', text: 'Notre logo et identité visuelle sont visibles dès l\'entrée et tout au long du parcours visiteur.', weight: 3 },
  { id: 'p2', pillar: 'P', pillarLabel: 'Présence de Marque', text: 'Les couleurs, matériaux et finitions de nos espaces reflètent notre positionnement de marque.', weight: 3 },
  { id: 'p3', pillar: 'P', pillarLabel: 'Présence de Marque', text: 'Les visuels affichés (photos, illustrations, écrans) sont de qualité professionnelle et actualisés.', weight: 2 },
  { id: 'p4', pillar: 'P', pillarLabel: 'Présence de Marque', text: 'Les supports imprimés (brochures, plaquettes) disponibles dans l\'espace sont à jour et cohérents.', weight: 2 },
  { id: 'p5', pillar: 'P', pillarLabel: 'Présence de Marque', text: 'La façade extérieure reflète dignement notre image de marque et attire le regard.', weight: 2 },
  { id: 'p6', pillar: 'P', pillarLabel: 'Présence de Marque', text: 'Nos espaces racontent une histoire de marque cohérente à travers leur aménagement.', weight: 2 },
  // A — Ambiance
  { id: 'a1', pillar: 'A', pillarLabel: 'Ambiance', text: 'L\'ambiance lumineuse (naturelle + artificielle) est appropriée à notre activité et agréable.', weight: 2 },
  { id: 'a2', pillar: 'A', pillarLabel: 'Ambiance', text: 'L\'environnement sonore (musique, niveau de bruit) est maîtrisé et cohérent avec notre image.', weight: 2 },
  { id: 'a3', pillar: 'A', pillarLabel: 'Ambiance', text: 'La propreté et le rangement des espaces sont irréprochables à tout moment de la journée.', weight: 3 },
  { id: 'a4', pillar: 'A', pillarLabel: 'Ambiance', text: 'La température et la qualité de l\'air sont confortables et contrôlées.', weight: 2 },
  { id: 'a5', pillar: 'A', pillarLabel: 'Ambiance', text: 'Les espaces communs donnent une impression de dynamisme, de vie et d\'activité positive.', weight: 2 },
  { id: 'a6', pillar: 'A', pillarLabel: 'Ambiance', text: 'Nos visiteurs commentent positivement l\'ambiance et le cadre de travail lors de leurs visites.', weight: 3 },
  // C — Cohérence
  { id: 'c1', pillar: 'C', pillarLabel: 'Cohérence', text: 'Il existe un Brand Space Guide documentant les standards d\'aménagement de nos espaces.', weight: 2 },
  { id: 'c2', pillar: 'C', pillarLabel: 'Cohérence', text: 'Tous nos sites ou points de vente offrent une expérience visuelle cohérente.', weight: 3 },
  { id: 'c3', pillar: 'C', pillarLabel: 'Cohérence', text: 'L\'espace physique est cohérent avec nos supports digitaux (site web, réseaux sociaux).', weight: 2 },
  { id: 'c4', pillar: 'C', pillarLabel: 'Cohérence', text: 'Les nouvelles recrues trouvent leurs nouvelles conditions de travail conformes à l\'image externe de l\'entreprise.', weight: 2 },
  { id: 'c5', pillar: 'C', pillarLabel: 'Cohérence', text: 'Après chaque rénovation ou déménagement, la cohérence de marque est préservée et vérifiée.', weight: 2 },
  { id: 'c6', pillar: 'C', pillarLabel: 'Cohérence', text: 'Les photos de nos espaces publiées sur les réseaux sociaux sont cohérentes avec l\'expérience réelle.', weight: 2 },
  // E — Expérience Visiteur
  { id: 'e1', pillar: 'E', pillarLabel: 'Expérience Visiteur', text: 'Un visiteur découvrant nos locaux pour la première fois en ressort avec une excellente première impression.', weight: 3 },
  { id: 'e2', pillar: 'E', pillarLabel: 'Expérience Visiteur', text: 'Le parcours visiteur (de l\'entrée à la sortie) est conçu pour guider et valoriser l\'expérience.', weight: 3 },
  { id: 'e3', pillar: 'E', pillarLabel: 'Expérience Visiteur', text: 'L\'accueil (physique ou digital) est professionnel, chaleureux et représentatif de notre culture.', weight: 3 },
  { id: 'e4', pillar: 'E', pillarLabel: 'Expérience Visiteur', text: 'Les espaces favorisent les échanges informels, la créativité et la collaboration.', weight: 2 },
  { id: 'e5', pillar: 'E', pillarLabel: 'Expérience Visiteur', text: 'Nous avons explicitement conçu un "First Impression Test™" et l\'avons fait réaliser par des personnes externes.', weight: 2 },
  { id: 'e6', pillar: 'E', pillarLabel: 'Expérience Visiteur', text: 'Les locaux contribuent positivement à notre attractivité employeur (talent et recrutement).', weight: 2 },
];

const PILLAR_COLORS: Record<string, string> = {
  S: '#F59E0B', P: '#FBBF24', A: '#FCD34D', C: '#D97706', E: '#B45309',
};

function generateRecommendations(pillarScores: Array<{ pillarId: string; score: number }>, globalScore: number): string[] {
  const recs: string[] = [];
  const sorted = [...pillarScores].sort((a, b) => a.score - b.score);
  const weakest = sorted.slice(0, 3);
  if (globalScore < 40) recs.push("Impact immédiat : 76% des clients entrent dans un établissement à cause de la signalétique. Votre score révèle un espace qui nuit à votre image de marque. Un audit Photo-Audit™ 12 zones s'impose en priorité.");
  weakest.forEach(ps => {
    if (ps.pillarId === 'S') recs.push("Signalétique : réalisez un audit de toutes vos signalétiques (intérieure + extérieure) et établissez un plan de mise aux normes graphiques avec un designer spécialisé en signalétique de marque.");
    if (ps.pillarId === 'P') recs.push("Présence de marque : créez un Brand Space Guide avec les standards visuels (logo, couleurs, typographies, matériaux recommandés) et systématisez son application lors de chaque réaménagement.");
    if (ps.pillarId === 'A') recs.push("Ambiance : définissez votre 'Brand Sensory Profile' (lumière, son, température, propreté) avec des standards mesurables et un processus de contrôle régulier.");
    if (ps.pillarId === 'C') recs.push("Cohérence : comparez vos espaces physiques avec votre site web et vos réseaux sociaux. L'écart de perception nuit à votre crédibilité. Utilisez la Brand Space Map™ pour identifier les zones prioritaires.");
    if (ps.pillarId === 'E') recs.push("Expérience visiteur : faites réaliser un First Impression Test™ par 3 personnes externes (clients, partenaires, candidats) et documentez leurs retours spontanés dans les 5 premières minutes.");
  });
  return recs.slice(0, 4);
}

type Step = 'roi' | 'form' | 'gate' | 'discover' | 'pricing' | 'intelligence';

export default function SpaceScorePage() {
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(50);
  const [auditZones, setAuditZones] = useState<string[]>([]);

  const toggleZone = (zone: string) => {
    setAuditZones(prev => prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]);
  };

  const [enrichedAnswers, setEnrichedAnswers] = useState<Record<string, { value: number; pillar: string; weight: number }>>({});
  const [resultId, setResultId] = useState('');
  const [partialScores, setPartialScores] = useState<Record<string, number>>({});
  const [intelligencePrice, setIntelligencePrice] = useState(6500);
  const [discoverGlobalScore, setDiscoverGlobalScore] = useState(0);
  const [discoverMaturityLevel, setDiscoverMaturityLevel] = useState(1);
  const [intelligenceData, setIntelligenceData] = useState<{ globalScore: number; maturityLevel: number; pillarScores: Record<string, number>; aiReport: unknown } | null>(null);

  const [chiffreAffaires, setChiffreAffaires] = useState(5000000);

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
        setIntelligencePrice(res.intelligencePrice ?? 6500);
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
      <Helmet>
        <title>SpaceScore™ — Scoring Signalétique & Espaces | Epitaphe 360</title>
        <meta name="description" content="Auditez la performance de votre signalétique et vos espaces de travail avec SpaceScore™ (modèle SPACE). 42 indicateurs." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/spacescore" />
        <meta property="og:title" content="SpaceScore™ — Scoring Signalétique" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/spacescore" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="SpaceScore™" description="Auditez la performance de votre signalétique et vos espaces de travail." url="/outils/spacescore" priceMad={6500} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"SpaceScore™",url:"/outils/spacescore"}]} />
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
                    SpaceScore™ · Modèle SPACE™ · par Epitaphe360
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Votre espace parle<br /><span style={{ color: TOOL_COLOR }}>avant vos équipes.</span>
                  </h1>
                  <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                    76% des clients entrent dans un magasin à cause de la signalétique. La première impression se forme en 7 secondes.
                    Le Photo-Audit™ 12 zones mesure la cohérence de votre marque dans chaque espace.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={() => setStep('form')} className="px-6 py-3 rounded-xl text-sm font-bold text-black hover:opacity-90" style={{ backgroundColor: TOOL_COLOR }}>Lancer mon audit →</button>
                    <a href="/outils" className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 no-underline">Voir les outils</a>
                    <button onClick={() => document.getElementById('space-pillars')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">En savoir plus</button>
                    <button className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">Rapport PDF</button>
                  </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                  {[
                    { value: '76%', label: 'des clients choisissent un point de vente grâce à la signalétique extérieure', src: 'Nielsen' },
                    { value: '7 sec', label: 'pour former une première impression de votre espace. Impossible à défaire.', src: 'Harvard' },
                    { value: '38%', label: 'des décisions d’achat sont influencées par l’aménagement spatial', src: 'CNRS' },
                    { value: '45%', label: 'des espaces professionnels ne sont pas alignés avec l’identité de marque', src: 'SpaceScore™' },
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
                  <h2 className="text-2xl font-bold text-white mb-4">Pourquoi SpaceScore™ ?</h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    SpaceScore™ est le premier audit scoring de la cohérence entre votre identité de marque et votre espace physique.
                    Le <strong className="text-white">Photo-Audit™ 12 zones</strong> cartographie les ruptures de cohérence dans chaque recoin de vos locaux.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="rounded-xl p-5 border border-red-500/20 bg-red-500/5">
                      <h3 className="text-sm font-bold text-red-400 mb-3">L’espace sans stratégie</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Signalétique vieillissante et incohérente</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Espace ne reflète pas la marque</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Expérience visiteur découchée du digital</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> -12% CA estimé par non-optimisation</li>
                      </ul>
                    </div>
                    <div className="rounded-xl p-5" style={{ border: `1px solid ${TOOL_COLOR}30`, background: `${TOOL_COLOR}08` }}>
                      <h3 className="text-sm font-bold mb-3" style={{ color: TOOL_COLOR }}>Ce que fait SpaceScore™</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Modèle SPACE™ en 5 dimensions</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Photo-Audit™ 12 zones</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> ROI optimisation espaces calculé</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Brief d'aménagement généré</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 12 ZONES AUDIT */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>PHOTO-AUDIT™ 12 ZONES</div>
                  <h2 className="text-xl font-bold text-white mb-6">Quelles zones seront auditées ?</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {ZONES_AUDIT.map(zone => (
                      <div key={zone} className="px-3 py-2 rounded-lg border border-gray-700 text-xs text-gray-400 text-center">{zone}</div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Vous sélectionnerez les zones pertinentes pour votre établissement lors du scoring.</p>
                </div>

                {/* 5 PILIERS SPACE™ */}
                <div id="space-pillars" className="mb-14">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>LES 5 PILIERS DU MODÈLE SPACE™</div>
                    <h2 className="text-2xl font-bold text-white">Qu'évalue SpaceScore™ ?</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { code: 'S', name: 'Signalétique', sub: 'Marquage & orientation', desc: 'Lisibilité, cohérence et impact de la signalétique extérieure et intérieure. Premier contact visuel avec votre marque.', tags: ['Signalétique ext.', 'Fléchage', 'Vitrine'] },
                      { code: 'P', name: 'Présence de Marque', sub: 'Identité visuelle', desc: 'Application de la charte graphique (logo, couleurs, typo) dans tous les supports et matériaux de l’espace.', tags: ['Logo', 'Charte graphique', 'Matériaux'] },
                      { code: 'A', name: 'Ambiance', sub: 'Cohérence sensorielle', desc: 'Lumière, couleur, son, odeur : l’ambiance crée l’émotion. Est-elle alignée avec votre positionnement de marque ?', tags: ['Lumière', 'Couleurs', 'Atmosphère'] },
                      { code: 'C', name: 'Cohérence', sub: 'Alignement multi-points', desc: 'Tous vos points de contact (accueil, bureaux, espaces clients) transmettent-ils le même message de marque ?', tags: ['Accueil', 'Bureaux', 'Espaces client'] },
                      { code: 'E', name: 'Expérience Visiteur', sub: 'Parcours & fonctionnalité', desc: 'Fluidité du parcours visiteur. L’espace facilite-t-il la visite et crée-t-il une expérience mémorable ?', tags: ['Parcours', 'NPS espace', 'Accessibilité'] },
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>SCORE DE MATURITÉ ESPACE</div>
                    <h2 className="text-2xl font-bold text-white">Les 5 niveaux SPACE™</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center">
                      <div className="relative w-44 h-44">
                        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                          <circle cx="100" cy="100" r="80" fill="none" stroke="#1f2937" strokeWidth="20" />
                          <circle cx="100" cy="100" r="80" fill="none" stroke={TOOL_COLOR} strokeWidth="20"
                            strokeDasharray={`${2 * Math.PI * 80 * 0.45} ${2 * Math.PI * 80 * 0.55}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-5xl font-extrabold" style={{ color: TOOL_COLOR }}>45</div>
                          <div className="text-gray-400 text-sm">/100</div>
                        </div>
                      </div>
                      <div className="text-center mt-3"><div className="text-lg font-bold" style={{ color: '#EAB308' }}>Cohérent</div><div className="text-xs text-gray-500">Niveau 3 sur 5 — exemple illustratif</div></div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Invisible', range: '0–20', color: '#EF4444', desc: 'Espace générique. La marque est absente ou illisible dans l’espace.' },
                        { name: 'Basique', range: '21–40', color: '#F97316', desc: 'Signalétique fonctionnelle mais sans personnalité de marque.' },
                        { name: 'Cohérent', range: '41–60', color: '#EAB308', desc: 'Marque présente mais ambiance à renforcer sur certaines zones.' },
                        { name: 'Mémorable', range: '61–80', color: '#22C55E', desc: 'Expérience spatiale forte et mémorable alignée sur la marque.' },
                        { name: 'Signature', range: '81–100', color: '#3B82F6', desc: 'L’espace EST la marque. Chaque détail communique un message précis.' },
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>SIMULATEUR IMPACT CA</div>
                  <h2 className="text-xl font-bold text-white mb-6">Estimez le CA perdu par non-optimisation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div><label className="block text-sm text-gray-400 mb-2">Chiffre d'affaires annuel : <strong className="text-white">{(chiffreAffaires/1000000).toFixed(1)}M MAD</strong></label>
                      <input type="range" min={500000} max={100000000} step={500000} value={chiffreAffaires} onChange={e => setChiffreAffaires(Number(e.target.value))} className="w-full" style={{ accentColor: TOOL_COLOR }} /></div>
                    <div className="rounded-xl p-5 text-center" style={{ background: `${TOOL_COLOR}12`, border: `1px solid ${TOOL_COLOR}40` }}>
                      <div className="text-xs text-gray-400 mb-2">CA potentiellement perdu</div>
                      <div className="text-4xl font-extrabold" style={{ color: TOOL_COLOR }}>
                        {Math.round(chiffreAffaires * 0.12).toLocaleString()} MAD
                      </div>
                      <div className="text-xs text-gray-500 mt-1">(12% CA non réalisé en l'absence d'optimisation espace)</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex : Marjane, CIH Bank..." className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" /></div>
                    <div><label className="block text-sm text-gray-400 mb-2">Secteur d'activité</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="luxury">Retail / Luxe</option><option value="finance">Finance / Banque</option>
                        <option value="pharma">Santé / Pharma</option><option value="btp">Immobilier / BTP</option>
                        <option value="tech">Tech / Coworking</option><option value="agroalimentaire">Restauration / F&amp;B</option>
                        <option value="energie">Industrie / Énergie</option><option value="autre">Autre</option>
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
                        {type === 'direction' ? '🏢 Direction / DG' : '📍 Responsable Site'}
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
                      { tier: 'Discover', price: 'Gratuit', highlight: false, items: ['Score SPACE™ partiel (3 piliers)', 'Niveau de maturité espace', '2 recommandations espaces', 'Brief Photo-Audit™ indicatif'] },
                      { tier: 'Intelligence', price: '6 500 MAD', highlight: true, items: ['Score complet 5 piliers SPACE™', 'Photo-Audit™ 12 zones complèt', 'ROI CA optimisation estimé', 'Rapport IA 12 pages', 'Brief aménagement généré'] },
                      { tier: 'Transform', price: 'Sur devis', highlight: false, items: ['Accompagnement aménagement', 'Audit photo terrain complet', 'Plan espace marque 12 mois', 'Sélection prestataires'] },
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
                  <div className="text-4xl mb-4">🏗️</div>
                  <h2 className="text-2xl font-extrabold text-white mb-3">SpaceScore™ — Prochaine étape</h2>
                  <p className="text-gray-400 mb-2 max-w-lg mx-auto">Obtenez votre Score SPACE™ gratuit en 6 minutes. 30 indicateurs espace &amp; signalétique analysés.</p>
                  <button onClick={() => setStep('form')}
                    className="px-10 py-4 rounded-xl text-base font-bold text-black transition-all hover:opacity-90 hover:scale-105"
                    style={{ backgroundColor: TOOL_COLOR }}>Démarrer l'évaluation SPACE™ — 30 questions · ~6 min →</button>
                </motion.div>

              </motion.div>
            )}

            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <ScoringQuestionnaire toolId={TOOL_ID} toolName="SpaceScore™" toolColor={TOOL_COLOR} questions={questions} onComplete={handleComplete} variant={respondentType} />
              </motion.div>
            )}
            {step === 'gate' && (
              <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmailGate
                  toolName="SpaceScore�"
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
                  toolLabel="SpaceScore™"
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
                  toolLabel="SpaceScore™"
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
                  toolLabel="SpaceScore™"
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



