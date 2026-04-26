/**
 * BMI 360™ — Générateur de rapports IA Intelligence (TIER-1 CONSULTING GRADE)
 * Modèle principal  : Anthropic Claude Sonnet 4.5 (raisonnement business supérieur)
 * Modèle fallback   : OpenAI gpt-4o (si Anthropic indisponible)
 * max_tokens 8000, temperature 0.3
 * Schéma de livrable : niveau McKinsey/BCG/Bain — quantification financière, business case,
 * RACI, scénarios, change management, cas références.
 */

// ─── Types granulaires ───────────────────────────────────────────────────────

export interface QuantifiedRisk {
  risque: string;
  consequence: string;
  probabilite: 'Élevée' | 'Moyenne' | 'Faible';
  impact: 'Critique' | 'Élevé' | 'Moyen';
  horizon: string;                 // "6 mois" | "12 mois" | "24 mois"
  coutEstime?: string;             // "200-400k MAD/an"
  mitigation: string;
}

export interface QuantifiedOpportunity {
  opportunite: string;
  facilite: 'Élevée' | 'Moyenne' | 'Faible';
  valeur: 'Élevée' | 'Moyenne' | 'Faible';
  horizon: string;
  valeurEstimee: string;
  actionPourSaisir: string;
}

export interface BloquantTypé {
  facteur: string;
  type: 'Culturel' | 'Structurel' | 'Compétences' | 'Outils' | 'Gouvernance';
  leverDeblocage: string;
}

export interface ActionDetaillee {
  action: string;
  responsable: string;
  delai: string;
  ressources?: string;
  kpiSucces?: string;
}

export interface QuickWinDetaille {
  titre: string;
  description: string;
  responsable: string;
  delai: string;                   // "15 jours"
  livrable: string;
  investissement?: string;         // "5-10k MAD"
  impactAttendu: string;           // "+8 points sur ce pilier en 60j"
}

export interface AIPillarAnalysis {
  pillar: string;
  pillarLabel: string;
  score: number;
  niveau: string;                  // "Critique" | "Préoccupant" | "En développement" | "Performant" | "Excellence"
  diagnostic: string;              // 5-7 phrases approfondies, ancrées dans les données
  rootCauseAnalysis?: string;      // Analyse causale de type 5-Why ou Ishikawa
  impactQuantifie?: {
    coutCacheAnnuel?: string;      // "200-400k MAD/an"
    impactProductivite?: string;
    impactEngagement?: string;
    impactReputationnel?: string;
  };
  benchmarkSectoriel?: {
    vousEtes: number;
    moyenneMENA: number;
    topQuartileMENA: number;
    leaderSecteur?: number;
    ecartAuLeader?: string;
    interpretation: string;
  };
  benchmarkMENA?: string;          // Legacy / texte court complémentaire
  risquesCles: Array<QuantifiedRisk | string>;
  facteursBloquants?: Array<BloquantTypé | string>;
  actions: Array<ActionDetaillee | string>;
  quickWin: QuickWinDetaille | string;
  indicateursCles?: {
    lagging: string[];             // KPIs résultat (mesurés a posteriori)
    leading: string[];             // KPIs prédictifs (mesurés en cours)
  } | string[];
  cheminVersExcellence?: {
    niveauActuel: string;
    prochainNiveau: string;
    leviersClefs: string[];
    horizonAtteinte: string;       // "6 mois" / "12 mois"
  };
  prochainNiveau?: string;         // Legacy texte
  impactOrganisationnel?: string;  // Legacy texte
}

export interface BusinessCase {
  investissementEstime: string;    // "150-250k MAD"
  gainAnnuelEstime: string;        // "500-800k MAD"
  paybackPeriod: string;           // "5-8 mois"
  horizonROI: string;              // "Année 1" / "Année 2"
  hypothesesClefs: string[];
  ratioROI?: string;               // "3.2x sur 3 ans"
}

export interface RACI {
  responsable: string;             // R — exécute le travail
  imputable: string;               // A — rend des comptes
  consultes: string[];             // C — donne avis avant action
  informes: string[];              // I — informé du résultat
}

export interface TopRecommendation {
  priority: number;
  title: string;
  narrativeStrategique?: string;   // 3-4 phrases : pourquoi c'est LA priorité
  rationale: string;
  businessCase?: BusinessCase;
  raci?: RACI;
  impact: 'Élevé' | 'Moyen' | 'Fort';
  effortRequis?: 'Faible' | 'Moyen' | 'Important';
  timeline: string;
  roiEstimate: string;
  responsable?: string;            // Legacy short form
  prerequis: string[] | string;
  facteursCritiquesSucces?: string[];
  piegesAEviter?: string[];
  methodologie?: string;           // "Hoshin Kanri" / "OKR" / "Kotter 8 steps" / etc.
}

export interface ActionPlanPhase {
  phase?: string;                  // "Mobilisation & Cadrage" / "Déploiement" / "Capitalisation"
  week: string;                    // "J1-J30"
  objectif?: string;
  actions: Array<ActionDetaillee | string>;
  livrable?: string;
  kpi?: string;
  comiteValidation?: string;       // "COMEX du J28"
  ressourcesRequises?: string;
  budgetAlloue?: string;
}

export interface ScenarioProjection {
  scoreCible12Mois: number;
  investissement: string;
  description: string;
  conditionsRealisation?: string[];
}

export interface CasReference {
  secteur: string;
  tailleEntreprise: string;
  situationDepart: string;
  actionsClefs: string[];
  resultats: string;
  duree?: string;
}

export interface StakeholderImpact {
  groupe: string;                  // "Managers N-1" / "Comité d'entreprise" / "Direction RH"
  posture: 'Promoteur' | 'Allié' | 'Neutre' | 'Sceptique' | 'Opposant';
  enjeu: string;
  actionRequise: string;
}

export interface AIReport {
  generatedAt: string;
  model: string;

  // ───── COUVERTURE ─────
  couverture?: {
    titre: string;
    sousTitre: string;
    verdictUneLigne: string;       // Le verdict en 1 phrase percutante
    dateDiagnostic: string;
    perimetre?: string;
  };

  // ───── EXECUTIVE LAYER ─────
  syntheseDirecteur?: string;       // Lettre 2-3 § du Senior Partner
  executiveSummary: string;
  troisChiffresClefs?: Array<{
    chiffre: string;
    label: string;
    interpretation: string;
  }>;
  troisMessagesClefs?: string[];

  // ───── POSITIONING ─────
  positionConcurrentielle?: string;
  positionnementStrategique?: {
    vsBenchmarkMENA: string;
    vsTop25Pct: string;
    vsLeaderSecteur?: string;
    trajectoireProjete5Ans: string; // Si rien ne change
  };
  risqueStrategique?: string;
  opportuniteStrategique?: string;

  // ───── MATRICES ─────
  matriceRisques?: QuantifiedRisk[];
  matriceOpportunites?: QuantifiedOpportunity[];

  // ───── DIAGNOSTIC PAR PILIER ─────
  pillarAnalyses: AIPillarAnalysis[];

  // ───── ROADMAP ─────
  topRecommendations: Array<TopRecommendation | string>;
  actionPlan90Days: Array<ActionPlanPhase> | { days30: string[]; days60: string[]; days90: string[] };

  // ───── SCÉNARIOS ─────
  scenariosProjection?: {
    conservateur: ScenarioProjection;
    base: ScenarioProjection;
    ambitieux: ScenarioProjection;
  };

  // ───── GOUVERNANCE & CHANGE ─────
  gouvernance?: {
    instancePilotage: string;
    frequenceReporting: string;
    sponsorExecutif: string;
    equipeProjet: string;
    budgetTotalRecommande: string;
  };

  changeManagement?: {
    stakeholdersCritiques: StakeholderImpact[];
    risquesAdoption: string[];
    leviersAdoption: string[];
    planCommunicationInterne: string;
  };

  // ───── PROOF POINTS ─────
  casReference?: CasReference[];

  // ───── CLOSING ─────
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

// ─── Calibrage financier MENA pour estimations ──────────────────────────────

const FINANCIAL_BENCHMARKS_MENA = {
  // Salaires bruts moyens annuels (MAD)
  salaireCadre: '180-350k MAD/an',
  salaireManager: '350-700k MAD/an',
  salaireDirecteur: '700k-1.5M MAD/an',
  // Coûts cachés référentiels documentés MENA
  coutTurnover: '6-12 mois de salaire par départ non souhaité',
  coutAccidentTravail: '50-150k MAD par accident avec arrêt (CNSS + production + RH)',
  coutRecrutementCadre: '15-25% du salaire annuel (cabinet + onboarding + montée en compétence)',
  coutDesengagement: '15-25% de baisse de productivité par collaborateur désengagé',
  coutCriseReputationnelle: '500k-5M MAD selon ampleur (marque employeur, ventes, partenaires)',
  // Tailles entreprises MENA typiques
  pmePetite: '50-150 collaborateurs · CA 20-80M MAD',
  pmeMoyenne: '150-500 collaborateurs · CA 80-300M MAD',
  grandeEntreprise: '500-2000 collaborateurs · CA 300M-2Md MAD',
  groupe: '2000+ collaborateurs · CA > 2Md MAD',
};

// ─── Méthodologies et frameworks référentiels ───────────────────────────────

const METHODOLOGIES_LIBRARY = [
  'Hoshin Kanri (déploiement stratégique X-Matrix)',
  'OKR (Objectives & Key Results, méthode Google/Intel)',
  'Kotter 8-Step Change Model',
  'ADKAR (Awareness, Desire, Knowledge, Ability, Reinforcement)',
  'McKinsey 7S Framework',
  'Balanced Scorecard (Kaplan & Norton)',
  'RACI Matrix (Responsabilités projet)',
  'SIPOC (Supplier, Input, Process, Output, Customer)',
  'Voice of Customer / Voice of Employee surveys',
  '5-Why Root Cause Analysis',
  'Ishikawa (diagramme causes-effets)',
  'Net Promoter Score interne (eNPS)',
  'Pulse Survey mensuel (15 questions max)',
  'Design Sprint (Google Ventures, 5 jours)',
  'Lean Six Sigma DMAIC',
  'Stage-Gate Innovation Process',
  'OGSM (Objectives, Goals, Strategies, Measures)',
];

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
  const toolCtx     = TOOL_CONTEXTS[toolId] ?? '';
  const maturityName = MATURITY_NAMES[maturityLevel]?.[toolId] ?? `Niveau ${maturityLevel}`;
  const pillarDefs   = TOOL_PILLAR_LABELS[toolId] ?? {};
  const benchmark    = TOOL_BENCHMARKS[toolId];

  // Tri des piliers du plus faible au plus fort
  const sortedPillars = Object.entries(pillarScores).sort((a, b) => a[1] - b[1]);
  const pillarsText   = sortedPillars
    .map(([p, s]) => {
      const def = pillarDefs[p];
      const lvl = s < 20 ? 'CRITIQUE' : s < 40 ? 'PRÉOCCUPANT' : s < 60 ? 'EN DÉVELOPPEMENT' : s < 80 ? 'PERFORMANT' : 'EXCELLENCE';
      return `  • [${p}] ${def?.label ?? p} (poids ${def?.weight ?? '?'}%) : ${s}/100 → ${lvl}\n    Définition : ${def?.description ?? 'N/A'}`;
    })
    .join('\n');

  // Gap analysis
  const scores       = Object.values(pillarScores);
  const maxScore     = Math.max(...scores);
  const minScore     = Math.min(...scores);
  const gap          = maxScore - minScore;
  const weakest      = sortedPillars[0];
  const strongest    = sortedPillars[sortedPillars.length - 1];
  const gapAnalysis  = gap > 25
    ? `⚠ PROFIL FORTEMENT DÉSÉQUILIBRÉ (écart de ${gap} points entre [${strongest[0]}]=${strongest[1]} et [${weakest[0]}]=${weakest[1]}). Loi du maillon faible : l'organisation performe au niveau de sa dimension la plus faible. Le rééquilibrage est PRIORITAIRE absolu — investir uniquement sur les forces ne génère plus de gain marginal significatif.`
    : gap > 15
    ? `Profil modérément déséquilibré (écart ${gap} points). Les dimensions faibles freinent l'expression des forces — séquencer le rééquilibrage AVANT toute optimisation des dimensions fortes.`
    : `Profil homogène (écart ${gap} points). Progression par optimisation systématique de l'ensemble du modèle, pas de point de blocage isolé.`;

  // Comparaison benchmark
  const benchmarkNote = benchmark
    ? `Score ${globalScore}/100 vs moyenne MENA ${benchmark.menaAvg}/100 (${globalScore > benchmark.menaAvg ? `+${globalScore - benchmark.menaAvg} pts au-dessus` : `${globalScore - benchmark.menaAvg} pts en dessous`}) · Top 25% MENA = ${benchmark.menaTop}/100 · Écart au top quartile = ${benchmark.menaTop - globalScore} pts`
    : '';

  const sectorNote = sector
    ? `\nSECTEUR : ${sector} — TU DOIS contextualiser CHAQUE recommandation et CHAQUE estimation financière avec les enjeux spécifiques à ${sector} en MENA (réglementation locale, intensité concurrentielle, maturité sectorielle, attentes parties prenantes, marges typiques, contraintes RH).`
    : '\nSECTEUR : Non précisé — utilise les benchmarks transversaux MENA.';

  const sizeNote = companySize
    ? `\nTAILLE : ${companySize} — TU DOIS calibrer les investissements, ressources et complexité organisationnelle selon cette taille (gouvernance, capacité d'investissement, vitesse d'exécution).`
    : '\nTAILLE : Non précisée — calibre par défaut sur PME moyenne MENA (150-500 collaborateurs).';

  return `=== IDENTITÉ ET POSTURE ===
Tu es un Senior Partner & Practice Leader chez Epitaphe360, cabinet de conseil stratégique tier-1 en Afrique du Nord et MENA, équivalent McKinsey/BCG/Bain pour la région. Tu factures cette mission à 10,000 USD au minimum.

EXPÉRIENCE :
• 20+ ans de conseil stratégique, dont 12 ans en région MENA
• 200+ transformations pilotées : groupes industriels, banques, assurances, retail, agro, services, scale-ups tech
• Membre du Board d'Epitaphe360, intervenant régulier au CEO Forum, à HEM, à l'ISCAE
• Spécialisé dans les transformations organisationnelles à fort impact business mesurable

EXIGENCES NON-NÉGOCIABLES POUR CE RAPPORT :

1. NIVEAU DE QUALITÉ
   Ce rapport doit être indiscernable d'un livrable McKinsey/BCG/Bain. Le client doit avoir l'impression d'avoir économisé 6 semaines de mission terrain. Aucune trivialité, aucune généralité. Chaque phrase doit faire gagner ou faire perdre des décisions.

2. QUANTIFICATION OBLIGATOIRE
   • TOUS les impacts en MAD (dirhams marocains) ou EUR avec fourchettes (ex: "200-400k MAD/an")
   • TOUTES les recommandations avec business case : investissement, gain annuel, payback period, ROI
   • TOUS les KPIs avec valeurs cibles chiffrées et horizons
   • TOUTES les actions avec délais en jours/semaines/mois précis
   Référentiel coûts MENA :
   - Turn-over non souhaité : 6-12 mois de salaire perdus
   - Accident travail avec arrêt : 50-150k MAD
   - Recrutement cadre : 15-25% du salaire annuel
   - Désengagement : -15 à -25% de productivité
   - Crise réputationnelle : 500k-5M MAD

3. STYLE D'ÉCRITURE
   • Direct, factuel, sans complaisance — tu dis ce qui est, pas ce qui rassure
   • Phrases courtes, verbes d'action, voix active
   • INTERDIT : "il convient de", "il est important de", "il faudrait", "nous recommandons de"
   • OBLIGATOIRE : "X fait Y avec Z en N jours pour produire L"
   • Cite des chiffres, des marques, des acteurs, des cas concrets MENA quand pertinent
   • Ton de Senior Partner — exigeant mais constructif, jamais condescendant

4. MÉTHODOLOGIES
   Quand tu recommandes une démarche, NOMME la méthodologie de référence :
   ${METHODOLOGIES_LIBRARY.map(m => `   • ${m}`).join('\n')}

5. SPÉCIFICITÉ
   Aucune phrase qui pourrait être copiée-collée à un autre client. Chaque ligne ancrée dans LES SCORES RÉELS de cette entreprise. Si tu écris "il faut améliorer la communication", c'est éliminatoire — tu écris "Le score Cohérence à 58/100 vs benchmark 72/100 nécessite la mise en place d'un Comité Éditorial mensuel piloté par le DRH avec validation des messages clés par le DG, dès J15".

6. CAS RÉFÉRENCE
   Tu cites 2-3 cas d'entreprises MENA anonymisés (mais réalistes) ayant vécu une transformation similaire — secteur, taille, situation de départ, actions, résultats chiffrés.

7. JSON UNIQUEMENT
   Aucun texte hors du JSON. Aucun markdown. Aucune explication. Le JSON DOIT être valide.

=== CONTEXTE DE L'OUTIL ===
${toolCtx}

=== DONNÉES DE L'ÉVALUATION ===
ENTREPRISE : ${companyName || 'Confidentiel — utilise "votre organisation"'}${sectorNote}${sizeNote}
SCORE GLOBAL : ${globalScore}/100 — Niveau ${maturityLevel}/5 "${maturityName}"
${benchmarkNote}

=== SCORES DÉTAILLÉS PAR DIMENSION (triés faible → fort) ===
${pillarsText}

=== ANALYSE DES ÉCARTS INTER-DIMENSIONS ===
${gapAnalysis}

=== GRILLE D'INTERPRÉTATION DES SCORES ===
• 0–19   → CRITIQUE         · Risque opérationnel immédiat · Coûts cachés majeurs (>500k MAD/an typiquement)
• 20–39  → PRÉOCCUPANT      · Vulnérabilités structurelles · Coûts cachés significatifs (200-500k MAD/an)
• 40–59  → EN DÉVELOPPEMENT · Bases présentes mais incohérences · Coûts d'opportunité importants
• 60–79  → PERFORMANT       · Pratiques solides · Optimisations rentables disponibles
• 80–100 → EXCELLENCE       · Référence sectorielle · Actif différenciant à valoriser

=== INSTRUCTIONS PAR SECTION (LIRE CHAQUE LIGNE) ===

▸ COUVERTURE
  • titre : "Rapport Intelligence™ — [Nom outil] — [Nom entreprise ou Confidentiel]"
  • sousTitre : 1 phrase positionnant l'enjeu stratégique central
  • verdictUneLigne : LE verdict en 1 phrase brutale et honnête. Ex : "Une organisation au-dessus de la moyenne MENA mais structurellement bloquée par 2 dimensions critiques qui annulent les efforts sur les autres."
  • dateDiagnostic : ISO 8601 du jour
  • perimetre : ce que couvre et ne couvre pas le diagnostic

▸ syntheseDirecteur (2-3 paragraphes, séparés par \\n\\n)
  §1 — État des lieux SANS COMPLAISANCE basé sur le score ${globalScore}/100. Nomme les 2 forces ET les 2 faiblesses majeures avec scores réels. Le ton est celui d'une note adressée au DG par un Senior Partner expérimenté.
  §2 — Ce que l'organisation peut atteindre dans 12 mois avec une feuille de route ciblée. Cite des cibles chiffrées (ex: "passage de 55 à 68/100, soit dans le top 30% MENA").
  §3 (optionnel) — Le coût de l'inaction sur 18 mois (chiffré).

▸ executiveSummary (5-6 phrases denses)
  Synthèse COMEX. Constat → Cause profonde → Risque #1 → Opportunité #1 → Recommandation phare → Engagement requis.

▸ troisChiffresClefs (EXACTEMENT 3 chiffres choc)
  Ex : { chiffre: "850k MAD", label: "Coût caché annuel estimé", interpretation: "Équivalent à 4 cadres seniors perdus chaque année" }

▸ troisMessagesClefs (EXACTEMENT 3 messages courts mémorables, max 12 mots chacun)

▸ positionnementStrategique
  • vsBenchmarkMENA : positionnement vs moyenne ${benchmark?.menaAvg ?? 'MENA'}/100 avec interprétation
  • vsTop25Pct : positionnement vs ${benchmark?.menaTop ?? 'top 25%'}/100 + écart à combler
  • vsLeaderSecteur : qui sont les leaders sectoriels MENA en ${benchmark?.unit ?? 'cette dimension'} (cite 1-2 références sectorielles MENA)
  • trajectoireProjete5Ans : où l'organisation sera dans 5 ans SI RIEN N'EST FAIT (factuel, pas dramatique)

▸ risqueStrategique : LE risque #1 si score inchangé à 18 mois — chiffré
▸ opportuniteStrategique : L'opportunité prioritaire — chiffrée

▸ matriceRisques (3-5 risques quantifiés)
  Pour chaque : risque, conséquence concrète, probabilité, impact, horizon, coût estimé en MAD, mitigation

▸ matriceOpportunites (3-5 opportunités quantifiées)
  Pour chaque : opportunité, facilité d'exécution, valeur, horizon, valeur estimée en MAD, action pour saisir

▸ pillarAnalyses (TOUS les piliers)
  Pour chaque dimension :
  • niveau : badge selon grille
  • diagnostic : 5-7 phrases SPÉCIFIQUES à ce score précis dans ce contexte. Aucune généralité.
  • rootCauseAnalysis : analyse causale en 3-5 phrases (5-Why) — POURQUOI ce score ?
  • impactQuantifie : objet avec coutCacheAnnuel (chiffré MAD), impactProductivite, impactEngagement, impactReputationnel
  • benchmarkSectoriel : objet { vousEtes, moyenneMENA, topQuartileMENA, leaderSecteur, ecartAuLeader, interpretation }
  • risquesCles : 3-4 objets QuantifiedRisk { risque, consequence, probabilite, impact, horizon, coutEstime, mitigation }
  • facteursBloquants : 2-3 objets BloquantTypé { facteur, type, leverDeblocage }
  • actions : 3-4 objets ActionDetaillee { action, responsable, delai, ressources, kpiSucces }
  • quickWin : objet QuickWinDetaille COMPLET avec investissement chiffré et impact attendu chiffré
  • indicateursCles : objet { lagging: [KPIs résultat], leading: [KPIs prédictifs] } — chacun avec valeur cible
  • cheminVersExcellence : objet { niveauActuel, prochainNiveau, leviersClefs, horizonAtteinte }

▸ topRecommendations (EXACTEMENT 5, classées ROI × urgence)
  Pour chaque :
  • narrativeStrategique : 3-4 phrases — pourquoi c'est LA priorité maintenant
  • businessCase OBLIGATOIRE : { investissementEstime (MAD), gainAnnuelEstime (MAD), paybackPeriod, horizonROI, hypothesesClefs (3-4), ratioROI (sur 3 ans) }
  • raci OBLIGATOIRE : { responsable, imputable, consultes [], informes [] }
  • impact, effortRequis, timeline
  • prerequis : 2-3 prérequis critiques
  • facteursCritiquesSucces : 3-4 FCS
  • piegesAEviter : 2-3 pièges classiques observés sur ce type de transformation
  • methodologie : nom de la méthode de référence à appliquer

▸ actionPlan90Days (3 phases × 30 jours)
  Pour chaque phase :
  • phase : nom (ex: "Mobilisation & Cadrage" / "Déploiement Quick Wins" / "Capitalisation & Scale")
  • week : "J1-J30" / "J31-J60" / "J61-J90"
  • objectif : 1 phrase
  • actions : 4-5 ActionDetaillee avec responsable, délai, ressources, kpiSucces
  • livrable : livrable tangible attendu
  • kpi : KPI précis et chiffré
  • comiteValidation : instance de validation
  • ressourcesRequises : ressources humaines / budget
  • budgetAlloue : montant en MAD

▸ scenariosProjection (3 scénarios)
  Conservateur / Base / Ambitieux — pour chaque : score cible 12 mois (chiffre), investissement total (MAD), description, conditionsRealisation (3-4)

▸ gouvernance
  Instance pilotage, fréquence reporting, sponsor exécutif, équipe projet, budget total recommandé sur 12 mois (MAD)

▸ changeManagement
  • stakeholdersCritiques : 4-6 groupes avec posture évaluée et action requise
  • risquesAdoption : 3-4 risques typiques d'adoption
  • leviersAdoption : 3-4 leviers concrets pour mobiliser
  • planCommunicationInterne : approche en 3-4 phrases (timing, canaux, messages clés)

▸ casReference (2-3 cas anonymisés)
  Cas réalistes d'entreprises MENA ayant vécu transformation similaire — secteur, taille, situation départ (score), actions clés, résultats chiffrés (score arrivée + ROI), durée

▸ messageDirigeant (4-5 phrases)
  Adressé directement au dirigeant, ton personnel et exigeant. Inclure score ${globalScore}/100, 1 vérité difficile, 1 message d'espoir ancré dans les données, 1 invitation à l'action.

▸ transformCTA (1 phrase percutante)
  Personnalisée niveau ${maturityName} et score ${globalScore}/100.

=== SCHÉMA JSON EXACT (réponds UNIQUEMENT avec ce JSON, sans markdown) ===
{
  "couverture": {
    "titre": "Rapport Intelligence™ — ...",
    "sousTitre": "...",
    "verdictUneLigne": "...",
    "dateDiagnostic": "2025-...",
    "perimetre": "..."
  },
  "syntheseDirecteur": "PARAGRAPHE_1\\n\\nPARAGRAPHE_2\\n\\nPARAGRAPHE_3",
  "executiveSummary": "5-6 phrases denses",
  "troisChiffresClefs": [
    { "chiffre": "850k MAD", "label": "Coût caché annuel", "interpretation": "..." },
    { "chiffre": "...", "label": "...", "interpretation": "..." },
    { "chiffre": "...", "label": "...", "interpretation": "..." }
  ],
  "troisMessagesClefs": ["Message 1 max 12 mots", "Message 2", "Message 3"],
  "positionnementStrategique": {
    "vsBenchmarkMENA": "...",
    "vsTop25Pct": "...",
    "vsLeaderSecteur": "...",
    "trajectoireProjete5Ans": "..."
  },
  "risqueStrategique": "...",
  "opportuniteStrategique": "...",
  "matriceRisques": [
    { "risque": "...", "consequence": "...", "probabilite": "Élevée", "impact": "Critique", "horizon": "12 mois", "coutEstime": "300-600k MAD/an", "mitigation": "..." }
  ],
  "matriceOpportunites": [
    { "opportunite": "...", "facilite": "Élevée", "valeur": "Élevée", "horizon": "6 mois", "valeurEstimee": "200-400k MAD/an", "actionPourSaisir": "..." }
  ],
  "pillarAnalyses": [
    {
      "pillar": "ID",
      "pillarLabel": "Nom complet",
      "score": 0,
      "niveau": "Préoccupant",
      "diagnostic": "5-7 phrases spécifiques et ancrées",
      "rootCauseAnalysis": "Analyse 5-Why en 3-5 phrases",
      "impactQuantifie": {
        "coutCacheAnnuel": "200-400k MAD/an",
        "impactProductivite": "...",
        "impactEngagement": "...",
        "impactReputationnel": "..."
      },
      "benchmarkSectoriel": {
        "vousEtes": 0,
        "moyenneMENA": 0,
        "topQuartileMENA": 0,
        "leaderSecteur": 0,
        "ecartAuLeader": "...",
        "interpretation": "..."
      },
      "risquesCles": [
        { "risque": "...", "consequence": "...", "probabilite": "Élevée", "impact": "Élevé", "horizon": "12 mois", "coutEstime": "...", "mitigation": "..." }
      ],
      "facteursBloquants": [
        { "facteur": "...", "type": "Culturel", "leverDeblocage": "..." }
      ],
      "actions": [
        { "action": "...", "responsable": "DRH", "delai": "30 jours", "ressources": "1 ETP RH + budget 50k MAD", "kpiSucces": "Score Inclusion à 45/100 à J90" }
      ],
      "quickWin": {
        "titre": "...",
        "description": "...",
        "responsable": "...",
        "delai": "15 jours",
        "livrable": "...",
        "investissement": "5-10k MAD",
        "impactAttendu": "+8 points sur ce pilier en 60 jours"
      },
      "indicateursCles": {
        "lagging": ["KPI résultat 1 (cible chiffrée)", "KPI 2"],
        "leading": ["KPI prédictif 1 (cible chiffrée)", "KPI 2"]
      },
      "cheminVersExcellence": {
        "niveauActuel": "...",
        "prochainNiveau": "...",
        "leviersClefs": ["...", "..."],
        "horizonAtteinte": "9 mois"
      }
    }
  ],
  "topRecommendations": [
    {
      "priority": 1,
      "title": "Titre court et percutant",
      "narrativeStrategique": "3-4 phrases",
      "rationale": "...",
      "businessCase": {
        "investissementEstime": "150-250k MAD",
        "gainAnnuelEstime": "500-800k MAD",
        "paybackPeriod": "5-8 mois",
        "horizonROI": "Année 1",
        "hypothesesClefs": ["...", "...", "..."],
        "ratioROI": "3.2x sur 3 ans"
      },
      "raci": {
        "responsable": "DRH",
        "imputable": "DG",
        "consultes": ["DAF", "DCom"],
        "informes": ["COMEX", "Managers N-1"]
      },
      "impact": "Élevé",
      "effortRequis": "Moyen",
      "timeline": "3 mois",
      "prerequis": ["...", "..."],
      "facteursCritiquesSucces": ["...", "...", "..."],
      "piegesAEviter": ["...", "..."],
      "methodologie": "Hoshin Kanri + RACI"
    }
  ],
  "actionPlan90Days": [
    {
      "phase": "Mobilisation & Cadrage",
      "week": "J1-J30",
      "objectif": "...",
      "actions": [
        { "action": "...", "responsable": "...", "delai": "J1-J7" }
      ],
      "livrable": "...",
      "kpi": "...",
      "comiteValidation": "COMEX du J28",
      "ressourcesRequises": "1 sponsor exécutif + 1 chef de projet + 0.5 ETP DRH",
      "budgetAlloue": "50-80k MAD"
    }
  ],
  "scenariosProjection": {
    "conservateur": { "scoreCible12Mois": 0, "investissement": "300-500k MAD", "description": "...", "conditionsRealisation": ["...", "..."] },
    "base":         { "scoreCible12Mois": 0, "investissement": "800k-1.2M MAD", "description": "...", "conditionsRealisation": ["...", "..."] },
    "ambitieux":    { "scoreCible12Mois": 0, "investissement": "1.5-2.5M MAD", "description": "...", "conditionsRealisation": ["...", "..."] }
  },
  "gouvernance": {
    "instancePilotage": "Comité Transform mensuel présidé par le DG",
    "frequenceReporting": "Mensuel COMEX, trimestriel Conseil",
    "sponsorExecutif": "DG ou DRH",
    "equipeProjet": "1 chef de projet + 2 référents métiers + appui Epitaphe360",
    "budgetTotalRecommande": "1.2-1.8M MAD sur 12 mois (incluant ressources internes)"
  },
  "changeManagement": {
    "stakeholdersCritiques": [
      { "groupe": "Managers N-1", "posture": "Sceptique", "enjeu": "...", "actionRequise": "..." }
    ],
    "risquesAdoption": ["...", "...", "..."],
    "leviersAdoption": ["...", "...", "..."],
    "planCommunicationInterne": "..."
  },
  "casReference": [
    {
      "secteur": "Industrie agroalimentaire MENA",
      "tailleEntreprise": "320 collaborateurs · CA 180M MAD",
      "situationDepart": "Score 38/100 — niveau Broadcast",
      "actionsClefs": ["...", "..."],
      "resultats": "Score 64/100 en 9 mois, ROI 3.5x, turn-over divisé par 2",
      "duree": "9 mois"
    }
  ],
  "messageDirigeant": "4-5 phrases personnelles et directes",
  "transformCTA": "1 phrase percutante personnalisée"
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

// ─── System prompt commun (Anthropic + OpenAI) ──────────────────────────────

const SYSTEM_PROMPT = `Tu es Senior Partner & Practice Leader chez Epitaphe360, cabinet de conseil stratégique tier-1 en MENA (équivalent McKinsey/BCG/Bain). Tu produis des rapports Intelligence™ vendus 10,000 USD minimum.

EXIGENCES ABSOLUES :
1. Niveau de qualité indiscernable d'un livrable McKinsey/BCG/Bain
2. Quantification financière SYSTÉMATIQUE en MAD (dirhams marocains) avec fourchettes
3. Business case complet pour chaque recommandation : investissement, gain annuel, payback, ROI
4. RACI détaillée (Responsable, Imputable, Consultés, Informés)
5. Scénarios de projection (conservateur / base / ambitieux) avec scores cibles chiffrés
6. Cas références anonymisés mais réalistes d'entreprises MENA
7. Méthodologies nommées (Hoshin Kanri, OKR, Kotter, ADKAR, RACI, etc.)
8. Aucune généralité, aucune phrase copiable-collable à un autre client
9. Style direct, factuel, sans formules creuses
10. JSON valide UNIQUEMENT — aucun texte hors du JSON, aucun markdown, aucune explication, aucun préambule, aucune balise de code. La réponse DOIT commencer par { et finir par }.

Le client doit avoir l'impression d'avoir économisé 6 semaines de mission terrain.`;

// ─── Provider Anthropic Claude (PRIORITAIRE) ─────────────────────────────────

async function callAnthropic(prompt: string): Promise<{ json: string; model: string } | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 8000,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: prompt + '\n\nIMPORTANT : Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ni après, sans bloc markdown ```json. Commence directement par { et termine par }.',
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('[AI Report] Anthropic error:', response.status, err);
    return null;
  }

  const data = await response.json() as {
    content: Array<{ type: string; text?: string }>;
    stop_reason?: string;
  };

  const text = data.content?.find(c => c.type === 'text')?.text;
  if (!text) {
    console.error('[AI Report] Anthropic: empty content');
    return null;
  }

  // Nettoyage défensif si Claude entoure quand même de markdown
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  return { json: cleaned, model };
}

// ─── Provider OpenAI (FALLBACK) ──────────────────────────────────────────────

async function callOpenAI(prompt: string): Promise<{ json: string; model: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || 'gpt-4o';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 8000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('[AI Report] OpenAI error:', response.status, err);
    return null;
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  return { json: content, model };
}

// ─── Dispatcher principal ────────────────────────────────────────────────────

export async function generateAIReport(params: {
  toolId: string;
  companyName?: string;
  sector?: string;
  companySize?: string;
  globalScore: number;
  maturityLevel: number;
  pillarScores: Record<string, number>;
}): Promise<AIReport> {
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAI    = !!process.env.OPENAI_API_KEY;

  if (!hasAnthropic && !hasOpenAI) {
    console.warn('[AI Report] No AI provider configured (ANTHROPIC_API_KEY or OPENAI_API_KEY) — using fallback report');
    return buildFallbackReport(params);
  }

  const prompt = buildPrompt(params);

  // Ordre des providers selon AI_PROVIDER (anthropic|openai|auto)
  const preferred = (process.env.AI_PROVIDER || 'anthropic').toLowerCase();
  const providers: Array<{ name: string; call: () => Promise<{ json: string; model: string } | null> }> = [];

  if (preferred === 'openai') {
    if (hasOpenAI)    providers.push({ name: 'openai',    call: () => callOpenAI(prompt) });
    if (hasAnthropic) providers.push({ name: 'anthropic', call: () => callAnthropic(prompt) });
  } else {
    if (hasAnthropic) providers.push({ name: 'anthropic', call: () => callAnthropic(prompt) });
    if (hasOpenAI)    providers.push({ name: 'openai',    call: () => callOpenAI(prompt) });
  }

  for (const provider of providers) {
    try {
      console.log(`[AI Report] Trying provider: ${provider.name}`);
      const result = await provider.call();
      if (!result) continue;

      const parsed = JSON.parse(result.json) as AIReport;
      parsed.generatedAt = new Date().toISOString();
      parsed.model = result.model;
      console.log(`[AI Report] ✓ Generated with ${provider.name} (${result.model})`);
      return parsed;
    } catch (err) {
      console.error(`[AI Report] Provider ${provider.name} failed:`, err instanceof Error ? err.message : err);
    }
  }

  console.warn('[AI Report] All providers failed — using fallback report');
  return buildFallbackReport(params);
}
