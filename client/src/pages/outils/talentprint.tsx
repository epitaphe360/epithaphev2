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

type Step = 'roi' | 'form' | 'gate' | 'discover' | 'pricing' | 'intelligence';

export default function TalentPrintPage() {
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(50);
  const [salaireMoyen, setSalaireMoyen] = useState(8000);
  // Turnover cost estimate : effectif × taux turnover moyen (20%) × coût remplacement (6 mois salaire)
  const turnoverCost = Math.round(effectif * 0.20 * (salaireMoyen * 6));

  const [enrichedAnswers, setEnrichedAnswers] = useState<Record<string, { value: number; pillar: string; weight: number }>>({});
  const [resultId, setResultId] = useState('');
  const [partialScores, setPartialScores] = useState<Record<string, number>>({});
  const [intelligencePrice, setIntelligencePrice] = useState(7500);
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
        setIntelligencePrice(res.intelligencePrice ?? 7500);
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
        title="TalentPrint™ — Scoring Marque Employeur"
        description="Mesurez l'attractivité de votre marque employeur avec TalentPrint™ (modèle ATTRACT). Score RH sur 100."
        canonicalPath="/outils/talentprint"
      />
      <SoftwareApplicationSchema name="TalentPrint™" description="Mesurez l'attractivité de votre marque employeur et votre capacité à retenir les talents." url="/outils/talentprint" priceMad={7500} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"TalentPrint™",url:"/outils/talentprint"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {step !== 'roi' && (
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setStep('roi')} className="text-gray-500 hover:text-white text-sm flex items-center gap-2 transition-colors">
                ← Retour
              </button>
              <div className="flex items-center gap-2 ml-auto">
                {(['form', 'gate', 'discover', 'pricing', 'intelligence'] as const).map((s) => {
                  const steps = ['form', 'gate', 'discover', 'pricing', 'intelligence'] as const;
                  const currentIdx = steps.indexOf(step as typeof steps[number]);
                  const sIdx = steps.indexOf(s);
                  return (<div key={s} className={`w-2 h-2 rounded-full transition-colors ${sIdx === currentIdx ? 'bg-white' : sIdx < currentIdx ? 'bg-green-500' : 'bg-gray-700'}`} />);
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
                    TalentPrint™ · Modèle ATTRACT™ · par Epitaphe360
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                    Your employer brand,<br />
                    <span style={{ color: TOOL_COLOR }}>decoded.</span>
                  </h1>
                  <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                    74% des entreprises recrutent difficilement. Un EVP fort réduit le turnover de 69%.
                    Mesurez l'écart entre votre promesse et la réalité vécue.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button onClick={() => setStep('form')}
                      className="px-6 py-3 rounded-xl text-sm font-bold text-black hover:opacity-90"
                      style={{ backgroundColor: TOOL_COLOR }}>Lancer mon audit →</button>
                    <a href="/outils" className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500 no-underline">Voir les outils</a>
                    <button onClick={() => document.getElementById('attract-pillars')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">En savoir plus</button>
                    <button className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-gray-700 hover:border-gray-500">Rapport PDF</button>
                  </div>
                </div>

                {/* STATS BANNER */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                  {[
                    { value: '74%', label: 'des entreprises éprouvent des difficultés à recruter des profils qualifiés', src: 'Gartner' },
                    { value: '20%', label: 'taux de turnover moyen au Maroc — soit 1 départ sur 5 chaque année', src: 'HCP' },
                    { value: '3×', label: 'meilleure rétention pour les entreprises avec un EVP (Employee Value Prop.) fort', src: 'LinkedIn' },
                    { value: '6 mois', label: 'de salaire en moyenne pour remplacer un employé qui part de l\'entreprise', src: 'SHRM' },
                  ].map(s => (
                    <div key={s.value} className="rounded-xl p-5 border border-gray-800 bg-gray-900/40 text-center">
                      <div className="text-3xl font-extrabold mb-1" style={{ color: TOOL_COLOR }}>{s.value}</div>
                      <p className="text-xs text-gray-400 leading-snug">{s.label}</p>
                      <p className="text-xs text-gray-600 mt-1">— {s.src}</p>
                    </div>
                  ))}
                </div>

                {/* POSITIONNEMENT UNIQUE */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>POSITIONNEMENT UNIQUE</div>
                  <h2 className="text-2xl font-bold text-white mb-4">Pourquoi TalentPrint™ ?</h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    TalentPrint™ est le premier outil de diagnostic de la marque employeur conçu pour les marchés francophones.
                    Il mesure l'écart entre ce que vous <strong className="text-white">dites</strong> aux candidats et ce qu'ils
                    <strong className="text-white"> vivent vraiment</strong> une fois recrutés — le fameux EVP Gap.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="rounded-xl p-5 border border-red-500/20 bg-red-500/5">
                      <h3 className="text-sm font-bold text-red-400 mb-3">Le problème actuel</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-2"><span className="text-red-500">✗</span> EVP défini en commé, non vécu en interne</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Turnover non calculé ni anticipé</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Réputation employeur non mesurée</li>
                        <li className="flex gap-2"><span className="text-red-500">✗</span> Onboarding sans structure ni KPIs</li>
                      </ul>
                    </div>
                    <div className="rounded-xl p-5" style={{ border: `1px solid ${TOOL_COLOR}30`, background: `${TOOL_COLOR}08` }}>
                      <h3 className="text-sm font-bold mb-3" style={{ color: TOOL_COLOR }}>Ce que fait TalentPrint™</h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Modèle ATTRACT™ en 7 dimensions</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> EVP Gap Score : discours vs vécu</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Turnover DNA Analysis™</li>
                        <li className="flex gap-2"><span style={{ color: TOOL_COLOR }}>✓</span> Plan d\'action RH 90 jours + rapport IA</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 7 PILIERS ATTRACT™ */}
                <div id="attract-pillars" className="mb-14">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                      style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>LES 7 PILIERS DU MODÈLE ATTRACT™</div>
                    <h2 className="text-2xl font-bold text-white">Qu'évalue TalentPrint™ ?</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { code: 'A', name: 'Authenticité', sub: 'EVP Gap Score', desc: 'Écart entre le discours de recrutement et l\'expérience réelle vécue. Premier facteur de turnover.', tags: ['Authenticité EVP', 'Gap discours/vécu', 'Engagements tenus'] },
                      { code: 'T1', name: 'Talent Magnet', sub: 'Attraction & différenciation', desc: 'Capacité à attirer les profils qualifiés sans recours systématique aux chasseurs de têtes.', tags: ['Attractivité', 'Différenciation', 'Candidatures spontanées'] },
                      { code: 'T2', name: 'Turnover DNA', sub: 'Analyse & prévention', desc: 'Diagnostic des causes profondes du turnover et calcul du coût réel des départs.', tags: ['Coût turnover', 'Entretiens sortie', 'Plans rétention'] },
                      { code: 'R', name: 'Réputation Digitale', sub: 'E-réputation employeur', desc: 'Qualité de votre présence digitale (LinkedIn, Glassdoor, page carrières) dans la perception talent.', tags: ['Glassdoor', 'LinkedIn', 'Page carrières'] },
                      { code: 'AM', name: 'Ambassadeurs', sub: 'Employee Advocacy', desc: 'Niveau d\'engagement de vos employés comme ambassadeurs spontanés de la marque.', tags: ['NPS employé', 'Cooptation', 'Employee Advocacy'] },
                      { code: 'CF', name: 'Culture Fitness', sub: 'Adhésion culturelle', desc: 'Alignement entre les valeurs affichées et les pratiques managériales quotidiennes.', tags: ['Valeurs vécues', 'Rituels culture', 'Fit culturel'] },
                      { code: 'TR', name: 'Transition', sub: 'Onboarding & offboarding', desc: 'Qualité du parcours d\'intégration et de la gestion des départs pour préserver la marque.', tags: ['Onboarding 90j', 'Rétention J+12m', 'Réseau alumni'] },
                    ].map((p) => (
                      <div key={p.code} className="rounded-xl p-5 border border-gray-800 bg-gray-900/30 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-extrabold shrink-0"
                          style={{ backgroundColor: `${TOOL_COLOR}25`, color: TOOL_COLOR }}>{p.code}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-bold text-white">{p.name}</span>
                            <span className="text-xs text-gray-500">— {p.sub}</span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2 leading-relaxed">{p.desc}</p>
                          <div className="flex flex-wrap gap-2">
                            {p.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded text-xs border"
                                style={{ borderColor: `${TOOL_COLOR}40`, color: TOOL_COLOR, background: `${TOOL_COLOR}10` }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SCORE GAUGE */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                      style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>VOTRE SCORE DE MATURITÉ MARQUE EMPLOYEUR</div>
                    <h2 className="text-2xl font-bold text-white">Les 5 niveaux ATTRACT™</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center">
                      <div className="relative w-44 h-44">
                        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                          <circle cx="100" cy="100" r="80" fill="none" stroke="#1f2937" strokeWidth="20" />
                          <circle cx="100" cy="100" r="80" fill="none" stroke={TOOL_COLOR} strokeWidth="20"
                            strokeDasharray={`${2 * Math.PI * 80 * 0.63} ${2 * Math.PI * 80 * 0.37}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-5xl font-extrabold" style={{ color: TOOL_COLOR }}>63</div>
                          <div className="text-gray-400 text-sm">/100</div>
                        </div>
                      </div>
                      <div className="text-center mt-3">
                        <div className="text-lg font-bold" style={{ color: '#22C55E' }}>Visible</div>
                        <div className="text-xs text-gray-500">Niveau 3 sur 5 — exemple illustratif</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Invisible', range: '0–20', color: '#EF4444', desc: 'Marque employeur inexistante. Recrutement difficile et coûteux.' },
                        { name: 'Emerging', range: '21–40', color: '#F97316', desc: 'Initiatives isolées sans EVP définie ni stratégie cohérente.' },
                        { name: 'Visible', range: '41–60', color: '#EAB308', desc: 'Présence digitale correcte mais EVP Gap encore mesurable.' },
                        { name: 'Magnetic', range: '61–80', color: '#22C55E', desc: 'Attractivité forte. Les talents viennent à vous spontanément.' },
                        { name: 'Iconic', range: '81–100', color: '#3B82F6', desc: 'Marque employeur de référence sectorielle. Benchmark Maroc.' },
                      ].map(m => (
                        <div key={m.name} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: m.color }} />
                          <div>
                            <div className="text-sm font-semibold text-white">{m.name} <span className="text-gray-500 font-normal">({m.range})</span></div>
                            <div className="text-xs text-gray-400">{m.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ROI SIMULATOR */}
                <div className="rounded-2xl p-8 mb-10 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>SIMULATEUR — COÛT ANNUEL DU TURNOVER</div>
                  <h2 className="text-xl font-bold text-white mb-2">Calculez votre coût de turnover réel</h2>
                  <p className="text-gray-400 text-sm mb-6">Remplacer un employé coûte en moyenne 6 mois de salaire. Quel est votre impact annuel ?</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                        placeholder="Ex : Lydec, Bank Of Africa..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" style={{ outlineColor: TOOL_COLOR }} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Secteur d'activité</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="pharma">Pharma / Santé</option><option value="auto">Automobile</option>
                        <option value="finance">Banque / Finance</option><option value="tech">Tech / IT</option>
                        <option value="energie">Énergie / Industrie</option><option value="luxury">Luxe / Retail</option>
                        <option value="btp">BTP / Immobilier</option><option value="agroalimentaire">Agroalimentaire</option>
                        <option value="textile">Textile / Mode</option><option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Effectif : <strong className="text-white">{effectif} employés</strong></label>
                      <input type="range" min={10} max={5000} step={10} value={effectif} onChange={e => setEffectif(Number(e.target.value))} className="w-full" style={{ accentColor: TOOL_COLOR }} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Salaire moyen : <strong className="text-white">{salaireMoyen.toLocaleString('fr-MA')} MAD/mois</strong></label>
                      <input type="range" min={3000} max={50000} step={500} value={salaireMoyen} onChange={e => setSalaireMoyen(Number(e.target.value))} className="w-full" style={{ accentColor: TOOL_COLOR }} />
                    </div>
                  </div>
                  <motion.div key={turnoverCost} initial={{ scale: 0.97 }} animate={{ scale: 1 }}
                    className="rounded-xl p-6 text-center"
                    style={{ background: `linear-gradient(135deg, ${TOOL_COLOR}15, ${TOOL_COLOR}05)`, border: `1px solid ${TOOL_COLOR}40` }}>
                    <p className="text-sm text-gray-400 mb-1">Coût annuel estimé de votre turnover</p>
                    <div className="text-4xl font-extrabold mb-1" style={{ color: TOOL_COLOR }}>{turnoverCost.toLocaleString('fr-MA')} MAD</div>
                    <p className="text-xs text-gray-500">20% turnover moyen × 6 mois salaire par remplacement × {effectif} employés</p>
                  </motion.div>
                </div>

                {/* RESPONDENT TYPE */}
                <div className="mb-10">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Je suis :</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['direction', 'terrain'] as const).map(type => (
                      <button key={type} onClick={() => setRespondentType(type)}
                        className={`px-4 py-4 rounded-xl border text-sm font-medium transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}
                        style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                        {type === 'direction' ? '👔 Direction / RH' : '👥 Collaborateur / Manager'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3-TIER MODEL */}
                <div className="mb-14">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                      style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>MODÈLE D'ÉVALUATION — 3 TIERS</div>
                    <h2 className="text-2xl font-bold text-white">Choisissez votre niveau d'analyse</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { tier: 'Discover', price: 'Gratuit', highlight: false, items: ['Score ATTRACT™ partiel (4 pilliers)', 'Niveau de maturité marque employeur', '2 recommandations RH prioritaires', 'Résultat immédiat en ligne'] },
                      { tier: 'Intelligence', price: '7 500 MAD', highlight: true, items: ['Score complet 7 pilliers ATTRACT™', 'EVP Gap Score™ Direction/Terrain', 'Rapport IA 12 pages personnalisé', 'Benchmark marque employeur Maroc', 'Plan RH action 90 jours'] },
                      { tier: 'Transform', price: 'Sur devis', highlight: false, items: ['Refonte EVP co-construite', 'Ateliers marque employeur', 'Stratégie réseaux & carrières', 'KPIs RH & tableau de bord'] },
                    ].map(t => (
                      <div key={t.tier} className="rounded-2xl p-6 border"
                        style={t.highlight ? { border: `2px solid ${TOOL_COLOR}`, background: `${TOOL_COLOR}10` } : { borderColor: '#374151' }}>
                        {t.highlight && (<div className="text-xs font-bold mb-3 px-2 py-0.5 rounded-full inline-block" style={{ backgroundColor: TOOL_COLOR, color: '#000' }}>✦ RECOMMANDÉ</div>)}
                        <div className="text-lg font-bold text-white mb-1">{t.tier}</div>
                        <div className="text-2xl font-extrabold mb-4" style={{ color: t.highlight ? TOOL_COLOR : '#fff' }}>{t.price}</div>
                        <ul className="space-y-2">{t.items.map(item => (<li key={item} className="flex gap-2 text-sm text-gray-400"><span style={{ color: t.highlight ? TOOL_COLOR : '#6b7280' }}>✓</span> {item}</li>))}</ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RAPPORT 12 PAGES */}
                <div className="rounded-2xl p-8 mb-14 border border-gray-800 bg-gray-900/40">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>CAPITAL RAPPORT COMPLET — 12 PAGES</div>
                  <h2 className="text-xl font-bold text-white mb-6">Structure du rapport Intelligence™ TalentPrint</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { pages: '1–2', title: 'Executive Summary RH', desc: 'Score global ATTRACT™, niveau de maturité et top 3 priorités.' },
                      { pages: '3–4', title: 'EVP Gap Analysis™', desc: 'Analyse de l\'écart discours vs vécu — Direction et Terrain.' },
                      { pages: '5–6', title: 'Turnover DNA™', desc: 'Diagnostic causes profondes, coût réel et segments à risque.' },
                      { pages: '7', title: 'Benchmark Marque Employeur', desc: 'Positionnement vs secteur Maroc et compétiteurs directs.' },
                      { pages: '8', title: 'Plan RH 90 jours', desc: 'Quick wins recrutement, rétention et onboarding à J+30/60/90.' },
                      { pages: '9–10', title: 'ROI Projections', desc: 'Impact financier attendu des actions recommandées.' },
                      { pages: '11', title: 'Feuille de Route Transform', desc: 'Architecture du programme EVP de transformation 6 mois.' },
                      { pages: '12', title: 'Prochaines étapes', desc: 'Modalités d\'engagement et planning Epitaphe360.' },
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                    style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR }}>FONCTIONNALITÉS ET INTÉGRATIONS</div>
                  <h2 className="text-xl font-bold text-white mb-6">Écosystème technique TalentPrint™</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: '📋', name: 'Formulaire', desc: 'Questionnaire RH adapté direction/terrain' },
                      { icon: '⚡', name: 'Automatisation', desc: 'Envoi auto rapport + relances' },
                      { icon: '🤖', name: 'Rapport IA', desc: 'Analyse GPT-4o personnalisée RH' },
                      { icon: '📅', name: 'Booking', desc: 'RDV consultant marque employeur' },
                      { icon: '📄', name: 'PDF Report', desc: 'Rapport 12 pages téléchargeable' },
                      { icon: '🌐', name: 'LinkedIn Audit', desc: 'Analyse page entreprise LinkedIn' },
                      { icon: '⭐', name: 'Glassdoor', desc: 'Intégration avis employés' },
                      { icon: '📊', name: 'Dashboard RH', desc: 'Suivi KPIs marque employeur' },
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
                  <div className="text-4xl mb-4">🎯</div>
                  <h2 className="text-2xl font-extrabold text-white mb-3">TalentPrint™ — Prochaine étape</h2>
                  <p className="text-gray-400 mb-2 max-w-lg mx-auto">
                    Obtenez votre score ATTRACT™ gratuit en 8 minutes. 42 indicateurs RH analysés. Résultat immédiat.
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    Vous êtes {respondentType === 'direction' ? 'une direction / RH' : 'un collaborateur / manager'} — l'évaluation sera adaptée à votre perspective.
                  </p>
                  <button onClick={() => setStep('form')}
                    className="px-10 py-4 rounded-xl text-base font-bold text-black transition-all hover:opacity-90 hover:scale-105"
                    style={{ backgroundColor: TOOL_COLOR }}>
                    Démarrer l'évaluation ATTRACT™ — 42 questions · ~8 min →
                  </button>
                </motion.div>

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
            {step === 'discover' && (
              <motion.div key="discover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <DiscoverResults
                  toolId={TOOL_ID}
                  toolLabel="TalentPrint™"
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
                  toolLabel="TalentPrint™"
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
                  toolLabel="TalentPrint™"
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



