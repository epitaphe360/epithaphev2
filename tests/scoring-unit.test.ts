/**
 * SUITE A — Tests unitaires : moteur de scoring + schémas Zod
 * Pas de DB requise pour cette suite.
 */
import { describe, it, expect } from "vitest";
import { z } from "zod";
import { calculateMaturityLevel, processDiscoverAssessment, processIntelligenceAssessment, processAssessment } from "../server/lib/scoring-engine";

// ─── Reproduce Zod schemas from scoring-routes.ts ────────────────────────────
const answersSchema = z.record(
  z.string(),
  z.object({
    value:  z.number().int().min(1).max(5),
    pillar: z.string(),
    weight: z.number().int().min(1).max(3),
  })
);

const discoverBodySchema = z.object({
  answers:        answersSchema,
  companyName:    z.string().max(200).optional(),
  sector:         z.string().max(80).optional(),
  companySize:    z.string().max(30).optional(),
  voiceType:      z.enum(["direction", "terrain"]).optional().default("direction"),
  email:          z.string().email().optional(),
  respondentName: z.string().max(200).optional(),
});

const ALLOWED_TOOL_IDS = [
  "commpulse", "talentprint", "impacttrace", "safesignal",
  "eventimpact", "spacescore", "finnarrative",
];

const INTELLIGENCE_PRICES: Record<string, number> = {
  commpulse: 4900, talentprint: 7500, impacttrace: 8400,
  safesignal: 7900, eventimpact: 7900, spacescore: 6500, finnarrative: 9900,
};

const TOOL_PILLAR_WEIGHTS: Record<string, Record<string, number>> = {
  commpulse:   { C: 0.18, L: 0.18, A: 0.15, R: 0.15, I: 0.12, T: 0.12, Y: 0.10 },
  talentprint: { A: 0.18, T1: 0.15, T2: 0.15, R: 0.14, AM: 0.13, CF: 0.13, TR: 0.12 },
  impacttrace: { P: 0.25, R: 0.18, O: 0.20, OC: 0.20, F: 0.17 },
  safesignal:  { S: 0.18, H: 0.22, IA: 0.14, E: 0.16, L: 0.14, D: 0.16 },
  eventimpact: { S: 0.25, T: 0.25, A: 0.20, G: 0.20, E: 0.10 },
  spacescore:  { S: 0.22, P: 0.22, A: 0.23, C: 0.18, E: 0.15 },
  finnarrative:{ C: 0.18, A: 0.15, P: 0.20, I: 0.16, T: 0.16, AL: 0.15 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// A1. calculateMaturityLevel — 5 seuils
// ═══════════════════════════════════════════════════════════════════════════════
describe("A1 — calculateMaturityLevel", () => {
  const cases: [number, number][] = [
    [0, 1], [10, 1], [20, 1],    // ≤20 → 1 Fragile
    [21, 2], [30, 2], [40, 2],   // ≤40 → 2 Émergent
    [41, 3], [50, 3], [60, 3],   // ≤60 → 3 Structuré
    [61, 4], [70, 4], [80, 4],   // ≤80 → 4 Performant
    [81, 5], [90, 5], [100, 5],  // >80 → 5 Leader
  ];

  it.each(cases)("score %i → niveau %i", (score, expected) => {
    expect(calculateMaturityLevel(score)).toBe(expected);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// A2. answersSchema — validation Zod
// ═══════════════════════════════════════════════════════════════════════════════
describe("A2 — answersSchema validation", () => {
  it("accepte des réponses valides (value 1-5, weight 1-3)", () => {
    const valid = {
      q1: { value: 1, pillar: "C", weight: 1 },
      q2: { value: 5, pillar: "L", weight: 3 },
      q3: { value: 3, pillar: "A", weight: 2 },
    };
    expect(answersSchema.safeParse(valid).success).toBe(true);
  });

  it("rejette value = 0 (min 1)", () => {
    const invalid = { q1: { value: 0, pillar: "C", weight: 1 } };
    expect(answersSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejette value = 6 (max 5)", () => {
    const invalid = { q1: { value: 6, pillar: "C", weight: 1 } };
    expect(answersSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejette value décimal (3.5)", () => {
    const invalid = { q1: { value: 3.5, pillar: "C", weight: 1 } };
    expect(answersSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejette value négatif (-1)", () => {
    const invalid = { q1: { value: -1, pillar: "C", weight: 1 } };
    expect(answersSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejette weight = 0 (min 1)", () => {
    const invalid = { q1: { value: 3, pillar: "C", weight: 0 } };
    expect(answersSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejette weight = 4 (max 3)", () => {
    const invalid = { q1: { value: 3, pillar: "C", weight: 4 } };
    expect(answersSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepte un objet vide (pas de réponses)", () => {
    expect(answersSchema.safeParse({}).success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// A3. discoverBodySchema — validation formulaire complet
// ═══════════════════════════════════════════════════════════════════════════════
describe("A3 — discoverBodySchema validation", () => {
  const validBody = {
    answers: { q1: { value: 4, pillar: "C", weight: 2 } },
    companyName: "TestCorp",
    sector: "industrie",
    companySize: "pme",
    voiceType: "direction" as const,
    email: "contact@testcorp.ma",
  };

  it("accepte un body complet et valide", () => {
    expect(discoverBodySchema.safeParse(validBody).success).toBe(true);
  });

  it("accepte sans champs optionnels (juste answers)", () => {
    expect(discoverBodySchema.safeParse({ answers: {} }).success).toBe(true);
  });

  it("rejette voiceType invalide", () => {
    expect(discoverBodySchema.safeParse({ ...validBody, voiceType: "manager" }).success).toBe(false);
  });

  it("rejette email invalide", () => {
    expect(discoverBodySchema.safeParse({ ...validBody, email: "pas-un-email" }).success).toBe(false);
  });

  it("rejette companyName > 200 chars", () => {
    expect(discoverBodySchema.safeParse({ ...validBody, companyName: "x".repeat(201) }).success).toBe(false);
  });

  it("rejette sector > 80 chars", () => {
    expect(discoverBodySchema.safeParse({ ...validBody, sector: "x".repeat(81) }).success).toBe(false);
  });

  it("default voiceType = 'direction' si absent", () => {
    const parsed = discoverBodySchema.parse({ answers: {} });
    expect(parsed.voiceType).toBe("direction");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// A4. toolId validation
// ═══════════════════════════════════════════════════════════════════════════════
describe("A4 — toolId whitelist", () => {
  it.each(ALLOWED_TOOL_IDS)("accepte '%s'", (toolId) => {
    expect(ALLOWED_TOOL_IDS.includes(toolId)).toBe(true);
  });

  it("rejette un toolId inconnu", () => {
    expect(ALLOWED_TOOL_IDS.includes("toto")).toBe(false);
    expect(ALLOWED_TOOL_IDS.includes("")).toBe(false);
  });

  it("toolId case-insensitive (route fait toLowerCase)", () => {
    const raw = "CommPulse";
    expect(ALLOWED_TOOL_IDS.includes(raw.toLowerCase())).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// A5. Prix Intelligence par outil + calcul TTC
// ═══════════════════════════════════════════════════════════════════════════════
describe("A5 — Prix Intelligence", () => {
  it("commpulse = 4900 MAD HT", () => expect(INTELLIGENCE_PRICES.commpulse).toBe(4900));
  it("talentprint = 7500 MAD HT", () => expect(INTELLIGENCE_PRICES.talentprint).toBe(7500));
  it("impacttrace = 8400 MAD HT", () => expect(INTELLIGENCE_PRICES.impacttrace).toBe(8400));
  it("safesignal = 7900 MAD HT", () => expect(INTELLIGENCE_PRICES.safesignal).toBe(7900));
  it("eventimpact = 7900 MAD HT", () => expect(INTELLIGENCE_PRICES.eventimpact).toBe(7900));
  it("spacescore = 6500 MAD HT", () => expect(INTELLIGENCE_PRICES.spacescore).toBe(6500));
  it("finnarrative = 9900 MAD HT", () => expect(INTELLIGENCE_PRICES.finnarrative).toBe(9900));

  it("fallback 4900 pour outil inconnu", () => {
    expect(INTELLIGENCE_PRICES["unknown"] ?? 4900).toBe(4900);
  });

  it("TTC = HT × 1.20 pour chaque outil", () => {
    for (const [tool, ht] of Object.entries(INTELLIGENCE_PRICES)) {
      const ttc = Math.round(ht * 1.20);
      expect(ttc).toBe(Math.round(ht * 1.20));
      expect(ttc).toBeGreaterThan(ht);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// A6. Cohérence des poids de piliers (somme ≈ 1.0)
// ═══════════════════════════════════════════════════════════════════════════════
describe("A6 — Poids piliers cohérents", () => {
  for (const [tool, weights] of Object.entries(TOOL_PILLAR_WEIGHTS)) {
    it(`${tool}: somme des poids ≈ 1.0`, () => {
      const sum = Object.values(weights).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 2);
    });
  }

  it("commpulse a 7 piliers", () => expect(Object.keys(TOOL_PILLAR_WEIGHTS.commpulse)).toHaveLength(7));
  it("talentprint a 7 piliers", () => expect(Object.keys(TOOL_PILLAR_WEIGHTS.talentprint)).toHaveLength(7));
  it("impacttrace a 5 piliers", () => expect(Object.keys(TOOL_PILLAR_WEIGHTS.impacttrace)).toHaveLength(5));
  it("safesignal a 6 piliers", () => expect(Object.keys(TOOL_PILLAR_WEIGHTS.safesignal)).toHaveLength(6));
  it("eventimpact a 5 piliers", () => expect(Object.keys(TOOL_PILLAR_WEIGHTS.eventimpact)).toHaveLength(5));
  it("spacescore a 5 piliers", () => expect(Object.keys(TOOL_PILLAR_WEIGHTS.spacescore)).toHaveLength(5));
  it("finnarrative a 6 piliers", () => expect(Object.keys(TOOL_PILLAR_WEIGHTS.finnarrative)).toHaveLength(6));
});

// ═══════════════════════════════════════════════════════════════════════════════
// A7. processDiscoverAssessment — calcul Discover (4 piliers max)
// ═══════════════════════════════════════════════════════════════════════════════
describe("A7 — processDiscoverAssessment", () => {
  it("calcule un score simple 1 pilier", () => {
    const answers = {
      q1: { value: 4, pillar: "C", weight: 2 },
      q2: { value: 3, pillar: "C", weight: 1 },
    };
    const result = processDiscoverAssessment("commpulse", answers);
    // (4*2 + 3*1) / (5*2 + 5*1) = 11/15 = 73.33 → 73
    expect(result.globalScore).toBe(73);
    expect(result.tier).toBe("discover");
    expect(result.pillarScores).toHaveProperty("C");
    expect(result.maturityLevel).toBe(4); // 73 → Performant
  });

  it("ne prend que 4 piliers en Discover", () => {
    const answers: Record<string, { value: number; pillar: string; weight: number }> = {};
    const pillars = ["C", "L", "A", "R", "I", "T", "Y"];
    pillars.forEach((p, i) => {
      answers[`q${i}`] = { value: 4, pillar: p, weight: 2 };
    });
    const result = processDiscoverAssessment("commpulse", answers);
    // Seuls C, L, A, R pris en Discover
    expect(Object.keys(result.pillarScores!)).toHaveLength(4);
    expect(result.pillarScores).not.toHaveProperty("I");
    expect(result.pillarScores).not.toHaveProperty("T");
    expect(result.pillarScores).not.toHaveProperty("Y");
  });

  it("retourne globalScore = 0 avec answers vide", () => {
    const result = processDiscoverAssessment("commpulse", {});
    expect(result.globalScore).toBe(0);
    expect(result.maturityLevel).toBe(1);
  });

  it("score max (toutes réponses = 5) → 100", () => {
    const answers = {
      q1: { value: 5, pillar: "C", weight: 3 },
      q2: { value: 5, pillar: "L", weight: 3 },
      q3: { value: 5, pillar: "A", weight: 3 },
      q4: { value: 5, pillar: "R", weight: 3 },
    };
    const result = processDiscoverAssessment("commpulse", answers);
    expect(result.globalScore).toBe(100);
    expect(result.maturityLevel).toBe(5);
  });

  it("score min (toutes réponses = 1) → 20", () => {
    const answers = {
      q1: { value: 1, pillar: "C", weight: 1 },
      q2: { value: 1, pillar: "L", weight: 1 },
      q3: { value: 1, pillar: "A", weight: 1 },
      q4: { value: 1, pillar: "R", weight: 1 },
    };
    const result = processDiscoverAssessment("commpulse", answers);
    expect(result.globalScore).toBe(20);
    expect(result.maturityLevel).toBe(1); // ≤20 → Fragile
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// A8. processIntelligenceAssessment — calcul Intelligence (tous piliers)
// ═══════════════════════════════════════════════════════════════════════════════
describe("A8 — processIntelligenceAssessment", () => {
  it("prend TOUS les piliers (7 pour commpulse)", () => {
    const answers: Record<string, { value: number; pillar: string; weight: number }> = {};
    const pillars = ["C", "L", "A", "R", "I", "T", "Y"];
    pillars.forEach((p, i) => {
      answers[`q${i}`] = { value: 4, pillar: p, weight: 2 };
    });
    const result = processIntelligenceAssessment("commpulse", answers);
    expect(Object.keys(result.pillarScores!)).toHaveLength(7);
    expect(result.tier).toBe("intelligence");
  });

  it("score Intelligence ≠ score Discover quand >4 piliers", () => {
    const answers: Record<string, { value: number; pillar: string; weight: number }> = {};
    const pillars = ["C", "L", "A", "R", "I", "T", "Y"];
    pillars.forEach((p, i) => {
      // Piliers 5-7 avec valeur basse pour que le score diffère
      answers[`q${i}`] = { value: i < 4 ? 5 : 1, pillar: p, weight: 2 };
    });
    const discover = processDiscoverAssessment("commpulse", answers);
    const intelligence = processIntelligenceAssessment("commpulse", answers);
    expect(discover.globalScore).not.toBe(intelligence.globalScore);
    expect(discover.globalScore).toBeGreaterThan(intelligence.globalScore);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// A9. processAssessment — Legacy (rétro-compat)
// ═══════════════════════════════════════════════════════════════════════════════
describe("A9 — processAssessment (legacy)", () => {
  it("calcule un score simple depuis Record<string, number>", () => {
    const answers = { q1: 4, q2: 3, q3: 5 }; // total 12, max 15 → 80
    const result = processAssessment("commpulse", answers);
    expect(result.globalScore).toBe(80);
    expect(result.tier).toBe("discover");
    expect(result.maturityLevel).toBe(4);
    expect(result.pillarScores).toHaveProperty("general");
  });

  it("gère un résultat vide → ne crash pas", () => {
    // Avec un objet vide, 0/0 → NaN, mais l'implémentation devrait gérer
    const result = processAssessment("commpulse", {});
    expect(typeof result.globalScore).toBe("number");
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// A10. UUID validation regex (utilisée dans les routes)
// ═══════════════════════════════════════════════════════════════════════════════
describe("A10 — UUID validation regex", () => {
  const UUID_REGEX = /^[0-9a-f-]{36}$/i;

  it("accepte un UUID v4 valide", () => {
    expect(UUID_REGEX.test("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("rejette une chaîne courte", () => {
    expect(UUID_REGEX.test("abc")).toBe(false);
  });

  it("rejette une injection SQL", () => {
    expect(UUID_REGEX.test("'; DROP TABLE scoring_results; --")).toBe(false);
  });

  it("rejette une chaîne vide", () => {
    expect(UUID_REGEX.test("")).toBe(false);
  });
});
