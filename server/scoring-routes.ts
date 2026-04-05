import { Express } from "express";
import { db } from "./db";
import { scoringResults, insertScoringResultSchema } from "../shared/schema";
import { processAssessment } from "./lib/scoring-engine";
import { z } from "zod";

export function registerScoringRoutes(app: Express) {
  // Soumettre un nouveau resultat de scoring (CommPulse, TalentPrint, etc.)
  app.post("/api/scoring/:toolId", async (req, res) => {
    try {
      const toolId = req.params.toolId;
      const { answers } = req.body;

      if (!answers || typeof answers !== 'object') {
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
      res.status(500).json({ error: "Internal Server Error during scoring" });
    }
  });

  // Recuperer un rapport de scoring pour un client
  app.get("/api/scoring/result/:id", async (req, res) => {
    try {
      const { id } = req.params;
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
