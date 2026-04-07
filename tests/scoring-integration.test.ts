/**
 * SUITE B-G — Tests d'intégration avec vraie DB Supabase
 * Couvre tout le flux : Discover → Intelligence → Payment → Devis → Subscriptions → Leads
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { getApp, cleanupTestData, TEST_PREFIX, db } from "./setup";
import { scoringResults, payments, subscriptionPlans, clientSubscriptions, devis, clientAccounts } from "../shared/schema";
import { eq, like, desc } from "drizzle-orm";

let app: Express;
// Track IDs created during tests for sequential flow
let discoverResultId: string;
let testClientId: number;
let testDevisRef: string;

beforeAll(async () => {
  await cleanupTestData();
  app = await getApp();
}, 30000);

afterAll(async () => {
  await cleanupTestData();
}, 15000);

// ═══════════════════════════════════════════════════════════════════════════════
// B — POST /api/scoring/:toolId/discover (Score Gratuit)
// ═══════════════════════════════════════════════════════════════════════════════
describe("B — Discover endpoint", () => {
  const validAnswers = {
    q1: { value: 4, pillar: "C", weight: 2 },
    q2: { value: 3, pillar: "L", weight: 2 },
    q3: { value: 5, pillar: "A", weight: 1 },
    q4: { value: 2, pillar: "R", weight: 3 },
  };

  it("B1 — 201 avec body valide, retourne score + ID", async () => {
    const res = await request(app)
      .post("/api/scoring/commpulse/discover")
      .send({
        answers: validAnswers,
        companyName: `${TEST_PREFIX}_DiscoverCorp`,
        sector: "industrie",
        companySize: "pme",
        voiceType: "direction",
        email: `${TEST_PREFIX}@testcorp.dev`,
        respondentName: "Test User",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.tier).toBe("discover");
    expect(res.body.globalScore).toBeGreaterThanOrEqual(0);
    expect(res.body.globalScore).toBeLessThanOrEqual(100);
    expect(res.body.maturityLevel).toBeGreaterThanOrEqual(1);
    expect(res.body.maturityLevel).toBeLessThanOrEqual(5);
    expect(res.body).toHaveProperty("pillarScores");
    expect(Object.keys(res.body.pillarScores).length).toBeLessThanOrEqual(4);
    expect(res.body.intelligencePrice).toBe(4900);

    // Save for later tests
    discoverResultId = res.body.id;
  });

  it("B2 — 400 si toolId invalide", async () => {
    const res = await request(app)
      .post("/api/scoring/unknown_tool/discover")
      .send({ answers: validAnswers });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("non reconnu");
  });

  it("B3 — 400 si body invalide (answers manquant)", async () => {
    const res = await request(app)
      .post("/api/scoring/commpulse/discover")
      .send({ companyName: "Test" });

    expect(res.status).toBe(400);
  });

  it("B4 — 400 si answers contient value hors bornes", async () => {
    const res = await request(app)
      .post("/api/scoring/commpulse/discover")
      .send({
        answers: { q1: { value: 99, pillar: "C", weight: 1 } },
        companyName: `${TEST_PREFIX}_Invalid`,
      });

    expect(res.status).toBe(400);
  });

  it("B5 — fonctionne pour chaque outil autorisé", async () => {
    const tools = ["talentprint", "safesignal", "impacttrace", "eventimpact", "spacescore", "finnarrative"];
    for (const tool of tools) {
      const res = await request(app)
        .post(`/api/scoring/${tool}/discover`)
        .send({
          answers: { q1: { value: 3, pillar: "S", weight: 2 } },
          companyName: `${TEST_PREFIX}_${tool}`,
        });
      expect(res.status).toBe(201);
      expect(res.body.tier).toBe("discover");

      // Clean up immediately
      if (res.body.id) {
        await db.delete(scoringResults).where(eq(scoringResults.id, res.body.id));
      }
    }
  });

  it("B6 — résultat persiste en DB", async () => {
    const row = await db.query.scoringResults.findFirst({
      where: (t, { eq }) => eq(t.id, discoverResultId),
    });
    expect(row).toBeDefined();
    expect(row!.toolId).toBe("commpulse");
    expect(row!.tier).toBe("discover");
    expect(row!.companyName).toBe(`${TEST_PREFIX}_DiscoverCorp`);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// C — GET /api/scoring/result/:id (Récupération résultat)
// ═══════════════════════════════════════════════════════════════════════════════
describe("C — Get result endpoint", () => {
  it("C1 — 200 avec UUID existant", async () => {
    const res = await request(app).get(`/api/scoring/result/${discoverResultId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(discoverResultId);
    expect(res.body.tier).toBe("discover");
    expect(res.body.intelligencePrice).toBe(4900);
  });

  it("C2 — 404 avec UUID inexistant", async () => {
    const res = await request(app).get("/api/scoring/result/00000000-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
  });

  it("C3 — 400 avec ID invalide (pas UUID)", async () => {
    const res = await request(app).get("/api/scoring/result/not-a-uuid");
    expect(res.status).toBe(400);
  });

  it("C4 — 400 avec tentative injection SQL", async () => {
    const res = await request(app).get("/api/scoring/result/'; DROP TABLE scoring_results; --");
    expect(res.status).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// D — POST /api/scoring/:id/unlock-intelligence (Score IA payant)
// ═══════════════════════════════════════════════════════════════════════════════
describe("D — Unlock Intelligence endpoint", () => {
  const allAnswers = {
    q1: { value: 4, pillar: "C", weight: 2 },
    q2: { value: 3, pillar: "L", weight: 2 },
    q3: { value: 5, pillar: "A", weight: 1 },
    q4: { value: 2, pillar: "R", weight: 3 },
    q5: { value: 4, pillar: "I", weight: 2 },
    q6: { value: 3, pillar: "T", weight: 1 },
    q7: { value: 5, pillar: "Y", weight: 2 },
  };

  it("D1 — 200 avec résultat discover existant → upgrade vers intelligence", async () => {
    const res = await request(app)
      .post(`/api/scoring/${discoverResultId}/unlock-intelligence`)
      .send({
        answers: allAnswers,
        email: `${TEST_PREFIX}@testcorp.dev`,
        respondentName: "Test Intelligence",
        companyName: `${TEST_PREFIX}_DiscoverCorp`,
        paymentRef: `${TEST_PREFIX}-PAY-001`,
      });

    expect(res.status).toBe(200);
    expect(res.body.tier).toBe("intelligence");
    expect(res.body.globalScore).toBeGreaterThanOrEqual(0);
    expect(res.body.pillarScores).toBeDefined();
    // Intelligence: should have more pillars than discover
    expect(Object.keys(res.body.pillarScores).length).toBeGreaterThanOrEqual(4);
    expect(res.body).toHaveProperty("aiReport");
  });

  it("D2 — idempotent: re-call retourne le même résultat sans re-générer", async () => {
    const res = await request(app)
      .post(`/api/scoring/${discoverResultId}/unlock-intelligence`)
      .send({
        answers: allAnswers,
        email: `${TEST_PREFIX}@testcorp.dev`,
      });

    expect(res.status).toBe(200);
    expect(res.body.tier).toBe("intelligence");
  });

  it("D3 — 404 avec UUID inexistant", async () => {
    const res = await request(app)
      .post("/api/scoring/00000000-0000-0000-0000-000000000000/unlock-intelligence")
      .send({ answers: allAnswers });

    expect(res.status).toBe(404);
  });

  it("D4 — 400 avec ID invalide", async () => {
    const res = await request(app)
      .post("/api/scoring/invalid-id/unlock-intelligence")
      .send({ answers: allAnswers });

    expect(res.status).toBe(400);
  });

  it("D5 — vérification DB: tier mis à jour → intelligence", async () => {
    const row = await db.query.scoringResults.findFirst({
      where: (t, { eq }) => eq(t.id, discoverResultId),
    });
    expect(row!.tier).toBe("intelligence");
    expect(row!.aiReport).toBeDefined();
    expect(row!.intelligenceUnlockedAt).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// E — POST /api/scoring/intelligence-payment (Initier paiement)
// ═══════════════════════════════════════════════════════════════════════════════
describe("E — Intelligence Payment endpoint", () => {
  it("E1 — 201 avec méthode virement", async () => {
    const res = await request(app)
      .post("/api/scoring/intelligence-payment")
      .send({
        scoringResultId: discoverResultId,
        toolId: "commpulse",
        email: `${TEST_PREFIX}@testcorp.dev`,
        companyName: `${TEST_PREFIX}_PayCorp`,
        method: "virement",
      });

    expect(res.status).toBe(201);
    expect(res.body.paymentMethod).toBe("virement");
    expect(res.body.amount).toBe(Math.round(4900 * 1.20));
    expect(res.body.amountHT).toBe(4900);
    expect(res.body.currency).toBe("MAD");
    expect(res.body).toHaveProperty("bankInstructions");
    expect(res.body.bankInstructions.beneficiary).toBe("Epitaphe360 SARL");
  });

  it("E2 — 400 sans scoringResultId", async () => {
    const res = await request(app)
      .post("/api/scoring/intelligence-payment")
      .send({ toolId: "commpulse", email: "test@x.com", method: "virement" });

    expect(res.status).toBe(400);
  });

  it("E3 — 400 avec email invalide", async () => {
    const res = await request(app)
      .post("/api/scoring/intelligence-payment")
      .send({
        scoringResultId: discoverResultId,
        toolId: "commpulse",
        email: "not-valid",
        method: "virement",
      });

    expect(res.status).toBe(400);
  });

  it("E4 — TVA 20% correct pour chaque outil", async () => {
    const prices: Record<string, number> = {
      commpulse: 4900, talentprint: 7500, safesignal: 7900,
    };
    for (const [tool, ht] of Object.entries(prices)) {
      const res = await request(app)
        .post("/api/scoring/intelligence-payment")
        .send({
          scoringResultId: discoverResultId,
          toolId: tool,
          email: `${TEST_PREFIX}@testcorp.dev`,
          method: "virement",
        });
      if (res.status === 201) {
        expect(res.body.amountHT).toBe(ht);
        expect(res.body.amount).toBe(Math.round(ht * 1.20));
        expect(res.body.amount - res.body.amountHT).toBe(res.body.amountTVA);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// F — POST /api/scoring/:id/simulate-payment (Simulation dev)
// ═══════════════════════════════════════════════════════════════════════════════
describe("F — Simulate Payment (dev mode)", () => {
  let simResultId: string;

  it("F0 — Setup: créer un résultat discover frais pour simulation", async () => {
    const res = await request(app)
      .post("/api/scoring/commpulse/discover")
      .send({
        answers: { q1: { value: 4, pillar: "C", weight: 2 } },
        companyName: `${TEST_PREFIX}_SimCorp`,
        email: `${TEST_PREFIX}_sim@testcorp.dev`,
      });
    expect(res.status).toBe(201);
    simResultId = res.body.id;
  });

  it("F1 — 200 avec simulation payment complète", async () => {
    const res = await request(app)
      .post(`/api/scoring/${simResultId}/simulate-payment`)
      .send({
        answers: {
          q1: { value: 4, pillar: "C", weight: 2 },
          q2: { value: 3, pillar: "L", weight: 2 },
        },
        email: `${TEST_PREFIX}_sim@testcorp.dev`,
        respondentName: "Sim User",
        companyName: `${TEST_PREFIX}_SimCorp`,
      });

    expect(res.status).toBe(200);
    expect(res.body.tier).toBe("intelligence");
    expect(res.body.simulation).toBe(true);
    expect(res.body).toHaveProperty("paymentId");
    expect(res.body).toHaveProperty("invoiceNumber");
    expect(res.body.amountTTC).toBe(Math.round(4900 * 1.20));
  });

  it("F2 — 400 si email manquant (requis pour simulation)", async () => {
    const res = await request(app)
      .post(`/api/scoring/${simResultId}/simulate-payment`)
      .send({
        answers: { q1: { value: 4, pillar: "C", weight: 2 } },
        respondentName: "No Email",
      });

    expect(res.status).toBe(400);
  });

  it("F3 — 404 si UUID inexistant", async () => {
    const res = await request(app)
      .post("/api/scoring/00000000-0000-0000-0000-000000000000/simulate-payment")
      .send({
        answers: { q1: { value: 4, pillar: "C", weight: 2 } },
        email: `${TEST_PREFIX}@test.dev`,
        respondentName: "Ghost",
      });

    expect(res.status).toBe(404);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// G — Leads capture (Email Gate)
// ═══════════════════════════════════════════════════════════════════════════════
describe("G — Leads capture", () => {
  it("G1 — 200 avec email + name → lead capturé", async () => {
    const res = await request(app)
      .post("/api/leads/capture")
      .send({
        email: `${TEST_PREFIX}_lead@testcorp.dev`,
        name: "Lead Test User",
        sourceTool: "CommPulse",
        companyName: `${TEST_PREFIX}_LeadCorp`,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("clientId");
    testClientId = res.body.clientId;
  });

  it("G2 — client créé en DB avec isActive=false", async () => {
    const [client] = await db.select().from(clientAccounts).where(eq(clientAccounts.id, testClientId)).limit(1);
    expect(client).toBeDefined();
    expect(client.email).toBe(`${TEST_PREFIX}_lead@testcorp.dev`);
    expect(client.isActive).toBe(false);
  });

  it("G3 — 400 sans email", async () => {
    const res = await request(app)
      .post("/api/leads/capture")
      .send({ name: "No Email" });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("requis");
  });

  it("G4 — 400 sans name", async () => {
    const res = await request(app)
      .post("/api/leads/capture")
      .send({ email: "test@x.com" });

    expect(res.status).toBe(400);
  });

  it("G5 — doublon email → réutilise le clientId existant", async () => {
    const res = await request(app)
      .post("/api/leads/capture")
      .send({
        email: `${TEST_PREFIX}_lead@testcorp.dev`,
        name: "Same Lead",
        sourceTool: "SafeSignal",
      });

    expect(res.status).toBe(200);
    expect(res.body.clientId).toBe(testClientId);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// H — Plans & Subscriptions
// ═══════════════════════════════════════════════════════════════════════════════
describe("H — Plans publics", () => {
  it("H1 — GET /api/plans retourne un tableau", async () => {
    const res = await request(app).get("/api/plans");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("H2 — POST /api/client/subscription sans auth → 401", async () => {
    const res = await request(app)
      .post("/api/client/subscription")
      .send({ planSlug: "pro", billingCycle: "monthly" });

    expect(res.status).toBe(401);
  });

  it("H3 — DELETE /api/client/subscription sans auth → 401", async () => {
    const res = await request(app).delete("/api/client/subscription");
    expect(res.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// I — Devis (accès public par lien signé)
// ═══════════════════════════════════════════════════════════════════════════════
describe("I — Devis endpoints", () => {
  it("I1 — GET /api/devis/:ref sans signature → 401", async () => {
    const res = await request(app).get("/api/devis/DEV-2026-FAKE0001");
    expect(res.status).toBe(401);
    expect(res.body.error).toContain("Signature");
  });

  it("I2 — GET /api/devis/:ref avec sig invalide → 401 ou 404", async () => {
    const res = await request(app).get("/api/devis/DEV-2026-FAKE0001?sig=invalidsignature");
    // 404 car le devis n'existe pas, ou 401 pour sig invalide
    expect([401, 404]).toContain(res.status);
  });

  it("I3 — POST /api/devis/:ref/accept sans sig → 401", async () => {
    const res = await request(app).post("/api/devis/DEV-2026-FAKE/accept");
    expect(res.status).toBe(401);
  });

  it("I4 — POST /api/devis/:ref/refuse sans sig → 401", async () => {
    const res = await request(app).post("/api/devis/DEV-2026-FAKE/refuse");
    expect(res.status).toBe(401);
  });

  it("I5 — GET /api/client/devis sans auth → 401", async () => {
    const res = await request(app).get("/api/client/devis");
    expect(res.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// J — Contact / Brief
// ═══════════════════════════════════════════════════════════════════════════════
describe("J — Contact", () => {
  it("J1 — POST /api/contact avec body valide → 201", async () => {
    const res = await request(app)
      .post("/api/contact")
      .send({
        firstName: "Test",
        lastName: "User",
        email: `${TEST_PREFIX}_contact@testcorp.dev`,
        company: `${TEST_PREFIX}_ContactCorp`,
        message: "Ceci est un message de test automatique.",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("J2 — POST /api/contact sans email → 400", async () => {
    const res = await request(app)
      .post("/api/contact")
      .send({ firstName: "Test", lastName: "User", message: "missing email" });

    expect(res.status).toBe(400);
  });

  it("J3 — POST /api/contact body vide → 400", async () => {
    const res = await request(app).post("/api/contact").send({});
    expect(res.status).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// K — Scoring Stats (public)
// ═══════════════════════════════════════════════════════════════════════════════
describe("K — Scoring Stats", () => {
  it("K1 — GET /api/scoring/stats/commpulse → 200", async () => {
    const res = await request(app).get("/api/scoring/stats/commpulse");
    expect(res.status).toBe(200);
    expect(res.body.toolId).toBe("commpulse");
    expect(typeof res.body.avgScore).toBe("number");
    expect(typeof res.body.count).toBe("number");
  });

  it("K2 — GET /api/scoring/stats/invalid_tool → 400", async () => {
    const res = await request(app).get("/api/scoring/stats/invalid_tool");
    expect(res.status).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// L — Health check
// ═══════════════════════════════════════════════════════════════════════════════
describe("L — Health", () => {
  it("L1 — GET /api/health → 200", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("healthy");
  });
});
