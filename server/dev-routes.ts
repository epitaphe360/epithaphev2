import { Express } from "express";
import { db } from "./db";
import { users, scoringResults } from "../shared/schema";

export function registerDevRoutes(app: Express) {
  app.get("/api/dev/seed", async (req, res) => {
    try {
      // 1. Ajouter un Admin
      await db.insert(users).values({
        email: "admin@epitaphe360.test",
        password: "admin123", // Attention: En prod ce doit être hashé
        name: "Administrateur Test",
        role: "ADMIN",
      }).onConflictDoNothing({ target: users.email });

      // 2. Ajouter un Client Test
      await db.insert(users).values({
        email: "client@entreprise.test",
        password: "client123", 
        name: "Client Test B2B",
        role: "USER",
      }).onConflictDoNothing({ target: users.email });

      // 3. Ajouter des données de Scoring (Leads & Rapports)
      await db.insert(scoringResults).values([
        {
          toolId: "commpulse",
          companyName: "Tech Solutions Mar",
          sector: "Technologie",
          companySize: "50-200",
          globalScore: 65,
          pillarScores: { general: 65, equipe: 70, feedback: 60 },
          maturityLevel: 3,
          sessionId: "test-session-1"
        },
        {
          toolId: "bmi360",
          companyName: "Finance Plus Agency",
          sector: "Finance",
          companySize: "200-500",
          globalScore: 82,
          pillarScores: { identite: 80, strategie: 85 },
          maturityLevel: 4,
          sessionId: "test-session-2"
        },
        {
          toolId: "talentprint",
          companyName: "Startup Innov.io",
          sector: "Startup",
          companySize: "1-50",
          globalScore: 45,
          pillarScores: { rh: 40, onboarding: 50 },
          maturityLevel: 2,
          sessionId: "test-session-3"
        }
      ]);

      res.json({ message: "Base de donnees peuplee avec succes ! Les utilisateurs tests et donnees d'audit sont prets." });
    } catch (error: any) {
      console.error("Erreur lors du peuplement :", error);
      res.status(500).json({ error: error.message });
    }
  });
}
