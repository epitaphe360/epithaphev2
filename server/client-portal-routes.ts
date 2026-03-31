import { Express } from "express";
import { db } from "./db";
import { scoringResults, users } from "../shared/schema";
import { eq } from "drizzle-orm";

export function registerClientPortalRoutes(app: Express) {
  app.get("/api/portal/reports", async (req, res) => {
    try {
      const reports = await db.query.scoringResults.findMany({
        // @ts-ignore
        orderBy: (results: any, { desc }: any) => [desc(results.createdAt)],
        limit: 10,
      });
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Portal error" });
    }
  });

  app.get("/api/portal/invoices", async (req, res) => {
    res.json([
      { id: "INV-2026-001", amount: "4900 MAD", status: "Paye", date: "2026-03-01", description: "Audit CommPulse™" },
      { id: "INV-2026-002", amount: "12500 MAD", status: "En attente", date: "2026-03-25", description: "Retainer Annuel" }
    ]);
  });
}
