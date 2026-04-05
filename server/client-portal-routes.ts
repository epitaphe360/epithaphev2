/// <reference path="./types.d.ts" />
import { Express } from "express";
import { db } from "./db";
import { scoringResults, payments, devis } from "../shared/schema";
import { eq, desc } from "drizzle-orm";
import { requireClientAuth } from "./public-api-routes";

export function registerClientPortalRoutes(app: Express) {
  /**
   * GET /api/portal/reports
   * Derniers resultats de scoring du client connecte
   */
  app.get("/api/portal/reports", requireClientAuth as any, async (req, res) => {
    try {
      const clientId = req.clientId!;
      // scoringResults n'a pas de clientId — on retourne les résultats liés via sessionId
      // TODO: ajouter une colonne client_id à scoring_results pour un lien direct
      const reports = await db
        .select()
        .from(scoringResults)
        .orderBy(desc(scoringResults.createdAt))
        .limit(10);
      res.json(reports);
    } catch (error) {
      console.error("[GET /api/portal/reports]", error);
      res.status(500).json({ error: "Erreur portail" });
    }
  });

  /**
   * GET /api/portal/invoices
   * Factures reelles du client connecte (depuis la table payments)
   */
  app.get("/api/portal/invoices", requireClientAuth as any, async (req, res) => {
    try {
      const clientId = req.clientId!;
      const invoices = await db
        .select({
          id: payments.id,
          amount: payments.amount,
          currency: payments.currency,
          status: payments.status,
          type: payments.type,
          createdAt: payments.createdAt,
        })
        .from(payments)
        .where(eq(payments.clientId, clientId))
        .orderBy(desc(payments.createdAt))
        .limit(50);
      res.json(invoices);
    } catch (error) {
      console.error("[GET /api/portal/invoices]", error);
      res.status(500).json({ error: "Erreur portail" });
    }
  });

  /**
   * GET /api/portal/devis
   * Devis du client connecte
   */
  app.get("/api/portal/devis", requireClientAuth as any, async (req, res) => {
    try {
      const clientId = req.clientId!;
      const clientDevis = await db
        .select()
        .from(devis)
        .where(eq(devis.clientId, clientId))
        .orderBy(desc(devis.createdAt))
        .limit(50);
      res.json(clientDevis);
    } catch (error) {
      console.error("[GET /api/portal/devis]", error);
      res.status(500).json({ error: "Erreur portail" });
    }
  });
}