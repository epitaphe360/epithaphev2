/**
 * BMI 360™ — AI Report Generator
 * Appel réel à Claude (Anthropic) pour générer un rapport stratégique en français.
 * Fallback statique si la clé API est absente ou si l'appel échoue.
 */

import Anthropic from "@anthropic-ai/sdk";

// ─── Labels des outils ────────────────────────────────────────────────────────
const TOOL_META: Record<string, { name: string; domain: string; pillarsDesc: Record<string, string> }> = {
  commpulse: {
    name: "CommPulse™",
    domain: "Communication Interne",
    pillarsDesc: {
      C: "Clarté & cohérence des messages",
      L: "Leadership & implication du management",
      A: "Accessibilité & canaux de diffusion",
      R: "Rétroaction & culture du feedback",
      I: "Inclusion & engagement des équipes",
      T: "Temporalité & régularité des communications",
      Y: "Yield — Mesure d'impact et ROI",
    },
  },
  talentprint: {
    name: "TalentPrint™",
    domain: "Marque Employeur",
    pillarsDesc: {
      A: "Attractivité externe",
      T1: "Talent acquisition",
      T2: "Talent retention",
      R: "Réputation employeur",
      AM: "Ambassadeurs internes",
      CF: "Culture fit & onboarding",
      TR: "Transformation & évolution",
    },
  },
  impacttrace: {
    name: "ImpactTrace™",
    domain: "Communication RSE & Impact",
    pillarsDesc: {
      P: "Pilotage stratégique",
      R: "Reporting & transparence",
      O: "Opérationnalisation RSE",
      OC: "Outreach communautaire",
      F: "Finance verte & investissements responsables",
    },
  },
  safesignal: {
    name: "SafeSignal™",
    domain: "Santé, Sécurité & Culture SST",
    pillarsDesc: {
      S: "Systèmes de management SST",
      H: "Habilitation & formation sécurité",
      IA: "Indicateurs & analyse accidents",
      E: "Engagement du top management",
      L: "Leadership sécurité terrain",
      D: "Déploiement & communication SST",
    },
  },
  eventimpact: {
    name: "EventImpact™",
    domain: "Événementiel Stratégique",
    pillarsDesc: {
      S: "Stratégie & objectifs événementiels",
      T: "Timing & planification",
      A: "Audience & ciblage",
      G: "Gestion logistique & qualité",
      E: "Évaluation & ROI",
    },
  },
  spacescore: {
    name: "SpaceScore™",
    domain: "Environnement de Travail & Branding Espacé",
    pillarsDesc: {
      S: "Signalétique & orientation",
      P: "Présence de marque dans les espaces",
      A: "Aménagement & ergonomie",
      C: "Culture d'entreprise visible",
      E: "Expérience collaborateur",
    },
  },
  finnarrative: {
    name: "FinNarrative™",
    domain: "Communication Financière",
    pillarsDesc: {
      C: "Clarté du discours financier",
      A: "Accessibilité aux parties prenantes",
      P: "Pertinence des supports",
      I: "Influence & confiance investisseurs",
      T: "Transparence réglementaire",
      AL: "Alignement stratégie / communication",
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function scoreToNiveau(score: number): string {
  if (score < 20) return "Critique";
  if (score < 40) return "Préoccupant";
  if (score < 60) return "En développement";
  if (score < 80) return "Performant";
  return "Excellence";
}

// ─── Sanitisation contre prompt injection ────────────────────────────────────
// Les valeurs utilisateur sont intégrées dans le prompt — on supprime les
// séquences qui pourraient détourner les instructions du LLM.
function sanitizeForPrompt(value: string): string {
  return value
    .replace(/\n{3,}/g, "\n\n")           // réduire les sauts multiples
    .replace(/```[\s\S]*?```/g, "[...]")  // supprimer les blocs code cachés
    .replace(/\[INST\]|\[\/INST\]|<s>|<\/s>|<\|im_start\|>|<\|im_end\|>/gi, "") // tokens LLM connus
    .slice(0, 300);                        // limiter la longueur
}

// ─── Construction du prompt expert ───────────────────────────────────────────
function buildPrompt(params: {
  toolId: string;
  companyName?: string;
  sector?: string;
  companySize?: string;
  globalScore: number;
  maturityLevel: number;
  pillarScores: Record<string, number>;
}): string {
  const { toolId, globalScore, maturityLevel, pillarScores } = params;
  const companyName = sanitizeForPrompt(params.companyName ?? "Confidentiel");
  const sector      = sanitizeForPrompt(params.sector      ?? "Non précisé");
  const companySize = sanitizeForPrompt(params.companySize ?? "Non précisée");
  const meta = TOOL_META[toolId] ?? { name: toolId, domain: toolId, pillarsDesc: {} };

  const pillarLines = Object.entries(pillarScores)
    .map(([k, v]) => {
      const desc = meta.pillarsDesc[k] ?? k;
      const niveau = scoreToNiveau(v);
      return `  - Pilier ${k} (${desc}) : ${v}/100 → ${niveau}`;
    })
    .join("\n");

  return `Tu es un consultant expert en communication organisationnelle, spécialisé dans l'accompagnement des grandes entreprises et multinationales opérant au Maroc.
Tu travailles pour Epitaphe360, agence de communication stratégique basée à Casablanca, partenaire des organisations dans les 12 régions du Royaume.

Tu dois générer un rapport de diagnostic stratégique structuré en JSON valide (et uniquement en JSON, sans texte avant ni après) à partir des données de scoring suivantes.

## DONNÉES DU DIAGNOSTIC

**Outil d'évaluation** : ${meta.name} — ${meta.domain}
**Entreprise** : ${companyName ?? "Confidentiel"}
**Secteur** : ${sector ?? "Non précisé"}
**Taille** : ${companySize ?? "Non précisée"}
**Score global** : ${globalScore}/100
**Niveau de maturité** : ${maturityLevel}/5 (1=Critique, 2=Préoccupant, 3=En développement, 4=Performant, 5=Excellence)

**Scores par pilier** :
${pillarLines}

## FORMAT DE RÉPONSE ATTENDU

Réponds UNIQUEMENT avec ce JSON (rempli avec les données réelles ci-dessus, en français) :

{
  "generatedAt": "<ISO 8601>",
  "model": "claude-3-5-haiku",
  "toolId": "${toolId}",
  "companyName": "${companyName ?? "Confidentiel"}",
  "globalScore": ${globalScore},
  "maturityLevel": ${maturityLevel},
  "executiveSummary": "<Synthèse de 3-4 phrases sur les forces, faiblesses et enjeux stratégiques de cette organisation selon le score>",
  "pillarAnalyses": [
    {
      "pillar": "<lettre clé>",
      "pillarLabel": "<libellé complet>",
      "score": <score numérique>,
      "niveau": "<Critique|Préoccupant|En développement|Performant|Excellence>",
      "diagnostic": "<Analyse de 2-3 phrases spécifiques à ce score>",
      "risquesCles": ["<risque 1>", "<risque 2>"],
      "actions": ["<action concrète 1>", "<action concrète 2>", "<action concrète 3>"],
      "quickWin": {
        "titre": "<action rapide à fort impact>",
        "description": "<description courte>",
        "responsable": "<DRH|DG|DAF|etc.>",
        "delai": "<15 jours|30 jours|60 jours>",
        "livrable": "<livrable concret attendu>",
        "impactAttendu": "<+X points estimés>"
      }
    }
  ],
  "topRecommendations": [
    {
      "priority": 1,
      "title": "<titre de la recommandation>",
      "rationale": "<justification stratégique de 2-3 phrases>",
      "businessCase": {
        "investissementEstime": "<fourchette en MAD>",
        "gainAnnuelEstime": "<fourchette en MAD>",
        "paybackPeriod": "<X mois>",
        "horizonROI": "<Année 1|Année 2>",
        "hypothesesClefs": ["<hypothèse 1>", "<hypothèse 2>"]
      },
      "raci": {
        "responsable": "<rôle>",
        "imputable": "<rôle>",
        "consultes": ["<rôle>"],
        "informes": ["<rôle>"]
      },
      "impact": "<Critique|Élevé|Moyen>",
      "timeline": "<X mois>",
      "prerequis": ["<prérequis 1>"]
    }
  ],
  "actionPlan90Days": [
    {
      "week": "J1-J30",
      "actions": [
        { "action": "<action>", "responsable": "<rôle>", "delai": "J30" }
      ]
    },
    {
      "week": "J31-J60",
      "actions": [
        { "action": "<action>", "responsable": "<rôle>", "delai": "J60" }
      ]
    },
    {
      "week": "J61-J90",
      "actions": [
        { "action": "<action>", "responsable": "<rôle>", "delai": "J90" }
      ]
    }
  ],
  "scenarios": {
    "conservateur": { "label": "Scénario conservateur", "scoreProjecte": <score+5 à score+10>, "description": "<description>", "investissement": "<MAD>", "ROI": "<X%>" },
    "base":         { "label": "Scénario de base",       "scoreProjecte": <score+10 à score+20>, "description": "<description>", "investissement": "<MAD>", "ROI": "<X%>" },
    "ambitieux":    { "label": "Scénario ambitieux",     "scoreProjecte": <score+20 à score+35>, "description": "<description>", "investissement": "<MAD>", "ROI": "<X%>" }
  },
  "transformCTA": "<Appel à l'action personnalisé et motivant pour contacter Epitaphe360>"
}

Génère le rapport complet en français, avec des recommandations réalistes, chiffrées en MAD, et adaptées au contexte marocain et au secteur indiqué.`;
}

// ─── Fallback statique (si pas de clé API ou erreur) ─────────────────────────
function buildFallbackReport(params: {
  toolId: string;
  companyName?: string;
  globalScore: number;
  maturityLevel: number;
  pillarScores: Record<string, number>;
}): Record<string, unknown> {
  const { toolId, companyName, globalScore, maturityLevel, pillarScores } = params;
  const meta = TOOL_META[toolId] ?? { name: toolId, domain: toolId, pillarsDesc: {} };

  return {
    generatedAt: new Date().toISOString(),
    model: "fallback",
    toolId,
    companyName: companyName ?? "Confidentiel",
    globalScore,
    maturityLevel,
    executiveSummary: `Diagnostic ${meta.name} pour ${companyName ?? "votre organisation"} : score de ${globalScore}/100 (niveau ${maturityLevel}/5). ${globalScore < 40 ? "Des axes d'amélioration prioritaires ont été identifiés pour renforcer votre performance." : globalScore < 70 ? "Votre organisation dispose de bases solides mais des leviers importants restent à activer." : "Votre organisation affiche une maturité élevée. Un accompagnement sur mesure permettra de consolider l'excellence."}`,
    pillarAnalyses: Object.entries(pillarScores).map(([pillar, score]) => ({
      pillar,
      pillarLabel: (meta.pillarsDesc as Record<string, string>)[pillar] ?? pillar,
      score,
      niveau: scoreToNiveau(score),
      diagnostic: `Score de ${score}/100 sur ce pilier. ${score < 50 ? "Des actions correctives prioritaires sont nécessaires." : "Des actions d'optimisation permettront de progresser."}`,
      risquesCles: score < 40 ? ["Risque opérationnel élevé", "Impact sur la performance équipe"] : ["Risque de stagnation", "Perte d'opportunités"],
      actions: ["Réaliser un audit approfondi", "Former les managers clés", "Mettre en place des indicateurs de suivi"],
      quickWin: {
        titre: "Atelier de sensibilisation management",
        description: "Organiser un workshop d'une journée pour aligner le management sur les priorités",
        responsable: "DRH",
        delai: "30 jours",
        livrable: "Plan d'action managérial validé",
        impactAttendu: "+5 à +8 points estimés",
      },
    })),
    topRecommendations: [
      {
        priority: 1,
        title: `Déployer un programme de transformation ${meta.domain}`,
        rationale: `Votre score de ${globalScore}/100 révèle un besoin structurel d'investissement dans ${meta.domain}. Une approche systémique permettra de maximiser l'impact.`,
        businessCase: {
          investissementEstime: "150 000 - 280 000 MAD",
          gainAnnuelEstime: "350 000 - 600 000 MAD",
          paybackPeriod: "8-12 mois",
          horizonROI: "Année 1",
          hypothesesClefs: ["Réduction du turnover de 15%", "Gain de productivité de 12%"],
        },
        raci: { responsable: "DRH", imputable: "DG", consultes: ["DAF", "Managers"], informes: ["COMEX"] },
        impact: "Élevé",
        timeline: "3 mois",
        prerequis: ["Validation COMEX", "Budget alloué"],
      },
    ],
    actionPlan90Days: [
      { week: "J1-J30", actions: [{ action: "Audit interne et cartographie des priorités", responsable: "DRH", delai: "J30" }] },
      { week: "J31-J60", actions: [{ action: "Déploiement des quick wins identifiés", responsable: "Managers", delai: "J60" }] },
      { week: "J61-J90", actions: [{ action: "Mesure d'impact et ajustement du plan", responsable: "DRH", delai: "J90" }] },
    ],
    scenarios: {
      conservateur: { label: "Scénario conservateur", scoreProjecte: Math.min(100, globalScore + 8), description: "Actions de base, quick wins uniquement", investissement: "80 000 MAD", ROI: "120%" },
      base:         { label: "Scénario de base",       scoreProjecte: Math.min(100, globalScore + 18), description: "Programme structuré sur 6 mois", investissement: "200 000 MAD", ROI: "200%" },
      ambitieux:    { label: "Scénario ambitieux",     scoreProjecte: Math.min(100, globalScore + 30), description: "Transformation profonde sur 12 mois", investissement: "380 000 MAD", ROI: "280%" },
    },
    transformCTA: `Votre score de ${globalScore}/100 justifie un accompagnement expert. Contactez Epitaphe360 pour un diagnostic approfondi et un plan de transformation sur mesure.`,
  };
}

// ─── Interpolation des variables {{...}} dans un prompt custom ───────────────
function interpolatePrompt(
  template: string,
  params: {
    toolId: string;
    companyName?: string;
    sector?: string;
    companySize?: string;
    globalScore: number;
    maturityLevel: number;
    pillarScores: Record<string, number>;
  }
): string {
  const meta = TOOL_META[params.toolId] ?? { name: params.toolId, domain: params.toolId, pillarsDesc: {} };
  const safeCompanyName = sanitizeForPrompt(params.companyName ?? "Confidentiel");
  const safeSector      = sanitizeForPrompt(params.sector      ?? "Non précisé");
  const safeCompanySize = sanitizeForPrompt(params.companySize ?? "Non précisée");
  const pillarLines = Object.entries(params.pillarScores)
    .map(([k, v]) => `  - ${k}: ${v}/100 → ${scoreToNiveau(v)}`)
    .join("\n");

  return template
    .replace(/\{\{toolId\}\}/g, params.toolId)
    .replace(/\{\{toolName\}\}/g, meta.name)
    .replace(/\{\{domain\}\}/g, meta.domain)
    .replace(/\{\{companyName\}\}/g, safeCompanyName)
    .replace(/\{\{sector\}\}/g, safeSector)
    .replace(/\{\{companySize\}\}/g, safeCompanySize)
    .replace(/\{\{globalScore\}\}/g, String(params.globalScore))
    .replace(/\{\{maturityLevel\}\}/g, String(params.maturityLevel))
    .replace(/\{\{pillarScores\}\}/g, pillarLines);
}

// ─── Appel réel à l'API Anthropic ────────────────────────────────────────────
export async function callAnthropic(params: {
  toolId: string;
  companyName?: string;
  sector?: string;
  companySize?: string;
  globalScore: number;
  maturityLevel: number;
  pillarScores: Record<string, number>;
  customPrompt?: string;
}): Promise<Record<string, unknown>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn("[AI Report] ANTHROPIC_API_KEY manquante — utilisation du fallback");
    return buildFallbackReport(params);
  }

  const client = new Anthropic({ apiKey });
  // Utiliser le prompt custom (depuis DB) s'il est défini, sinon le prompt expert par défaut
  const prompt = params.customPrompt
    ? interpolatePrompt(params.customPrompt, params)
    : buildPrompt(params);

  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  // Extraire le JSON de la réponse
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Réponse IA invalide : pas de JSON détecté");

  const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
  parsed.model = "claude-haiku-4-5";
  return parsed;
}

// ─── Stub OpenAI (non utilisé) ────────────────────────────────────────────────
export async function callOpenAI(_params: unknown): Promise<string> {
  return JSON.stringify({ message: "OpenAI non configuré" });
}

// ─── Point d'entrée principal ─────────────────────────────────────────────────
export async function generateAIReport(params: {
  toolId: string;
  companyName?: string;
  sector?: string;
  companySize?: string;
  globalScore: number;
  maturityLevel: number;
  pillarScores: Record<string, number>;
  useOpenAI?: boolean;
  customPrompt?: string;
}): Promise<Record<string, unknown>> {
  try {
    const report = await callAnthropic(params);
    console.log(`[AI Report] Rapport généré par Claude pour ${params.toolId} — score ${params.globalScore}/100`);
    return report;
  } catch (error) {
    console.error("[AI Report] Erreur API Anthropic, fallback activé :", error);
    return buildFallbackReport(params);
  }
}
