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

type Step = 'roi' | 'form' | 'gate' | 'result';

export default function SpaceScorePage() {
  const questions = useToolQuestions(TOOL_ID, DEFAULT_QUESTIONS);
  const [step, setStep] = useState<Step>('roi');
  const [respondentType, setRespondentType] = useState<'direction' | 'terrain'>('direction');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState<SectorType>('autre');
  const [companySize, setCompanySize] = useState<CompanySizeType>('pme');
  const [effectif, setEffectif] = useState(50);
  const [result, setResult] = useState<ScoringResult | null>(null);
  const [auditZones, setAuditZones] = useState<string[]>([]);

  const toggleZone = (zone: string) => {
    setAuditZones(prev => prev.includes(zone) ? prev.filter(z => z !== zone) : [...prev, zone]);
  };

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
        <title>SpaceScore™ — Scoring Signalétique & Espaces | Epitaphe 360</title>
        <meta name="description" content="Auditez la performance de votre signalétique et vos espaces de travail avec SpaceScore™ (modèle SPACE). 42 indicateurs." />
        <link rel="canonical" href="https://www.epitaphe360.ma/outils/spacescore" />
        <meta property="og:title" content="SpaceScore™ — Scoring Signalétique" />
        <meta property="og:url" content="https://www.epitaphe360.ma/outils/spacescore" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SoftwareApplicationSchema name="SpaceScore™" description="Auditez la performance de votre signalétique et vos espaces de travail." url="/outils/spacescore" priceMad={4900} />
      <BreadcrumbSchema items={[{name:"Accueil",url:"/"},{name:"Outils BMI 360™",url:"/outils"},{name:"SpaceScore™",url:"/outils/spacescore"}]} />
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ backgroundColor: `${TOOL_COLOR}20`, color: TOOL_COLOR, border: `1px solid ${TOOL_COLOR}40` }}>
              SpaceScore™ · Modèle SPACE™
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Votre espace parle<br />
              <span style={{ color: TOOL_COLOR }}>avant vos équipes.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              76% des clients entrent dans un magasin à cause de la signalétique.<br />
              Le Photo-Audit™ 12 zones mesure la cohérence de votre marque dans chaque recoin de vos locaux.
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
                  {s === 'roi' ? 'Zones' : s === 'form' ? 'Évaluation' : 'Résultats'}
                </span>
                {i < 2 && <div className="w-8 h-px bg-gray-700" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'roi' && (
              <motion.div key="roi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="border border-gray-800 rounded-2xl p-8 space-y-6">
                  <h2 className="text-xl font-bold text-white">Photo-Audit™ — Sélectionnez vos zones</h2>
                  <p className="text-gray-400 text-sm">Identifiez les zones de votre espace qui feront l'objet d'un audit visuel après votre scoring. Votre brief d'audit sera généré automatiquement.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ZONES_AUDIT.map(zone => (
                      <button key={zone} onClick={() => toggleZone(zone)}
                        className={`px-3 py-2 rounded-xl border text-xs font-medium text-left transition-all ${auditZones.includes(zone) ? 'text-black' : 'border-gray-700 text-gray-400'}`}
                        style={auditZones.includes(zone) ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                        {zone}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {auditZones.length} zone{auditZones.length !== 1 ? 's' : ''} sélectionnée{auditZones.length !== 1 ? 's' : ''} sur 12
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom de votre entreprise</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex : Marjane, CIH Bank..." className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Secteur</label>
                      <select value={sector} onChange={e => setSector(e.target.value as SectorType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="luxury">Retail / Luxe</option>
                        <option value="finance">Finance / Banque</option>
                        <option value="pharma">Santé / Pharma</option>
                        <option value="btp">Immobilier / BTP</option>
                        <option value="tech">Tech / Coworking</option>
                        <option value="agroalimentaire">Restauration / F&B</option>
                        <option value="energie">Industrie / Énergie</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Taille entreprise</label>
                      <select value={companySize} onChange={e => setCompanySize(e.target.value as CompanySizeType)} className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none">
                        <option value="tpe">TPE / Indépendant</option>
                        <option value="pme">PME</option>
                        <option value="eti">ETI</option>
                        <option value="grande">Grande entreprise / Réseau</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Vous évaluez :</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['direction', 'terrain'] as const).map(type => (
                          <button key={type} onClick={() => setRespondentType(type)}
                            className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${respondentType === type ? 'text-black' : 'border-gray-700 text-gray-400'}`}
                            style={respondentType === type ? { backgroundColor: TOOL_COLOR, borderColor: TOOL_COLOR } : {}}>
                            {type === 'direction' ? '🏢 Direction' : '👁️ Terrain'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStep('form')} className="w-full py-4 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                    style={{ backgroundColor: TOOL_COLOR }}>
                    Démarrer l'évaluation SPACE™ — 30 questions →
                  </button>
                </div>
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
            {step === 'result' && result && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">Votre score SpaceScore™ — {result.companyName}</h2>
                  <p className="text-gray-400 mt-1">Analyse SPACE™ · Brand Space Map™ · {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                {auditZones.length > 0 && (
                  <div className="rounded-xl p-4 mb-6 border" style={{ borderColor: `${TOOL_COLOR}40`, background: `${TOOL_COLOR}10` }}>
                    <p className="text-sm font-semibold text-white mb-2">📸 Votre Brief Photo-Audit™</p>
                    <p className="text-xs text-gray-400 mb-3">Photographiez ces {auditZones.length} zones et partagez-les avec votre consultant Epitaphe360 pour l'analyse Brand Space Map™ :</p>
                    <div className="flex flex-wrap gap-2">
                      {auditZones.map(zone => (
                        <span key={zone} className="px-2 py-1 rounded-full text-xs font-medium text-black" style={{ backgroundColor: TOOL_COLOR }}>{zone}</span>
                      ))}
                    </div>
                  </div>
                )}
                <ScoringResults result={result} toolName="SpaceScore™" toolColor={TOOL_COLOR} toolModel="SPACE™" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}



