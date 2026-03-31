import { Express } from "express";
import rateLimit from "express-rate-limit";
import { db } from "./db";
import { scoringResults, insertScoringResultSchema } from "../shared/schema";
import { processAssessment } from "./lib/scoring-engine";
import { z } from "zod";
import { eq } from "drizzle-orm";

const scoringLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Trop de requêtes de scoring. Réessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const ALLOWED_TOOL_IDS = ["commpulse", "talentprint", "bmi360", "brandpulse", "digitalscore"];

export function registerScoringRoutes(app: Express) {
  // Soumettre un nouveau resultat de scoring (CommPulse, TalentPrint, etc.)
  app.post("/api/scoring/:toolId", scoringLimiter, async (req, res) => {
    try {
      const toolId = req.params.toolId;

      // Validate toolId against whitelist
      if (!ALLOWED_TOOL_IDS.includes(toolId.toLowerCase())) {
        return res.status(400).json({ error: "Invalid tool ID." });
      }

      const { answers } = req.body;

      if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
        return res.status(400).json({ error: "Answers object is required." });
      }

      const processed = processAssessment(toolId, answers);

      const [newResult] = await db
        .insert(scoringResults)
        .values(processed as any)
        .returning();

      return res.status(201).json(newResult);
    } catch (error) {
      console.error("[Scoring API] Error saving result:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Recuperer un rapport de scoring par ID (UUID)
  app.get("/api/scoring/result/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Validate UUID format to prevent injection
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
          && !/^\d+$/.test(id)) {
        return res.status(400).json({ error: "Invalid report ID format" });
      }

      const result = await db.query.scoringResults.findFirst({
        where: (t: any, { eq }: any) => eq(t.id, id)
      });
      if (!result) return res.status(404).json({ error: "Report not found" });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Could not retrieve report" });
    }
  });
}
