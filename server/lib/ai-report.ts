/**
 * BMI 360™ — Générateur de rapports IA Intelligence
 * Utilise l'API OpenAI (gpt-4o) pour produire une analyse stratégique de niveau C-suite.
 * Fallback: rapport structuré dynamique si OPENAI_API_KEY absent.
 */

export interface AIPillarAnalysis {
  pillar: string;
  pillarLabel: string;
  score: number;
  niveau?: string;                 // "Critique" | "Préoccupant" | "En développement" | "Performant" | "Excellence"
  diagnostic: string;              // 4-5 phrases d'analyse approfondie et spécifique
  impactOrganisationnel?: string;  // Impact concret sur la performance de l'organisation
  benchmarkMENA?: string;          // Positionnement vs entreprises MENA similaires
  risquesCles: string[];           // 3-4 risques avec conséquences concrètes
  facteursBloquants?: string[];    // 2-3 facteurs organisationnels bloquant la progression
  actions: string[];               // 3-4 actions prioritaires concrètes et nommées
  quickWin: string;                // 1 action ultra-spécifique faisable en < 30 jours
  indicateursCles?: string[];      // 2-3 KPIs pour mesurer le progrès
  prochainNiveau?: string;         // Ce qui permettrait de passer au niveau de maturité suivant
}

export interface AIReport {
  generatedAt: string;
  model: string;
  syntheseDirecteur?: string;       // Synthèse 2 paragraphes, ton lettre Senior Partner
  executiveSummary: string;         // 4-5 phrases de synthèse stratégique COMEX
  positionConcurrentielle?: string; // Positionnement vs secteur MENA
  risqueStrategique?: string;       // Le risque stratégique #1 de l'organisation
  opportuniteStrategique?: string;  // L'opportunité prioritaire à saisir
  pillarAnalyses: AIPillarAnalysis[];
  topRecommendations: Array<{
    priority: number;
    title: string;
    rationale: string;
    impact: 'Élevé' | 'Moyen' | 'Fort';
    effortRequis?: 'Faible' | 'Moyen' | 'Important';
    timeline: string;
    roiEstimate: string;
    responsable?: string;
    prerequis?: string;
  }>;
  actionPlan90Days: Array<{
    week: string;
    actions: string[];
    livrable?: string;
    kpi?: string;
  }>;
  messageDirigeant?: string;
  transformCTA: string;
}

// ─── Pilier Definitions ──────────────────────────────────────────────────────

const TOOL_PILLAR_LABELS: Record<string, Record<string, { label: string; description: string; weight: number }>> = {
  commpulse: {
    C:  { label: 'Cohérence',    description: "Alignement et consistance des messages à travers tous les canaux et niveaux hiérarchiques",              weight: 18 },
    L:  { label: 'Liens',        description: "Qualité des relations transversales et verticales, circulation de l'information entre équipes",           weight: 18 },
    A:  { label: 'Attention',    description: "Écoute active, prise en compte des remontées terrain, mécanismes de feedback structurés",                 weight: 15 },
    R:  { label: 'Résultats',    description: "Mesure, évaluation et amélioration continue de l'efficacité communicationnelle",                          weight: 15 },
    I:  { label: 'Inclusion',    description: "Intégration de toutes les populations (terrain, production, siège, filiales, diversité culturelle)",      weight: 12 },
    T:  { label: 'Transparence', description: "Clarté sur la stratégie, les décisions, les résultats et le contexte externe",                            weight: 12 },
    Y:  { label: 'Engagement',   description: "Mobilisation émotionnelle, adhésion à la vision, sentiment d'appartenance et fierté d'entreprise",       weight: 10 },
  },
  talentprint: {
    A:  { label: 'Authenticité',       description: "Cohérence entre la promesse employeur affichée et la réalité quotidiennement vécue par les collaborateurs", weight: 18 },
    T1: { label: 'Talent Magnet',      description: "Capacité à attirer les profils cibles, visibilité et attractivité sur les plateformes emploi",              weight: 15 },
    T2: { label: 'Turnover DNA',       description: "Compréhension des dynamiques de départ, maîtrise du turn-over subi vs choisi",                             weight: 15 },
    R:  { label: 'Réputation Digitale',description: "E-réputation employeur sur LinkedIn, Glassdoor, Indeed et réseaux sociaux professionnels",                 weight: 14 },
    AM: { label: 'Ambassadeurs',       description: "Programme de valorisation des collaborateurs en ambassadeurs de marque externe",                            weight: 13 },
    CF: { label: 'Culture Fitness',    description: "Alignement entre la culture interne réelle et les attentes des talents cibles",                             weight: 13 },
    TR: { label: 'Transition',         description: "Qualité du off-boarding, gestion des alumni, continuité de l'image de marque après les départs",           weight: 12 },
  },
  impacttrace: {
    P:  { label: 'Purpose',        description: "Raison d'être RSE formalisée, incarnée par le management et visible en interne et externe",             weight: 25 },
    R:  { label: 'Reach',          description: "Visibilité, portée et impact médiatique des actions RSE auprès des parties prenantes",                  weight: 18 },
    O:  { label: 'Owned Evidence', description: "Preuves tangibles, données mesurées et documentées des impacts RSE réels (vs déclaratifs)",            weight: 20 },
    OC: { label: 'Owned Inside',   description: "Ancrage RSE dans la culture interne, engagement et appropriation par les collaborateurs",              weight: 20 },
    F:  { label: 'Feel',           description: "Perception et adhésion des parties prenantes internes et externes à la démarche RSE",                  weight: 17 },
  },
  safesignal: {
    S:  { label: 'Signal',          description: "Remontée, traitement et exploitation des signaux faibles et des incidents sécurité",                  weight: 18 },
    H:  { label: 'Human',           description: "Comportements individuels, leadership sécurité du management de proximité",                          weight: 22 },
    IA: { label: 'Internalization', description: "Intégration de la sécurité dans les réflexes quotidiens, culture SST incarnée",                      weight: 14 },
    E:  { label: 'Engagement',      description: "Implication active et volontaire de tous les niveaux dans les démarches sécurité",                   weight: 16 },
    L:  { label: 'Learning',        description: "Apprentissage organisationnel systématisé post-incidents et quasi-accidents",                        weight: 14 },
    D:  { label: 'Data',            description: "Exploitation des données sécurité pour le pilotage préventif et prédictif",                          weight: 16 },
  },
  eventimpact: {
    S: { label: 'Strategy',    description: "Alignement de la stratégie événementielle avec les objectifs de marque et business",                       weight: 25 },
    T: { label: 'Touch',       description: "Qualité de l'expérience participant et des points de contact avant/pendant/après l'événement",            weight: 25 },
    A: { label: 'Activation',  description: "Capacité à générer engagement, contenu viral et conversion pendant et après l'événement",                 weight: 20 },
    G: { label: 'Growth',      description: "Impact mesurable sur la croissance de la marque, des communautés et du pipeline commercial",              weight: 20 },
    E: { label: 'Efficiency',  description: "ROI démontré, pilotage de la performance et optimisation des coûts événementiels",                        weight: 10 },
  },
  spacescore: {
    S: { label: 'Signage',     description: "Cohérence, lisibilité et efficacité de la signalétique de marque dans tous les espaces",                  weight: 22 },
    P: { label: 'Presence',    description: "Force et impact de la présence visuelle de la marque dans les environnements physiques",                  weight: 22 },
    A: { label: 'Atmosphere',  description: "Impact sensoriel et émotionnel des espaces : lumière, son, matière, odeur, température",                  weight: 23 },
    C: { label: 'Consistency', description: "Homogénéité de l'identité de marque sur tous les sites, points de vente et espaces",                     weight: 18 },
    E: { label: 'Expression',  description: "Capacité des espaces physiques à exprimer et incarner la culture et les valeurs de marque",              weight: 15 },
  },
  finnarrative: {
    C:  { label: 'Clarity',                    description: "Lisibilité, accessibilité et clarté du discours et des documents financiers",                  weight: 18 },
    A:  { label: 'Alignment',                  description: "Cohérence entre la narrative financière et la stratégie globale de l'entreprise",              weight: 15 },
    P:  { label: 'Proof',                      description: "Solidité des preuves, données chiffrées et indicateurs extra-financiers (ESG)",                weight: 20 },
    I:  { label: 'Institutionalization',       description: "Formalisation et structuration des processus de communication financière",                     weight: 16 },
    T:  { label: 'Trust',                      description: "Crédibilité perçue par les investisseurs, banques, partenaires et régulateurs",                weight: 16 },
    AL: { label: 'Amplification & Listening',  description: "Diffusion multi-canal et veille active de la narrative financière externe",                    weight: 15 },
  },
};

// ─── Benchmarks MENA par outil ────────────────────────────────────────────────

const TOOL_BENCHMARKS: Record<string, { menaAvg: number; menaTop: number; unit: string }> = {
  commpulse:   { menaAvg: 48, menaTop: 72, unit: 'communication interne' },
  talentprint: { menaAvg: 42, menaTop: 68, unit: 'marque employeur' },
  impacttrace: { menaAvg: 38, menaTop: 65, unit: 'maturité RSE' },
  safesignal:  { menaAvg: 45, menaTop: 70, unit: 'culture sécurité' },
  eventimpact: { menaAvg: 44, menaTop: 69, unit: 'maturité événementielle' },
  spacescore:  { menaAvg: 41, menaTop: 66, unit: 'marque physique' },
  finnarrative:{ menaAvg: 40, menaTop: 67, unit: 'communication financière' },
};

// ─── Contextes riches par outil ───────────────────────────────────────────────

const TOOL_CONTEXTS: Record<string, string> = {
  commpulse: `OUTIL : CommPulse™ — Diagnostic de maturité de la communication interne
MODÈLE : CLARITY™ — 7 dimensions pondérées (score global = moyenne pondérée)
  C-Cohérence (18%) · L-Liens (18%) · A-Attention (15%) · R-Résultats (15%) · I-Inclusion (12%) · T-Transparence (12%) · Y-Engagement (10%)
BENCHMARK MENA : Moyenne = 48/100 · Top 25% = 72/100 · PME marocaine = 38/100 · Grande entreprise MENA = 55/100
CONTEXTE SPÉCIFIQUE MENA :
• La communication interne reste chroniquement sous-investie au Maroc/MENA : souvent réduite à l'intranet, aux circulaires et aux réunions descendantes
• La culture hiérarchique forte freine les remontées terrain et la transparence ascendante — le manager intermédiaire filtre l'information
• La fragmentation linguistique (arabe/français/darija/anglais) crée des ruptures de cohérence dans les messages selon les populations
• Enjeu critique 2025-2026 : les nouvelles générations (Gen Z, Millénials) exigent une communication authentique, bidirectionnelle et en temps réel
• Le travail hybride amplifie le risque de désengagement silencieux si la communication interne n'évolue pas
NIVEAUX DE MATURITÉ :
• Niveau 1 — Silent : communication descendante sporadique, la rumeur comble le vide informationnel, aucun mécanisme de feedback
• Niveau 2 — Broadcast : communication structurée mais unidirectionnelle, messages corporate sans écoute, engagement faible
• Niveau 3 — Dialogue : boucles de feedback émergentes, managers engagés dans certaines directions, mais incohérences inter-départements
• Niveau 4 — Engaged : communication bidirectionnelle intégrée, KPIs de suivi, culture de transparence managériale visible
• Niveau 5 — Pulse : excellence communicationnelle, marque employeur renforcée par la com interne, référence sectorielle`,

  talentprint: `OUTIL : TalentPrint™ — Diagnostic de maturité de la marque employeur
MODÈLE : ATTRACT™ — 7 dimensions pondérées
  A-Authenticité (18%) · T1-Talent Magnet (15%) · T2-Turnover DNA (15%) · R-Réputation Digitale (14%) · AM-Ambassadeurs (13%) · CF-Culture Fitness (13%) · TR-Transition (12%)
BENCHMARK MENA : Moyenne = 42/100 · Top 25% = 68/100 · Secteur financier = 52/100 · Industrie = 35/100 · Tech = 58/100
CONTEXTE SPÉCIFIQUE MENA :
• Marché du travail MENA sous pression intense : brain drain vers Europe/Golfe, guerre des talents sur les profils Bac+3/5 en finance, tech et marketing
• L'authenticité est le facteur différenciant #1 en 2025 : les candidats vérifient les avis Glassdoor et LinkedIn AVANT de postuler
• Taux de turn-over moyen Maroc : 18-25% dans les services, 12-15% dans l'industrie — coût estimé à 6-12 mois de salaire par départ non souhaité
• La marque employeur digitale est souvent inexistante ou mal gérée : pages LinkedIn sous-investies, aucune présence sur les plateformes emploi jeunes
• Enjeu 2025 : les entreprises qui ne formalisent pas leur EVP (Employee Value Proposition) perdent 30-40% de candidatures qualifiées
NIVEAUX DE MATURITÉ :
• Niveau 1 — Invisible : marque employeur inexistante, recrutement par réseaux informels, réputation subie
• Niveau 2 — Reactive : marque employeur réactive aux besoins, pas de stratégie proactive, turn-over non analysé
• Niveau 3 — Structured : EVP définie, présence digitale en développement, mais pas encore différenciante ni cohérente
• Niveau 4 — Magnetic : marque employeur forte et assumée, programme ambassadeurs actif, flux candidats entrant
• Niveau 5 — Iconic : référence sectorielle, recrutement passif dominant, prix et labels employeur reconnus`,

  impacttrace: `OUTIL : ImpactTrace™ — Diagnostic de maturité RSE et communication durable
MODÈLE : PROOF™ — 5 dimensions pondérées + Walk vs Talk Score™ (écart déclaratif/réel)
  P-Purpose (25%) · R-Reach (18%) · O-Owned Evidence (20%) · OC-Owned Inside (20%) · F-Feel (17%)
BENCHMARK MENA : Moyenne = 38/100 · Entreprises cotées Casablanca = 55/100 · PME = 28/100 · Secteur extractif = 45/100
CONTEXTE SPÉCIFIQUE MENA :
• Pression réglementaire croissante : CSRD (pour filiales de groupes européens), Bourse de Casablanca (reporting ESG obligatoire dès 2026), Green Climate Fund
• Walk vs Talk Score™ : mesure de l'écart entre ce que l'entreprise déclare faire et ce qu'elle prouve réellement — révélateur critique de crédibilité
• Risque greenwashing en forte hausse : consommateurs et partenaires distinguent de mieux en mieux les déclarations des preuves
• Enjeu 2025-2026 : accès aux financements ESG, green bonds, partenaires internationaux — tous exigent un reporting RSE crédible
• La RSE reste perçue comme "communication" et non comme levier stratégique dans 65% des entreprises MENA
NIVEAUX DE MATURITÉ :
• Niveau 1 — Déni : RSE = philanthropie ponctuelle et non structurée, aucun engagement formalisé
• Niveau 2 — Déclaratif : engagements écrits mais peu de preuves mesurables, risque greenwashing maximal
• Niveau 3 — Actif : démarche structurée, données collectées, communication externe en développement
• Niveau 4 — Intégré : RSE intégrée dans la stratégie d'entreprise, reporting crédible, stakeholders engagés
• Niveau 5 — Régénératif : pionnier sectoriel, impact positif certifié, référence internationale`,

  safesignal: `OUTIL : SafeSignal™ — Diagnostic de maturité de la culture sécurité QHSE/SST
MODÈLE : SHIELD™ — 6 dimensions pondérées + Safety Perception Gap™
  S-Signal (18%) · H-Human (22%) · IA-Internalization (14%) · E-Engagement (16%) · L-Learning (14%) · D-Data (16%)
BENCHMARK MENA : Moyenne = 45/100 · Industrie lourde = 55/100 · Services = 38/100 · Construction = 42/100 · Mines/Extraction = 60/100
CONTEXTE SPÉCIFIQUE MENA :
• Accidents du travail Maroc : 50 000+/an déclarés (CNSS), taux de sous-déclaration estimé à 35-40% — les coûts réels sont donc 1.6× supérieurs aux données officielles
• Safety Perception Gap™ = écart entre la perception sécurité des managers et celle des opérateurs terrain — révélateur du décalage culturel critique
• Conformité réglementaire ≠ culture sécurité : nombreuses entreprises conformes sur le papier mais avec comportements à risque quotidiens non signalés
• La dimension H (Human) à 22% est délibérément la plus pondérée : le comportement humain est le levier #1 de transformation sécurité
• Enjeu 2025 : les certifications ISO 45001 exigent une démonstration de culture sécurité, pas seulement de conformité procédurale
NIVEAUX DE MATURITÉ :
• Niveau 1 — Pathological : "Qui se soucie tant qu'on n'est pas pris" — l'accident est perçu comme malchance
• Niveau 2 — Reactive : sécurité = réponse aux incidents uniquement, après coup, sans anticipation
• Niveau 3 — Calculative : systèmes en place, conformité mesurée, mais culture pas encore intégrée dans les comportements
• Niveau 4 — Proactive : anticipation des risques, leadership sécurité actif, apprentissage systématique post-incident
• Niveau 5 — Generative : sécurité = valeur centrale et identitaire, zéro accident comme norme culturelle vécue`,

  eventimpact: `OUTIL : EventImpact™ — Diagnostic de maturité de la stratégie événementielle
MODÈLE : STAGE™ — 5 dimensions pondérées + triple temporalité Avant/Pendant/Après
  S-Strategy (25%) · T-Touch (25%) · A-Activation (20%) · G-Growth (20%) · E-Efficiency (10%)
BENCHMARK MENA : Moyenne = 44/100 · Top 25% = 69/100 · Agences events = 62/100 · Entreprises = 38/100 · Événements institutionnels = 52/100
CONTEXTE SPÉCIFIQUE MENA :
• Marché événementiel MENA en croissance +12%/an : le Maroc est hub régional (COP, GITEX Africa, Africa CEO Forum, Mondialisation 2030)
• Problème structurel identifié : budget concentré à 70% sur le "spectaculaire" le jour J, investissement Avant (préparation, contenu) et Après (capitalisation) quasi inexistant
• ROI événementiel rarement mesuré : 73% des entreprises MENA évaluent leurs événements uniquement par satisfaction à chaud — zéro mesure d'impact business
• Enjeu 2025 : la guerre de l'attention force à repenser l'événement comme expérience continue, pas comme moment ponctuel
• La dimension E (Efficiency) à seulement 10% est volontairement faible — ce qui compte d'abord est l'impact, pas l'optimisation des coûts
NIVEAUX DE MATURITÉ :
• Niveau 1 — Ad Hoc : événements organisés sans stratégie, budget variable, ROI non mesuré, décisions intuitives
• Niveau 2 — Operational : processus répétables, mais vision stratégique absente, focus logistique
• Niveau 3 — Structured : alignement partiel avec les objectifs business, premiers KPIs mis en place
• Niveau 4 — Strategic : événements = vecteur de business development démontré, ROI mesuré et communiqué
• Niveau 5 — Iconic : marque événementielle forte, référence sectorielle, communauté fidèle et engagement post-événement`,

  spacescore: `OUTIL : SpaceScore™ — Diagnostic de maturité de la marque physique
MODÈLE : SPACE™ — 5 dimensions pondérées + Photo-Audit 12 zones
  S-Signage (22%) · P-Presence (22%) · A-Atmosphere (23%) · C-Consistency (18%) · E-Expression (15%)
BENCHMARK MENA : Moyenne = 41/100 · Retail = 55/100 · Banque/Finance = 48/100 · Industrie = 32/100 · Hôtellerie = 60/100
CONTEXTE SPÉCIFIQUE MENA :
• L'espace physique reste le PREMIER point de contact avec la marque dans les marchés MENA : culture du face-à-face, de l'agence bancaire, du showroom
• Problème récurrent : identité visuelle définie au siège mais non déployée en agences/points de vente régionaux — incohérence de marque criante
• Photo-Audit 12 zones = audit photographique standardisé sur 12 zones clés : entrée, accueil, salle d'attente, bureau, toilettes, façade, signalétique, etc.
• Enjeu 2025 : le phygital oblige à aligner l'expérience digitale et l'expérience physique — les clients passent de l'un à l'autre sans discontinuité attendue
• La dimension A (Atmosphere) à 23% est la plus pondérée — l'impact sensoriel et émotionnel prime sur la simple présence visuelle
NIVEAUX DE MATURITÉ :
• Niveau 1 — Generic : espace sans identité distincte, peinture blanche, mobilier générique et interchangeable
• Niveau 2 — Partial : quelques éléments de marque présents mais incohérents entre sites
• Niveau 3 — Functional : espace fonctionnel avec identité reconnaissable mais sans expérience différenciante
• Niveau 4 — Branded : expérience de marque cohérente et immersive sur tous les sites, personnel aligné
• Niveau 5 — Immersive : espace = vecteur de storytelling de marque, destination expérientielle, référence sectorielle`,

  finnarrative: `OUTIL : FinNarrative™ — Diagnostic de maturité de la communication financière
MODÈLE : CAPITAL™ — 6 dimensions pondérées + Narrative Doctor™ (outil de détection d'incohérences)
  C-Clarity (18%) · A-Alignment (15%) · P-Proof (20%) · I-Institutionalization (16%) · T-Trust (16%) · AL-Amplification & Listening (15%)
BENCHMARK MENA : Moyenne = 40/100 · Entreprises cotées Casablanca = 58/100 · PME familiales = 28/100 · Groupes industriels = 48/100
CONTEXTE SPÉCIFIQUE MENA :
• Communication financière sous-développée : la majorité des entreprises MENA limite la com financière au rapport annuel légal minimum
• Enjeu 2025-2026 : accès aux financements ESG, green bonds, partenaires internationaux, private equity — tous exigent une narrative financière robuste et cohérente
• Narrative Doctor™ = outil de détection des incohérences entre le discours financier officiel et les données réelles ou perçues — révélateur de credibility gap
• Le marché bancaire MENA évolue : les banques exigent de plus en plus une communication financière pro-active des entreprises au-delà des bilans comptables
• La dimension P (Proof) à 20% est délibérément la plus pondérée — sans preuves chiffrées, aucune narrative n'est crédible
NIVEAUX DE MATURITÉ :
• Niveau 1 — Opaque : communication financière minimale légale, réticence à partager les données, opacité culturelle
• Niveau 2 — Compliant : conformité légale uniquement, rapport annuel générique et non différenciant
• Niveau 3 — Narrative : narrative financière émergente, quelques éléments différenciants, mais sans cohérence globale
• Niveau 4 — Strategic : communication financière proactive, investisseurs et partenaires activement engagés
• Niveau 5 — Reference : référence sectorielle, accès facilité aux financements, notation ESG reconnue`,
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
  const toolCtx  = TOOL_CONTEXTS[toolId] ?? '';
  const maturityName = MATURITY_NAMES[maturityLevel]?.[toolId] ?? `Niveau ${maturityLevel}`;
  const pillarDefs   = TOOL_PILLAR_LABELS[toolId] ?? {};
  const benchmark    = TOOL_BENCHMARKS[toolId];

  // Tri des piliers du plus faible au plus fort pour mise en évidence des priorités
  const sortedPillars = Object.entries(pillarScores).sort((a, b) => a[1] - b[1]);
  const pillarsText = sortedPillars
    .map(([p, s]) => {
      const def   = pillarDefs[p];
      const lvl   = s < 20 ? 'CRITIQUE' : s < 40 ? 'PRÉOCCUPANT' : s < 60 ? 'EN DÉVELOPPEMENT' : s < 80 ? 'PERFORMANT' : 'EXCELLENCE';
      return `  • [${p}] ${def?.label ?? p} (poids ${def?.weight ?? '?'}%) : ${s}/100 → ${lvl}\n    Description : ${def?.description ?? 'N/A'}`;
    })
    .join('\n');

  // Gap analysis dynamique
  const scores       = Object.values(pillarScores);
  const maxScore     = Math.max(...scores);
  const minScore     = Math.min(...scores);
  const gap          = maxScore - minScore;
  const weakest      = sortedPillars[0];
  const strongest    = sortedPillars[sortedPillars.length - 1];
  const gapAnalysis  = gap > 25
    ? `⚠ PROFIL DÉSÉQUILIBRÉ (écart de ${gap} points) : la dimension [${strongest[0]}] à ${strongest[1]}/100 coexiste avec [${weakest[0]}] à ${weakest[1]}/100. Ce déséquilibre est structurellement limitant — l'organisation performe globalement à la hauteur de sa dimension la plus faible.`
    : gap > 15
    ? `Profil modérément déséquilibré (écart de ${gap} points). Les dimensions faibles freinent l'expression des dimensions fortes — aligner les niveaux est prioritaire.`
    : `Profil relativement homogène (écart de ${gap} points). La progression passe par une amélioration systématique de l'ensemble du modèle.`;

  // Comparaison benchmark
  const benchmarkNote = benchmark
    ? `Score ${globalScore}/100 vs moyenne MENA ${benchmark.menaAvg}/100 (${globalScore > benchmark.menaAvg ? `+${globalScore - benchmark.menaAvg} points au-dessus` : `${globalScore - benchmark.menaAvg} points en dessous`} de la moyenne) · Top 25% MENA = ${benchmark.menaTop}/100`
    : '';

  const sectorNote    = sector     ? `\nSECTEUR : ${sector} — contextualise chaque analyse et recommandation avec les enjeux spécifiques à ce secteur en MENA (réglementation, concurrence, maturité sectorielle, attentes parties prenantes).` : '';
  const sizeNote      = companySize ? `\nTAILLE : ${companySize} — adapte les recommandations aux capacités et contraintes réelles (ressources humaines, budget transformation, gouvernance) de cette taille d'entreprise.` : '';

  return `=== IDENTITÉ ET MISSION ===
Tu es un Senior Partner chez Epitaphe360, cabinet de conseil stratégique de référence en transformation organisationnelle et communication d'entreprise en Afrique du Nord et MENA.
Tu as accompagné plus de 200 transformations d'entreprises : PME familiales marocaines, filiales de multinationales, entreprises publiques en transition, scale-ups africaines.
Ton expertise couvre la communication interne, la marque employeur, la RSE, la sécurité, l'événementiel, le brand physique et la communication financière.

TON STYLE EST :
• Direct et sans complaisance — tu dis ce qui est, pas ce que le client veut entendre
• Expert et ancré dans la réalité MENA — tes recommandations sont opérationnelles, pas théoriques
• Structuré comme un rapport McKinsey/BCG — chaque phrase porte une information concrète
• Jamais générique — chaque analyse est unique et fondée sur les scores réels de cette entreprise
• Tu n'utilises jamais des formules creuses ("il convient de", "il est important de", "nous recommandons de") — tu nommes des actions, des responsables, des délais

RÈGLE ABSOLUE : Tu réponds UNIQUEMENT en JSON valide selon le schéma demandé. Aucun texte hors du JSON.

=== CONTEXTE DE L'OUTIL ===
${toolCtx}

=== DONNÉES DE L'ÉVALUATION ===
Entreprise  : ${companyName  || 'Confidentiel'}${sectorNote}${sizeNote}
Score global : ${globalScore}/100 — Niveau ${maturityLevel}/5 "${maturityName}"
${benchmarkNote}

=== SCORES DÉTAILLÉS PAR DIMENSION (triés du plus faible au plus fort) ===
${pillarsText}

=== ANALYSE DES ÉCARTS INTER-DIMENSIONS ===
${gapAnalysis}

=== GRILLE D'INTERPRÉTATION DES SCORES ===
• 0–19   → CRITIQUE         : Absence de pratiques structurées — risque opérationnel immédiat et coûts cachés significatifs
• 20–39  → PRÉOCCUPANT      : Pratiques embryonnaires — vulnérabilités structurelles majeures, urgence d'action
• 40–59  → EN DÉVELOPPEMENT : Bases en place mais incohérences limitantes — fort potentiel d'amélioration rapide
• 60–79  → PERFORMANT       : Pratiques solides — optimisations à fort impact disponibles pour passer au niveau supérieur
• 80–100 → EXCELLENCE       : Maturité avancée — positionnement de référence sectorielle, rôle de benchmark

=== INSTRUCTIONS DE RÉDACTION (CRITIQUES) ===

1. syntheseDirecteur — 2 paragraphes distincts séparés par \\n\\n
   • §1 : État des lieux HONNÊTE basé sur le score ${globalScore}/100. Nomme les 2 forces et les 2 faiblesses majeures. Cite les scores réels.
   • §2 : Ce que l'organisation peut concrètement réaliser dans les 12 mois avec les bons leviers. Ton : constructif mais exigeant.

2. executiveSummary — 4-5 phrases. Commence par le constat clé du score ${globalScore}/100 au niveau ${maturityName}. Nomme les dimensions critiques. Conclure par l'enjeu compétitif si rien n'est fait.

3. positionConcurrentielle — 2 phrases. Compare à ${benchmark ? `la moyenne MENA de ${benchmark.menaAvg}/100` : 'la moyenne MENA'}. Contextualise dans le secteur ${sector ?? 'MENA'}.

4. risqueStrategique — 1 phrase précise. Le risque #1 qui menace la performance de l'entreprise si ce score reste inchangé dans 18 mois.

5. opportuniteStrategique — 1 phrase précise. L'opportunité de gain rapide et mesurable la plus accessible compte tenu des scores actuels.

6. pillarAnalyses — TOUTES les dimensions présentes dans les scores. Pour chaque dimension :
   • niveau : "Critique" | "Préoccupant" | "En développement" | "Performant" | "Excellence" selon la grille ci-dessus
   • diagnostic : 4-5 phrases SPÉCIFIQUES à ce score précis. Interprète ce que ce score signifie concrètement pour cette entreprise dans ce secteur. Jamais générique.
   • impactOrganisationnel : 2-3 phrases sur l'impact CONCRET et MESURABLE de ce score sur la performance de l'organisation (coûts cachés, risques de compétitivité, impact RH, etc.)
   • benchmarkMENA : 1 phrase comparant ce score aux entreprises MENA de même secteur/taille. Cite le benchmark.
   • risquesCles : 3-4 risques CONCRETS avec conséquences MESURABLES. Exemple : "Risque de turn-over managérial > 20% dans les 18 mois si aucune action sur cette dimension" — PAS "risque de perte de performance"
   • facteursBloquants : 2-3 facteurs organisationnels PRÉCIS qui expliquent ce score (culture, gouvernance, ressources, processus, compétences manquantes)
   • actions : 3-4 actions CONCRÈTES et NOMMÉES avec responsable. Exemple : "Déployer un baromètre mensuel de 5 indicateurs, piloté par le DRH, avec restitution trimestrielle au COMEX" — PAS "améliorer la communication"
   • quickWin : 1 action ULTRA-SPÉCIFIQUE réalisable en < 30 jours. Nomme : QUI fait QUOI, avec QUEL livrable attendu, en COMBIEN de jours.
   • indicateursCles : 2-3 KPIs PRÉCIS et mesurables pour suivre la progression sur cette dimension
   • prochainNiveau : 1-2 phrases sur ce qui permettrait de passer du niveau ${maturityLevel} "${maturityName}" au niveau ${Math.min(maturityLevel + 1, 5)}

7. topRecommendations — EXACTEMENT 5 recommandations, classées par priorité décroissante (ROI × urgence). Chaque recommandation :
   • fondée sur les scores réels — jamais déconnectée des données
   • avec un ROI qualitatif PRÉCIS (ex: "Réduction estimée du turn-over de 15-20%, économie de 3-6 mois de salaire par poste retenu")
   • avec un responsable clairement identifié (DG / DRH / DCom / DSI / etc.)
   • avec un prérequis concret et réaliste

8. actionPlan90Days — 3 phases de 30 jours. Chaque phase :
   • 3-4 actions concrètes et séquencées logiquement
   • 1 livrable tangible (document, atelier, outil, décision, etc.)
   • 1 KPI précis pour mesurer le succès de la phase

9. messageDirigeant — 3-4 phrases personnelles, directement adressées au dirigeant. Ton : direct, honnête, sans complaisance mais constructif. Inclure le score ${globalScore}/100 et 1 message d'espoir ancré dans les données.

10. transformCTA — 1 phrase d'accroche percutante proposant la mission Transform Epitaphe360, personnalisée au niveau ${maturityName} et au score ${globalScore}/100.

=== SCHÉMA JSON EXACT (réponds UNIQUEMENT avec ce JSON, aucun texte hors du JSON) ===
{
  "syntheseDirecteur": "PARAGRAPHE_1\\n\\nPARAGRAPHE_2",
  "executiveSummary": "4-5 phrases de synthèse stratégique COMEX",
  "positionConcurrentielle": "2 phrases sur le positionnement vs secteur MENA",
  "risqueStrategique": "1 phrase sur le risque stratégique #1 à 18 mois",
  "opportuniteStrategique": "1 phrase sur l'opportunité de gain prioritaire",
  "pillarAnalyses": [
    {
      "pillar": "ID_DIMENSION",
      "pillarLabel": "Nom complet de la dimension",
      "score": 0,
      "niveau": "Critique|Préoccupant|En développement|Performant|Excellence",
      "diagnostic": "4-5 phrases d'analyse approfondie et spécifique à ce score et ce contexte",
      "impactOrganisationnel": "2-3 phrases sur l'impact concret et mesurable sur la performance organisationnelle",
      "benchmarkMENA": "1 phrase de positionnement vs pairs MENA avec chiffre de benchmark",
      "risquesCles": ["Risque concret avec conséquence mesurable 1", "Risque 2", "Risque 3"],
      "facteursBloquants": ["Facteur organisationnel précis bloquant la progression 1", "Facteur 2"],
      "actions": ["Action concrète nommée avec responsable 1", "Action 2", "Action 3"],
      "quickWin": "Action ultra-spécifique : QUI fait QUOI en X jours pour produire QUEL livrable",
      "indicateursCles": ["KPI précis et mesurable 1", "KPI 2"],
      "prochainNiveau": "Ce qui permettrait concrètement de passer au niveau de maturité suivant"
    }
  ],
  "topRecommendations": [
    {
      "priority": 1,
      "title": "Titre court, percutant et spécifique",
      "rationale": "Pourquoi c'est la priorité #1 — fondé sur les scores et leur impact business",
      "impact": "Élevé",
      "effortRequis": "Moyen",
      "timeline": "X jours / X mois",
      "roiEstimate": "Description précise et qualitative du ROI attendu avec ordre de grandeur",
      "responsable": "DG / DRH / DCom / DSI / etc.",
      "prerequis": "Ce qui doit être en place avant de démarrer cette recommandation"
    }
  ],
  "actionPlan90Days": [
    {
      "week": "J1-J30",
      "actions": ["Action concrète 1", "Action 2", "Action 3"],
      "livrable": "Livrable tangible attendu à J30 (document, outil, décision, atelier...)",
      "kpi": "KPI précis pour mesurer le succès de cette phase"
    },
    {
      "week": "J31-J60",
      "actions": ["Action 1", "Action 2", "Action 3"],
      "livrable": "Livrable tangible attendu à J60",
      "kpi": "KPI de mesure"
    },
    {
      "week": "J61-J90",
      "actions": ["Action 1", "Action 2", "Action 3"],
      "livrable": "Livrable tangible attendu à J90",
      "kpi": "KPI de mesure"
    }
  ],
  "messageDirigeant": "Message personnel et direct au dirigeant — honnête, constructif, ancré dans les scores réels",
  "transformCTA": "1 phrase d'accroche percutante pour proposer la mission Transform Epitaphe360"
}`;
}

// ─── Rapport statique de fallback ────────────────────────────────────────────

function scoreToNiveau(score: number): string {
  if (score < 20) return 'Critique';
  if (score < 40) return 'Préoccupant';
  if (score < 60) return 'En développement';
  if (score < 80) return 'Performant';
  return 'Excellence';
}

function buildFallbackReport(params: {
  toolId: string;
  globalScore: number;
  maturityLevel: number;
  pillarScores: Record<string, number>;
}): AIReport {
  const { toolId, globalScore, maturityLevel, pillarScores } = params;
  const pillars    = Object.entries(pillarScores);
  const sorted     = [...pillars].sort((a, b) => a[1] - b[1]);
  const weakest    = sorted.slice(0, 2);
  const strongest  = sorted.slice(-2).reverse();
  const maturityName = MATURITY_NAMES[maturityLevel]?.[toolId] ?? `Niveau ${maturityLevel}`;
  const pillarDefs = TOOL_PILLAR_LABELS[toolId] ?? {};
  const benchmark  = TOOL_BENCHMARKS[toolId];

  const globalCtx = globalScore < 40
    ? 'Des actions urgentes et structurées sont nécessaires pour sécuriser la performance.'
    : globalScore < 60
    ? 'La démarche est engagée mais des lacunes structurelles freinent les résultats.'
    : globalScore < 75
    ? 'La maturité est réelle mais des optimisations ciblées peuvent générer un impact significatif.'
    : "L'organisation est bien positionnée — l'enjeu est de consolider l'excellence et de la diffuser.";

  const benchmarkNote = benchmark
    ? `Votre score de ${globalScore}/100 se positionne ${globalScore >= benchmark.menaAvg ? `${globalScore - benchmark.menaAvg} points au-dessus` : `${benchmark.menaAvg - globalScore} points en dessous`} de la moyenne MENA (${benchmark.menaAvg}/100) en ${benchmark.unit}.`
    : '';

  return {
    generatedAt: new Date().toISOString(),
    model: 'fallback',

    syntheseDirecteur: `Votre organisation affiche un score global de ${globalScore}/100 en ${TOOL_BENCHMARKS[toolId]?.unit ?? 'maturité organisationnelle'}, correspondant au niveau "${maturityName}" (${maturityLevel}/5). ${benchmarkNote} Les dimensions ${weakest.map(([p]) => pillarDefs[p]?.label ?? p).join(' et ')} tirent le score vers le bas et concentrent les risques opérationnels immédiats. À l'inverse, ${strongest[0] ? (pillarDefs[strongest[0][0]]?.label ?? strongest[0][0]) : 'la dimension la plus forte'} à ${strongest[0]?.[1] ?? 0}/100 constitue un actif à capitaliser et un modèle à déployer dans le reste de l'organisation.\n\nAvec une feuille de route ciblée sur les 90 prochains jours, il est réaliste de progresser de 8 à 12 points sur le score global, en traitant d'abord les dimensions critiques. ${globalCtx} Epitaphe360 vous accompagne pour transformer ce diagnostic en programme de transformation concret et mesurable.`,

    executiveSummary: `Avec un score de ${globalScore}/100, votre organisation se situe au niveau ${maturityLevel}/5 "${maturityName}" en ${TOOL_BENCHMARKS[toolId]?.unit ?? 'maturité organisationnelle'}. ${benchmarkNote} Les dimensions ${weakest.map(([p]) => pillarDefs[p]?.label ?? p).join(' et ')} représentent les zones de vulnérabilité les plus critiques avec des scores respectifs de ${weakest.map(([, s]) => s).join(' et ')}/100. ${globalCtx}`,

    positionConcurrentielle: benchmark
      ? `Votre score de ${globalScore}/100 vous place ${globalScore >= benchmark.menaAvg ? 'au-dessus' : 'en dessous'} de la moyenne MENA (${benchmark.menaAvg}/100) en ${benchmark.unit} — mais encore loin du top 25% (${benchmark.menaTop}/100). ${globalScore >= benchmark.menaTop ? "Vous faites partie des leaders sectoriels MENA — l'enjeu est maintenant de creuser l'écart." : `Un gain de ${benchmark.menaTop - globalScore} points vous permettrait d'intégrer le top 25% MENA.`}`
      : `Votre score de ${globalScore}/100 reflète un niveau de maturité intermédiaire. Le travail sur les dimensions critiques permettra un positionnement compétitif renforcé.`,

    risqueStrategique: `Si aucune action n'est engagée sur la dimension ${weakest[0] ? (pillarDefs[weakest[0][0]]?.label ?? weakest[0][0]) : 'la plus critique'} (${weakest[0]?.[1] ?? 0}/100) dans les 6 prochains mois, l'organisation s'expose à une dégradation mesurable de sa performance et de sa compétitivité dans ce domaine.`,

    opportuniteStrategique: `La dimension ${strongest[0] ? (pillarDefs[strongest[0][0]]?.label ?? strongest[0][0]) : 'la plus forte'} à ${strongest[0]?.[1] ?? 0}/100 est un actif stratégique inexploité — la déployer comme modèle interne et levier de communication externe peut générer un retour visible en moins de 90 jours.`,

    pillarAnalyses: pillars.map(([pillar, score]) => {
      const def    = pillarDefs[pillar];
      const niveau = scoreToNiveau(score);
      const label  = def?.label ?? pillar;
      return {
        pillar,
        pillarLabel: label,
        score,
        niveau,
        diagnostic: score < 40
          ? `La dimension ${label} est en situation ${niveau.toLowerCase()} avec un score de ${score}/100. L'absence de pratiques structurées dans ce domaine génère des inefficacités opérationnelles directement mesurables. Les équipes compensent souvent par des ajustements informels qui créent des incohérences entre départements. Une intervention rapide et structurée est indispensable pour éviter l'aggravation.`
          : score < 60
          ? `La dimension ${label} affiche un score de ${score}/100 — des bases existent mais restent insuffisamment déployées. Les pratiques sont hétérogènes selon les équipes et les niveaux hiérarchiques, créant des écarts de performance. Le potentiel d'amélioration est réel et accessible avec des actions ciblées et bien séquencées.`
          : score < 80
          ? `La dimension ${label} se positionne à ${score}/100 — niveau performant. Les pratiques sont structurées et reconnues, mais des optimisations à fort impact restent disponibles. L'enjeu est de passer d'un niveau de bonne pratique à un niveau de référence sectorielle en comblant les écarts résiduels.`
          : `La dimension ${label} atteint ${score}/100 — niveau d'excellence. Cette maturité avancée constitue un actif différenciant à documenter, valoriser en externe et déployer comme modèle dans d'autres dimensions de l'organisation.`,
        impactOrganisationnel: score < 40
          ? `Ce score génère des coûts cachés significatifs : dysfonctionnements, non-qualité, désengagement ou inefficacité directement liés à cette dimension. L'impact sur la performance globale de l'organisation est immédiat et mesurable.`
          : score < 60
          ? `Les lacunes dans cette dimension limitent la performance de l'organisation de façon documentée. Des gains rapides sont possibles avec des investissements ciblés en processus et compétences.`
          : `Cette dimension soutient la performance organisationnelle mais n'en est pas encore un levier différenciant. Des optimisations permettraient de transformer cet actif en avantage compétitif.`,
        benchmarkMENA: benchmark
          ? `Score de ${score}/100 vs moyenne MENA ${benchmark.menaAvg}/100 en ${benchmark.unit} — ${score >= benchmark.menaAvg ? `${score - benchmark.menaAvg} points au-dessus de la moyenne.` : `${benchmark.menaAvg - score} points en dessous de la moyenne — priorité d'alignement.`}`
          : `Score de ${score}/100 — à comparer aux benchmarks sectoriels MENA pour valider le positionnement relatif.`,
        risquesCles: score < 40
          ? [
            `Perte de performance mesurable directement liée aux déficiences dans ce domaine`,
            `Risque de désengagement ou de démobilisation des équipes impactées par ces lacunes`,
            `Vulnérabilité concurrentielle si des acteurs du secteur avancent sur cette dimension`,
          ]
          : score < 60
          ? [
            `Hétérogénéité des pratiques selon les équipes générant des incohérences de résultats`,
            `Difficulté à démontrer la valeur et le ROI de ce domaine en interne`,
            `Risque de régression si les bases ne sont pas consolidées rapidement`,
          ]
          : [
            `Difficulté à maintenir le niveau d'excellence dans un environnement en mutation rapide`,
            `Risque de ne pas exploiter pleinement cet actif différenciant`,
          ],
        facteursBloquants: score < 50
          ? [`Absence de processus formalisés et partagés`, `Manque de gouvernance claire sur ce domaine`]
          : [`Optimisations incrémentales insuffisantes pour atteindre l'excellence`, `Benchmark sectoriel non intégré dans les objectifs`],
        actions: score < 40
          ? [
            `Constituer un groupe de travail dédié avec des représentants de chaque département pour cartographier les dysfonctionnements`,
            `Définir 3 Quick Wins prioritaires avec le DG/DRH et allouer un budget et des ressources dédiées`,
            `Mettre en place un reporting mensuel sur les indicateurs clés de cette dimension`,
          ]
          : score < 60
          ? [
            `Formaliser les bonnes pratiques existantes dans un guide opérationnel accessible à tous`,
            `Déployer des indicateurs de suivi et créer un tableau de bord mensuel`,
            `Former les managers de proximité aux nouvelles pratiques via 2 sessions de 3h`,
          ]
          : [
            `Documenter et partager les bonnes pratiques en interne via un programme de transfert`,
            `Benchmarker les pratiques vs les leaders sectoriels MENA et identifier les écarts résiduels`,
            `Valoriser cette excellence en externe (marque, communication, appels d'offres)`,
          ],
        quickWin: score < 50
          ? `Dans les 15 jours : organiser un atelier de 2h avec les 5-8 parties prenantes clés pour identifier les 3 irritants principaux et les 3 actions immédiates — livrable : plan d'action priorisé validé par la direction`
          : `Dans les 30 jours : déployer un baromètre de suivi mensuel avec 3 indicateurs clés sur cette dimension — livrable : premier tableau de bord partagé avec le COMEX`,
        indicateursCles: [
          `Score de maturité sur cette dimension (objectif : +10 points dans les 6 mois)`,
          `Taux d'adoption des nouvelles pratiques par les équipes concernées (objectif : > 70%)`,
        ],
        prochainNiveau: score < 60
          ? `Passer au niveau suivant requiert de formaliser les pratiques, de désigner un responsable dédié et de mettre en place des mécanismes de mesure et de feedback réguliers.`
          : `Atteindre le niveau d'excellence implique d'intégrer des pratiques de benchmarking continu, d'innovation sectorielle et de valorisation externe de la maturité atteinte.`,
      };
    }),

    topRecommendations: [
      {
        priority: 1,
        title: `Traiter en urgence la dimension ${weakest[0] ? (pillarDefs[weakest[0][0]]?.label ?? weakest[0][0]) : 'la plus faible'}`,
        rationale: `Score de ${weakest[0]?.[1] ?? 0}/100 — c'est la dimension avec le plus fort impact négatif sur le score global et la compétitivité. Chaque mois d'inaction aggrave les coûts cachés.`,
        impact: 'Élevé',
        effortRequis: 'Moyen',
        timeline: '30 jours',
        roiEstimate: 'Amélioration estimée de 5-8 points sur le score global dans les 90 jours, avec réduction directe des coûts cachés liés à cette dimension',
        responsable: 'DG / DRH',
        prerequis: 'Validation de la priorité en COMEX et allocation d'un responsable de chantier dédié',
      },
      {
        priority: 2,
        title: `Structurer un tableau de bord de pilotage de la transformation`,
        rationale: `Sans mesure régulière et transparente, les améliorations engagées ne sont pas pérennes et l'organisation perd le cap. Un tableau de bord partagé rend la transformation visible et accountable.`,
        impact: 'Moyen',
        effortRequis: 'Faible',
        timeline: '2 semaines',
        roiEstimate: 'Accélération du rythme de transformation x1.5, meilleure adhésion des équipes, décisions de direction fondées sur des données',
        responsable: 'DRH / DCom',
        prerequis: 'Désignation d'un pilote de la transformation avec accès aux données',
      },
      {
        priority: 3,
        title: `Capitaliser sur ${strongest[0] ? (pillarDefs[strongest[0][0]]?.label ?? strongest[0][0]) : 'la dimension la plus forte'} comme modèle interne`,
        rationale: `Score de ${strongest[0]?.[1] ?? 0}/100 — cette excellence est un actif stratégique sous-exploité. La répliquer dans les dimensions faibles accélère la transformation à moindre coût.`,
        impact: 'Moyen',
        effortRequis: 'Faible',
        timeline: '45 jours',
        roiEstimate: 'Transfert de bonnes pratiques accélérant la progression des dimensions faibles de 20-30%, valorisation externe de l'excellence',
        responsable: 'Direction générale',
        prerequis: 'Cartographie des bonnes pratiques de la dimension forte et identification des équipes porteuses',
      },
      {
        priority: 4,
        title: 'Lancer un programme de formation ciblée sur les compétences critiques',
        rationale: 'Les facteurs bloquants identifiés dans les dimensions faibles sont souvent liés à des lacunes de compétences managériales et opérationnelles.',
        impact: 'Moyen',
        effortRequis: 'Moyen',
        timeline: '3 mois',
        roiEstimate: 'Montée en compétences mesurable des équipes, réduction des erreurs et des dysfonctionnements récurrents',
        responsable: 'DRH',
        prerequis: 'Diagnostic précis des compétences manquantes par dimension (à réaliser en J1-J30)',
      },
      {
        priority: 5,
        title: 'Engager un programme de transformation accompagné Epitaphe360',
        rationale: `Un score de ${globalScore}/100 au niveau ${maturityName} nécessite un accompagnement expert pour structurer et accélérer la transformation — les ressources internes seules peinent généralement à maintenir le rythme.`,
        impact: 'Élevé',
        effortRequis: 'Important',
        timeline: '6 mois',
        roiEstimate: 'Gain de 15-25 points sur le score global sur 12 mois avec un accompagnement structuré, ROI documenté et reconnu par les parties prenantes',
        responsable: 'DG',
        prerequis: 'Validation du budget transformation et engagement de la direction dans la durée',
      },
    ],

    actionPlan90Days: [
      {
        week: 'J1-J30',
        actions: [
          `Présentation du diagnostic Intelligence™ en COMEX — validation des priorités et allocation des ressources`,
          `Constitution du comité de pilotage de la transformation avec un responsable par dimension critique`,
          `Lancement du chantier prioritaire sur ${weakest[0] ? (pillarDefs[weakest[0][0]]?.label ?? weakest[0][0]) : 'la dimension la plus faible'} — atelier de cadrage et plan d'action détaillé`,
        ],
        livrable: 'Plan de transformation validé en COMEX avec responsables, budgets et jalons',
        kpi: 'Taux d'engagement du COMEX sur les priorités identifiées (objectif : 100%)',
      },
      {
        week: 'J31-J60',
        actions: [
          'Déploiement des Quick Wins identifiés sur les 2 dimensions les plus critiques',
          'Mise en place du tableau de bord mensuel de suivi de la transformation',
          'Première session de formation des managers sur les nouvelles pratiques prioritaires',
        ],
        livrable: 'Tableau de bord opérationnel + 2 Quick Wins déployés + premier bilan chiffré',
        kpi: 'Progression mesurée sur les 2 dimensions critiques (objectif : +5 points chacune)',
      },
      {
        week: 'J61-J90',
        actions: [
          'Premier bilan de mi-parcours en COMEX — ajustement du plan selon les résultats',
          'Capitalisation des bonnes pratiques émergentes et partage inter-équipes',
          'Préparation du programme de transformation semestre 2 avec Epitaphe360',
        ],
        livrable: 'Rapport de mi-parcours avec KPIs mesurés + proposition de programme Transform S2',
        kpi: `Progression du score global (objectif : +${Math.min(12, 100 - globalScore)} points par rapport à ${globalScore}/100)`,
      },
    ],

    messageDirigeant: `Votre score de ${globalScore}/100 au niveau ${maturityName} est une photo honnête de l'état actuel de votre organisation — ni catastrophique, ni rassurant. ${weakest[0] ? `La dimension ${pillarDefs[weakest[0][0]]?.label ?? weakest[0][0]} à ${weakest[0][1]}/100 est votre talon d'Achille : elle limite l'expression de vos forces.` : ''} La bonne nouvelle est que les leviers d'amélioration sont identifiés et actionnables immédiatement. L'organisation qui passera à l'action dans les 30 prochains jours sera dans une position compétitive significativement différente dans 12 mois.`,

    transformCTA: `Votre niveau ${maturityName} (${globalScore}/100) révèle des leviers de transformation concrets et actionnables — Epitaphe360 vous propose un programme Transform sur mesure pour passer de l'analyse à l'impact en 90 jours.`,
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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Tu es un Senior Partner chez Epitaphe360, cabinet de conseil stratégique de référence en MENA. Tu analyses les résultats de diagnostic BMI 360™ et produis des rapports Intelligence™ de niveau C-suite. Ton analyse est toujours spécifique aux données fournies, jamais générique. Tu réponds UNIQUEMENT en JSON valide selon le schéma demandé — aucun texte, aucun markdown, aucune explication hors du JSON.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.35,
        max_tokens: 4500,
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
    parsed.model = 'gpt-4o';
    return parsed;
  } catch (err) {
    console.error('[AI Report] Generation failed:', err);
    return buildFallbackReport(params);
  }
}
