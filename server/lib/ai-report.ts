/**
 * BMI 360™ — Générateur de rapports IA Intelligence
 * Utilise l'API OpenAI (gpt-4o-mini) pour produire une analyse experte par outil.
 * Fallback: rapport structuré statique si OPENAI_API_KEY absent.
 */

export interface AIPillarAnalysis {
  pillar: string;
  pillarLabel: string;
  score: number;
  diagnostic: string;       // 2-3 phrases d'analyse du score
  risquesCles: string[];     // 2-3 risques concrets
  actions: string[];         // 2-3 actions prioritaires
  quickWin: string;          // 1 action rapide (< 30 jours)
}

export interface AIReport {
  generatedAt: string;
  model: string;
  executiveSummary: string;  // 3-4 phrases de synthèse DG
  pillarAnalyses: AIPillarAnalysis[];
  topRecommendations: Array<{
    priority: number;
    title: string;
    rationale: string;
    impact: 'Élevé' | 'Moyen' | 'Fort';
    timeline: string;
    roiEstimate?: string;
  }>;
  actionPlan90Days: Array<{
    week: string;
    actions: string[];
  }>;
  transformCTA: string;     // Phrase d'accroche pour proposer la mission
}

const TOOL_CONTEXTS: Record<string, string> = {
  commpulse: `Tu es un expert en communication interne et culture d'entreprise chez Epitaphe360 (agence MENA). 
L'outil CommPulse™ mesure la maturité de la communication interne via le modèle CLARITY™ (7 dimensions : Cohérence, Liens, Attention, Résultats, Inclusion, Transparence, Engagement).
Chaque pilier est noté /100. Le score global est la moyenne pondérée (C:18%, L:18%, A:15%, R:15%, I:12%, T:12%, Y:10%).`,

  talentprint: `Tu es un expert en marque employeur et capital humain chez Epitaphe360 (agence MENA).
L'outil TalentPrint™ mesure la maturité de la marque employeur via le modèle ATTRACT™ (7 dimensions : Authenticité, Talent Magnet, Turnover DNA, Réputation Digitale, Ambassadeurs, Culture Fitness, Transition).
Poids : A:18%, T1:15%, T2:15%, R:14%, AM:13%, CF:13%, TR:12%.`,

  impacttrace: `Tu es un expert en RSE et communication durable chez Epitaphe360 (agence MENA).
L'outil ImpactTrace™ mesure la maturité RSE via le modèle PROOF™ (5 dimensions : Purpose, Reach, Owned Evidence, Owned Inside, Feel).
Poids : P:25%, R:18%, O:20%, OC:20%, F:17%. L'innovation centrale est le Walk vs Talk Score™.`,

  safesignal: `Tu es un expert en culture sécurité QHSE/SST chez Epitaphe360 (agence MENA).
L'outil SafeSignal™ mesure la maturité de la culture sécurité via le modèle SHIELD™ (6 dimensions : Signal, Human, Internalization, Engagement, Learning, Data).
Poids : S:18%, H:22%, IA:14%, E:16%, L:14%, D:16%. L'innovation est le Safety Perception Gap™.`,

  eventimpact: `Tu es un expert en stratégie événementielle et ROI de marque chez Epitaphe360 (agence MENA).
L'outil EventImpact™ mesure la maturité événementielle via le modèle STAGE™ (5 dimensions : Strategy, Touch, Activation, Growth, Efficiency).
Poids : S:25%, T:25%, A:20%, G:20%, E:10%. Triple temporalité : Avant/Pendant/Après.`,

  spacescore: `Tu es un expert en brand physique et design d'espaces chez Epitaphe360 (agence MENA).
L'outil SpaceScore™ mesure la maturité de la marque physique via le modèle SPACE™ (5 dimensions : Signage, Presence, Atmosphere, Consistency, Expression).
Poids : S:22%, P:22%, A:23%, C:18%, E:15%. Innovation : Photo-Audit 12 zones.`,

  finnarrative: `Tu es un expert en communication financière et narrative d'entreprise chez Epitaphe360 (agence MENA).
L'outil FinNarrative™ mesure la maturité de la com financière via le modèle CAPITAL™ (6 dimensions : Clarity, Alignment, Proof, Institutionalization, Trust, Amplification & Listening).
Poids : C:18%, A:15%, P:20%, I:16%, T:16%, AL:15%. Innovation : Narrative Doctor™.`,
};

const MATURITY_NAMES: Record<number, Record<string, string>> = {
  1: { commpulse: 'Silent', talentprint: 'Invisible', impacttrace: 'Déni', safesignal: 'Pathological', eventimpact: 'Ad Hoc', spacescore: 'Generic', finnarrative: 'Opaque' },
  2: { commpulse: 'Broadcast', talentprint: 'Reactive', impacttrace: 'Déclaratif', safesignal: 'Reactive', eventimpact: 'Operational', spacescore: 'Partial', finnarrative: 'Compliant' },
  3: { commpulse: 'Dialogue', talentprint: 'Structured', impacttrace: 'Actif', safesignal: 'Calculative', eventimpact: 'Structured', spacescore: 'Functional', finnarrative: 'Narrative' },
  4: { commpulse: 'Engaged', talentprint: 'Magnetic', impacttrace: 'Intégré', safesignal: 'Proactive', eventimpact: 'Strategic', spacescore: 'Branded', finnarrative: 'Strategic' },
  5: { commpulse: 'Pulse', talentprint: 'Iconic', impacttrace: 'Régénératif', safesignal: 'Generative', eventimpact: 'Iconic', spacescore: 'Immersive', finnarrative: 'Reference' },
};

function buildPrompt(params: {
  toolId: string;
  companyName?: string;
  sector?: string;
  companySize?: string;
  globalScore: number;
  maturityLevel: number;
  pillarScores: Record<string, number>;
}): string {
  const { toolId, companyName, sector, companySize, globalScore, maturityLevel, pillarScores } = params;
  const context = TOOL_CONTEXTS[toolId] ?? '';
  const maturityName = MATURITY_NAMES[maturityLevel]?.[toolId] ?? `Niveau ${maturityLevel}`;

  const pillarsText = Object.entries(pillarScores)
    .map(([p, s]) => `  - ${p}: ${s}/100`)
    .join('\n');

  return `${context}

DONNÉES DE L'ÉVALUATION :
- Entreprise : ${companyName || 'Confidentiel'}
- Secteur : ${sector || 'Non précisé'}
- Taille : ${companySize || 'Non précisée'}
- Score global : ${globalScore}/100
- Niveau de maturité : ${maturityLevel}/5 — "${maturityName}"
- Scores par dimension :
${pillarsText}

MISSION : En tant qu'expert Epitaphe360, génère un rapport Intelligence™ structuré en JSON selon le schéma exact suivant. 
Le rapport doit être directement utilisable par un DG/DAF en COMEX. 
Ton analyse doit être précise, actionnable, contextualisée pour les entreprises MENA (Maroc/Afrique du Nord).
Ne mentionne pas explicitement l'IA dans le rapport — écris comme un expert humain.

SCHÉMA JSON ATTENDU (réponds UNIQUEMENT avec ce JSON, sans markdown, sans backticks) :
{
  "executiveSummary": "3-4 phrases de synthèse stratégique pour le DG",
  "pillarAnalyses": [
    {
      "pillar": "ID_PILIER",
      "pillarLabel": "Nom complet du pilier",
      "score": 0,
      "diagnostic": "2-3 phrases d'analyse du score de ce pilier",
      "risquesCles": ["risque 1", "risque 2"],
      "actions": ["action prioritaire 1", "action prioritaire 2"],
      "quickWin": "1 action concrète faisable en 30 jours"
    }
  ],
  "topRecommendations": [
    {
      "priority": 1,
      "title": "Titre de la recommandation",
      "rationale": "Pourquoi cette recommandation est prioritaire",
      "impact": "Élevé",
      "timeline": "30 jours / 3 mois / 6 mois",
      "roiEstimate": "Description qualitative du ROI attendu"
    }
  ],
  "actionPlan90Days": [
    { "week": "J1-J30", "actions": ["action 1", "action 2"] },
    { "week": "J31-J60", "actions": ["action 3", "action 4"] },
    { "week": "J61-J90", "actions": ["action 5", "action 6"] }
  ],
  "transformCTA": "Phrase d'invitation à la mission Transform avec Epitaphe360 (1 phrase percutante)"
}`;
}

// Rapport statique de fallback (si pas d'API key)
function buildFallbackReport(params: {
  toolId: string;
  globalScore: number;
  maturityLevel: number;
  pillarScores: Record<string, number>;
}): AIReport {
  const { globalScore, maturityLevel, pillarScores } = params;
  const pillars = Object.entries(pillarScores);
  const sorted = [...pillars].sort((a, b) => a[1] - b[1]);
  const weakest = sorted.slice(0, 2);
  const strongest = sorted.slice(-2).reverse();

  return {
    generatedAt: new Date().toISOString(),
    model: 'fallback',
    executiveSummary: `Votre organisation affiche un score global de ${globalScore}/100, correspondant au niveau de maturité ${maturityLevel}/5. ${globalScore < 40 ? 'Des actions urgentes sont nécessaires pour structurer votre démarche.' : globalScore < 70 ? 'Votre démarche est en bonne voie mais présente des lacunes significatives à adresser.' : 'Votre organisation est bien positionnée, avec des opportunités d\'optimisation identifiées.'} Les dimensions les plus critiques sont ${weakest.map(([p]) => p).join(' et ')}, qui nécessitent une attention prioritaire. Epitaphe360 vous accompagne pour transformer ce diagnostic en plan d'action concret.`,
    pillarAnalyses: pillars.map(([pillar, score]) => ({
      pillar,
      pillarLabel: pillar,
      score,
      diagnostic: score < 40
        ? `La dimension ${pillar} est critique avec un score de ${score}/100. Des actions immédiates sont requises.`
        : score < 70
        ? `La dimension ${pillar} est en développement (${score}/100). Des améliorations structurées peuvent générer un impact rapide.`
        : `La dimension ${pillar} est bien développée (${score}/100). L'objectif est de consolider et benchmarker.`,
      risquesCles: score < 40
        ? ['Absence de processus structurés', 'Risque de perte de compétitivité']
        : score < 70
        ? ['Pratiques non homogènes', 'Manque de mesure et de suivi']
        : ['Maintien de l\'excellence à long terme', 'Transmission des bonnes pratiques'],
      actions: score < 40
        ? ['Réaliser un audit approfondi', 'Définir des priorités et Quick Wins']
        : score < 70
        ? ['Formaliser les processus existants', 'Mettre en place des indicateurs de suivi']
        : ['Documenter et partager les bonnes pratiques', 'Explorer les innovations sectorielles'],
      quickWin: score < 50
        ? 'Organiser un atelier diagnostic avec les parties prenantes clés dans les 30 prochains jours'
        : 'Déployer un baromètre de suivi mensuel pour mesurer la progression',
    })),
    topRecommendations: [
      {
        priority: 1,
        title: `Adresser en priorité la dimension ${weakest[0]?.[0] ?? 'la plus faible'}`,
        rationale: `Score de ${weakest[0]?.[1] ?? 0}/100 — c'est le levier avec le plus fort potentiel d'amélioration rapide`,
        impact: 'Élevé',
        timeline: '30 jours',
        roiEstimate: 'Amélioration directe du score global et réduction des dysfonctionnements associés',
      },
      {
        priority: 2,
        title: 'Mettre en place un tableau de bord de suivi',
        rationale: 'Sans mesure régulière, les améliorations ne sont pas pérennes',
        impact: 'Moyen',
        timeline: '3 mois',
        roiEstimate: 'Visibilité accrue pour le management et décisions fondées sur des données',
      },
      {
        priority: 3,
        title: `Capitaliser sur la force de la dimension ${strongest[0]?.[0] ?? 'la plus forte'}`,
        rationale: `Score de ${strongest[0]?.[1] ?? 0}/100 — cette dimension peut servir de modèle interne`,
        impact: 'Moyen',
        timeline: '6 mois',
        roiEstimate: 'Démultiplication des bonnes pratiques dans toute l\'organisation',
      },
    ],
    actionPlan90Days: [
      { week: 'J1-J30', actions: ['Briefing COMEX sur les résultats du diagnostic', `Lancer le chantier ${weakest[0]?.[0] ?? '1'} en priorité absolue`] },
      { week: 'J31-J60', actions: ['Déploiement des Quick Wins identifiés', 'Formation des managers aux nouvelles pratiques'] },
      { week: 'J61-J90', actions: ['Premier bilan et mesure d\'impact', 'Préparation du plan d\'action semestre 2'] },
    ],
    transformCTA: 'Epitaphe360 vous propose une mission Transform sur mesure pour passer du diagnostic à la transformation concrète — contactez-nous pour un atelier de restitution de 45 minutes avec un expert.',
  };
}

export async function generateAIReport(params: {
  toolId: string;
  companyName?: string;
  sector?: string;
  companySize?: string;
  globalScore: number;
  maturityLevel: number;
  pillarScores: Record<string, number>;
}): Promise<AIReport> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('[AI Report] OPENAI_API_KEY not set — using fallback report');
    return buildFallbackReport(params);
  }

  const prompt = buildPrompt(params);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un expert consultant stratégique chez Epitaphe360. Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans explications.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 3000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[AI Report] OpenAI error:', err);
      return buildFallbackReport(params);
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return buildFallbackReport(params);

    const parsed = JSON.parse(content) as AIReport;
    parsed.generatedAt = new Date().toISOString();
    parsed.model = 'gpt-4o-mini';
    return parsed;
  } catch (err) {
    console.error('[AI Report] Generation failed:', err);
    return buildFallbackReport(params);
  }
}
